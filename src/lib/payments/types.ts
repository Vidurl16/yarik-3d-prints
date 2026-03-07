export interface CreateCheckoutInput {
  orderId: string;
  amountCents: number;
  currency: string;
  customerEmail: string | null;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CreateCheckoutOutput {
  redirectUrl: string;
  providerSessionId: string;
}

export type WebhookEventStatus = "succeeded" | "failed" | "refunded" | "unknown";

export interface WebhookEvent {
  providerEventId: string;
  providerSessionId: string;
  status: WebhookEventStatus;
  amountCents: number | null;
  currency: string | null;
  customerEmail: string | null;
  metadata: Record<string, unknown>;
}

export interface PaymentProvider {
  readonly name: string;
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutOutput>;
  verifyWebhookAndParseEvent(
    headers: Record<string, string>,
    rawBody: string
  ): Promise<WebhookEvent>;
}
