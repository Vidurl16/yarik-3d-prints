import { YocoProvider } from "./yoco";
import type { PaymentProvider } from "./types";

/**
 * Returns the active payment provider adapter.
 * Accepts an optional secretKey override (used for local dev with test key).
 * Not memoized — safe to call per-request.
 */
export function getPaymentProvider(secretKeyOverride?: string): PaymentProvider {
  const providerName = (process.env.PAYMENT_PROVIDER ?? "yoco").toLowerCase();

  if (providerName === "yoco") {
    return new YocoProvider(secretKeyOverride);
  }

  throw new Error(`Unsupported payment provider: "${providerName}". Set PAYMENT_PROVIDER=yoco.`);
}

export type { PaymentProvider, CreateCheckoutInput, CreateCheckoutOutput, WebhookEvent } from "./types";
