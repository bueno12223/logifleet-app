-- Repair the seeded super-admin row from 20260613130000. Its auth.users token
-- columns were left NULL, which makes GoTrue fail login with "Database error
-- querying schema" (it scans these columns into non-nullable Go strings).
-- The original migration is amended for clean applies; this fixes the row that
-- was already seeded on the linked project.
update auth.users
set
  confirmation_token = coalesce(confirmation_token, ''),
  recovery_token = coalesce(recovery_token, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change = coalesce(email_change, ''),
  email_change_token_current = coalesce(email_change_token_current, ''),
  phone_change = coalesce(phone_change, ''),
  phone_change_token = coalesce(phone_change_token, ''),
  reauthentication_token = coalesce(reauthentication_token, '')
where email = 'jesus@mindcodeservice.com';
