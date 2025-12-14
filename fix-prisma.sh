#!/bin/bash

echo "🔧 Fixing Prisma Client Issues..."
echo ""
echo "Running migration script..."

cd "$(dirname "$0")/../backend"

node scripts/apply-migration.js

echo ""
echo "✅ Done! Please restart your backend server:"
echo "   cd backend && npm run dev"
