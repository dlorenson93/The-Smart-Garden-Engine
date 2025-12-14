/**
 * SoilProvider Interface
 * 
 * Extensible interface for integrating external soil data sources:
 * - USDA soil survey data
 * - IoT sensor readings
 * - Terra Trionfo marketplace products
 * 
 * This keeps the UI decoupled from specific data sources.
 */

export interface SoilDataSuggestion {
  soilType?: string;
  texture?: string;
  drainage?: 'poor' | 'average' | 'well';
  typicalPhRange?: { min: number; max: number };
  notes?: string;
  confidence?: number; // 0-1, how confident is this suggestion
  source: string; // e.g., "USDA Soil Survey", "Local Sensor", "Manual Entry"
}

export interface AmendmentProduct {
  id: string;
  name: string;
  type: 'compost' | 'lime' | 'sulfur' | 'fertilizer' | 'mulch' | 'other';
  description: string;
  price?: number;
  unit?: string;
  vendorUrl?: string;
  imageUrl?: string;
}

export interface SoilProvider {
  /**
   * Look up soil data by geographic location.
   * Useful for initializing a soil profile based on USDA data.
   */
  lookupByLocation(lat: number, lon: number): Promise<SoilDataSuggestion | null>;

  /**
   * Get amendment products for a specific soil improvement goal.
   * Example goals: "raise_ph", "lower_ph", "improve_drainage", "add_organic_matter"
   */
  getAmendmentsForGoal(goal: string): Promise<AmendmentProduct[]>;

  /**
   * Get live sensor readings if available.
   * Returns null if no sensors connected.
   */
  getSensorReadings?(scopeType: string, scopeId: string): Promise<{
    ph?: number;
    moisture?: number;
    temperature?: number;
    timestamp: Date;
  } | null>;
}

/**
 * Local implementation - returns null/defaults.
 * This is the MVP stub. Future implementations can replace this.
 */
export class LocalSoilProvider implements SoilProvider {
  async lookupByLocation(lat: number, lon: number): Promise<SoilDataSuggestion | null> {
    // TODO: Integrate USDA Web Soil Survey API
    // Example: https://sdmdataaccess.sc.egov.usda.gov/
    // For now, return null to indicate no external data available
    console.log(`[LocalSoilProvider] USDA lookup requested for ${lat}, ${lon} - not yet implemented`);
    return null;
  }

  async getAmendmentsForGoal(goal: string): Promise<AmendmentProduct[]> {
    // TODO: Integrate with Terra Trionfo marketplace API
    // For now, return empty array
    console.log(`[LocalSoilProvider] Amendment lookup for goal "${goal}" - not yet implemented`);
    
    // Could return some basic defaults for demonstration:
    const basicProducts: Record<string, AmendmentProduct[]> = {
      raise_ph: [
        {
          id: 'local-lime-1',
          name: 'Garden Lime (Calcium Carbonate)',
          type: 'lime',
          description: 'Raises soil pH for acidic soils',
          unit: '5 lb bag',
        },
      ],
      lower_ph: [
        {
          id: 'local-sulfur-1',
          name: 'Elemental Sulfur',
          type: 'sulfur',
          description: 'Lowers soil pH for alkaline soils',
          unit: '2 lb bag',
        },
      ],
      add_organic_matter: [
        {
          id: 'local-compost-1',
          name: 'Organic Compost',
          type: 'compost',
          description: 'Improves soil structure and fertility',
          unit: '1 cu ft bag',
        },
      ],
      improve_drainage: [
        {
          id: 'local-compost-2',
          name: 'Compost & Perlite Mix',
          type: 'other',
          description: 'Improves drainage in clay soils',
          unit: '1 cu ft bag',
        },
      ],
    };

    return basicProducts[goal] || [];
  }

  async getSensorReadings(scopeType: string, scopeId: string): Promise<any> {
    // TODO: Integrate with IoT sensor APIs
    // For now, return null to indicate no sensors
    console.log(`[LocalSoilProvider] Sensor readings requested for ${scopeType}:${scopeId} - not yet implemented`);
    return null;
  }
}

// Singleton instance
export const soilProvider: SoilProvider = new LocalSoilProvider();
