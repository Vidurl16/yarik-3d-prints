import type { PaymentProvider } from "./types";

let _provider: PaymentProvider | null = null;

/**
 * Returns the active payment provider adapter based on PAYMENT_PROVIDER env var.
 * Lazily initialized and memoized for the server process lifetime.
 */
export function getPaymentProvider(): PaymentProvider {
  if (_provider) return _provider;

  const providerName = (process.env.PAYMENT_PROVIDER ?? "yoco").toLowerCase();

  if (providerName === "yoco") {
    const { YocoProvider } = require("./yoco") as typeof import("./yoco");
    _provider = new YocoProvider();
    return _provider;
  }

  throw new Error(`Unsupported payment provider: "${providerName}". Set PAYMENT_PROVIDER=yoco.`);
}

export type { PaymentProvider, CreateCheckoutInput, CreateCheckoutOutput, WebhookEvent } from "./types";
