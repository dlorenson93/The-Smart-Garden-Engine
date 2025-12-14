import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import seasonalData from '../data/seasonal-crops.json';

const router = Router();

// Get seasonal crop recommendations
router.get(
  '/seasonal',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    // Get user's profile to find their USDA zone
    const profile = await prisma.growerProfile.findUnique({
      where: { userId: req.userId },
    }) as any;

    if (!profile || !profile.usdaZone) {
      return res.status(400).json({ 
        error: { message: 'Profile not found or USDA zone not set. Please update your profile with a ZIP code.' } 
      });
    }

    const currentMonth = new Date().getMonth() + 1; // 1-12
    const zone = profile.usdaZone;

    // Get recommended crop names for this zone and month
    const recommendations = (seasonalData.recommendations as any)[zone];
    const cropNames = recommendations?.[currentMonth.toString()] || [];

    if (cropNames.length === 0) {
      return res.json({ 
        zone, 
        month: currentMonth, 
        crops: [],
        message: 'No specific recommendations for this month in your zone.'
      });
    }

    // Fetch full crop details from database
    const crops = await prisma.crop.findMany({
      where: {
        name: {
          in: cropNames,
        },
      },
      select: {
        id: true,
        name: true,
        category: true,
        daysToMaturity: true,
        sunRequirement: true,
        difficulty: true,
        spacingInRow: true,
        spacingBetweenRows: true,
        minHardinessZone: true,
        maxHardinessZone: true,
        frostTolerant: true,
      },
    });

    // Log for debugging
    console.log(`Seasonal recommendations for zone ${zone}, month ${currentMonth}:`);
    console.log(`  - Recommended crop names: ${cropNames.join(', ')}`);
    console.log(`  - Found ${crops.length} crops in database`);

    res.json({
      zone,
      month: currentMonth,
      crops,
      frostDates: {
        lastFrost: profile.lastFrostDate,
        firstFrost: profile.firstFrostDate,
      },
    });
  })
);

export default router;
