import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import usdaZonesData from '../data/usda-zones.json';
import axios from 'axios';

const router = Router();

// Helper function to detect USDA zone from ZIP code
function detectZone(postalCode: string): { zone: string | null; lastFrost: string | null; firstFrost: string | null } {
  const zipPrefix = postalCode.substring(0, 3);
  const zone = (usdaZonesData.mappings as any)[zipPrefix] || null;
  
  if (zone && (usdaZonesData.frostDates as any)[zone]) {
    const { lastFrost, firstFrost } = (usdaZonesData.frostDates as any)[zone];
    return { zone, lastFrost, firstFrost };
  }
  
  return { zone, lastFrost: null, firstFrost: null };
}

// Helper function to geocode ZIP code to coordinates
async function geocodePostalCode(postalCode: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const geocodeUrl = 'https://geocoding-api.open-meteo.com/v1/search';
    const response = await axios.get(geocodeUrl, {
      params: {
        name: postalCode,
        count: 1,
        language: 'en',
        format: 'json',
        country: 'US',
      },
      timeout: 5000,
    });

    if (response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0];
      return {
        latitude: location.latitude,
        longitude: location.longitude,
      };
    }

    return null;
  } catch (error) {
    console.error('Error geocoding postal code:', error);
    return null;
  }
}

// Get profile
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const profile = await prisma.growerProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!profile) {
      // Return a default empty profile instead of 404
      // This prevents "Profile not found" errors in the UI
      return res.json({
        id: null,
        userId: req.userId,
        name: '',
        location: '',
        experienceLevel: 'beginner',
        gardenType: 'backyard',
        climateZone: null,
        latitude: null,
        longitude: null,
        postalCode: null,
        usdaZone: null,
        firstFrostDate: null,
        lastFrostDate: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    res.json(profile);
  })
);

// Create profile
router.post(
  '/',
  authenticate,
  [
    body('name').notEmpty().trim(),
    body('location').notEmpty().trim(),
    body('experienceLevel').isIn(['beginner', 'intermediate', 'advanced']),
    body('gardenType').isIn(['balcony', 'backyard', 'small_farm']),
    body('climateZone').optional().trim(),
    body('postalCode').optional().trim().isLength({ min: 5, max: 10 }),
  ],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    const { name, location, experienceLevel, gardenType, climateZone, postalCode } = req.body;

    // Check if profile already exists
    const existingProfile = await prisma.growerProfile.findUnique({
      where: { userId: req.userId },
    });

    if (existingProfile) {
      return res.status(400).json({ error: { message: 'Profile already exists' } });
    }

    // Auto-detect USDA zone from ZIP code
    let zoneData = { zone: null, lastFrost: null, firstFrost: null };
    let coordinates: { latitude: number; longitude: number } | null = null;
    
    if (postalCode) {
      zoneData = detectZone(postalCode);
      coordinates = await geocodePostalCode(postalCode);
    }

    const profile = await prisma.growerProfile.create({
      data: {
        userId: req.userId!,
        name,
        location,
        experienceLevel,
        gardenType,
        ...(climateZone && { climateZone }),
        ...(coordinates && { 
          latitude: coordinates.latitude,
          longitude: coordinates.longitude 
        }),
        ...(postalCode && { postalCode }),
        ...(zoneData.zone && { usdaZone: zoneData.zone }),
        ...(zoneData.lastFrost && { lastFrostDate: zoneData.lastFrost }),
        ...(zoneData.firstFrost && { firstFrostDate: zoneData.firstFrost }),
      },
    });

    res.status(201).json(profile);
  })
);

