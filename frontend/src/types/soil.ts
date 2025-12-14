/**
 * Shared TypeScript types for Soil Intelligence feature
 */

export interface SoilProfile {
  id: string;
  scopeType: 'garden' | 'bed';
  scopeId: string;
  soilType?: string;
  texture?: string;
  drainage?: 'poor' | 'average' | 'well';
  ph?: number;
  organicMatter?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  tests?: SoilTest[];
  events?: SoilEvent[];
}

export interface SoilTest {
  id: string;
  profileId: string;
  scopeType: 'garden' | 'bed';
  scopeId: string;
  testDate: string;
  ph?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  moisture?: number;
  salinity?: number;
  source: 'manual' | 'kit' | 'lab' | 'sensor';
  notes?: string;
  createdAt: string;
}

export interface SoilEvent {
  id: string;
  profileId: string;
  scopeType: 'garden' | 'bed';
  scopeId: string;
  eventType: 'amendment' | 'compost' | 'mulch' | 'lime' | 'sulfur' | 'fertilizer';
  amount: string;
  eventDate: string;
  notes?: string;
  createdAt: string;
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

export const SOIL_TYPES = [
  'Loam',
  'Clay',
  'Sandy',
  'Silt',
  'Peaty',
  'Chalky',
] as const;

export const DRAINAGE_OPTIONS = [
  { value: 'poor', label: 'Poor (water pools)' },
  { value: 'average', label: 'Average' },
  { value: 'well', label: 'Well-drained' },
] as const;

export const EVENT_TYPES = [
  { value: 'compost', label: 'Compost' },
  { value: 'amendment', label: 'Soil Amendment' },
  { value: 'lime', label: 'Lime (raise pH)' },
  { value: 'sulfur', label: 'Sulfur (lower pH)' },
  { value: 'fertilizer', label: 'Fertilizer' },
  { value: 'mulch', label: 'Mulch' },
] as const;

export const TEST_SOURCES = [
  { value: 'manual', label: 'Manual Entry' },
  { value: 'kit', label: 'Home Test Kit' },
  { value: 'lab', label: 'Lab Analysis' },
  { value: 'sensor', label: 'Sensor Reading' },
] as const;
