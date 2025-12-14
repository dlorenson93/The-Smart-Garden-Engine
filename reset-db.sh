#!/bin/bash
cd /workspaces/The-Smart-Garden-Engine/backend

echo "🗑️  Removing all Prisma caches..."
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma
rm -rf ../node_modules/.prisma
rm -rf ../node_modules/@prisma

echo "🔄 Regenerating Prisma client..."
npx prisma generate

echo "📊 Creating database..."
npx prisma migrate dev --name init

echo "✅ Done! Start the backend with: npm run dev"
