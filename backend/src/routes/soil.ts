import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { getSoilInsights } from '../services/soilIntelligence';
import { soilProvider } from '../integrations/soilProvider';

const router = Router();

// ===== PROFILES =====

// Get soil profile for a scope (garden or bed)
router.get(
  '/profile/:scopeType/:scopeId',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { scopeType, scopeId } = req.params;

    if (scopeType !== 'garden' && scopeType !== 'bed') {
      return res.status(400).json({ error: 'Invalid scope type' });
    }

    // Verify ownership
    if (scopeType === 'garden') {
      const garden = await prisma.garden.findFirst({
        where: { id: scopeId, userId: req.userId },
      });
      if (!garden) {
        return res.status(404).json({ error: 'Garden not found' });
      }
    } else {
      const bed = await prisma.bed.findFirst({
        where: { id: scopeId },
        include: { garden: true },
      });
      if (!bed || bed.garden.userId !== req.userId) {
        return res.status(404).json({ error: 'Bed not found' });
      }
    }

    const profile = await prisma.soilProfile.findUnique({
      where: {
        scopeType_scopeId: {
          scopeType,
          scopeId,
        },
      },
      include: {
        tests: {
          orderBy: { testDate: 'desc' },
          take: 10,
        },
        events: {
          orderBy: { eventDate: 'desc' },
          take: 10,
        },
      },
    });

    res.json(profile || null);
  })
);

// Create or update soil profile
router.put(
  '/profile/:scopeType/:scopeId',
  authenticate,
  [
    body('soilType').optional().isString(),
    body('texture').optional().isString(),
    body('drainage').optional().isIn(['poor', 'average', 'well']),
    body('ph').optional().isFloat({ min: 3.0, max: 9.0 }),
    body('organicMatter').optional().isFloat({ min: 0, max: 100 }),
    body('notes').optional().isString(),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { scopeType, scopeId } = req.params;
    const { soilType, texture, drainage, ph, organicMatter, notes } = req.body;

    if (scopeType !== 'garden' && scopeType !== 'bed') {
      return res.status(400).json({ error: 'Invalid scope type' });
    }

    // Verify ownership
    if (scopeType === 'garden') {
      const garden = await prisma.garden.findFirst({
        where: { id: scopeId, userId: req.userId },
      });
      if (!garden) {
        return res.status(404).json({ error: 'Garden not found' });
      }
    } else {
      const bed = await prisma.bed.findFirst({
        where: { id: scopeId },
        include: { garden: true },
      });
      if (!bed || bed.garden.userId !== req.userId) {
        return res.status(404).json({ error: 'Bed not found' });
      }
    }

    const profile = await prisma.soilProfile.upsert({
      where: {
        scopeType_scopeId: {
          scopeType,
          scopeId,
        },
      },
      update: {
        soilType,
        texture,
        drainage,
        ph,
        organicMatter,
        notes,
        updatedAt: new Date(),
      },
      create: {
        scopeType,
        scopeId,
        soilType,
        texture,
        drainage,
        ph,
        organicMatter,
        notes,
      },
    });

    res.json(profile);
  })
);

// ===== TESTS =====

// Add a soil test
router.post(
  '/test',
  authenticate,
  [
    body('scopeType').isIn(['garden', 'bed']),
    body('scopeId').isString(),
    body('testDate').isISO8601(),
    body('ph').optional().isFloat({ min: 3.0, max: 9.0 }),
    body('nitrogen').optional().isFloat(),
    body('phosphorus').optional().isFloat(),
    body('potassium').optional().isFloat(),
    body('moisture').optional().isFloat({ min: 0, max: 100 }),
    body('salinity').optional().isFloat(),
    body('source').isIn(['manual', 'kit', 'lab', 'sensor']),
    body('notes').optional().isString(),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      scopeType,
      scopeId,
      testDate,
      ph,
      nitrogen,
      phosphorus,
      potassium,
      moisture,
      salinity,
      source,
      notes,
    } = req.body;

    // Verify ownership
    if (scopeType === 'garden') {
      const garden = await prisma.garden.findFirst({
        where: { id: scopeId, userId: req.userId },
      });
      if (!garden) {
        return res.status(404).json({ error: 'Garden not found' });
      }
    } else {
      const bed = await prisma.bed.findFirst({
        where: { id: scopeId },
        include: { garden: true },
      });
      if (!bed || bed.garden.userId !== req.userId) {
        return res.status(404).json({ error: 'Bed not found' });
      }
    }

    // Get or create profile
    let profile = await prisma.soilProfile.findUnique({
      where: {
        scopeType_scopeId: {
          scopeType,
          scopeId,
        },
      },
    });

    if (!profile) {
      profile = await prisma.soilProfile.create({
        data: {
          scopeType,
          scopeId,
        },
      });
    }

    const test = await prisma.soilTest.create({
      data: {
        profileId: profile.id,
        scopeType,
        scopeId,
        testDate: new Date(testDate),
        ph,
        nitrogen,
        phosphorus,
        potassium,
        moisture,
        salinity,
        source,
        notes,
      },
    });

    res.status(201).json(test);
  })
);

