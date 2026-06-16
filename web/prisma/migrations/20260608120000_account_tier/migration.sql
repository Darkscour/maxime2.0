-- Add account tier (collegiate | grassroots) for onboarding split

ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "accountTier" TEXT;
ALTER TABLE "Team" ADD COLUMN IF NOT EXISTS "accountTier" TEXT;
ALTER TABLE "PlayerProfile" ADD COLUMN IF NOT EXISTS "accountTier" TEXT;
