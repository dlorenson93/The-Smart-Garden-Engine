import { PrismaClient } from '@prisma/client';
import { companionData } from '../data/companion-planting';

const prisma = new PrismaClient();

async function updateCompanionPlanting() {
  console.log('🌱 Updating crops with companion planting data...');
  
  let updated = 0;
  let skipped = 0;
  
  for (const [cropName, data] of Object.entries(companionData)) {
    try {
      const result = await prisma.crop.updateMany({
        where: { name: cropName },
        data: {
          companions: data.companions,
          avoid: data.avoid
        }
      });
      
      if (result.count > 0) {
        updated += result.count;
        console.log(`✓ Updated ${cropName}: ${data.companions.split(',').length} companions, ${data.avoid === 'none' ? 0 : data.avoid.split(',').length} to avoid`);
      } else {
        skipped++;
        console.log(`- Skipped ${cropName}: not found in database`);
      }
    } catch (error) {
      console.error(`✗ Error updating ${cropName}:`, error);
    }
  }
  
  console.log(`\n✓ Updated ${updated} crops`);
  console.log(`- Skipped ${skipped} crops (not in database)`);
}

updateCompanionPlanting()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
