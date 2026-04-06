# Supabase Auth Email Branding

The sign-up confirmation email is managed in the Supabase Dashboard, not in code.

## Steps to update

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Select "Confirm signup"
3. Update the **Subject** to: `Confirm your Dexarium account`
4. Update the **From Name** to: `The Dexarium`
5. Update the body to include "The Dexarium" branding — remove any Supabase references
6. Ensure the **Sender email** is set to a domain you own (e.g. `orders@yarik3d.co.za`)

## Note

This configuration must be re-applied after any Supabase project reset.

All transactional order confirmation emails are sent via Resend (`src/lib/email/index.ts`)
and are fully branded as "The Dexarium" in code. The Supabase auth template (above) is
the only email that requires a manual dashboard update.
