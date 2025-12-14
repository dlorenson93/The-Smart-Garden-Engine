import { Router } from 'express';
import { getWeather, getWeatherByPostalCode } from '../services/weather.service';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

/**
 * GET /api/v1/weather/current
 * Get current weather and forecast based on user's profile location
 */
router.get('/current', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    // Get user's profile to retrieve location
    const profile = await prisma.growerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Profile not found. Please set up your profile with location data.',
        },
      });
    }

    let weatherData;

    // Try to get weather data using coordinates first
    if (profile.latitude && profile.longitude) {
      weatherData = await getWeather(profile.latitude, profile.longitude);
    } 
    // Fall back to postal code if coordinates not available
    else if (profile.postalCode) {
      try {
        weatherData = await getWeatherByPostalCode(profile.postalCode, 'US');
      } catch (error) {
        return res.status(400).json({
          error: {
            code: 'GEOCODING_FAILED',
            message: 'Could not determine location from postal code. Please add coordinates to your profile.',
          },
        });
      }
    } 
    // No location data available
    else {
      return res.status(400).json({
        error: {
          code: 'LOCATION_NOT_SET',
          message: 'Location not set in profile. Please add a ZIP code or coordinates.',
        },
      });
    }

    res.json({
      weather: weatherData,
      profile: {
        location: profile.location,
        usdaZone: profile.usdaZone,
        postalCode: profile.postalCode,
      },
    });
  } catch (error: any) {
    console.error('Error fetching weather:', error);
    
    // Handle specific axios timeout errors
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(504).json({
        error: {
          code: 'WEATHER_TIMEOUT',
          message: 'Weather service request timed out. Please try again.',
        },
      });
    }
    
    // Handle axios network errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: {
          code: 'WEATHER_SERVICE_UNAVAILABLE',
          message: 'Weather service is temporarily unavailable.',
        },
      });
    }
    
    res.status(500).json({
      error: {
        code: 'WEATHER_FETCH_ERROR',
        message: error.message || 'Failed to fetch weather data',
      },
    });
  }
});

/**
 * GET /api/v1/weather/by-location
 * Get weather for specific coordinates (optional, for testing)
 */
router.get('/by-location', authenticate, async (req: AuthRequest, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: {
          code: 'MISSING_COORDINATES',
          message: 'Latitude and longitude are required',
        },
      });
    }

    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_COORDINATES',
          message: 'Invalid latitude or longitude values',
        },
      });
    }

    const weatherData = await getWeather(lat, lon);
    res.json({ weather: weatherData });
  } catch (error: any) {
    console.error('Error fetching weather by location:', error);
    
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(504).json({
        error: {
          code: 'WEATHER_TIMEOUT',
          message: 'Weather service request timed out. Please try again.',
        },
      });
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: {
          code: 'WEATHER_SERVICE_UNAVAILABLE',
          message: 'Weather service is temporarily unavailable.',
        },
      });
    }
    
    res.status(500).json({
      error: {
        code: 'WEATHER_FETCH_ERROR',
        message: error.message || 'Failed to fetch weather data',
      },
    });
  }
});

/**
 * GET /api/v1/weather/by-postal-code
 * Get weather for specific postal code (optional, for testing)
 */
router.get('/by-postal-code', authenticate, async (req: AuthRequest, res) => {
  try {
    const { postalCode, countryCode } = req.query;

    if (!postalCode) {
      return res.status(400).json({
        error: {
          code: 'MISSING_POSTAL_CODE',
          message: 'Postal code is required',
        },
      });
    }

    const weatherData = await getWeatherByPostalCode(
      postalCode as string,
      (countryCode as string) || 'US'
    );
    res.json({ weather: weatherData });
  } catch (error: any) {
    console.error('Error fetching weather by postal code:', error);
    
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(504).json({
        error: {
          code: 'WEATHER_TIMEOUT',
          message: 'Weather service request timed out. Please try again.',
        },
      });
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: {
          code: 'WEATHER_SERVICE_UNAVAILABLE',
          message: 'Weather service is temporarily unavailable.',
        },
      });
    }
    
    res.status(500).json({
      error: {
        code: 'WEATHER_FETCH_ERROR',
        message: error.message || 'Failed to fetch weather data',
      },
    });
  }
});

export default router;