// Update profile
router.put(
  '/',
  authenticate,
  [
    body('name').optional().notEmpty().trim(),
    body('location').optional().notEmpty().trim(),
    body('experienceLevel').optional().isIn(['beginner', 'intermediate', 'advanced']),
    body('gardenType').optional().isIn(['balcony', 'backyard', 'small_farm']),
    body('climateZone').optional().trim(),
    body('postalCode').optional().trim().isLength({ min: 5, max: 10 }),
  ],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    const { name, location, experienceLevel, gardenType, climateZone, postalCode } = req.body;

    // Auto-detect USDA zone and coordinates from ZIP code if provided
    let zoneData = { zone: null, lastFrost: null, firstFrost: null };
    let coordinates: { latitude: number; longitude: number } | null = null;
    
    if (postalCode) {
      zoneData = detectZone(postalCode);
      coordinates = await geocodePostalCode(postalCode);
    }

    const profile = await prisma.growerProfile.update({
      where: { userId: req.userId },
      data: {
        ...(name && { name }),
        ...(location && { location }),
        ...(experienceLevel && { experienceLevel }),
        ...(gardenType && { gardenType }),
        ...(climateZone && { climateZone }),
        ...(coordinates && { 
          latitude: coordinates.latitude,
          longitude: coordinates.longitude 
        }),
        ...(postalCode && { postalCode }),
        ...(zoneData.zone && { usdaZone: zoneData.zone }),
        ...(zoneData.lastFrost && { lastFrostDate: zoneData.lastFrost }),
        ...(zoneData.firstFrost && { firstFrostDate: zoneData.firstFrost }),
      },
    });

    res.json(profile);
  })
);

// Upsert profile (create or update)
router.post(
  '/upsert',
  authenticate,
  [
    body('name').notEmpty().trim(),
    body('location').notEmpty().trim(),
    body('experienceLevel').isIn(['beginner', 'intermediate', 'advanced']),
    body('gardenType').isIn(['balcony', 'backyard', 'small_farm']),
    body('climateZone').optional().trim(),
    body('postalCode').optional().trim().isLength({ min: 5, max: 10 }),
  ],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    const { name, location, experienceLevel, gardenType, climateZone, postalCode } = req.body;

    console.log('[Profile Upsert] User ID:', req.userId, 'Data:', { name, location, experienceLevel, gardenType });

    // Verify user exists (JWT may be valid but user could have been deleted)
    const userExists = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: { id: true }
    });

    if (!userExists) {
      console.error('[Profile Upsert] User not found in database:', req.userId);
      return res.status(401).json({ 
        error: { 
          message: 'Your session is invalid. Please log out and log back in.',
          code: 'USER_NOT_FOUND'
        } 
      });
    }

    // Auto-detect USDA zone and coordinates from ZIP code if provided
    let zoneData = { zone: null, lastFrost: null, firstFrost: null };
    let coordinates: { latitude: number; longitude: number } | null = null;
    
    if (postalCode) {
      zoneData = detectZone(postalCode);
      coordinates = await geocodePostalCode(postalCode);
      console.log('[Profile Upsert] Detected zone:', zoneData.zone, 'Coordinates:', coordinates);
    }

    // Upsert profile using Prisma
    const profile = await prisma.growerProfile.upsert({
      where: { userId: req.userId! },
      create: {
        user: {
          connect: { id: req.userId! }
        },
        name,
        location,
        experienceLevel,
        gardenType,
        ...(climateZone && { climateZone }),
        ...(coordinates && { 
          latitude: coordinates.latitude,
          longitude: coordinates.longitude 
        }),
        ...(postalCode && { postalCode }),
        ...(zoneData.zone && { usdaZone: zoneData.zone }),
        ...(zoneData.lastFrost && { lastFrostDate: zoneData.lastFrost }),
        ...(zoneData.firstFrost && { firstFrostDate: zoneData.firstFrost }),
      },
      update: {
        name,
        location,
        experienceLevel,
        gardenType,
        ...(climateZone && { climateZone }),
        ...(coordinates && { 
          latitude: coordinates.latitude,
          longitude: coordinates.longitude 
        }),
        ...(postalCode && { postalCode }),
        ...(zoneData.zone && { usdaZone: zoneData.zone }),
        ...(zoneData.lastFrost && { lastFrostDate: zoneData.lastFrost }),
        ...(zoneData.firstFrost && { firstFrostDate: zoneData.firstFrost }),
      },
    });

    console.log('[Profile Upsert] Profile saved:', profile.id);
    res.json(profile);
  })
);

export default router;
