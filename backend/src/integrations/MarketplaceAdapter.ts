/**
 * MarketplaceAdapter - Integration layer for Terra Trionfo marketplace
 * 
 * This module provides stubbed methods for future marketplace integration.
 * All methods return 'integration_disabled' status in the MVP.
 */

interface IntegrationResult {
  status: 'integration_disabled';
  message: string;
}

export class MarketplaceAdapter {
  /**
   * Create a marketplace listing from surplus harvest
   * @param harvestLogId - ID of the harvest log with surplus
   * @returns Integration status
   */
  static async createListingFromSurplus(harvestLogId: string): Promise<IntegrationResult> {
    // TODO: Implement when marketplace integration is enabled
    return {
      status: 'integration_disabled',
      message: 'Marketplace integration is not enabled. This feature will be available when connected to Terra Trionfo.',
    };
  }

  /**
   * Sync inventory for grower profile with marketplace
   * @param growerId - ID of the grower
   * @returns Integration status
   */
  static async syncInventoryForGrower(growerId: string): Promise<IntegrationResult> {
    // TODO: Implement when marketplace integration is enabled
    return {
      status: 'integration_disabled',
      message: 'Marketplace integration is not enabled. This feature will be available when connected to Terra Trionfo.',
    };
  }

  /**
   * Get suggested buyers for surplus produce
   * @param harvestLogId - ID of the harvest log
   * @returns Integration status
   */
  static async getSuggestedBuyersForSurplus(harvestLogId: string): Promise<IntegrationResult> {
    // TODO: Implement when marketplace integration is enabled
    return {
      status: 'integration_disabled',
      message: 'Marketplace integration is not enabled. This feature will be available when connected to Terra Trionfo.',
    };
  }

  /**
   * Check if marketplace integration is enabled
   * @returns boolean indicating integration status
   */
  static async isEnabled(): Promise<boolean> {
    // In MVP, always return false
    // TODO: Check IntegrationConfig table when implemented
    return false;
  }
}
