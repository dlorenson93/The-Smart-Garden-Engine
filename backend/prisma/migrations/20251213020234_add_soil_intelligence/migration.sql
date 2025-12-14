-- CreateTable
CREATE TABLE "seeds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "crop_name" TEXT NOT NULL,
    "variety" TEXT,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'packets',
    "source" TEXT,
    "purchase_date" DATETIME,
    "expiration_date" DATETIME,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "seeds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "soil_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scope_type" TEXT NOT NULL,
    "scope_id" TEXT NOT NULL,
    "soil_type" TEXT,
    "texture" TEXT,
    "drainage" TEXT,
    "ph" REAL,
    "organic_matter" REAL,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "soil_tests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profile_id" TEXT NOT NULL,
    "scope_type" TEXT NOT NULL,
    "scope_id" TEXT NOT NULL,
    "test_date" DATETIME NOT NULL,
    "ph" REAL,
    "nitrogen" REAL,
    "phosphorus" REAL,
    "potassium" REAL,
    "moisture" REAL,
    "salinity" REAL,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "soil_tests_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "soil_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "soil_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profile_id" TEXT NOT NULL,
    "scope_type" TEXT NOT NULL,
    "scope_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "event_date" DATETIME NOT NULL,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "soil_events_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "soil_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "soil_profiles_scope_type_scope_id_idx" ON "soil_profiles"("scope_type", "scope_id");

-- CreateIndex
CREATE UNIQUE INDEX "soil_profiles_scope_type_scope_id_key" ON "soil_profiles"("scope_type", "scope_id");

-- CreateIndex
CREATE INDEX "soil_tests_profile_id_test_date_idx" ON "soil_tests"("profile_id", "test_date");

-- CreateIndex
CREATE INDEX "soil_tests_scope_type_scope_id_idx" ON "soil_tests"("scope_type", "scope_id");

-- CreateIndex
CREATE INDEX "soil_events_profile_id_event_date_idx" ON "soil_events"("profile_id", "event_date");

-- CreateIndex
CREATE INDEX "soil_events_scope_type_scope_id_idx" ON "soil_events"("scope_type", "scope_id");
