-- Add optional image URL for team profile/workspace cards.
ALTER TABLE "Team"
ADD COLUMN "profileImageUrl" TEXT;
