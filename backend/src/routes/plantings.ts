import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { generateTasksForPlanting } from '../utils/taskGenerator';
import { calculatePlantAnalytics, getSunlightInfo } from '../utils/plantAnalytics';

const router = Router();

// Get all plantings for user
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const plantings = await prisma.planting.findMany({
      where: { userId: req.userId },
      include: {
        crop: true,
        bed: true,
        garden: true,
        tasks: {
          where: {
            completed: false,
          },
          orderBy: { dueDate: 'asc' },
          take: 1,
        },
        _count: {
          select: {
            tasks: true,
            harvestLogs: true,
          },
        },
      },
      orderBy: { plantingDate: 'desc' },
    });

    // Add analytics to each planting
    const plantingsWithAnalytics = plantings.map((planting) => {
      const analytics = calculatePlantAnalytics(
        new Date(planting.plantingDate),
        new Date(planting.expectedHarvestStart),
        new Date(planting.expectedHarvestEnd),
        planting.healthStatus
      );

      const sunlightInfo = getSunlightInfo(planting.bed.sunExposure);
      const nextTask = planting.tasks[0] || null;

      return {
        ...planting,
        analytics,
        sunlightInfo,
        nextTask,
      };
    });

    res.json(plantingsWithAnalytics);
  })
);

// Get single planting with full details
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const planting = await prisma.planting.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        crop: true,
        bed: true,
        garden: true,
        tasks: {
          where: {
            completed: false,
          },
          orderBy: { dueDate: 'asc' },
          take: 1,
        },
        harvestLogs: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!planting) {
      return res.status(404).json({ error: { message: 'Planting not found' } });
    }

    // Calculate analytics
    const analytics = calculatePlantAnalytics(
      new Date(planting.plantingDate),
      new Date(planting.expectedHarvestStart),
      new Date(planting.expectedHarvestEnd),
      planting.healthStatus
    );

    // Get sunlight info from bed
    const sunlightInfo = getSunlightInfo(planting.bed.sunExposure);

    // Get next task
    const nextTask = planting.tasks[0] || null;

    res.json({
      ...planting,
      analytics,
      sunlightInfo,
      nextTask,
    });
  })
);

// Create planting
router.post(
  '/',
  authenticate,
  [
    body('gardenId').notEmpty(),
    body('bedId').notEmpty(),
    body('cropId').notEmpty(),
    body('variety').optional().isString(),
    body('plantingDate').isISO8601(),
    body('quantity').isInt({ min: 1 }),
  ],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    const { gardenId, bedId, cropId, variety, plantingDate, quantity } = req.body;

    // Verify ownership of garden and bed
    const garden = await prisma.garden.findFirst({
      where: { id: gardenId, userId: req.userId },
    });

    if (!garden) {
      return res.status(404).json({ error: { message: 'Garden not found' } });
    }

    const bed = await prisma.bed.findFirst({
      where: { id: bedId, gardenId },
    });

    if (!bed) {
      return res.status(404).json({ error: { message: 'Bed not found' } });
    }

    // Get crop details
    const crop = await prisma.crop.findUnique({
      where: { id: cropId },
    });

    if (!crop) {
      return res.status(404).json({ error: { message: 'Crop not found' } });
    }

    // Calculate harvest window
    const plantDate = new Date(plantingDate);
    const expectedHarvestStart = new Date(plantDate);
    expectedHarvestStart.setDate(expectedHarvestStart.getDate() + crop.daysToMaturity - 7);
    
    const expectedHarvestEnd = new Date(plantDate);
    expectedHarvestEnd.setDate(expectedHarvestEnd.getDate() + crop.daysToMaturity + 7);

    // Create planting
    const planting = await prisma.planting.create({
      data: {
        userId: req.userId!,
        gardenId,
        bedId,
        cropId,
        variety: variety || null,
        plantingDate: plantDate,
        quantity: parseInt(quantity),
        expectedHarvestStart,
        expectedHarvestEnd,
      },
      include: {
        crop: true,
        bed: true,
        garden: true,
      },
    });

    // Generate care tasks
    await generateTasksForPlanting(planting.id, req.userId!, plantDate);

    // Fetch the planting with tasks
    const plantingWithTasks = await prisma.planting.findUnique({
      where: { id: planting.id },
      include: {
        crop: true,
        bed: true,
        garden: true,
        tasks: {
          orderBy: { dueDate: 'asc' },
        },
      },
    });

    res.status(201).json(plantingWithTasks);
  })
);

// Update planting
router.put(
  '/:id',
  authenticate,
  [
    body('quantity').optional().isInt({ min: 1 }),
  ],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    // Verify ownership
    const existing = await prisma.planting.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: { message: 'Planting not found' } });
    }

    const { quantity } = req.body;

    const planting = await prisma.planting.update({
      where: { id: req.params.id },
      data: {
        ...(quantity && { quantity: parseInt(quantity) }),
      },
      include: {
        crop: true,
        bed: true,
        garden: true,
      },
    });

    res.json(planting);
  })
);

// Update planting health status
router.patch(
  '/:id/health',
  authenticate,
  [
    body('healthStatus')
      .isIn(['healthy', 'needs_water', 'needs_fertilizing', 'stressed'])
      .withMessage('Invalid health status'),
  ],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    // Verify ownership
    const existing = await prisma.planting.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: { message: 'Planting not found' } });
    }

    const { healthStatus } = req.body;

    const planting = await prisma.planting.update({
      where: { id: req.params.id },
      data: { healthStatus },
      include: {
        crop: true,
        bed: true,
        garden: true,
      },
    });

    res.json(planting);
  })
);

// Delete planting
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    // Verify ownership
    const existing = await prisma.planting.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: { message: 'Planting not found' } });
    }

    await prisma.planting.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Planting deleted successfully' });
  })
);

// Get harvest logs for a planting
router.get(
  '/:id/harvests',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    // Verify ownership
    const planting = await prisma.planting.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!planting) {
      return res.status(404).json({ error: { message: 'Planting not found' } });
    }

    const harvests = await prisma.harvestLog.findMany({
      where: { plantingId: req.params.id },
      orderBy: { date: 'desc' },
    });

    res.json(harvests);
  })
);

// Log harvest for a planting
router.post(
  '/:id/harvests',
  authenticate,
  [
    body('date').isISO8601(),
    body('amount').isFloat({ min: 0 }),
    body('units').isIn(['lbs', 'kg', 'pieces']),
    body('notes').optional().trim(),
    body('surplusFlag').optional().isBoolean(),
    body('surplusAmount').optional().isFloat({ min: 0 }),
  ],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    // Verify ownership
    const planting = await prisma.planting.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!planting) {
      return res.status(404).json({ error: { message: 'Planting not found' } });
    }

    const { date, amount, units, notes, surplusFlag, surplusAmount } = req.body;

    const harvestLog = await prisma.harvestLog.create({
      data: {
        userId: req.userId!,
        plantingId: req.params.id,
        date: new Date(date),
        amount: parseFloat(amount),
        units,
        notes,
        surplusFlag: surplusFlag || false,
        surplusAmount: surplusAmount ? parseFloat(surplusAmount) : null,
      },
    });

    res.status(201).json(harvestLog);
  })
);

export default router;
