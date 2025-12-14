/**
 * Soil Intelligence Engine
 * 
 * Rules-based MVP for analyzing soil health and providing actionable recommendations.
 * Designed to be deterministic, explainable, and easy to extend.
 */

export interface SoilProfile {
  id: string;
  scopeType: 'garden' | 'bed';
  scopeId: string;
  soilType?: string; // "Loam" | "Clay" | "Sandy" | "Silt" | "Peaty" | "Chalky"
  texture?: string;
  drainage?: string; // "poor" | "average" | "well"
  ph?: number;
  organicMatter?: number; // percentage
  notes?: string;
}

export interface SoilTest {
  id: string;
  profileId: string;
  testDate: Date;
  ph?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  moisture?: number;
  salinity?: number;
  source: string; // "manual" | "kit" | "lab" | "sensor"
  notes?: string;
}

export interface WeatherContext {
  recentRainfall?: number; // inches in last 7 days
  temperatureF?: number;
  humidity?: number;
}

export interface CropFit {
  cropName: string;
  fitLevel: 'great' | 'okay' | 'avoid';
  reason: string;
}

export interface RecommendedAction {
  title: string;
  reason: string;
  howTo: string;
  priority: 'high' | 'medium' | 'low';
  linkToMarketplace?: string;
}

export interface SoilInsights {
  score: number; // 0-100
  scoreBreakdown: {
    phScore: number;
    drainageScore: number;
    organicMatterScore: number;
    textureScore: number;
  };
  summaryBullets: string[];
  warnings: string[];
  recommendedActions: RecommendedAction[];
  cropFit: CropFit[];
}

/**
 * Calculate a soil health score (0-100) based on profile and latest test data.
 * Score is explainable and based on ideal vegetable garden conditions.
 */
export function calculateSoilScore(
  profile: SoilProfile,
  latestTest?: SoilTest
): { score: number; breakdown: SoilInsights['scoreBreakdown'] } {
  let phScore = 50;
  let drainageScore = 50;
  let organicMatterScore = 50;
  let textureScore = 50;

  // pH Score (0-100)
  // Ideal range for most vegetables: 6.0-7.0
  const testPh = latestTest?.ph ?? profile.ph;
  if (testPh) {
    if (testPh >= 6.0 && testPh <= 7.0) {
      phScore = 100;
    } else if (testPh >= 5.5 && testPh < 6.0) {
      phScore = 75;
    } else if (testPh > 7.0 && testPh <= 7.5) {
      phScore = 75;
    } else if (testPh >= 5.0 && testPh < 5.5) {
      phScore = 50;
    } else if (testPh > 7.5 && testPh <= 8.0) {
      phScore = 50;
    } else if (testPh >= 4.5 && testPh < 5.0) {
      phScore = 25;
    } else if (testPh > 8.0 && testPh <= 8.5) {
      phScore = 25;
    } else {
      phScore = 10; // Very acidic (<4.5) or very alkaline (>8.5)
    }
  }

  // Drainage Score (0-100)
  if (profile.drainage) {
    switch (profile.drainage.toLowerCase()) {
      case 'well':
        drainageScore = 100;
        break;
      case 'average':
        drainageScore = 70;
        break;
      case 'poor':
        drainageScore = 30;
        break;
    }
  }

  // Organic Matter Score (0-100)
  // Ideal: 3-5% for vegetable gardens
  const om = profile.organicMatter;
  if (om !== null && om !== undefined) {
    if (om >= 3 && om <= 5) {
      organicMatterScore = 100;
    } else if (om >= 2 && om < 3) {
      organicMatterScore = 70;
    } else if (om > 5 && om <= 7) {
      organicMatterScore = 85;
    } else if (om >= 1 && om < 2) {
      organicMatterScore = 50;
    } else if (om < 1) {
      organicMatterScore = 25;
    } else {
      organicMatterScore = 60; // >7%
    }
  }

  // Texture/Soil Type Score (0-100)
  // Loam is ideal, clay and sand have challenges
  if (profile.soilType) {
    const type = profile.soilType.toLowerCase();
    if (type.includes('loam')) {
      textureScore = 100;
    } else if (type === 'silt' || type === 'silty') {
      textureScore = 80;
    } else if (type === 'clay') {
      textureScore = 50;
    } else if (type === 'sandy' || type === 'sand') {
      textureScore = 60;
    } else if (type === 'peaty' || type === 'peat') {
      textureScore = 70;
    } else if (type === 'chalky' || type === 'chalk') {
      textureScore = 50;
    }
  }

  // Calculate weighted average
  // pH is most critical (35%), drainage (30%), organic matter (25%), texture (10%)
  const score = Math.round(
    phScore * 0.35 +
    drainageScore * 0.30 +
    organicMatterScore * 0.25 +
    textureScore * 0.10
  );

  return {
    score,
    breakdown: {
      phScore,
      drainageScore,
      organicMatterScore,
      textureScore,
    },
  };
}

