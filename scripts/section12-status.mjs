import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env.local");

const placeholderFragments = [
  "your-project",
  "eyJ...",
  "sk_test_...",
  "whsec_...",
  "you@yourdomain.com",
  "change-me-in-production",
  "xxx",
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return new Map();
  }

  const env = new Map();
  const content = fs.readFileSync(filePath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    env.set(line.slice(0, eq), line.slice(eq + 1));
  }

  return env;
}

function isPlaceholder(value = "") {
  return placeholderFragments.some((fragment) => value.includes(fragment));
}

function printRow(id, title, status, nextStep) {
  console.log(`${id} ${status}`);
  console.log(`  ${title}`);
  console.log(`  Next: ${nextStep}`);
}

const env = loadEnvFile(envPath);

const paymentSecret = env.get("PAYMENT_SECRET_KEY") ?? "";
const webhookSecret = env.get("PAYMENT_WEBHOOK_SECRET") ?? "";
const adminAllowlist = env.get("ADMIN_EMAIL_ALLOWLIST") ?? "";
const revalidateSecret = env.get("REVALIDATE_SECRET") ?? "";

console.log("Section 12 status");
console.log("=================");

printRow(
  "12.1",
  "Yoco checkout/webhook secrets",
  paymentSecret && webhookSecret && !isPlaceholder(paymentSecret) && !isPlaceholder(webhookSecret) ? "READY" : "BLOCKED",
  paymentSecret && !isPlaceholder(paymentSecret)
    ? webhookSecret && !isPlaceholder(webhookSecret)
      ? "Run a sandbox checkout to verify webhook delivery."
      : "Replace `PAYMENT_WEBHOOK_SECRET` in `.env.local` with the real Yoco webhook signing secret, then restart the dev server."
    : "Set both `PAYMENT_SECRET_KEY` and `PAYMENT_WEBHOOK_SECRET` in `.env.local`.",
);

printRow(
  "12.2",
  "Supabase setup applied",
  "MANUAL CHECK",
  "Run `supabase/verify_setup.sql` to confirm the core tables and provider-agnostic payment columns exist after applying `supabase/bootstrap.sql` (or the individual phase SQL files).",
);

printRow(
  "12.3",
  "Webhook reachability",
  "MANUAL CHECK",
  "Use `ngrok http 3000` or a public staging domain and configure that URL in Yoco.",
);

printRow(
  "12.4",
  "Admin allowlist",
  adminAllowlist && !isPlaceholder(adminAllowlist) ? "READY" : "BLOCKED",
  adminAllowlist && !isPlaceholder(adminAllowlist)
    ? "Log in with the allowlisted admin account and verify `/admin`."
    : "Replace `ADMIN_EMAIL_ALLOWLIST` in `.env.local` with the real admin tester email.",
);

printRow(
  "12.x",
  "Admin cache revalidation secret",
  revalidateSecret && !isPlaceholder(revalidateSecret) ? "READY" : "BLOCKED",
  revalidateSecret && !isPlaceholder(revalidateSecret)
    ? "Verify product edits trigger storefront revalidation."
    : "Replace `REVALIDATE_SECRET` in `.env.local` with a real secret before admin revalidation testing.",
);

printRow(
  "12.5-12.10",
  "Non-blocking caveats",
  "REVIEW",
  "Proceed after core blockers are cleared; placeholders and guest order-status caveats do not block internal functional QA.",
);
