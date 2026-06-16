CREATE TABLE "DuelChallenge" (
    "id" TEXT NOT NULL,
    "challengerTeamId" TEXT NOT NULL,
    "targetTeamId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "game" TEXT NOT NULL,
    "message" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DuelChallenge_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DuelChallenge_challengerTeamId_status_idx" ON "DuelChallenge"("challengerTeamId", "status");
CREATE INDEX "DuelChallenge_targetTeamId_status_idx" ON "DuelChallenge"("targetTeamId", "status");
CREATE INDEX "DuelChallenge_createdByUserId_idx" ON "DuelChallenge"("createdByUserId");

ALTER TABLE "DuelChallenge"
  ADD CONSTRAINT "DuelChallenge_challengerTeamId_fkey"
  FOREIGN KEY ("challengerTeamId") REFERENCES "Team"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DuelChallenge"
  ADD CONSTRAINT "DuelChallenge_targetTeamId_fkey"
  FOREIGN KEY ("targetTeamId") REFERENCES "Team"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DuelChallenge"
  ADD CONSTRAINT "DuelChallenge_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "UserAccount"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

