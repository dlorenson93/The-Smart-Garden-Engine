#!/bin/bash

# Navigate to backend directory
cd "$(dirname "$0")/../backend" || exit 1

echo "Applying password reset migration..."

# Apply the migration SQL directly to the database
sqlite3 prisma/dev.db < prisma/migrations/20251213_add_password_resets/migration.sql

echo "Regenerating Prisma Client..."
npx prisma generate

echo "✅ Password reset migration complete!"
echo "The Prisma client has been regenerated with PasswordReset model."
