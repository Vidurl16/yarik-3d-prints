import { Resend } from "resend";
import type { DbOrder, DbOrderItem } from "@/lib/data/types";

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "The Dexarium <orders@thedexarium.co.za>";

function formatZAR(cents: number): string {
  return `R ${(cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function buildShippingBlock(order: DbOrder): string {
  const meta = order.payment_metadata ?? {};
  const addr = meta.shipping_address as Record<string, string> | undefined;
  const postnet = meta.postnet_details as { branch_name?: string; number?: string; email?: string } | undefined;

  if (!addr && !postnet) return "";

  const method = addr?.shipping_method_label ?? "Standard delivery";
  let details = "";

  if (postnet?.branch_name) {
    details = `
      <p style="margin:4px 0;color:#e8dcc8;font-size:14px;">PostNet Branch: <strong>${postnet.branch_name}</strong></p>
      ${postnet.number ? `<p style="margin:4px 0;color:#9e8e78;font-size:13px;">Branch #: ${postnet.number}</p>` : ""}
      ${postnet.email ? `<p style="margin:4px 0;color:#9e8e78;font-size:13px;">Branch email: ${postnet.email}</p>` : ""}
    `;
  } else if (addr?.locker) {
    // PUDO locker delivery
    details = `
      <p style="margin:4px 0;color:#e8dcc8;font-size:14px;">${addr.name}</p>
      <p style="margin:4px 0;color:#9e8e78;font-size:13px;">PUDO Locker: <strong style="color:#c9a84c;">${addr.locker}</strong></p>
      ${addr.phone ? `<p style="margin:4px 0;color:#9e8e78;font-size:13px;">Phone: ${addr.phone}</p>` : ""}
    `;
  } else if (addr?.name) {
    details = `
      <p style="margin:4px 0;color:#e8dcc8;font-size:14px;">${addr.name}</p>
      ${addr.line1 ? `<p style="margin:4px 0;color:#9e8e78;font-size:13px;">${addr.line1}${addr.line2 ? `, ${addr.line2}` : ""}</p>` : ""}
      ${addr.city ? `<p style="margin:4px 0;color:#9e8e78;font-size:13px;">${addr.city}${addr.province ? `, ${addr.province}` : ""}${addr.postal_code ? ` ${addr.postal_code}` : ""}</p>` : ""}
    `;
  }

  return `
  <tr>
    <td style="padding:24px 40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0902;border:1px solid rgba(196,160,69,0.15);">
        <tr>
          <td style="padding:16px 20px;">
            <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:10px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;">
              Shipping
            </p>
            <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:13px;color:#9e8e78;">
              Method: <strong style="color:#e8dcc8;">${method}</strong>
            </p>
            <div style="font-family:Georgia,serif;">${details}</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function buildOrderConfirmationHtml(
  order: DbOrder,
  items: DbOrderItem[]
): string {
  const total = order.total_amount_cents ?? 0;
  const orderDate = new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });

  const itemRows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:14px 20px;border-bottom:1px solid #1e1a14;color:#e8dcc8;font-family:Georgia,serif;font-size:15px;line-height:1.4;">
        ${item.name_snapshot ?? "Product"}
      </td>
      <td style="padding:14px 20px;border-bottom:1px solid #1e1a14;color:#9e8e78;font-family:Georgia,serif;font-size:14px;text-align:center;">
        ×${item.quantity}
      </td>
      <td style="padding:14px 20px;border-bottom:1px solid #1e1a14;color:#c9a84c;font-family:Georgia,serif;font-size:15px;text-align:right;font-weight:bold;">
        ${formatZAR(item.unit_amount_cents * item.quantity)}
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Order Confirmed — The Dexarium</title>
</head>
<body style="margin:0;padding:0;background:#0c0902;font-family:Georgia,serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0902;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#110d05;border:1px solid rgba(196,160,69,0.15);overflow:hidden;">

          <!-- Blood-red accent line -->
          <tr><td style="background:linear-gradient(90deg,#8b0000,#6b0000);height:3px;padding:0;font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- Header -->
          <tr>
            <td style="background:#0c0902;padding:36px 40px 28px;text-align:center;border-bottom:1px solid rgba(196,160,69,0.1);">
              <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:10px;letter-spacing:5px;color:#8b0000;text-transform:uppercase;font-weight:normal;">
                THE DEXARIUM
              </p>
              <h1 style="margin:0 0 6px;font-family:Georgia,serif;font-size:32px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;font-weight:bold;">
                Order Confirmed
              </h1>
              <p style="margin:0;font-family:Georgia,serif;font-size:12px;color:rgba(196,160,69,0.5);letter-spacing:2px;">
                ${orderDate}
              </p>
            </td>
          </tr>

          <!-- Intro copy -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0 0 8px;color:#c9a84c;font-family:Georgia,serif;font-size:17px;font-weight:bold;letter-spacing:0.5px;">
                Thank you for your order from The Dexarium!
              </p>
              <p style="margin:0;color:#9e8e78;font-family:Georgia,serif;font-size:15px;line-height:1.7;">
                Your prints have entered the queue — medical-grade resin and multicolour FDM, built to battlefield standard. We'll send you a shipping notification the moment your order is on its way.
              </p>
            </td>
          </tr>

          <!-- Order ID block -->
          <tr>
            <td style="padding:24px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0902;border:1px solid rgba(139,0,0,0.4);">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:10px;letter-spacing:3px;color:#8b0000;text-transform:uppercase;">
                      Order Reference
                    </p>
                    <p style="margin:0;font-size:13px;color:#c9a84c;font-family:'Courier New',Courier,monospace;word-break:break-all;">
                      ${order.id}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding:28px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(196,160,69,0.12);overflow:hidden;">
                <thead>
                  <tr style="background:#0c0902;">
                    <th style="padding:12px 20px;text-align:left;font-family:Georgia,serif;font-size:10px;letter-spacing:3px;color:rgba(196,160,69,0.6);text-transform:uppercase;font-weight:normal;border-bottom:1px solid rgba(196,160,69,0.12);">Item</th>
                    <th style="padding:12px 20px;text-align:center;font-family:Georgia,serif;font-size:10px;letter-spacing:3px;color:rgba(196,160,69,0.6);text-transform:uppercase;font-weight:normal;border-bottom:1px solid rgba(196,160,69,0.12);">Qty</th>
                    <th style="padding:12px 20px;text-align:right;font-family:Georgia,serif;font-size:10px;letter-spacing:3px;color:rgba(196,160,69,0.6);text-transform:uppercase;font-weight:normal;border-bottom:1px solid rgba(196,160,69,0.12);">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Total -->
          <tr>
            <td style="padding:0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-left:1px solid rgba(196,160,69,0.12);border-right:1px solid rgba(196,160,69,0.12);border-bottom:1px solid rgba(196,160,69,0.12);">
                <tr>
                  <td style="padding:16px 20px;text-align:right;">
                    <span style="font-family:Georgia,serif;font-size:11px;letter-spacing:2px;color:#9e8e78;text-transform:uppercase;margin-right:20px;">Total Paid</span>
                    <span style="font-family:Georgia,serif;font-size:22px;color:#c9a84c;font-weight:bold;">${formatZAR(total)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping details -->
          ${buildShippingBlock(order)}

          <!-- What next -->
          <tr>
            <td style="padding:28px 40px 0;">
              <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:10px;letter-spacing:3px;color:rgba(196,160,69,0.6);text-transform:uppercase;">What happens next</p>
              <p style="margin:8px 0 0;color:#9e8e78;font-family:Georgia,serif;font-size:14px;line-height:1.7;">
                1. Your order enters the print queue within 24 hours.<br>
                2. We'll email you when printing is complete and your order is dispatched.<br>
                3. Delivery via your selected courier to your door or locker.
              </p>
            </td>
          </tr>

          <!-- Contact / WhatsApp CTA -->
          <tr>
            <td style="padding:24px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(139,0,0,0.08);border:1px solid rgba(139,0,0,0.25);">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:13px;color:#e8dcc8;">Questions about your order?</p>
                    <p style="margin:0;font-family:Georgia,serif;font-size:13px;color:#9e8e78;line-height:1.6;">
                      Email: <a href="mailto:thedexarium@gmail.com" style="color:#c9a84c;text-decoration:none;">thedexarium@gmail.com</a>
                      &nbsp;&middot;&nbsp;
                      WhatsApp: <a href="https://wa.me/27739140709" style="color:#c9a84c;text-decoration:none;">+27 73 914 0709</a><br>
                      Include your order reference in any message.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0c0902;border-top:1px solid rgba(196,160,69,0.08);padding:28px 40px;text-align:center;margin-top:32px;">
              <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:10px;letter-spacing:4px;color:#8b0000;text-transform:uppercase;">
                THE DEXARIUM
              </p>
              <p style="margin:0;font-family:Georgia,serif;font-size:12px;color:rgba(196,160,69,0.35);line-height:1.5;">
                Medical-grade resin &amp; multicolour FDM printing, built to battlefield standard.<br>
                &copy; ${new Date().getFullYear()} The Dexarium &mdash; South Africa
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
  const { error } = await resend.emails.send({ from: FROM_EMAIL, to, subject, html, replyTo: "thedexarium@gmail.com" });
  if (error) console.error("[Email] Failed to send to", to, error);
}

