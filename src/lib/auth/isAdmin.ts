/**
 * Check if an email address is in the admin allowlist.
 * The allowlist is controlled by the ADMIN_EMAIL_ALLOWLIST env var
 * (comma-separated emails). All checks are server-side only.
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowlist = (process.env.ADMIN_EMAIL_ALLOWLIST ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowlist.includes(email.toLowerCase());
}

/**
 * Assert that the current user is an admin.
 * Call in API routes after getting the user session.
 */
export function assertAdmin(email: string | null | undefined): void {
  if (!isAdmin(email)) {
    throw new Error("Forbidden: admin access required");
  }
}
