import { Router } from 'express';
import { body, validationResult, query } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /seeds - Get all seeds for user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { cropName, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    const where: any = {
      userId: req.userId
    };
    
    if (cropName) {
      where.cropName = {
        contains: cropName,
        mode: 'insensitive'
      };
    }
    
    const seeds = await prisma.seed.findMany({
      where,
      orderBy: { [sortBy as string]: order }
    });
    
    res.json(seeds);
  } catch (error: any) {
    console.error('Error fetching seeds:', error.message);
    res.status(500).json({ error: { message: 'Failed to fetch seeds', details: error.message } });
  }
});

// GET /seeds/:id - Get single seed
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const seed = await prisma.seed.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });
    
    if (!seed) {
      return res.status(404).json({ error: { message: 'Seed not found' } });
    }
    
    res.json(seed);
  } catch (error) {
    console.error('Error fetching seed:', error);
    res.status(500).json({ error: { message: 'Failed to fetch seed' } });
  }
});

// POST /seeds - Create new seed entry
router.post(
  '/',
  authenticate,
  body('cropName').notEmpty().withMessage('Crop name is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),
  body('unit').optional().isIn(['packets', 'seeds', 'grams', 'oz']).withMessage('Invalid unit'),
  body('purchaseDate').optional().isISO8601().withMessage('Invalid purchase date'),
  body('expirationDate').optional().isISO8601().withMessage('Invalid expiration date'),
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: errors.array()[0].msg } });
    }
    
    try {
      const { cropName, variety, quantity, unit, source, purchaseDate, expirationDate, notes } = req.body;
      
      console.log('Creating seed with data:', { cropName, variety, quantity, unit, source, purchaseDate, expirationDate, notes });
      console.log('User ID:', req.userId);
      
      const seed = await prisma.seed.create({
        data: {
          userId: req.userId,
          cropName,
          variety: variety || null,
          quantity,
          unit: unit || 'packets',
          source: source || null,
          purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
          expirationDate: expirationDate ? new Date(expirationDate) : null,
          notes: notes || null
        }
      });
      
      res.status(201).json(seed);
    } catch (error: any) {
      console.error('Error creating seed:', error.message);
      res.status(500).json({ error: { message: 'Failed to create seed entry', details: error.message } });
    }
  }
);

// PUT /seeds/:id - Update seed entry
router.put(
  '/:id',
  authenticate,
  body('cropName').optional().notEmpty().withMessage('Crop name cannot be empty'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),
  body('unit').optional().isIn(['packets', 'seeds', 'grams', 'oz']).withMessage('Invalid unit'),
  body('purchaseDate').optional().isISO8601().withMessage('Invalid purchase date'),
  body('expirationDate').optional().isISO8601().withMessage('Invalid expiration date'),
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: errors.array()[0].msg } });
    }
    
    try {
      const { id } = req.params;
      
      // Check ownership
      const existing = await prisma.seed.findFirst({
        where: { id, userId: req.userId }
      });
      
      if (!existing) {
        return res.status(404).json({ error: { message: 'Seed not found' } });
      }
      
      const { cropName, variety, quantity, unit, source, purchaseDate, expirationDate, notes } = req.body;
      
      const seed = await prisma.seed.update({
        where: { id },
        data: {
          ...(cropName !== undefined && { cropName }),
          ...(variety !== undefined && { variety }),
          ...(quantity !== undefined && { quantity }),
          ...(unit !== undefined && { unit }),
          ...(source !== undefined && { source }),
          ...(purchaseDate !== undefined && { purchaseDate: purchaseDate ? new Date(purchaseDate) : null }),
          ...(expirationDate !== undefined && { expirationDate: expirationDate ? new Date(expirationDate) : null }),
          ...(notes !== undefined && { notes })
        }
      });
      
      res.json(seed);
    } catch (error) {
      console.error('Error updating seed:', error);
      res.status(500).json({ error: { message: 'Failed to update seed entry' } });
    }
  }
);

// DELETE /seeds/:id - Delete seed entry
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const seed = await prisma.seed.findFirst({
      where: { id, userId: req.userId }
    });
    
    if (!seed) {
      return res.status(404).json({ error: { message: 'Seed not found' } });
    }
    
    await prisma.seed.delete({ where: { id } });
    
    res.json({ message: 'Seed entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting seed:', error);
    res.status(500).json({ error: { message: 'Failed to delete seed entry' } });
  }
});

// POST /seeds/:id/use - Decrease seed quantity
router.post(
  '/:id/use',
  authenticate,
  body('amount').isInt({ min: 1 }).withMessage('Amount must be a positive integer'),
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: errors.array()[0].msg } });
    }
    
    try {
      const { id } = req.params;
      const { amount } = req.body;
      
      const seed = await prisma.seed.findFirst({
        where: { id, userId: req.userId }
      });
      
      if (!seed) {
        return res.status(404).json({ error: { message: 'Seed not found' } });
      }
      
      if (seed.quantity < amount) {
        return res.status(400).json({ error: { message: 'Not enough seeds in inventory' } });
      }
      
      const updatedSeed = await prisma.seed.update({
        where: { id },
        data: { quantity: seed.quantity - amount }
      });
      
      res.json(updatedSeed);
    } catch (error) {
      console.error('Error using seeds:', error);
      res.status(500).json({ error: { message: 'Failed to update seed quantity' } });
    }
  }
);

export default router;
