"use server";

// Uses Web3Forms (web3forms.com) — no domain verification required.
// Add WEB3FORMS_KEY to Vercel env vars (register at web3forms.com with yarikhansraj@gmail.com).

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

  const apiKey = process.env.WEB3FORMS_KEY;
  if (!apiKey) {
    console.warn("[Contact] WEB3FORMS_KEY not set");
    return {
      status: "error",
      message: "Email service not configured. Please contact us directly.",
    };
  }

  const subject = `[Dexarium Enquiry] ${enquiryType ? enquiryType + " — " : ""}${name}`;
  const body = `Name: ${name}\nEmail: ${email}${enquiryType ? `\nType: ${enquiryType}` : ""}\n\n${message}`;

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: apiKey,
      subject,
      from_name: `${name} via The Dexarium`,
      replyto: email,
      message: body,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    console.error("[Contact] Web3Forms error:", data);
    return { status: "error", message: "Failed to send your message. Please try again." };
  }

  return { status: "success" };
}
