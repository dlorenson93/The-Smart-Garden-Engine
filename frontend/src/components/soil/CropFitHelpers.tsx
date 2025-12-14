/**
 * Helper components and utilities for enhanced Crop Fit UI
 */
import React from 'react';

// Crop category mapping for grouping
export const CROP_CATEGORIES: Record<string, string> = {
  // Leafy Greens
  'lettuce': 'Leafy Greens',
  'spinach': 'Leafy Greens',
  'kale': 'Leafy Greens',
  'arugula': 'Leafy Greens',
  'chard': 'Leafy Greens',
  'cabbage': 'Leafy Greens',
  'collards': 'Leafy Greens',
  
  // Fruit Crops
  'tomatoes': 'Fruit Crops',
  'peppers': 'Fruit Crops',
  'cucumbers': 'Fruit Crops',
  'squash': 'Fruit Crops',
  'zucchini': 'Fruit Crops',
  'pumpkins': 'Fruit Crops',
  'melons': 'Fruit Crops',
  'eggplant': 'Fruit Crops',
  
  // Root Vegetables
  'carrots': 'Root Vegetables',
  'beets': 'Root Vegetables',
  'radishes': 'Root Vegetables',
  'turnips': 'Root Vegetables',
  'potatoes': 'Root Vegetables',
  'onions': 'Root Vegetables',
  'garlic': 'Root Vegetables',
  
  // Herbs
  'basil': 'Herbs',
  'parsley': 'Herbs',
  'cilantro': 'Herbs',
  'thyme': 'Herbs',
  'rosemary': 'Herbs',
  'oregano': 'Herbs',
  'mint': 'Herbs',
  'dill': 'Herbs',
  
  // Legumes
  'beans': 'Legumes',
  'peas': 'Legumes',
  'lentils': 'Legumes',
};

// Ideal pH ranges for common crops
export const CROP_PH_RANGES: Record<string, { min: number; max: number }> = {
  'tomatoes': { min: 6.0, max: 6.8 },
  'peppers': { min: 6.0, max: 7.0 },
  'lettuce': { min: 6.0, max: 7.0 },
  'spinach': { min: 6.5, max: 7.5 },
  'carrots': { min: 5.5, max: 7.0 },
  'beans': { min: 6.0, max: 7.0 },
  'peas': { min: 6.0, max: 7.5 },
  'cucumbers': { min: 6.0, max: 7.0 },
  'squash': { min: 6.0, max: 6.5 },
  'potatoes': { min: 5.0, max: 6.5 },
  'kale': { min: 6.0, max: 7.5 },
  'basil': { min: 6.0, max: 7.5 },
  'default': { min: 6.0, max: 7.0 },
};

export function getCropCategory(cropName: string): string {
  const normalized = cropName.toLowerCase();
  return CROP_CATEGORIES[normalized] || 'Other Crops';
}

export function getCropPHRange(cropName: string): { min: number; max: number } {
  const normalized = cropName.toLowerCase();
  return CROP_PH_RANGES[normalized] || CROP_PH_RANGES.default;
}

export function getSuggestedFix(fitLevel: string, reason: string, currentPH?: number, cropName?: string): string {
  const reasonLower = reason.toLowerCase();
  
  if (fitLevel === 'great') {
    return 'Your soil is ideal! Maintain current conditions with regular compost additions.';
  }
  
  if (reasonLower.includes('high ph') || reasonLower.includes('alkaline') || reasonLower.includes('too high')) {
    return 'Add sulfur or acidic compost to lower pH. Coffee grounds and pine needles also help.';
  }
  
  if (reasonLower.includes('low ph') || reasonLower.includes('acidic') || reasonLower.includes('too low')) {
    return 'Add lime or wood ash to raise pH. Dolomitic lime also adds magnesium.';
  }
  
  if (reasonLower.includes('drainage')) {
    return 'Improve drainage with compost, perlite, or create raised beds.';
  }
  
  if (reasonLower.includes('nitrogen') || reasonLower.includes('nutrients')) {
    return 'Add compost, aged manure, or nitrogen-rich fertilizer.';
  }
  
  return 'Add organic compost to improve overall soil health and structure.';
}

export function getScoreMeaning(score: number): string {
  if (score >= 80) return 'Excellent! Your soil is in great condition for most crops.';
  if (score >= 65) return 'Good soil health. Minor improvements will boost crop performance.';
  if (score >= 50) return 'Fair condition. Some amendments recommended for optimal growth.';
  return 'Needs improvement. Follow recommendations to build soil health.';
}

export function generateSmartInsight(cropFit: any[], profile: any): string {
  if (cropFit.length === 0) return '';
  
  const greatCrops = cropFit.filter(c => c.fitLevel === 'great');
  const okayCrops = cropFit.filter(c => c.fitLevel === 'okay');
  const avoidCrops = cropFit.filter(c => c.fitLevel === 'avoid');
  
  // Group by category
  const categories: Record<string, number> = {};
  greatCrops.forEach(crop => {
    const cat = getCropCategory(crop.cropName);
    categories[cat] = (categories[cat] || 0) + 1;
  });
  
  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
  
  if (greatCrops.length > cropFit.length * 0.6) {
    return topCategory 
      ? `🌟 ${topCategory[0]} are thriving in your soil conditions!`
      : '🌟 Most crops will thrive in your current soil conditions!';
  }
  
  if (avoidCrops.length > cropFit.length * 0.4) {
    if (profile?.ph) {
      if (profile.ph < 6.0) {
        return '⚠️ Your acidic soil may limit some crops. Consider adding lime.';
      }
      if (profile.ph > 7.5) {
        return '⚠️ Alkaline soil detected. Sulfur amendments can help expand crop options.';
      }
    }
    return '⚠️ Several crops need better conditions. Check recommendations below.';
  }
  
  if (topCategory && topCategory[1] >= 2) {
    return `💡 ${topCategory[0]} look strongest in your soil right now.`;
  }
  
  return '💡 Your soil supports a good variety of crops with minor adjustments.';
}

interface CropLegendProps {
  showAvoid: boolean;
}

export function CropLegend({ showAvoid }: CropLegendProps) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      fontSize: '0.875rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
          display: 'inline-block'
        }} />
        <span><strong>Great</strong> = Ideal conditions</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: '#f59e0b',
          display: 'inline-block'
        }} />
        <span><strong>Okay</strong> = Will grow but not optimal</span>
      </div>
      {showAvoid && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            display: 'inline-block'
          }} />
          <span><strong>Avoid</strong> = Likely issues</span>
        </div>
      )}
    </div>
  );
}

interface SmartInsightBannerProps {
  insight: string;
}

export function SmartInsightBanner({ insight }: SmartInsightBannerProps) {
  if (!insight) return null;
  
  return (
    <div style={{
      padding: '1rem 1.25rem',
      backgroundColor: '#eff6ff',
      border: '1px solid #3b82f6',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      color: '#1e40af',
      fontWeight: '500'
    }}>
      {insight}
    </div>
  );
}
