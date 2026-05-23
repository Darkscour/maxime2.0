-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "avatarHue" INTEGER NOT NULL,
    "game" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "school" TEXT,
    "age" INTEGER NOT NULL,
    "winRate" DOUBLE PRECISION NOT NULL,
    "kda" DOUBLE PRECISION NOT NULL,
    "hoursPerWeek" INTEGER NOT NULL,
    "fitScore" INTEGER NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'Available',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "externalSrc" TEXT,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "checkSize" TEXT NOT NULL,
    "regions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "games" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "audience" TEXT NOT NULL,
    "applicationUrl" TEXT NOT NULL,
    "contact" TEXT,
    "description" TEXT NOT NULL,
    "brandHue" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'manual_curation',
    "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_handle_key" ON "Player"("handle");

-- CreateIndex
CREATE INDEX "Player_game_idx" ON "Player"("game");

-- CreateIndex
CREATE INDEX "Player_region_idx" ON "Player"("region");

-- CreateIndex
CREATE INDEX "Player_rank_idx" ON "Player"("rank");

-- CreateIndex
CREATE UNIQUE INDEX "Sponsor_name_key" ON "Sponsor"("name");

-- CreateIndex
CREATE INDEX "Sponsor_industry_idx" ON "Sponsor"("industry");

-- CreateIndex
CREATE INDEX "Sponsor_tier_idx" ON "Sponsor"("tier");
