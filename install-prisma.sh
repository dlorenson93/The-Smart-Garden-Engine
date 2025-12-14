#!/bin/bash
cd /workspaces/The-Smart-Garden-Engine/backend

echo "📦 Installing Prisma..."
npm install @prisma/client

echo "🔄 Generating Prisma client..."
npx prisma generate

echo "✅ Done! Backend is ready."
