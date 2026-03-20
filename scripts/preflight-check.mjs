import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env.local");
const brandAssetsPath = path.join(root, "public", "brand-assets");

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "PAYMENT_PROVIDER",
  "PAYMENT_SECRET_KEY",
  "PAYMENT_WEBHOOK_SECRET",
  "ADMIN_EMAIL_ALLOWLIST",
  "REVALIDATE_SECRET",
];

const placeholderFragments = [
  "your-project",
  "eyJ...",
  "sk_test_...",
  "whsec_...",
  "you@yourdomain.com",
  "change-me-in-production",
  "xxx",
];

const themes = ["dexarium", "grimdark", "fantasy", "pokemon", "basing", "terrain"];
const requiredAssets = ["hero.svg", "texture-01.svg", "texture-02.svg", "detail.svg"];

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

function classifyEnvValue(key, value) {
  if (!value) return "missing";
  if (placeholderFragments.some((fragment) => value.includes(fragment))) return "placeholder";
  if (key === "ADMIN_EMAIL_ALLOWLIST" && value.split(",").filter(Boolean).length === 0) return "missing";
  return "set";
}

function checkAssets() {
  return themes.map((theme) => {
    const missing = requiredAssets.filter(
      (file) => !fs.existsSync(path.join(brandAssetsPath, theme, file)),
    );

    return { theme, missing };
  });
}

function printSection(title) {
  console.log(`\n${title}`);
  console.log("-".repeat(title.length));
}

function addRemediation(remediations, item) {
  remediations.push(item);
}

const env = loadEnvFile(envPath);

printSection("Environment");

let hasBlockingIssue = false;
const remediations = [];

for (const key of requiredEnv) {
  const status = classifyEnvValue(key, env.get(key));
  if (status !== "set") hasBlockingIssue = true;

  const suffix =
    key === "ADMIN_EMAIL_ALLOWLIST" && status === "set"
      ? ` (${env.get(key).split(",").filter(Boolean).length} entr${env.get(key).split(",").filter(Boolean).length === 1 ? "y" : "ies"})`
      : "";

  console.log(`${key}: ${status.toUpperCase()}${suffix}`);

  if (key === "PAYMENT_WEBHOOK_SECRET" && status !== "set") {
    addRemediation(
      remediations,
      "12.1 - `PAYMENT_SECRET_KEY` is present, but `PAYMENT_WEBHOOK_SECRET` is still placeholder-like. Replace it in `.env.local` with the real Yoco webhook signing secret, then restart the dev server.",
    );
  }

  if (key === "ADMIN_EMAIL_ALLOWLIST" && status !== "set") {
    addRemediation(
      remediations,
      "12.4 - Replace the placeholder `ADMIN_EMAIL_ALLOWLIST` value in `.env.local` with the real admin tester email.",
    );
  }

  if (key === "REVALIDATE_SECRET" && status !== "set") {
    addRemediation(
      remediations,
      "Admin revalidation - Replace `REVALIDATE_SECRET=change-me-in-production` in `.env.local` with a real secret before admin cache revalidation testing.",
    );
  }
}

printSection("Brand assets");

for (const { theme, missing } of checkAssets()) {
  if (missing.length > 0) {
    hasBlockingIssue = true;
    console.log(`${theme}: MISSING ${missing.join(", ")}`);
  } else {
    console.log(`${theme}: READY`);
  }
}

printSection("Manual checks still required");
console.log("- Confirm `supabase/bootstrap.sql` has been applied for a fresh project, or run the individual schema/migration/seed SQL files for an existing one.");
console.log("- Run `supabase/verify_setup.sql` in Supabase to confirm the core tables, payment columns, RLS, and seeded catalog are present.");
console.log("- Confirm Yoco webhook delivery can reach a public URL (ngrok locally or staging/prod domain).");
console.log("- Confirm the Yoco sandbox response includes one of: `redirectUrl`, `paymentUrl`, or `url`.");
console.log("- Replace placeholder brand art with licensed final assets before release sign-off.");

if (remediations.length > 0) {
  printSection("Exact next fixes");
  for (const remediation of remediations) {
    console.log(`- ${remediation}`);
  }
}

printSection("Result");
if (hasBlockingIssue) {
  console.log("Preflight found blocking issues. Resolve the missing or placeholder items above before full E2E.");
  process.exitCode = 1;
} else {
  console.log("Local preflight passed. You can move on to the remaining manual checks.");
}