/**
 * Generate pH-specific guidance and recommendations.
 */
function getPhGuidance(ph?: number): {
  summary: string;
  warning?: string;
  action?: RecommendedAction;
} {
  if (!ph) {
    return {
      summary: 'pH not yet tested',
      action: {
        title: 'Test your soil pH',
        reason: 'pH affects nutrient availability and plant health',
        howTo: 'Use a soil test kit or send a sample to a lab',
        priority: 'high',
      },
    };
  }

  if (ph >= 6.0 && ph <= 7.0) {
    return {
      summary: `pH ${ph.toFixed(1)} is ideal for most vegetables`,
    };
  }

  if (ph < 6.0) {
    const severity = ph < 5.0 ? 'very acidic' : 'slightly acidic';
    return {
      summary: `pH ${ph.toFixed(1)} is ${severity}`,
      warning: ph < 5.0 ? 'Very acidic soil can limit nutrient availability' : undefined,
      action: {
        title: 'Add lime to raise pH',
        reason: `Current pH ${ph.toFixed(1)} is below optimal range (6.0-7.0)`,
        howTo: 'Apply garden lime (calcium carbonate) at 5 lbs per 100 sq ft, retest in 3 months',
        priority: ph < 5.0 ? 'high' : 'medium',
        linkToMarketplace: '/marketplace?q=garden+lime',
      },
    };
  }

  if (ph > 7.0) {
    const severity = ph > 8.0 ? 'very alkaline' : 'slightly alkaline';
    return {
      summary: `pH ${ph.toFixed(1)} is ${severity}`,
      warning: ph > 8.0 ? 'Very alkaline soil can lock up nutrients' : undefined,
      action: {
        title: 'Add sulfur to lower pH',
        reason: `Current pH ${ph.toFixed(1)} is above optimal range (6.0-7.0)`,
        howTo: 'Apply elemental sulfur at 1-2 lbs per 100 sq ft, retest in 3 months',
        priority: ph > 8.0 ? 'high' : 'medium',
        linkToMarketplace: '/marketplace?q=sulfur+soil',
      },
    };
  }

  return { summary: `pH ${ph.toFixed(1)}` };
}

/**
 * Generate drainage-specific recommendations.
 */
function getDrainageGuidance(drainage?: string, soilType?: string): {
  summary: string;
  action?: RecommendedAction;
} {
  if (!drainage) {
    return { summary: 'Drainage not yet assessed' };
  }

  if (drainage === 'well') {
    return { summary: 'Good drainage for most crops' };
  }

  if (drainage === 'poor') {
    return {
      summary: 'Poor drainage can cause root rot',
      action: {
        title: 'Improve drainage',
        reason: 'Poor drainage leads to waterlogged roots and disease',
        howTo: soilType?.toLowerCase().includes('clay')
          ? 'Add compost and perlite to clay soil, consider raised beds'
          : 'Add organic matter, consider raised beds or French drains',
        priority: 'high',
      },
    };
  }

  return {
    summary: 'Average drainage',
    action: {
      title: 'Monitor moisture levels',
      reason: 'Average drainage can be improved for better root health',
      howTo: 'Add compost annually to improve soil structure',
      priority: 'low',
    },
  };
}

/**
 * Generate watering recommendations based on soil + weather.
 */
function getWateringGuidance(
  profile: SoilProfile,
  latestTest?: SoilTest,
  weather?: WeatherContext
): {
  summary: string;
  action?: RecommendedAction;
} {
  const soilType = profile.soilType?.toLowerCase();
  const drainage = profile.drainage?.toLowerCase();
  const moisture = latestTest?.moisture;

  let wateringFrequency = 'every 2-3 days';
  let priority: 'high' | 'medium' | 'low' = 'medium';

  // Sandy soils need more frequent watering
  if (soilType?.includes('sandy') || soilType === 'sand') {
    wateringFrequency = 'daily or every other day';
  }

  // Clay soils hold water longer
  if (soilType?.includes('clay')) {
    wateringFrequency = 'every 3-5 days';
  }

  // Poor drainage = less frequent watering needed
  if (drainage === 'poor') {
    wateringFrequency = 'every 4-6 days, check soil before watering';
    priority = 'low';
  }

  // Recent rainfall reduces need
  if (weather?.recentRainfall && weather.recentRainfall > 1.0) {
    return {
      summary: `Recent rainfall (${weather.recentRainfall}" in last 7 days) - no watering needed`,
    };
  }

  // Low moisture reading = urgent
  if (moisture !== null && moisture !== undefined && moisture < 20) {
    priority = 'high';
    return {
      summary: `Soil moisture is low (${moisture}%)`,
      action: {
        title: 'Water immediately',
        reason: 'Moisture reading below 20% indicates dry soil',
        howTo: 'Deep water until soil is moist 6 inches down',
        priority: 'high',
      },
    };
  }

  return {
    summary: `Water ${wateringFrequency} based on your ${soilType || 'soil'} type`,
    action: {
      title: 'Check soil moisture',
      reason: 'Regular monitoring prevents over/under watering',
      howTo: 'Insert finger 2 inches into soil - if dry, water deeply',
      priority,
    },
  };
}