// Get tests for a scope
router.get(
  '/tests/:scopeType/:scopeId',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { scopeType, scopeId } = req.params;

    if (scopeType !== 'garden' && scopeType !== 'bed') {
      return res.status(400).json({ error: 'Invalid scope type' });
    }

    // Verify ownership
    if (scopeType === 'garden') {
      const garden = await prisma.garden.findFirst({
        where: { id: scopeId, userId: req.userId },
      });
      if (!garden) {
        return res.status(404).json({ error: 'Garden not found' });
      }
    } else {
      const bed = await prisma.bed.findFirst({
        where: { id: scopeId },
        include: { garden: true },
      });
      if (!bed || bed.garden.userId !== req.userId) {
        return res.status(404).json({ error: 'Bed not found' });
      }
    }

    const tests = await prisma.soilTest.findMany({
      where: {
        scopeType,
        scopeId,
      },
      orderBy: { testDate: 'desc' },
    });

    res.json(tests);
  })
);

// ===== EVENTS =====

// Add a soil event (amendment, compost, etc.)
router.post(
  '/event',
  authenticate,
  [
    body('scopeType').isIn(['garden', 'bed']),
    body('scopeId').isString(),
    body('eventType').isIn(['amendment', 'compost', 'mulch', 'lime', 'sulfur', 'fertilizer']),
    body('amount').isString(),
    body('eventDate').isISO8601(),
    body('notes').optional().isString(),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { scopeType, scopeId, eventType, amount, eventDate, notes } = req.body;

    // Verify ownership
    if (scopeType === 'garden') {
      const garden = await prisma.garden.findFirst({
        where: { id: scopeId, userId: req.userId },
      });
      if (!garden) {
        return res.status(404).json({ error: 'Garden not found' });
      }
    } else {
      const bed = await prisma.bed.findFirst({
        where: { id: scopeId },
        include: { garden: true },
      });
      if (!bed || bed.garden.userId !== req.userId) {
        return res.status(404).json({ error: 'Bed not found' });
      }
    }

    // Get or create profile
    let profile = await prisma.soilProfile.findUnique({
      where: {
        scopeType_scopeId: {
          scopeType,
          scopeId,
        },
      },
    });

    if (!profile) {
      profile = await prisma.soilProfile.create({
        data: {
          scopeType,
          scopeId,
        },
      });
    }

    const event = await prisma.soilEvent.create({
      data: {
        profileId: profile.id,
        scopeType,
        scopeId,
        eventType,
        amount,
        eventDate: new Date(eventDate),
        notes,
      },
    });

    res.status(201).json(event);
  })
);

// Get events for a scope
router.get(
  '/events/:scopeType/:scopeId',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { scopeType, scopeId } = req.params;

    if (scopeType !== 'garden' && scopeType !== 'bed') {
      return res.status(400).json({ error: 'Invalid scope type' });
    }

    // Verify ownership
    if (scopeType === 'garden') {
      const garden = await prisma.garden.findFirst({
        where: { id: scopeId, userId: req.userId },
      });
      if (!garden) {
        return res.status(404).json({ error: 'Garden not found' });
      }
    } else {
      const bed = await prisma.bed.findFirst({
        where: { id: scopeId },
        include: { garden: true },
      });
      if (!bed || bed.garden.userId !== req.userId) {
        return res.status(404).json({ error: 'Bed not found' });
      }
    }

    const events = await prisma.soilEvent.findMany({
      where: {
        scopeType,
        scopeId,
      },
      orderBy: { eventDate: 'desc' },
    });

    res.json(events);
  })
);

