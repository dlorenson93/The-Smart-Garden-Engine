-- Add companion planting fields to crops table
ALTER TABLE "crops" ADD COLUMN "companions" TEXT;
ALTER TABLE "crops" ADD COLUMN "avoid" TEXT;