const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "thedexarium@gmail.com";

const STATUS_META: Record<string, { label: string; colour: string; description: string; emoji: string }> = {
  processing:  { label: "In Production",    colour: "#3b82f6", description: "Your order has entered the print queue and production has started.",                          emoji: "⚙️" },
  dispatched:  { label: "Dispatched",       colour: "#c9a84c", description: "Your order has been packed and handed to the courier. Tracking details will follow shortly.", emoji: "📦" },
  fulfilled:   { label: "Delivered",        colour: "#22c55e", description: "Your order has been delivered. We hope you love it — enjoy the battlefield!",                emoji: "✅" },
  cancelled:   { label: "Cancelled",        colour: "#8b0000", description: "Your order has been cancelled. If you have any questions please reach out.",                 emoji: "❌" },
  pending:     { label: "Order Received",   colour: "#c9a84c", description: "We've received your order and it will enter the print queue shortly.",                       emoji: "🕐" },
};

function buildStatusUpdateHtml(order: DbOrder, newStatus: string, customMessage?: string): string {
  const meta = STATUS_META[newStatus] ?? { label: newStatus, colour: "#c9a84c", description: "", emoji: "📋" };
  const orderDate = new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
  const shippingBlock = ["dispatched", "fulfilled"].includes(newStatus) ? buildShippingBlock(order) : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Order Update — The Dexarium</title>
</head>
<body style="margin:0;padding:0;background:#0c0902;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0902;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#110d05;border:1px solid rgba(196,160,69,0.15);overflow:hidden;">

          <tr><td style="background:linear-gradient(90deg,${meta.colour},${meta.colour}99);height:3px;padding:0;font-size:0;line-height:0;">&nbsp;</td></tr>

          <tr>
            <td style="background:#0c0902;padding:36px 40px 28px;text-align:center;border-bottom:1px solid rgba(196,160,69,0.1);">
              <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:10px;letter-spacing:5px;color:#8b0000;text-transform:uppercase;font-weight:normal;">THE DEXARIUM</p>
              <p style="margin:0 0 10px;font-size:32px;">${meta.emoji}</p>
              <h1 style="margin:0 0 6px;font-family:Georgia,serif;font-size:28px;color:${meta.colour};letter-spacing:3px;text-transform:uppercase;font-weight:bold;">
                ${meta.label}
              </h1>
              <p style="margin:0;font-family:Georgia,serif;font-size:12px;color:rgba(196,160,69,0.5);letter-spacing:2px;">${orderDate}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0;color:#9e8e78;font-family:Georgia,serif;font-size:15px;line-height:1.7;">${meta.description}</p>
            </td>
          </tr>

          ${customMessage ? `
          <tr>
            <td style="padding:24px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0902;border:1px solid rgba(196,160,69,0.2);">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:10px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;">Message from The Dexarium</p>
                    <p style="margin:0;color:#e8dcc8;font-family:Georgia,serif;font-size:14px;line-height:1.7;">${customMessage}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : ""}

          ${shippingBlock}

          <tr>
            <td style="padding:24px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0902;border:1px solid rgba(139,0,0,0.4);">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:10px;letter-spacing:3px;color:#8b0000;text-transform:uppercase;">Order Reference</p>
                    <p style="margin:0;font-size:13px;color:#c9a84c;font-family:'Courier New',Courier,monospace;word-break:break-all;">${order.id}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(139,0,0,0.08);border:1px solid rgba(139,0,0,0.25);">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:13px;color:#e8dcc8;">Questions about your order?</p>
                    <p style="margin:0;font-family:Georgia,serif;font-size:13px;color:#9e8e78;line-height:1.6;">
                      Email: <a href="mailto:thedexarium@gmail.com" style="color:#c9a84c;text-decoration:none;">thedexarium@gmail.com</a>
                      &nbsp;&middot;&nbsp;
                      WhatsApp: <a href="https://wa.me/27739140709" style="color:#c9a84c;text-decoration:none;">+27 73 914 0709</a><br>
                      Include your order reference in any message.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#0c0902;border-top:1px solid rgba(196,160,69,0.08);padding:28px 40px;text-align:center;margin-top:32px;">
              <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:10px;letter-spacing:4px;color:#8b0000;text-transform:uppercase;">THE DEXARIUM</p>
              <p style="margin:0;font-family:Georgia,serif;font-size:12px;color:rgba(196,160,69,0.35);line-height:1.5;">
                Medical-grade resin &amp; multicolour FDM printing, built to battlefield standard.<br>
                &copy; ${new Date().getFullYear()} The Dexarium &mdash; South Africa
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

export async function sendOrderStatusEmail(
  order: DbOrder,
  newStatus: string,
  customMessage?: string
): Promise<void> {
  const toEmail = order.email;
  if (!toEmail) return;
  if (!STATUS_META[newStatus]) return; // don't email for statuses without a template
  if (RESEND_KEY_IS_PLACEHOLDER) {
    console.warn("[Email] RESEND_API_KEY not set — skipping status email for order", order.id);
    return;
  }

  const meta = STATUS_META[newStatus];
  const resend = new Resend(RESEND_KEY);
  const subject = `${meta.emoji} Your order is ${meta.label} – #${order.id.slice(0, 8).toUpperCase()}`;
  const html = buildStatusUpdateHtml(order, newStatus, customMessage);

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    replyTo: OWNER_EMAIL,
    subject,
    html,
  });
  if (error) {
    console.error("[Email] Failed to send status update to", toEmail, error);
  } else {
    console.log("[Email] Status update sent to", toEmail, "— status:", newStatus, "order:", order.id);
  }
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
  const subject = `Your Dexarium Order Confirmation – #${order.id.slice(0, 8).toUpperCase()}`;
  const html = buildOrderConfirmationHtml(order, items);

  // Send confirmation to customer
  const { error: customerError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    replyTo: OWNER_EMAIL,
    subject,
    html,
  });
  if (customerError) {
    console.error("[Email] Failed to send customer confirmation:", customerError);
  } else {
    console.log("[Email] Order confirmation sent to customer", toEmail, "for order", order.id);
  }

  // Send notification to owner (skip if owner is already the customer)
  if (toEmail.toLowerCase() !== OWNER_EMAIL.toLowerCase()) {
    const { error: ownerError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      replyTo: toEmail,
      subject: `New Order – #${order.id.slice(0, 8).toUpperCase()} from ${toEmail}`,
      html,
    });
    if (ownerError) {
      console.error("[Email] Failed to send owner notification:", ownerError);
    } else {
      console.log("[Email] Owner notification sent to", OWNER_EMAIL, "for order", order.id);
    }
  }
}