// ===== INSIGHTS =====

// Get soil insights (health score + recommendations)
router.get(
  '/insights/:scopeType/:scopeId',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { scopeType, scopeId } = req.params;

    if (scopeType !== 'garden' && scopeType !== 'bed') {
      return res.status(400).json({ error: 'Invalid scope type' });
    }

    // Verify ownership
    if (scopeType === 'garden') {
      const garden = await prisma.garden.findFirst({
        where: { id: scopeId, userId: req.userId },
      });
      if (!garden) {
        return res.status(404).json({ error: 'Garden not found' });
      }
    } else {
      const bed = await prisma.bed.findFirst({
        where: { id: scopeId },
        include: { garden: true },
      });
      if (!bed || bed.garden.userId !== req.userId) {
        return res.status(404).json({ error: 'Bed not found' });
      }
    }

    const profile = await prisma.soilProfile.findUnique({
      where: {
        scopeType_scopeId: {
          scopeType,
          scopeId,
        },
      },
      include: {
        tests: {
          orderBy: { testDate: 'desc' },
          take: 1,
        },
      },
    });

    if (!profile) {
      return res.json({
        score: 50,
        scoreBreakdown: {
          phScore: 50,
          drainageScore: 50,
          organicMatterScore: 50,
          textureScore: 50,
        },
        summaryBullets: ['No soil data yet - start by adding a soil profile'],
        warnings: [],
        recommendedActions: [
          {
            title: 'Set up your soil profile',
            reason: 'Understanding your soil is the first step to a healthy garden',
            howTo: 'Add soil type, drainage, and pH information',
            priority: 'high' as const,
          },
        ],
        cropFit: [],
      });
    }

    const latestTest = profile.tests[0] || undefined;

    // Optional: fetch weather context (TODO: integrate with weather service)
    const weatherContext = undefined;

    const insights = getSoilInsights(
      {
        id: profile.id,
        scopeType: profile.scopeType as 'garden' | 'bed',
        scopeId: profile.scopeId,
        soilType: profile.soilType || undefined,
        texture: profile.texture || undefined,
        drainage: profile.drainage || undefined,
        ph: profile.ph || undefined,
        organicMatter: profile.organicMatter || undefined,
        notes: profile.notes || undefined,
      },
      latestTest ? {
        id: latestTest.id,
        profileId: latestTest.profileId,
        testDate: latestTest.testDate,
        ph: latestTest.ph || undefined,
        nitrogen: latestTest.nitrogen || undefined,
        phosphorus: latestTest.phosphorus || undefined,
        potassium: latestTest.potassium || undefined,
        moisture: latestTest.moisture || undefined,
        salinity: latestTest.salinity || undefined,
        source: latestTest.source,
        notes: latestTest.notes || undefined,
      } : undefined,
      weatherContext
    );

    res.json(insights);
  })
);

// ===== EXTERNAL INTEGRATIONS =====

// Lookup soil data by location (USDA soil survey)
router.get(
  '/lookup/location',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon required' });
    }

    const suggestion = await soilProvider.lookupByLocation(
      parseFloat(lat as string),
      parseFloat(lon as string)
    );

    res.json(suggestion || { message: 'No data available for this location' });
  })
);

// Get amendment products for a goal
router.get(
  '/amendments/:goal',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { goal } = req.params;

    const products = await soilProvider.getAmendmentsForGoal(goal);

    res.json(products);
  })
);

// Get all profiles for user (for dashboard summary)
router.get(
  '/user-summary',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    // Get all gardens for user
    const gardens = await prisma.garden.findMany({
      where: { userId: req.userId },
      include: {
        beds: true,
      },
    });

    const gardenIds = gardens.map(g => g.id);
    const bedIds = gardens.flatMap(g => g.beds.map(b => b.id));

    // Get soil profiles for all gardens and beds
    const profiles = await prisma.soilProfile.findMany({
      where: {
        OR: [
          { scopeType: 'garden', scopeId: { in: gardenIds } },
          { scopeType: 'bed', scopeId: { in: bedIds } },
        ],
      },
      include: {
        tests: {
          orderBy: { testDate: 'desc' },
          take: 1,
        },
      },
    });

    res.json(profiles);
  })
);

export default router;
