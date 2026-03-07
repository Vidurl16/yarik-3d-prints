import * as crypto from "crypto";
import type {
  PaymentProvider,
  CreateCheckoutInput,
  CreateCheckoutOutput,
  WebhookEvent,
  WebhookEventStatus,
} from "./types";

const YOCO_CHECKOUT_URL = "https://payments.yoco.com/api/checkouts";

export class YocoProvider implements PaymentProvider {
  readonly name = "yoco";
  private secretKey: string;
  private webhookSecret: string;

  constructor() {
    const secretKey =
      process.env.PAYMENT_SECRET_KEY ??
      process.env.YOCO_SECRET_KEY;
    const webhookSecret =
      process.env.PAYMENT_WEBHOOK_SECRET ??
      process.env.YOCO_WEBHOOK_SECRET;

    if (!secretKey) throw new Error("Yoco secret key not configured (PAYMENT_SECRET_KEY)");
    if (!webhookSecret) throw new Error("Yoco webhook secret not configured (PAYMENT_WEBHOOK_SECRET)");

    this.secretKey = secretKey;
    this.webhookSecret = webhookSecret;
  }

  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutOutput> {
    const body = {
      amount: input.amountCents,
      currency: input.currency.toUpperCase(),
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
      metadata: {
        order_id: input.orderId,
        ...input.metadata,
      },
    };

    const res = await fetch(YOCO_CHECKOUT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.secretKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Yoco checkout creation failed (${res.status}): ${text}`);
    }

    const data = await res.json();

    const redirectUrl: string = data.redirectUrl ?? data.paymentUrl ?? data.url;
    const providerSessionId: string = data.id ?? data.checkoutId;

    if (!redirectUrl) throw new Error("Yoco did not return a redirect URL");
    if (!providerSessionId) throw new Error("Yoco did not return a checkout ID");

    return { redirectUrl, providerSessionId };
  }

  async verifyWebhookAndParseEvent(
    headers: Record<string, string>,
    rawBody: string
  ): Promise<WebhookEvent> {
    const webhookId = headers["webhook-id"];
    const webhookTimestamp = headers["webhook-timestamp"];
    const webhookSignature = headers["webhook-signature"];

    if (!webhookId || !webhookTimestamp || !webhookSignature) {
      throw new Error("Missing Yoco webhook signature headers");
    }

    // Enforce timestamp tolerance (5 minutes) to prevent replay attacks
    const tsSeconds = parseInt(webhookTimestamp, 10);
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (Math.abs(nowSeconds - tsSeconds) > 300) {
      throw new Error("Yoco webhook timestamp out of tolerance");
    }

    // Compute expected signature: HMAC-SHA256(secret, "{webhookId}.{webhookTimestamp}.{rawBody}")
    const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;
    const expectedSig = crypto
      .createHmac("sha256", this.webhookSecret)
      .update(signedContent, "utf8")
      .digest("base64");

    // Webhook-Signature header may contain multiple "v1,<base64sig>" entries separated by space
    const signatures = webhookSignature
      .split(" ")
      .map((s) => s.replace(/^v\d+,/, "").trim());

    const valid = signatures.some((sig) =>
      timingSafeEqual(sig, expectedSig)
    );

    if (!valid) {
      throw new Error("Yoco webhook signature mismatch");
    }

    // Parse the event payload
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      throw new Error("Invalid Yoco webhook JSON body");
    }

    const eventType = payload.type as string;
    const eventId = (payload.id ?? webhookId) as string;
    const eventData = (payload.payload ?? payload.data ?? {}) as Record<string, unknown>;

    // Map Yoco event types to internal statuses
    let status: WebhookEventStatus = "unknown";
    if (eventType === "payment.succeeded") status = "succeeded";
    else if (eventType === "payment.failed") status = "failed";
    else if (eventType === "refund.succeeded") status = "refunded";

    // Extract the checkout/payment id used as providerSessionId
    const providerSessionId =
      (eventData.checkoutId as string) ??
      (eventData.id as string) ??
      (payload.checkoutId as string) ??
      "";

    const amountCents =
      typeof eventData.amount === "number" ? eventData.amount : null;
    const currency =
      typeof eventData.currency === "string"
        ? (eventData.currency as string).toUpperCase()
        : null;

    const metadata = (eventData.metadata ?? {}) as Record<string, unknown>;

    return {
      providerEventId: eventId,
      providerSessionId,
      status,
      amountCents,
      currency,
      customerEmail: null, // Yoco does not expose customer email in webhook
      metadata,
    };
  }
}

/** Constant-time string comparison to prevent timing attacks */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return crypto.timingSafeEqual(bufA, bufB);
}
