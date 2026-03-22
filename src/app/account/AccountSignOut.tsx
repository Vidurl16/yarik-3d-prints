"use client";

/**
 * Navigates to the server-side sign-out route which clears auth cookies
 * and redirects to home. Using a server route avoids the client-side
 * supabase.auth.signOut() call that can hang on slow connections.
 */
export default function AccountSignOut() {
  return (
    <a
      href="/api/auth/signout"
      className="font-body text-xs tracking-[0.2em] px-4 py-2 transition-colors inline-block"
      style={{
        border: "1px solid var(--border)",
        color: "var(--muted)",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.color = "var(--text)";
        el.style.borderColor = "var(--primary)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.color = "var(--muted)";
        el.style.borderColor = "var(--border)";
      }}
    >
      SIGN OUT
    </a>
  );
}
