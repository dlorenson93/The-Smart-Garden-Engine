-- Create photos table
CREATE TABLE "photos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "planting_id" TEXT,
    "garden_id" TEXT,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "photos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "photos_planting_id_fkey" FOREIGN KEY ("planting_id") REFERENCES "plantings" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "photos_garden_id_fkey" FOREIGN KEY ("garden_id") REFERENCES "gardens" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
