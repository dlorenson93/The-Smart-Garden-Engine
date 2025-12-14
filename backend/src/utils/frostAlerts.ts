// Utility functions for frost alert calculations

interface FrostAlert {
  type: 'warning' | 'danger';
  message: string;
  date: string;
}

// Parse frost date string (e.g., "April 10") and get it for current year
function parseFrostDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  const parts = dateStr.split(' ');
  if (parts.length !== 2) return null;
  
  const month = new Date(`${parts[0]} 1, 2000`).getMonth();
  const day = parseInt(parts[1], 10);
  
  const currentYear = new Date().getFullYear();
  return new Date(currentYear, month, day);
}

// Calculate days between two dates
function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((date2.getTime() - date1.getTime()) / oneDay);
}

// Check if planting will experience frost
export function checkFrostRisk(
  plantingDate: Date,
  harvestDate: Date,
  lastFrostDateStr: string | null,
  firstFrostDateStr: string | null
): FrostAlert[] {
  const alerts: FrostAlert[] = [];
  const now = new Date();

  // Check spring frost risk (last frost)
  if (lastFrostDateStr) {
    const lastFrost = parseFrostDate(lastFrostDateStr);
    if (lastFrost) {
      // If planting before last frost date
      if (plantingDate < lastFrost) {
        const daysUntilFrost = daysBetween(now, lastFrost);
        if (daysUntilFrost > 0 && daysUntilFrost <= 14) {
          alerts.push({
            type: 'danger',
            message: `Spring frost expected around ${lastFrostDateStr}. Planting may be at risk.`,
            date: lastFrostDateStr,
          });
        } else if (daysUntilFrost > 14 && daysUntilFrost <= 30) {
          alerts.push({
            type: 'warning',
            message: `Last spring frost typically around ${lastFrostDateStr}. Consider delaying planting.`,
            date: lastFrostDateStr,
          });
        }
      }
    }
  }

  // Check fall frost risk (first frost)
  if (firstFrostDateStr) {
    const firstFrost = parseFrostDate(firstFrostDateStr);
    if (firstFrost) {
      // If harvest date is after first frost
      if (harvestDate > firstFrost) {
        const daysUntilFrost = daysBetween(now, firstFrost);
        if (daysUntilFrost > 0 && daysUntilFrost <= 30) {
          alerts.push({
            type: 'warning',
            message: `Fall frost expected around ${firstFrostDateStr}. Harvest may need to be earlier.`,
            date: firstFrostDateStr,
          });
        } else if (daysUntilFrost <= 0 && daysUntilFrost >= -14) {
          alerts.push({
            type: 'danger',
            message: `Fall frost season has arrived (${firstFrostDateStr}). Protect or harvest immediately.`,
            date: firstFrostDateStr,
          });
        }
      }
    }
  }

  return alerts;
}

// Get general frost status for the zone
export function getFrostStatus(
  lastFrostDateStr: string | null,
  firstFrostDateStr: string | null
): { inGrowingSeason: boolean; nextFrostDate: string | null; daysToFrost: number | null } {
  const now = new Date();
  
  if (!lastFrostDateStr || !firstFrostDateStr) {
    return { inGrowingSeason: true, nextFrostDate: null, daysToFrost: null };
  }

  const lastFrost = parseFrostDate(lastFrostDateStr);
  const firstFrost = parseFrostDate(firstFrostDateStr);

  if (!lastFrost || !firstFrost) {
    return { inGrowingSeason: true, nextFrostDate: null, daysToFrost: null };
  }

  // Determine if we're in growing season
  const inGrowingSeason = now > lastFrost && now < firstFrost;

  // Determine next frost
  let nextFrostDate = null;
  let daysToFrost = null;

  if (now < lastFrost) {
    nextFrostDate = lastFrostDateStr;
    daysToFrost = daysBetween(now, lastFrost);
  } else if (now < firstFrost) {
    nextFrostDate = firstFrostDateStr;
    daysToFrost = daysBetween(now, firstFrost);
  }

  return { inGrowingSeason, nextFrostDate, daysToFrost };
}
