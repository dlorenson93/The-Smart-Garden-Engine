import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get single bed
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const bed = await prisma.bed.findFirst({
      where: { id: req.params.id },
      include: {
        garden: true,
        plantings: {
          include: {
            crop: true,
          },
          orderBy: { plantingDate: 'desc' },
        },
      },
    });

    if (!bed || !bed.garden || bed.garden.userId !== req.userId) {
      return res.status(404).json({ error: { message: 'Bed not found' } });
    }

    res.json(bed);
  })
);

// Update bed
router.put(
  '/:id',
  authenticate,
  [
    body('name').optional().notEmpty().trim(),
    body('length').optional().isFloat({ min: 0 }),
    body('width').optional().isFloat({ min: 0 }),
    body('sunExposure').optional().isIn(['full', 'partial', 'shade']),
    body('sunHours').optional().isFloat({ min: 0, max: 24 }),
    body('positionX').optional().isFloat(),
    body('positionY').optional().isFloat(),
    body('rotation').optional().isFloat({ min: 0, max: 360 }),
    body('notes').optional().trim(),
  ],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    // Verify ownership through garden
    const existing = await prisma.bed.findFirst({
      where: {
        id: req.params.id,
        garden: { userId: req.userId },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: { message: 'Bed not found' } });
    }

    const { name, length, width, sunExposure, sunHours, positionX, positionY, rotation, notes } = req.body;

    const bed = await prisma.bed.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(length && { length: parseFloat(length) }),
        ...(width && { width: parseFloat(width) }),
        ...(sunExposure && { sunExposure }),
        ...(sunHours !== undefined && { sunHours: parseFloat(sunHours) }),
        ...(positionX !== undefined && { positionX: parseFloat(positionX) }),
        ...(positionY !== undefined && { positionY: parseFloat(positionY) }),
        ...(rotation !== undefined && { rotation: parseFloat(rotation) }),
        ...(notes !== undefined && { notes }),
      },
    });

    res.json(bed);
  })
);

// Delete bed
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    // Verify ownership through garden
    const existing = await prisma.bed.findFirst({
      where: {
        id: req.params.id,
        garden: { userId: req.userId },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: { message: 'Bed not found' } });
    }

    await prisma.bed.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Bed deleted successfully' });
  })
);

// Update bed position (for garden layout tool)
router.patch(
  '/:id/position',
  authenticate,
  [
    body('positionX').optional().isFloat(),
    body('positionY').optional().isFloat(),
    body('rotation').optional().isFloat({ min: 0, max: 360 }),
  ],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    // Verify ownership through garden
    const existing = await prisma.bed.findFirst({
      where: {
        id: req.params.id,
        garden: { userId: req.userId },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: { message: 'Bed not found' } });
    }

    const { positionX, positionY, rotation } = req.body;

    const bed = await prisma.bed.update({
      where: { id: req.params.id },
      data: {
        ...(positionX !== undefined && { positionX: parseFloat(positionX) }),
        ...(positionY !== undefined && { positionY: parseFloat(positionY) }),
        ...(rotation !== undefined && { rotation: parseFloat(rotation) }),
      },
    });

    res.json(bed);
  })
);

export default router;
