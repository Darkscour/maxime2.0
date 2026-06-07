-- Onboarding tables only (safe to run alongside manual Sponsor import)

CREATE TABLE IF NOT EXISTS "UserAccount" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT,
    "displayName" TEXT,
    "accountType" TEXT,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserAccount_clerkId_key" ON "UserAccount"("clerkId");

CREATE TABLE IF NOT EXISTS "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "school" TEXT,
    "games" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "region" TEXT,
    "rosterSize" INTEGER,
    "avgViewers" INTEGER,
    "discordUrl" TEXT,
    "inviteCode" TEXT NOT NULL,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Team_slug_key" ON "Team"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "Team_inviteCode_key" ON "Team"("inviteCode");
CREATE INDEX IF NOT EXISTS "Team_inviteCode_idx" ON "Team"("inviteCode");

CREATE TABLE IF NOT EXISTS "TeamMembership" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TeamMembership_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "TeamMembership_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "TeamMembership_userId_key" ON "TeamMembership"("userId");
CREATE INDEX IF NOT EXISTS "TeamMembership_teamId_idx" ON "TeamMembership"("teamId");

CREATE TABLE IF NOT EXISTS "PlayerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "game" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "school" TEXT,
    "age" INTEGER,
    "hoursPerWeek" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlayerProfile_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PlayerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "PlayerProfile_userId_key" ON "PlayerProfile"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "PlayerProfile_handle_key" ON "PlayerProfile"("handle");
CREATE INDEX IF NOT EXISTS "PlayerProfile_game_idx" ON "PlayerProfile"("game");
CREATE INDEX IF NOT EXISTS "PlayerProfile_region_idx" ON "PlayerProfile"("region");
