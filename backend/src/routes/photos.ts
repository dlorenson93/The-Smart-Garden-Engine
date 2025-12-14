import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/v1/photos
 * Get all photos for the authenticated user
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const { plantingId, gardenId, type } = req.query;
    
    const where: any = { userId: req.userId };
    if (plantingId) where.plantingId = plantingId as string;
    if (gardenId) where.gardenId = gardenId as string;
    if (type) where.type = type as string;
    
    const photos = await prisma.photo.findMany({
      where,
      include: {
        planting: {
          include: {
            crop: true
          }
        },
        garden: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(photos);
  })
);

/**
 * POST /api/v1/photos
 * Upload a new photo (base64 data URL)
 */
router.post(
  '/',
  authenticate,
  [
    body('url').notEmpty().isString(),
    body('caption').optional().trim(),
    body('type').isIn(['progress', 'harvest', 'problem', 'general']),
    body('plantingId').optional().isString(),
    body('gardenId').optional().isString(),
  ],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }
    
    const { url, caption, type, plantingId, gardenId } = req.body;
    
    // Verify planting/garden ownership if provided
    if (plantingId) {
      const planting = await prisma.planting.findFirst({
        where: { id: plantingId, userId: req.userId }
      });
      if (!planting) {
        return res.status(404).json({ error: { message: 'Planting not found' } });
      }
    }
    
    if (gardenId) {
      const garden = await prisma.garden.findFirst({
        where: { id: gardenId, userId: req.userId }
      });
      if (!garden) {
        return res.status(404).json({ error: { message: 'Garden not found' } });
      }
    }
    
    const photo = await prisma.photo.create({
      data: {
        userId: req.userId!,
        url,
        caption,
        type,
        ...(plantingId && { plantingId }),
        ...(gardenId && { gardenId })
      },
      include: {
        planting: {
          include: {
            crop: true
          }
        },
        garden: true
      }
    });
    
    res.status(201).json(photo);
  })
);

/**
 * DELETE /api/v1/photos/:id
 * Delete a photo
 */
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const { id } = req.params;
    
    const photo = await prisma.photo.findFirst({
      where: { id, userId: req.userId }
    });
    
    if (!photo) {
      return res.status(404).json({ error: { message: 'Photo not found' } });
    }
    
    await prisma.photo.delete({ where: { id } });
    
    res.json({ message: 'Photo deleted' });
  })
);

export default router;
