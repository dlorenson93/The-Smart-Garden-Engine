import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get surplus harvest summary
router.get(
  '/surplus',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    // Get all gardens for this user
    const gardens = await prisma.garden.findMany({
      where: { userId: req.userId },
      select: { id: true },
    });

    const gardenIds = gardens.map(g => g.id);

    if (gardenIds.length === 0) {
      return res.json({ surplusSummary: [] });
    }

    // Get all harvest logs with surplus flagged
    const surplusHarvests = await prisma.harvestLog.findMany({
      where: {
        planting: {
          bed: {
            gardenId: {
              in: gardenIds,
            },
          },
        },
        surplusFlag: true,
      },
      include: {
        planting: {
          include: {
            crop: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Aggregate by crop
    const summary = surplusHarvests.reduce((acc: any, log) => {
      const cropId = log.planting.crop.id;
      const cropName = log.planting.crop.name;

      if (!acc[cropId]) {
        acc[cropId] = {
          cropId,
          cropName,
          totalQuantity: 0,
          unit: log.units || 'units',
          harvestCount: 0,
          lastHarvestDate: log.date,
        };
      }

      acc[cropId].totalQuantity += log.amount;
      acc[cropId].harvestCount += 1;

      // Update last harvest date if more recent
      if (new Date(log.date) > new Date(acc[cropId].lastHarvestDate)) {
        acc[cropId].lastHarvestDate = log.date;
      }

      return acc;
    }, {});

    const surplusSummary = Object.values(summary);

    res.json({ surplusSummary });
  })
);

export default router;
