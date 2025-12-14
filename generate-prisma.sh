#!/bin/bash

# Regenerate Prisma Client after schema changes

echo "🔄 Regenerating Prisma Client..."

cd backend
npx prisma generate

echo "✅ Prisma Client regenerated successfully!"
echo ""
echo "The TypeScript types for the new schema fields are now available."
