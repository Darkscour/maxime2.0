/** True when the signed-in user's email matches DEVELOPER_EMAIL in .env */
export function isDeveloperEmail(email: string | null | undefined): boolean {
  const configured = process.env.DEVELOPER_EMAIL?.trim().toLowerCase();
  if (!configured || !email) return false;
  return email.trim().toLowerCase() === configured;
}