/**
 * Analyze crop fit for common vegetables based on soil conditions.
 */
function analyzeCropFit(profile: SoilProfile, latestTest?: SoilTest): CropFit[] {
  const ph = latestTest?.ph ?? profile.ph;
  const drainage = profile.drainage?.toLowerCase();
  const soilType = profile.soilType?.toLowerCase();

  const cropFit: CropFit[] = [];

  // Tomatoes: pH 6.0-6.8, well-drained
  if (ph && ph >= 6.0 && ph <= 6.8 && drainage === 'well') {
    cropFit.push({
      cropName: 'Tomatoes',
      fitLevel: 'great',
      reason: 'Ideal pH and drainage for tomatoes',
    });
  } else if (ph && (ph < 5.5 || ph > 7.5)) {
    cropFit.push({
      cropName: 'Tomatoes',
      fitLevel: 'avoid',
      reason: `pH ${ph.toFixed(1)} is outside tomato preference (6.0-6.8)`,
    });
  } else {
    cropFit.push({
      cropName: 'Tomatoes',
      fitLevel: 'okay',
      reason: 'Will grow but conditions not optimal',
    });
  }

  // Lettuce: pH 6.0-7.0, tolerates less drainage
  if (ph && ph >= 6.0 && ph <= 7.0) {
    cropFit.push({
      cropName: 'Lettuce',
      fitLevel: 'great',
      reason: 'Ideal pH for lettuce',
    });
  } else if (!ph || (ph >= 5.5 && ph <= 7.5)) {
    cropFit.push({
      cropName: 'Lettuce',
      fitLevel: 'okay',
      reason: 'Lettuce is adaptable to various conditions',
    });
  }

  // Carrots: pH 6.0-6.8, well-drained, no clay
  if (soilType?.includes('clay')) {
    cropFit.push({
      cropName: 'Carrots',
      fitLevel: 'avoid',
      reason: 'Clay soil causes misshapen carrots',
    });
  } else if (ph && ph >= 6.0 && ph <= 6.8 && drainage === 'well') {
    cropFit.push({
      cropName: 'Carrots',
      fitLevel: 'great',
      reason: 'Ideal loose, well-drained soil for straight carrots',
    });
  } else {
    cropFit.push({
      cropName: 'Carrots',
      fitLevel: 'okay',
      reason: 'Will grow but may be less straight',
    });
  }

  // Blueberries: pH 4.5-5.5 (acidic lovers)
  if (ph && ph >= 4.5 && ph <= 5.5) {
    cropFit.push({
      cropName: 'Blueberries',
      fitLevel: 'great',
      reason: 'Perfect acidic soil for blueberries',
    });
  } else if (ph && ph > 6.5) {
    cropFit.push({
      cropName: 'Blueberries',
      fitLevel: 'avoid',
      reason: `pH ${ph.toFixed(1)} too alkaline - blueberries need acidic soil (4.5-5.5)`,
    });
  }

  // Potatoes: pH 5.0-6.0, well-drained
  if (ph && ph >= 5.0 && ph <= 6.0) {
    cropFit.push({
      cropName: 'Potatoes',
      fitLevel: 'great',
      reason: 'Ideal slightly acidic pH for potatoes',
    });
  } else if (!ph || (ph >= 4.5 && ph <= 7.0)) {
    cropFit.push({
      cropName: 'Potatoes',
      fitLevel: 'okay',
      reason: 'Potatoes are adaptable',
    });
  }

  // Peppers: pH 6.0-7.0, well-drained
  if (ph && ph >= 6.0 && ph <= 7.0 && drainage === 'well') {
    cropFit.push({
      cropName: 'Peppers',
      fitLevel: 'great',
      reason: 'Ideal conditions for peppers',
    });
  } else if (!ph || (ph >= 5.5 && ph <= 7.5)) {
    cropFit.push({
      cropName: 'Peppers',
      fitLevel: 'okay',
      reason: 'Will produce but may have lower yields',
    });
  }

  // Beans: pH 6.0-7.0, various drainage
  if (ph && ph >= 6.0 && ph <= 7.0) {
    cropFit.push({
      cropName: 'Beans',
      fitLevel: 'great',
      reason: 'Beans thrive in neutral pH',
    });
  } else {
    cropFit.push({
      cropName: 'Beans',
      fitLevel: 'okay',
      reason: 'Beans are relatively tolerant',
    });
  }

  // Squash: pH 6.0-7.0
  if (ph && ph >= 6.0 && ph <= 7.0) {
    cropFit.push({
      cropName: 'Squash',
      fitLevel: 'great',
      reason: 'Great pH for squash family',
    });
  } else if (!ph || (ph >= 5.5 && ph <= 7.5)) {
    cropFit.push({
      cropName: 'Squash',
      fitLevel: 'okay',
      reason: 'Squash is adaptable',
    });
  }

  return cropFit;
}

