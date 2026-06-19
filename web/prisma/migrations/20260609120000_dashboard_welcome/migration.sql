-- Track whether the user has seen the dashboard overview welcome (first visit vs return).
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "hasWelcomedToDashboard" BOOLEAN NOT NULL DEFAULT false;

UPDATE "UserAccount"
SET "hasWelcomedToDashboard" = true
WHERE "onboardingComplete" = true;
