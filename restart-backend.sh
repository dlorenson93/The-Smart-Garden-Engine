#!/bin/bash
# Script to restart backend after schema changes

echo "🔄 Regenerating Prisma Client..."
cd /workspaces/The-Smart-Garden-Engine/backend
npx prisma generate

echo "✅ Prisma Client regenerated!"
echo ""
echo "⚠️  Please restart your backend server if it's running:"
echo "   1. Stop the current backend process (Ctrl+C if running in terminal)"
echo "   2. Restart it with: npm run dev"
echo ""
echo "⚠️  Also restart VS Code TypeScript Server:"
echo "   1. Press Ctrl+Shift+P (or Cmd+Shift+P on Mac)"
echo "   2. Type: TypeScript: Restart TS Server"
echo "   3. Press Enter"
