import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get all gardens for user
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const gardens = await prisma.garden.findMany({
      where: { userId: req.userId },
      include: {
        beds: true,
        _count: {
          select: { plantings: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(gardens);
  })
);

// Get single garden
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const garden = await prisma.garden.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        beds: {
          include: {
            _count: {
              select: { plantings: true },
            },
          },
        },
      },
    });

    if (!garden) {
      return res.status(404).json({ error: { message: 'Garden not found' } });
    }

    res.json(garden);
  })
);

// Create garden
router.post(
  '/',
  authenticate,
  [
    body('name').notEmpty().trim(),
    body('description').optional().trim(),
  ],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    const { name, description } = req.body;

    try {
      // Verify user exists before creating garden
      if (!req.userId) {
        return res.status(401).json({ error: { message: 'User not authenticated' } });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.userId },
      });

      if (!user) {
        return res.status(404).json({ error: { message: 'User not found. Please log in again.' } });
      }

      const garden = await prisma.garden.create({
        data: {
          userId: req.userId,
          name,
          description: description || null,
          width: 30, // Default garden width
          height: 20, // Default garden height
        },
      });

      res.status(201).json(garden);
    } catch (error) {
      console.error('Database error creating garden:', error);
      throw error;
    }
  })
);

// Update garden
router.put(
  '/:id',
  authenticate,
  [
    body('name').optional().notEmpty().trim(),
    body('description').optional().trim(),
  ],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    const { name, description } = req.body;

    // Verify ownership
    const existing = await prisma.garden.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: { message: 'Garden not found' } });
    }

    const garden = await prisma.garden.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    });

    res.json(garden);
  })
);

// Delete garden
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    // Verify ownership
    const existing = await prisma.garden.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: { message: 'Garden not found' } });
    }

    await prisma.garden.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Garden deleted successfully' });
  })
);

// Get beds for a garden
router.get(
  '/:gardenId/beds',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    // Verify garden ownership
    const garden = await prisma.garden.findFirst({
      where: { id: req.params.gardenId, userId: req.userId },
    });

    if (!garden) {
      return res.status(404).json({ error: { message: 'Garden not found' } });
    }

    const beds = await prisma.bed.findMany({
      where: { gardenId: req.params.gardenId },
      include: {
        _count: {
          select: { plantings: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(beds);
  })
);

// Create bed in a garden
router.post(
  '/:gardenId/beds',
  authenticate,
  [
    body('name').notEmpty().trim(),
    body('length').isFloat({ min: 0 }),
    body('width').isFloat({ min: 0 }),
    body('sunExposure').isIn(['full', 'partial', 'shade']),
    body('notes').optional().trim(),
  ],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    // Verify garden ownership
    const garden = await prisma.garden.findFirst({
      where: { id: req.params.gardenId, userId: req.userId },
    });

    if (!garden) {
      return res.status(404).json({ error: { message: 'Garden not found' } });
    }

    const { name, length, width, sunExposure, notes } = req.body;

    const bed = await prisma.bed.create({
      data: {
        gardenId: req.params.gardenId,
        name,
        length: parseFloat(length),
        width: parseFloat(width),
        sunExposure,
        notes,
      },
    });

    res.status(201).json(bed);
  })
);

// Get garden layout with bed positions
router.get(
  '/:id/layout',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const garden = await prisma.garden.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: {
        beds: {
          include: {
            plantings: {
              include: {
                crop: true,
              },
            },
          },
        },
      },
    }) as any;

    if (!garden) {
      return res.status(404).json({ error: { message: 'Garden not found' } });
    }

    res.json({
      id: garden.id,
      name: garden.name,
      width: garden.width,
      height: garden.height,
      beds: (garden.beds || []).map((bed: any) => ({
        id: bed.id,
        name: bed.name,
        length: bed.length,
        width: bed.width,
        positionX: bed.positionX,
        positionY: bed.positionY,
        rotation: bed.rotation,
        sunExposure: bed.sunExposure,
        sunHours: bed.sunHours,
        plantings: bed.plantings || [],
      })),
    });
  })
);

export default router;
