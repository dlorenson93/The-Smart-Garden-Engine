import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { getWateringIntelligence, autoSkipWateringTasks } from '../services/watering.service';

const router = Router();

/**
 * GET /api/v1/watering/intelligence
 * Get smart watering recommendations based on weather
 */
router.get(
  '/intelligence',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.userId!;
    const intelligence = await getWateringIntelligence(userId);
    res.json(intelligence);
  })
);

/**
 * POST /api/v1/watering/auto-skip
 * Manually trigger auto-skip of watering tasks based on weather
 */
router.post(
  '/auto-skip',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.userId!;
    const skippedCount = await autoSkipWateringTasks(userId);
    res.json({ 
      skipped: skippedCount,
      message: skippedCount > 0 
        ? `Skipped ${skippedCount} watering task(s) due to rain forecast`
        : 'No watering tasks to skip'
    });
  })
);

export default router;
