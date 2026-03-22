import { Resend } from "resend";
import type { DbOrder, DbOrderItem } from "@/lib/data/types";

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "The Dexarium <orders@yarik3d.co.za>";

function formatZAR(cents: number): string {
  return `R ${(cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function buildOrderConfirmationHtml(
  order: DbOrder,
  items: DbOrderItem[]
): string {
  const total = order.total_amount_cents ?? 0;

  const itemRows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #1a1a1a;color:#d4d4d4;font-family:Arial,sans-serif;font-size:14px;">
        ${item.name_snapshot ?? "Product"}
      </td>
      <td style="padding:10px 16px;border-bottom:1px solid #1a1a1a;color:#d4d4d4;font-family:Arial,sans-serif;font-size:14px;text-align:center;">
        ${item.quantity}
      </td>
      <td style="padding:10px 16px;border-bottom:1px solid #1a1a1a;color:#c9a84c;font-family:Arial,sans-serif;font-size:14px;text-align:right;">
        ${formatZAR(item.unit_amount_cents * item.quantity)}
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Order Confirmed</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border:1px solid #1a1a1a;border-radius:4px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#0a0a0a;border-bottom:2px solid #8b0000;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:11px;letter-spacing:4px;color:#8b0000;text-transform:uppercase;">The Dexarium</p>
              <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;color:#c9a84c;letter-spacing:2px;text-transform:uppercase;">Order Confirmed</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <p style="margin:0 0 24px;color:#a3a3a3;font-size:15px;line-height:1.6;">
                Thank you for your order. Your miniatures are now in the print queue — we'll be in touch when they're ready to ship.
              </p>

              <!-- Order ID -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:3px;margin-bottom:32px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;color:#8b0000;text-transform:uppercase;">Order Reference</p>
                    <p style="margin:0;font-size:13px;color:#737373;font-family:'Courier New',monospace;">${order.id}</p>
                  </td>
                </tr>
              </table>

              <!-- Items Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1a1a1a;border-radius:3px;overflow:hidden;margin-bottom:24px;">
                <thead>
                  <tr style="background:#0a0a0a;">
                    <th style="padding:10px 16px;text-align:left;font-size:11px;letter-spacing:2px;color:#737373;text-transform:uppercase;font-weight:normal;">Item</th>
                    <th style="padding:10px 16px;text-align:center;font-size:11px;letter-spacing:2px;color:#737373;text-transform:uppercase;font-weight:normal;">Qty</th>
                    <th style="padding:10px 16px;text-align:right;font-size:11px;letter-spacing:2px;color:#737373;text-transform:uppercase;font-weight:normal;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="text-align:right;padding:8px 0;">
                    <span style="font-size:13px;color:#737373;margin-right:16px;letter-spacing:1px;text-transform:uppercase;">Total Paid</span>
                    <span style="font-size:20px;color:#c9a84c;font-weight:bold;">${formatZAR(total)}</span>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;color:#a3a3a3;font-size:14px;line-height:1.6;">
                Questions? Contact us at <a href="mailto:hello@yarik3d.co.za" style="color:#c9a84c;text-decoration:none;">hello@yarik3d.co.za</a> or WhatsApp us — just reply to this email with your order reference.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0a0a0a;border-top:1px solid #1a1a1a;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#404040;">
                &copy; ${new Date().getFullYear()} The Dexarium &mdash; Medical-grade resin &amp; multicolour FDM printing, built to battlefield standard.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

const RESEND_KEY = process.env.RESEND_API_KEY ?? "";
const RESEND_KEY_IS_PLACEHOLDER = !RESEND_KEY || RESEND_KEY.startsWith("re_your_");

/** Generic transactional email — skips silently if RESEND_API_KEY is not set. */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (RESEND_KEY_IS_PLACEHOLDER) {
    console.warn(
      "[Email] RESEND_API_KEY is missing or still the placeholder value — skipping email to",
      to,
      "(set a real key from https://resend.com/api-keys)"
    );
    return;
  }
  const resend = new Resend(RESEND_KEY);
  const { error } = await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
  if (error) console.error("[Email] Failed to send to", to, error);
}

export async function sendOrderConfirmationEmail(
  order: DbOrder,
  items: DbOrderItem[]
): Promise<void> {
  const toEmail = order.email;
  if (!toEmail) {
    console.warn("[Email] No customer email on order", order.id, "— skipping confirmation email");
    return;
  }

  if (RESEND_KEY_IS_PLACEHOLDER) {
    console.warn(
      "[Email] RESEND_API_KEY is missing or still the placeholder value — order confirmation NOT sent for order",
      order.id,
      "(set a real key from https://resend.com/api-keys)"
    );
    return;
  }

  const resend = new Resend(RESEND_KEY);

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: "Your Dexarium order is confirmed",
    html: buildOrderConfirmationHtml(order, items),
  });

  if (error) {
    console.error("[Email] Failed to send order confirmation:", error);
  } else {
    console.log("[Email] Order confirmation sent to", toEmail, "for order", order.id);
  }
}
