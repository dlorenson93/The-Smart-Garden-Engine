#!/bin/bash

echo "🌱 Seeding crops database..."
echo ""

cd backend
npm run seed

echo ""
echo "✅ Crops database seeded successfully!"
echo ""
echo "You should now see crops available in the application."