/**
 * Main function: Generate comprehensive soil insights.
 */
export function getSoilInsights(
  profile: SoilProfile,
  latestTest?: SoilTest,
  weatherContext?: WeatherContext
): SoilInsights {
  const { score, breakdown } = calculateSoilScore(profile, latestTest);

  const summaryBullets: string[] = [];
  const warnings: string[] = [];
  const recommendedActions: RecommendedAction[] = [];

  // pH guidance
  const ph = latestTest?.ph ?? profile.ph;
  const phGuidance = getPhGuidance(ph);
  summaryBullets.push(phGuidance.summary);
  if (phGuidance.warning) warnings.push(phGuidance.warning);
  if (phGuidance.action) recommendedActions.push(phGuidance.action);

  // Drainage guidance
  const drainageGuidance = getDrainageGuidance(profile.drainage, profile.soilType);
  summaryBullets.push(drainageGuidance.summary);
  if (drainageGuidance.action) recommendedActions.push(drainageGuidance.action);

  // Organic matter guidance
  if (profile.organicMatter !== null && profile.organicMatter !== undefined) {
    if (profile.organicMatter >= 3 && profile.organicMatter <= 5) {
      summaryBullets.push(`Organic matter at ${profile.organicMatter}% (excellent)`);
    } else if (profile.organicMatter < 3) {
      summaryBullets.push(`Organic matter at ${profile.organicMatter}% (low)`);
      recommendedActions.push({
        title: 'Add compost to increase organic matter',
        reason: `Current OM ${profile.organicMatter}% is below ideal range (3-5%)`,
        howTo: 'Add 2-3 inches of compost and work into top 6 inches of soil',
        priority: 'medium',
        linkToMarketplace: '/marketplace?q=compost',
      });
    } else {
      summaryBullets.push(`Organic matter at ${profile.organicMatter}%`);
    }
  } else {
    summaryBullets.push('Organic matter not yet measured');
  }

  // Soil type summary
  if (profile.soilType) {
    summaryBullets.push(`${profile.soilType} soil texture`);
    
    // Clay-specific recommendations
    if (profile.soilType.toLowerCase().includes('clay')) {
      warnings.push('Clay soil can compact and limit root growth');
      recommendedActions.push({
        title: 'Improve clay soil structure',
        reason: 'Clay soil benefits from organic amendments',
        howTo: 'Add compost, peat moss, or aged manure annually; avoid tilling when wet',
        priority: 'medium',
      });
    }

    // Sandy soil recommendations
    if (profile.soilType.toLowerCase().includes('sandy') || profile.soilType.toLowerCase() === 'sand') {
      warnings.push('Sandy soil drains quickly and may need frequent watering');
      recommendedActions.push({
        title: 'Add organic matter to sandy soil',
        reason: 'Helps sandy soil retain moisture and nutrients',
        howTo: 'Mix in compost or aged manure to improve water retention',
        priority: 'medium',
      });
    }
  }

  // Watering guidance
  const wateringGuidance = getWateringGuidance(profile, latestTest, weatherContext);
  summaryBullets.push(wateringGuidance.summary);
  if (wateringGuidance.action) recommendedActions.push(wateringGuidance.action);

  // Crop fit analysis
  const cropFit = analyzeCropFit(profile, latestTest);

  // Sort actions by priority
  recommendedActions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return {
    score,
    scoreBreakdown: breakdown,
    summaryBullets,
    warnings,
    recommendedActions,
    cropFit,
  };
}
