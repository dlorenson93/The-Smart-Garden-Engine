-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "grower_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "climate_zone" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "experience_level" TEXT NOT NULL,
    "garden_type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "grower_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gardens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "width" REAL,
    "height" REAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "gardens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "beds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "garden_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "length" REAL NOT NULL,
    "width" REAL NOT NULL,
    "position_x" REAL,
    "position_y" REAL,
    "rotation" REAL DEFAULT 0,
    "sun_exposure" TEXT NOT NULL,
    "sun_hours" REAL,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "beds_garden_id_fkey" FOREIGN KEY ("garden_id") REFERENCES "gardens" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "crops" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sun_requirement" TEXT NOT NULL,
    "days_to_maturity" INTEGER NOT NULL,
    "days_to_germination" INTEGER,
    "spacing_in_row" REAL,
    "spacing_between_rows" REAL,
    "difficulty" TEXT NOT NULL,
    "min_hardiness_zone" INTEGER,
    "max_hardiness_zone" INTEGER,
    "frost_tolerant" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "plantings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "garden_id" TEXT NOT NULL,
    "bed_id" TEXT NOT NULL,
    "crop_id" TEXT NOT NULL,
    "planting_date" DATETIME NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expected_harvest_start" DATETIME NOT NULL,
    "expected_harvest_end" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "plantings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "plantings_garden_id_fkey" FOREIGN KEY ("garden_id") REFERENCES "gardens" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "plantings_bed_id_fkey" FOREIGN KEY ("bed_id") REFERENCES "beds" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "plantings_crop_id_fkey" FOREIGN KEY ("crop_id") REFERENCES "crops" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "planting_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "due_date" DATETIME NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tasks_planting_id_fkey" FOREIGN KEY ("planting_id") REFERENCES "plantings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "harvest_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "planting_id" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "units" TEXT NOT NULL,
    "notes" TEXT,
    "surplus_flag" BOOLEAN NOT NULL DEFAULT false,
    "surplus_amount" REAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "harvest_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "harvest_logs_planting_id_fkey" FOREIGN KEY ("planting_id") REFERENCES "plantings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "integration_configs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "external_marketplace_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ai_chats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "context" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "grower_profiles_user_id_key" ON "grower_profiles"("user_id");
