/**
 * Plant Analytics Utilities
 * Rule-based calculations for planting metrics
 */

export interface PlantAnalytics {
  daysSincePlanting: number;
  daysToHarvest: number;
  harvestStatus: 'upcoming' | 'ready' | 'closed';
  growthStage: {
    name: string;
    icon: string;
    percentage: number;
  };
  healthStatus: {
    status: string;
    label: string;
    icon: string;
    color: string;
  };
}

/**
 * Calculate days since planting
 */
export function calculateDaysSincePlanting(plantingDate: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - plantingDate.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate days to harvest
 * Returns negative if past harvest window
 */
export function calculateDaysToHarvest(expectedHarvestStart: Date): number {
  const now = new Date();
  const diffTime = expectedHarvestStart.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determine harvest status
 */
export function getHarvestStatus(
  expectedHarvestStart: Date,
  expectedHarvestEnd: Date
): 'upcoming' | 'ready' | 'closed' {
  const now = new Date();
  
  if (now < expectedHarvestStart) {
    return 'upcoming';
  } else if (now >= expectedHarvestStart && now <= expectedHarvestEnd) {
    return 'ready';
  } else {
    return 'closed';
  }
}

/**
 * Calculate growth stage based on percentage of growth cycle
 * Rules:
 * - germination: 0-10%
 * - seedling: 10-25%
 * - vegetative: 25-60%
 * - flowering: 60-90%
 * - harvest: 90-100% or in harvest window
 */
export function calculateGrowthStage(
  plantingDate: Date,
  expectedHarvestStart: Date,
  expectedHarvestEnd: Date
): { name: string; icon: string; percentage: number } {
  const now = new Date();
  const totalDays = expectedHarvestStart.getTime() - plantingDate.getTime();
  const elapsed = now.getTime() - plantingDate.getTime();
  const percentage = Math.min(100, Math.max(0, (elapsed / totalDays) * 100));

  // Check if in harvest window
  if (now >= expectedHarvestStart && now <= expectedHarvestEnd) {
    return { name: 'Harvest Ready', icon: '🍅', percentage: 100 };
  }

  // Check if past harvest window
  if (now > expectedHarvestEnd) {
    return { name: 'Harvest Complete', icon: '✅', percentage: 100 };
  }

  // Check if not yet planted
  if (now < plantingDate) {
    return { name: 'Not Yet Planted', icon: '🌰', percentage: 0 };
  }

  // Determine stage based on percentage
  if (percentage < 10) {
    return { name: 'Germination', icon: '🌰', percentage };
  } else if (percentage < 25) {
    return { name: 'Seedling', icon: '🌱', percentage };
  } else if (percentage < 60) {
    return { name: 'Vegetative', icon: '🌿', percentage };
  } else if (percentage < 90) {
    return { name: 'Flowering', icon: '🌸', percentage };
  } else {
    return { name: 'Fruiting', icon: '🍃', percentage };
  }
}

/**
 * Get health status display info
 */
export function getHealthStatusInfo(healthStatus: string): {
  status: string;
  label: string;
  icon: string;
  color: string;
} {
  const statusMap: Record<
    string,
    { status: string; label: string; icon: string; color: string }
  > = {
    healthy: {
      status: 'healthy',
      label: 'Healthy',
      icon: '🟢',
      color: '#10b981',
    },
    needs_water: {
      status: 'needs_water',
      label: 'Needs Water',
      icon: '🔵',
      color: '#3b82f6',
    },
    needs_fertilizing: {
      status: 'needs_fertilizing',
      label: 'Needs Fertilizing',
      icon: '🟡',
      color: '#f59e0b',
    },
    stressed: {
      status: 'stressed',
      label: 'Stressed',
      icon: '🔴',
      color: '#ef4444',
    },
  };

  return (
    statusMap[healthStatus] || {
      status: 'unknown',
      label: 'Unknown',
      icon: '⚪',
      color: '#6b7280',
    }
  );
}

/**
 * Get sunlight exposure info
 */
export function getSunlightInfo(sunExposure: string): {
  exposure: string;
  estimate: string;
  icon: string;
} {
  const sunlightMap: Record<string, { exposure: string; estimate: string; icon: string }> = {
    full: {
      exposure: 'Full Sun',
      estimate: '~6+ hrs sunlight',
      icon: '☀️',
    },
    partial: {
      exposure: 'Partial Sun',
      estimate: '~3–6 hrs sunlight',
      icon: '⛅',
    },
    shade: {
      exposure: 'Shade',
      estimate: '<3 hrs sunlight',
      icon: '🌥️',
    },
  };

  return (
    sunlightMap[sunExposure] || {
      exposure: 'Unknown',
      estimate: 'Unknown',
      icon: '🌤️',
    }
  );
}

/**
 * Calculate all analytics for a planting
 */
export function calculatePlantAnalytics(
  plantingDate: Date,
  expectedHarvestStart: Date,
  expectedHarvestEnd: Date,
  healthStatus: string
): PlantAnalytics {
  return {
    daysSincePlanting: calculateDaysSincePlanting(plantingDate),
    daysToHarvest: calculateDaysToHarvest(expectedHarvestStart),
    harvestStatus: getHarvestStatus(expectedHarvestStart, expectedHarvestEnd),
    growthStage: calculateGrowthStage(plantingDate, expectedHarvestStart, expectedHarvestEnd),
    healthStatus: getHealthStatusInfo(healthStatus),
  };
}
