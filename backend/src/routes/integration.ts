import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { MarketplaceAdapter } from '../integrations/MarketplaceAdapter';

const router = Router();

// Sync harvest surplus to marketplace
router.post(
  '/harvest-sync',
  authenticate,
  [body('harvestLogId').notEmpty()],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    const { harvestLogId } = req.body;
    const result = await MarketplaceAdapter.createListingFromSurplus(harvestLogId);

    res.json(result);
  })
);

// Sync grower profile with marketplace
router.post(
  '/grower-profile-sync',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const result = await MarketplaceAdapter.syncInventoryForGrower(req.userId!);

    res.json(result);
  })
);

// Get surplus interest/buyers
router.post(
  '/surplus-interest',
  authenticate,
  [body('harvestLogId').notEmpty()],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    const { harvestLogId } = req.body;
    const result = await MarketplaceAdapter.getSuggestedBuyersForSurplus(harvestLogId);

    res.json(result);
  })
);

// Get integration status
router.get(
  '/status',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const enabled = await MarketplaceAdapter.isEnabled();

    res.json({
      marketplaceIntegration: enabled ? 'enabled' : 'disabled',
      message: enabled
        ? 'Marketplace integration is active'
        : 'Marketplace integration is not enabled. All integration features will be available when connected to Terra Trionfo.',
    });
  })
);

export default router;
