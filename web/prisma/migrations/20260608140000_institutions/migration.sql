-- U.S. institutions (College Scorecard) + team/player links

CREATE TABLE IF NOT EXISTS "Institution" (
    "id" TEXT NOT NULL,
    "scorecardId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nameLower" TEXT NOT NULL,
    "state" TEXT,
    "city" TEXT,
    "primaryDomain" TEXT,
    "domains" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Institution_scorecardId_key" ON "Institution"("scorecardId");
CREATE INDEX IF NOT EXISTS "Institution_nameLower_idx" ON "Institution"("nameLower");

ALTER TABLE "Team" ADD COLUMN IF NOT EXISTS "institutionId" TEXT;
ALTER TABLE "PlayerProfile" ADD COLUMN IF NOT EXISTS "institutionId" TEXT;

DO $$ BEGIN
  ALTER TABLE "Team" ADD CONSTRAINT "Team_institutionId_fkey"
    FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "PlayerProfile" ADD CONSTRAINT "PlayerProfile_institutionId_fkey"
    FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "Team_institutionId_idx" ON "Team"("institutionId");
CREATE INDEX IF NOT EXISTS "PlayerProfile_institutionId_idx" ON "PlayerProfile"("institutionId");
