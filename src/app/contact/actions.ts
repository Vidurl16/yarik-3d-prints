"use server";

import { Resend } from "resend";

const TO_EMAIL = process.env.RESEND_TO_EMAIL ?? "yarikhansraj@gmail.com";
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "The Dexarium <orders@yarik3d.co.za>";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const enquiryType = String(formData.get("enquiryType") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill in all required fields." };
  }

  if (!email.includes("@")) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn("[Contact] RESEND_API_KEY not set — cannot send enquiry email");
    return {
      status: "error",
      message: "Email service not configured. Please contact us directly.",
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: email,
    subject: `[Dexarium Enquiry] ${enquiryType ? enquiryType + " — " : ""}${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;background:#0a0a0a;color:#d4d4d4;padding:32px;border:1px solid #1a1a1a;">
        <h2 style="color:#c9a84c;font-family:Georgia,serif;letter-spacing:2px;margin:0 0 24px;">NEW ENQUIRY</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#737373;font-size:12px;letter-spacing:1px;text-transform:uppercase;width:120px;">Name</td><td style="padding:8px 0;color:#d4d4d4;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#737373;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Email</td><td style="padding:8px 0;color:#c9a84c;"><a href="mailto:${email}" style="color:#c9a84c;">${email}</a></td></tr>
          ${enquiryType ? `<tr><td style="padding:8px 0;color:#737373;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Type</td><td style="padding:8px 0;color:#d4d4d4;">${enquiryType}</td></tr>` : ""}
        </table>
        <hr style="border:none;border-top:1px solid #1a1a1a;margin:20px 0;" />
        <p style="white-space:pre-wrap;line-height:1.7;color:#d4d4d4;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
      </div>
    `,
  });

  if (error) {
    console.error("[Contact] Failed to send enquiry:", error);
    return { status: "error", message: "Failed to send your message. Please try again." };
  }

  return { status: "success" };
}
