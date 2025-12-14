import { Router } from 'express';
import { query, param } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get tasks with filtering
router.get(
  '/',
  authenticate,
  [query('scope').optional().isIn(['today', 'upcoming', 'completed', 'all'])],
  asyncHandler(async (req: AuthRequest, res) => {
    const scope = req.query.scope || 'all';
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    let whereClause: any = { userId: req.userId };

    if (scope === 'today') {
      whereClause.dueDate = {
        gte: today,
        lt: tomorrow,
      };
      whereClause.completed = false;
    } else if (scope === 'upcoming') {
      whereClause.dueDate = {
        gte: tomorrow,
        lte: nextWeek,
      };
      whereClause.completed = false;
    } else if (scope === 'completed') {
      whereClause.completed = true;
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        planting: {
          include: {
            crop: true,
            bed: true,
            garden: true,
          },
        },
      },
      orderBy: [
        { completed: 'asc' },
        { dueDate: 'asc' },
      ],
    });

    res.json(tasks);
  })
);

// Get single task
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        planting: {
          include: {
            crop: true,
            bed: true,
            garden: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ error: { message: 'Task not found' } });
    }

    res.json(task);
  })
);

// Mark task as complete
router.put(
  '/:id/complete',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    // Verify ownership
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: { message: 'Task not found' } });
    }

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        completed: true,
        completedAt: new Date(),
      },
      include: {
        planting: {
          include: {
            crop: true,
          },
        },
      },
    });

    res.json(task);
  })
);

// Mark task as incomplete
router.put(
  '/:id/incomplete',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    // Verify ownership
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: { message: 'Task not found' } });
    }

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        completed: false,
        completedAt: null,
      },
    });

    res.json(task);
  })
);

// Delete task
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    // Verify ownership
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: { message: 'Task not found' } });
    }

    await prisma.task.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Task deleted successfully' });
  })
);

export default router;
