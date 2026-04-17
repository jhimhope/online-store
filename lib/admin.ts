// List of admin emails - set ADMIN_EMAILS in Vercel environment variables
// Format: comma-separated emails e.g. "admin@store.com,owner@store.com"
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const adminEmails = process.env.ADMIN_EMAILS || ''
  if (!adminEmails) return false
  return adminEmails.split(',').map(e => e.trim().toLowerCase()).includes(email.toLowerCase())
}
