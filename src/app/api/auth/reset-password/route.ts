import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getServiceClient } from "@/lib/supabase/server";

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "The Dexarium <orders@thedexarium.co.za>";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thedexarium.co.za";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  // IMPORTANT: Supabase Dashboard → Auth → URL Configuration → Site URL must be
  // https://thedexarium.co.za, and /reset-password must be in the Redirect URLs allowlist.
  const redirectTo = `${SITE_URL}/reset-password`;
  const supabase = getServiceClient();

  let resetUrl: string | null = null;

  // Step 1: try recovery (user exists + confirmed)
  const { data: recoveryData } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email: normalizedEmail,
    options: { redirectTo },
  });
  if (recoveryData?.properties?.action_link) {
    resetUrl = recoveryData.properties.action_link;
  }

  // Step 2: user doesn't exist or is unconfirmed — look them up
  if (!resetUrl) {
    const { data: listData } = await supabase.auth.admin.listUsers();
    const existingUser = listData?.users?.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    if (existingUser && !existingUser.email_confirmed_at) {
      // Confirm them so recovery works
      await supabase.auth.admin.updateUserById(existingUser.id, {
        email_confirm: true,
      });
      const { data: retryData } = await supabase.auth.admin.generateLink({
        type: "recovery",
        email: normalizedEmail,
        options: { redirectTo },
      });
      if (retryData?.properties?.action_link) {
        resetUrl = retryData.properties.action_link;
      }
    }

    if (!existingUser) {
      // Create the account (invite flow) — trigger errors are non-fatal
      await supabase.auth.admin.createUser({
        email: normalizedEmail,
        email_confirm: true,
        user_metadata: { full_name: "" },
      });
      const { data: newUserLink } = await supabase.auth.admin.generateLink({
        type: "recovery",
        email: normalizedEmail,
        options: { redirectTo },
      });
      if (newUserLink?.properties?.action_link) {
        resetUrl = newUserLink.properties.action_link;
      }
    }
  }

  if (!resetUrl) {
    // Silently succeed — don't reveal failures
    console.error("[reset-password] could not generate link for:", normalizedEmail);
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error: emailError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: normalizedEmail,
    replyTo: "thedexarium@gmail.com",
    subject: "Set up your Dexarium password",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#111008;border:1px solid rgba(201,168,76,0.2);">
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(201,168,76,0.12);text-align:center;">
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:4px;color:#c9a84c;text-transform:uppercase;">The Dexarium</p>
              <h1 style="margin:0;font-size:22px;letter-spacing:3px;color:#e8e0d0;font-weight:normal;text-transform:uppercase;">Password Reset</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 16px;font-size:15px;color:#9e8e78;line-height:1.6;">Hi there,</p>
              <p style="margin:0 0 24px;font-size:15px;color:#9e8e78;line-height:1.6;">
                We received a request to reset the password for your Dexarium account.
                Click the button below to choose a new password. This link expires in <strong style="color:#e8e0d0;">1 hour</strong>.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;background:#8b0000;color:#e8e0d0;text-decoration:none;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-family:Georgia,serif;">
                      SET MY PASSWORD
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:12px;color:#5a4e42;line-height:1.6;">
                If you didn't request this, you can safely ignore this email.
              </p>
              <p style="margin:0;font-size:11px;color:#3a3028;line-height:1.6;word-break:break-all;">
                Or copy this link:<br/>
                <a href="${resetUrl}" style="color:#c9a84c;text-decoration:none;">${resetUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(201,168,76,0.12);text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:2px;color:#3a3028;text-transform:uppercase;">The Dexarium · South Africa</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });

  if (emailError) {
    console.error("[reset-password] Resend error:", emailError);
    return NextResponse.json(
      { error: "Failed to send reset email. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

