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
  private webhookSecret?: string;
  private webhookSecretTest?: string;

  constructor(secretKeyOverride?: string) {
    const secretKey =
      secretKeyOverride ??
      process.env.PAYMENT_SECRET_KEY ??
      process.env.YOCO_SECRET_KEY;
    const webhookSecret =
      process.env.PAYMENT_WEBHOOK_SECRET ??
      process.env.YOCO_WEBHOOK_SECRET;
    const webhookSecretTest =
      process.env.PAYMENT_WEBHOOK_SECRET_TEST ??
      process.env.YOCO_WEBHOOK_SECRET_TEST;

    if (!secretKey) throw new Error("Yoco secret key not configured (PAYMENT_SECRET_KEY)");

    this.secretKey = secretKey;
    this.webhookSecret = webhookSecret;
    this.webhookSecretTest = webhookSecretTest;
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
    if (!this.webhookSecret && !this.webhookSecretTest) {
      throw new Error("Yoco webhook secret not configured (PAYMENT_WEBHOOK_SECRET)");
    }

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
    const signatures = webhookSignature
      .split(" ")
      .map((s) => s.replace(/^v\d+,/, "").trim());

    const isValidForSecret = (secret: string) => {
      // Yoco secrets are base64-encoded after the "whsec_" prefix
      const secretBytes = Buffer.from(secret.split("_")[1], "base64");
      const expectedSig = crypto
        .createHmac("sha256", secretBytes)
        .update(signedContent, "utf8")
        .digest("base64");
      return signatures.some((sig) => timingSafeEqual(sig, expectedSig));
    };

    const secrets = [this.webhookSecret, this.webhookSecretTest].filter(Boolean) as string[];
    const valid = secrets.some(isValidForSecret);

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
    // Per Yoco docs: checkoutId lives inside payload.metadata
    const metadata = (eventData.metadata ?? {}) as Record<string, unknown>;
    const providerSessionId =
      (metadata.checkoutId as string) ??
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
