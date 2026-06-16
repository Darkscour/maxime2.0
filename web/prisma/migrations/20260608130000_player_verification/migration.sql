-- Collegiate player school email verification

ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "playerSchoolEmail" TEXT;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "playerVerificationStatus" TEXT;
