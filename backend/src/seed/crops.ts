import prisma from '../lib/prisma';

const crops = [
  // Easy Vegetables
  {
    name: 'Lettuce',
    category: 'vegetable',
    sunRequirement: 'partial',
    daysToMaturity: 50,
    daysToGermination: 7,
    spacingInRow: 8,
    spacingBetweenRows: 12,
    difficulty: 'easy',
  },
  {
    name: 'Radish',
    category: 'vegetable',
    sunRequirement: 'full',
    daysToMaturity: 25,
    daysToGermination: 5,
    spacingInRow: 2,
    spacingBetweenRows: 6,
    difficulty: 'easy',
  },
  {
    name: 'Spinach',
    category: 'vegetable',
    sunRequirement: 'partial',
    daysToMaturity: 45,
    daysToGermination: 7,
    spacingInRow: 3,
    spacingBetweenRows: 12,
    difficulty: 'easy',
  },
  {
    name: 'Green Beans',
    category: 'vegetable',
    sunRequirement: 'full',
    daysToMaturity: 55,
    daysToGermination: 8,
    spacingInRow: 4,
    spacingBetweenRows: 18,
    difficulty: 'easy',
  },
  {
    name: 'Zucchini',
    category: 'vegetable',
    sunRequirement: 'full',
    daysToMaturity: 50,
    daysToGermination: 7,
    spacingInRow: 24,
    spacingBetweenRows: 36,
    difficulty: 'easy',
  },
  {
    name: 'Kale',
    category: 'vegetable',
    sunRequirement: 'partial',
    daysToMaturity: 55,
    daysToGermination: 7,
    spacingInRow: 12,
    spacingBetweenRows: 18,
    difficulty: 'easy',
  },
  {
    name: 'Cherry Tomato',
    category: 'vegetable',
    sunRequirement: 'full',
    daysToMaturity: 65,
    daysToGermination: 7,
    spacingInRow: 24,
    spacingBetweenRows: 36,
    difficulty: 'easy',
  },
  // Medium Vegetables
  {
    name: 'Tomato (Beefsteak)',
    category: 'vegetable',
    sunRequirement: 'full',
    daysToMaturity: 80,
    daysToGermination: 7,
    spacingInRow: 24,
    spacingBetweenRows: 36,
    difficulty: 'medium',
  },
  {
    name: 'Cucumber',
    category: 'vegetable',
    sunRequirement: 'full',
    daysToMaturity: 60,
    daysToGermination: 7,
    spacingInRow: 12,
    spacingBetweenRows: 36,
    difficulty: 'medium',
  },
  {
    name: 'Bell Pepper',
    category: 'vegetable',
    sunRequirement: 'full',
    daysToMaturity: 75,
    daysToGermination: 10,
    spacingInRow: 18,
    spacingBetweenRows: 24,
    difficulty: 'medium',
  },
  {
    name: 'Carrot',
    category: 'vegetable',
    sunRequirement: 'full',
    daysToMaturity: 70,
    daysToGermination: 14,
    spacingInRow: 2,
    spacingBetweenRows: 12,
    difficulty: 'medium',
  },
  {
    name: 'Broccoli',
    category: 'vegetable',
    sunRequirement: 'full',
    daysToMaturity: 70,
    daysToGermination: 7,
    spacingInRow: 18,
    spacingBetweenRows: 24,
    difficulty: 'medium',
  },
  {
    name: 'Cabbage',
    category: 'vegetable',
    sunRequirement: 'full',
    daysToMaturity: 90,
    daysToGermination: 7,
    spacingInRow: 18,
    spacingBetweenRows: 24,
    difficulty: 'medium',
  },
  {
    name: 'Eggplant',
    category: 'vegetable',
    sunRequirement: 'full',
    daysToMaturity: 80,
    daysToGermination: 10,
    spacingInRow: 24,
    spacingBetweenRows: 30,
    difficulty: 'medium',
  },
  // Hard Vegetables
  {
    name: 'Cauliflower',
    category: 'vegetable',
    sunRequirement: 'full',
    daysToMaturity: 85,
    daysToGermination: 7,
    spacingInRow: 18,
    spacingBetweenRows: 24,
    difficulty: 'hard',
  },
  {
    name: 'Brussels Sprouts',
    category: 'vegetable',
    sunRequirement: 'full',
    daysToMaturity: 100,
    daysToGermination: 7,
    spacingInRow: 18,
    spacingBetweenRows: 24,
    difficulty: 'hard',
  },
  {
    name: 'Asparagus',
    category: 'vegetable',
    sunRequirement: 'full',
    daysToMaturity: 730, // 2 years for harvest
    daysToGermination: 21,
    spacingInRow: 18,
    spacingBetweenRows: 36,
    difficulty: 'hard',
  },
  // Easy Herbs
  {
    name: 'Basil',
    category: 'herb',
    sunRequirement: 'full',
    daysToMaturity: 60,
    daysToGermination: 7,
    spacingInRow: 10,
    spacingBetweenRows: 12,
    difficulty: 'easy',
  },
  {
    name: 'Mint',
    category: 'herb',
    sunRequirement: 'partial',
    daysToMaturity: 90,
    daysToGermination: 14,
    spacingInRow: 12,
    spacingBetweenRows: 18,
    difficulty: 'easy',
  },
  {
    name: 'Chives',
    category: 'herb',
    sunRequirement: 'partial',
    daysToMaturity: 60,
    daysToGermination: 10,
    spacingInRow: 6,
    spacingBetweenRows: 12,
    difficulty: 'easy',
  },
  {
    name: 'Cilantro',
    category: 'herb',
    sunRequirement: 'partial',
    daysToMaturity: 45,
    daysToGermination: 7,
    spacingInRow: 6,
    spacingBetweenRows: 12,
    difficulty: 'easy',
  },
  {
    name: 'Parsley',
    category: 'herb',
    sunRequirement: 'partial',
    daysToMaturity: 70,
    daysToGermination: 14,
    spacingInRow: 6,
    spacingBetweenRows: 12,
    difficulty: 'easy',
  },
  {
    name: 'Oregano',
    category: 'herb',
    sunRequirement: 'full',
    daysToMaturity: 90,
    daysToGermination: 10,
    spacingInRow: 10,
    spacingBetweenRows: 12,
    difficulty: 'easy',
  },
  {
    name: 'Thyme',
    category: 'herb',
    sunRequirement: 'full',
    daysToMaturity: 90,
    daysToGermination: 14,
    spacingInRow: 12,
    spacingBetweenRows: 12,
    difficulty: 'easy',
  },
  // Fruits
  {
    name: 'Strawberry',
    category: 'fruit',
    sunRequirement: 'full',
    daysToMaturity: 60,
    daysToGermination: 14,
    spacingInRow: 12,
    spacingBetweenRows: 18,
    difficulty: 'medium',
  },
  {
    name: 'Blueberry',
    category: 'fruit',
    sunRequirement: 'full',
    daysToMaturity: 365, // 1 year
    daysToGermination: 30,
    spacingInRow: 48,
    spacingBetweenRows: 60,
    difficulty: 'hard',
  },
  {
    name: 'Raspberry',
    category: 'fruit',
    sunRequirement: 'full',
    daysToMaturity: 365, // 1 year
    daysToGermination: 21,
    spacingInRow: 24,
    spacingBetweenRows: 48,
    difficulty: 'medium',
  },
  // Flowers
  {
    name: 'Marigold',
    category: 'flower',
    sunRequirement: 'full',
    daysToMaturity: 50,
    daysToGermination: 7,
    spacingInRow: 8,
    spacingBetweenRows: 12,
    difficulty: 'easy',
  },
  {
    name: 'Sunflower',
    category: 'flower',
    sunRequirement: 'full',
    daysToMaturity: 80,
    daysToGermination: 10,
    spacingInRow: 12,
    spacingBetweenRows: 24,
    difficulty: 'easy',
  },
  {
    name: 'Nasturtium',
    category: 'flower',
    sunRequirement: 'full',
    daysToMaturity: 50,
    daysToGermination: 10,
    spacingInRow: 10,
    spacingBetweenRows: 12,
    difficulty: 'easy',
  },
];

async function seed() {
  console.log('🌱 Seeding crop database...');

  // Clear existing crops (optional, comment out if you want to preserve)
  await prisma.crop.deleteMany({});

  // Insert all crops
  for (const crop of crops) {
    await prisma.crop.create({ data: crop });
  }

  console.log(`✅ Successfully seeded ${crops.length} crops`);
}

seed()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
