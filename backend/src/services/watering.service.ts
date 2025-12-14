import prisma from '../lib/prisma';
import { getWeather } from './weather.service';

interface WateringRecommendation {
  shouldWater: boolean;
  reason: string;
  rainAmount?: number;
  rainChance?: number;
}

/**
 * Analyze weather forecast to determine if watering is needed
 * Checks today and tomorrow's forecast
 */
export async function analyzeWateringNeed(
  latitude: number,
  longitude: number
): Promise<WateringRecommendation> {
  try {
    const weather = await getWeather(latitude, longitude);
    
    // Check today's weather
    const todayPrecip = weather.current.precipitation;
    const todayCondition = weather.current.condition.toLowerCase();
    
    // Check tomorrow's forecast (first item in forecast array)
    const tomorrowForecast = weather.forecast[0];
    const tomorrowPrecipChance = tomorrowForecast?.precipitationChance || 0;
    
    // Skip watering if it rained today (more than 0.1 inches)
    if (todayPrecip > 0.1) {
      return {
        shouldWater: false,
        reason: `It rained ${todayPrecip.toFixed(2)}" today - soil is moist`,
        rainAmount: todayPrecip
      };
    }
    
    // Skip watering if it's currently raining
    if (todayCondition.includes('rain') || todayCondition.includes('drizzle')) {
      return {
        shouldWater: false,
        reason: `Currently ${weather.current.condition} - skipping watering`,
        rainAmount: todayPrecip
      };
    }
    
    // Skip watering if high chance of rain tomorrow (>70%)
    if (tomorrowPrecipChance > 70) {
      return {
        shouldWater: false,
        reason: `${tomorrowPrecipChance}% chance of rain tomorrow - saving water`,
        rainChance: tomorrowPrecipChance
      };
    }
    
    // Recommend watering if low chance of rain
    if (tomorrowPrecipChance < 30) {
      return {
        shouldWater: true,
        reason: 'Low chance of rain - watering recommended',
        rainChance: tomorrowPrecipChance
      };
    }
    
    // Moderate chance of rain - still recommend watering to be safe
    return {
      shouldWater: true,
      reason: `${tomorrowPrecipChance}% chance of rain tomorrow - water if soil is dry`,
      rainChance: tomorrowPrecipChance
    };
    
  } catch (error) {
    console.error('Error analyzing watering need:', error);
    // Default to watering if we can't get weather data
    return {
      shouldWater: true,
      reason: 'Weather data unavailable - check soil moisture manually'
    };
  }
}

/**
 * Auto-skip watering tasks based on weather forecast
 * Returns count of tasks skipped
 */
export async function autoSkipWateringTasks(userId: string): Promise<number> {
  try {
    // Get user's profile for location
    const profile = await prisma.growerProfile.findUnique({
      where: { userId }
    });
    
    if (!profile || (!profile.latitude || !profile.longitude)) {
      console.log('No location data for user, skipping weather check');
      return 0;
    }
    
    // Get watering recommendation
    const recommendation = await analyzeWateringNeed(
      profile.latitude,
      profile.longitude
    );
    
    if (recommendation.shouldWater) {
      return 0; // No tasks to skip
    }
    
    // Find today's incomplete watering tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const wateringTasks = await prisma.task.findMany({
      where: {
        userId,
        type: 'water',
        completed: false,
        skippedByWeather: false,
        dueDate: {
          gte: today,
          lt: tomorrow
        }
      }
    });
    
    // Skip these tasks
    await prisma.task.updateMany({
      where: {
        id: { in: wateringTasks.map(t => t.id) }
      },
      data: {
        skippedByWeather: true,
        weatherReason: recommendation.reason
      }
    });
    
    return wateringTasks.length;
    
  } catch (error) {
    console.error('Error auto-skipping watering tasks:', error);
    return 0;
  }
}

/**
 * Get watering intelligence for dashboard display
 */
export async function getWateringIntelligence(userId: string): Promise<{
  recommendation: WateringRecommendation | null;
  skippedTasks: number;
}> {
  try {
    const profile = await prisma.growerProfile.findUnique({
      where: { userId }
    });
    
    if (!profile || (!profile.latitude || !profile.longitude)) {
      return { recommendation: null, skippedTasks: 0 };
    }
    
    const recommendation = await analyzeWateringNeed(
      profile.latitude,
      profile.longitude
    );
    
    const skippedTasks = await autoSkipWateringTasks(userId);
    
    return { recommendation, skippedTasks };
    
  } catch (error) {
    console.error('Error getting watering intelligence:', error);
    return { recommendation: null, skippedTasks: 0 };
  }
}
