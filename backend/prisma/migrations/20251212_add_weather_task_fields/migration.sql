-- Add weather-based task skipping fields
ALTER TABLE "tasks" ADD COLUMN "skipped_by_weather" BOOLEAN NOT NULL DEFAULT 0;
ALTER TABLE "tasks" ADD COLUMN "weather_reason" TEXT;
