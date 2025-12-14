-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ai_chats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "context" TEXT,
    "scope_type" TEXT NOT NULL DEFAULT 'global',
    "scope_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ai_chats" ("context", "created_at", "id", "question", "response", "user_id") SELECT "context", "created_at", "id", "question", "response", "user_id" FROM "ai_chats";
DROP TABLE "ai_chats";
ALTER TABLE "new_ai_chats" RENAME TO "ai_chats";
CREATE INDEX "ai_chats_user_id_scope_type_scope_id_idx" ON "ai_chats"("user_id", "scope_type", "scope_id");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_users" ("created_at", "email", "id", "password_hash", "updated_at") SELECT "created_at", "email", "id", "password_hash", "updated_at" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
