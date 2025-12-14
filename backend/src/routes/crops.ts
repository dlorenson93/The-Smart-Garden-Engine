import { Router, Response } from 'express';
import { query, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get all crops with optional filtering
router.get(
  '/',
  authenticate,
  [
    query('category').optional().isIn(['vegetable', 'herb', 'fruit', 'flower']),
    query('difficulty').optional().isIn(['easy', 'medium', 'hard']),
    query('sunRequirement').optional().isIn(['full', 'partial', 'shade']),
  ],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    const { category, difficulty, sunRequirement } = req.query;

    const crops = await prisma.crop.findMany({
      where: {
        ...(category && { category: category as string }),
        ...(difficulty && { difficulty: difficulty as string }),
        ...(sunRequirement && { sunRequirement: sunRequirement as string }),
      },
      orderBy: [
        { difficulty: 'asc' },
        { name: 'asc' },
      ],
    });

    res.json(crops);
  })
);

// Get crop recommendations for a bed
router.get(
  '/recommendations',
  authenticate,
  [query('bedId').notEmpty()],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    const { bedId } = req.query;

    // Get bed details
    const bed = await prisma.bed.findFirst({
      where: {
        id: bedId as string,
        garden: { userId: req.userId },
      },
    });

    if (!bed) {
      return res.status(404).json({ error: { message: 'Bed not found' } });
    }

    // Get user's experience level and climate zone
    const profile = await prisma.growerProfile.findUnique({
      where: { userId: req.userId },
    });

    // Build recommendation query
    const difficultyLevels: string[] = ['easy'];
    if (profile?.experienceLevel === 'intermediate') {
      difficultyLevels.push('medium');
    } else if (profile?.experienceLevel === 'advanced') {
      difficultyLevels.push('medium', 'hard');
    }

    // Find crops that match bed's sun exposure, user's experience level, and climate zone
    const whereClause: any = {
      sunRequirement: bed.sunExposure,
      difficulty: { in: difficultyLevels },
    };

    // Add climate zone filtering if user has it set
    if (profile?.climateZone) {
      const userZone = parseInt(profile.climateZone);
      if (!isNaN(userZone)) {
        whereClause.AND = [
          {
            OR: [
              { minHardinessZone: null },
              { minHardinessZone: { lte: userZone } },
            ],
          },
          {
            OR: [
              { maxHardinessZone: null },
              { maxHardinessZone: { gte: userZone } },
            ],
          },
        ];
      }
    }

    const recommendations = await prisma.crop.findMany({
      where: whereClause,
      orderBy: [
        { difficulty: 'asc' },
        { daysToMaturity: 'asc' },
      ],
    });

    res.json({
      bed: {
        id: bed.id,
        name: bed.name,
        sunExposure: bed.sunExposure,
        sunHours: bed.sunHours,
      },
      userExperienceLevel: profile?.experienceLevel || 'beginner',
      userClimateZone: profile?.climateZone,
      recommendations,
    });
  })
);

// Get single crop details
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const crop = await prisma.crop.findUnique({
      where: { id: req.params.id },
    });

    if (!crop) {
      return res.status(404).json({ error: { message: 'Crop not found' } });
    }

    res.json(crop);
  })
);

export default router;
