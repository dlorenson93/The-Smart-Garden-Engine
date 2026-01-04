import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Simple AI assistant that provides context-aware gardening advice
router.post('/ask', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const { question, gardenId, plantingId, scope_type, scope_id } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Determine scope from request
    const scopeType = scope_type || (gardenId ? 'garden' : plantingId ? 'planting' : 'global');
    const scopeId = scope_id || gardenId || plantingId || null;

    // Gather context about user's garden
    const context: any = {
      gardenId,
      plantingId,
    };

    // Get user profile for location-based context
    const profile = await prisma.growerProfile.findUnique({
      where: { userId },
    });

    if (profile) {
      context.experience = profile.experienceLevel;
      context.climateZone = profile.climateZone;
      context.location = profile.location;
    }

    // Get specific garden context if provided
    if (gardenId) {
      const garden = await prisma.garden.findUnique({
        where: { id: gardenId },
        include: {
          beds: {
            include: {
              plantings: {
                include: {
                  crop: true,
                },
              },
            },
          },
        },
      });

      if (garden) {
        context.gardenName = garden.name;
        context.gardenSize = `${garden.width}x${garden.height}`;
        context.bedCount = garden.beds.length;
        context.activePlantings = garden.beds.reduce(
          (sum, bed) => sum + bed.plantings.length,
          0
        );
      }
    }

    // Get specific planting context if provided
    if (plantingId) {
      const planting = await prisma.planting.findUnique({
        where: { id: plantingId },
        include: {
          crop: true,
          bed: true,
        },
      });

      if (planting) {
        context.cropName = planting.crop.name;
        context.plantingDate = planting.plantingDate;
        context.expectedHarvest = planting.expectedHarvestStart;
        context.sunExposure = planting.bed.sunExposure;
      }
    }

    console.log('[AI Assistant] Incoming /ask request:', {
      userId,
      question,
      gardenId,
      plantingId,
      scope_type,
      scope_id
    });

    // Generate AI response based on question keywords
    const response = generateResponse(question, context);

    console.log('[AI Assistant] Generated response:', response);
    console.log('[AI Assistant] Context used:', context);

    // Save conversation to database with scope
    const chat = await prisma.aIChat.create({
      data: {
        userId,
        question,
        response,
        context: JSON.stringify(context),
        scopeType,
        scopeId,
      },
    });

    res.json({
      id: chat.id,
      question: chat.question,
      response: chat.response,
      createdAt: chat.createdAt,
    });
  }));

// Get conversation history (with optional scope filtering)
router.get('/history', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || 20;
    const scopeType = req.query.scope_type as string;
    const scopeId = req.query.scope_id as string;

    // Build where clause based on scope filters
    const where: any = { userId };
    
    if (scopeType) {
      where.scopeType = scopeType;
      
      if (scopeId) {
        where.OR = [
          { scopeId: scopeId },
          { scopeId: null }  // Include global messages too
        ];
      }
    }

    const chats = await prisma.aIChat.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    res.json(chats);
  }));

// Simple rule-based AI response generator
function generateResponse(question: string, context: any): string {
  const q = question.toLowerCase();

  // Watering questions
  if (q.includes('water') || q.includes('irrigation')) {
    if (context.cropName) {
      return `For ${context.cropName}, water deeply but infrequently - about 1-2 inches per week. Check soil moisture 2 inches down; if it's dry, water. Morning watering is best to reduce disease risk. In your ${context.sunExposure || 'location'}, adjust based on weather conditions.`;
    }
    return `Water most vegetables deeply (6-8 inches) 1-2 times per week rather than shallow daily watering. This encourages deep root growth. Water in the morning to reduce evaporation and disease. Adjust based on your soil type, weather, and plant needs.`;
  }

  // Fertilizing questions
  if (q.includes('fertiliz') || q.includes('nutrient') || q.includes('feed')) {
    if (context.cropName) {
      return `${context.cropName} benefits from balanced fertilizer at planting, then side-dress with compost or fertilizer every 3-4 weeks during the growing season. Avoid over-fertilizing leafy greens with nitrogen as it can reduce flavor. For fruiting crops, switch to higher phosphorus/potassium once flowering begins.`;
    }
    return `Start with compost or balanced fertilizer (10-10-10) at planting. Side-dress every 3-4 weeks with compost or organic fertilizer. Leafy greens need more nitrogen, fruiting crops need more phosphorus and potassium. Watch for signs of deficiency: yellowing leaves (nitrogen), purple tints (phosphorus), or weak stems (potassium).`;
  }

  // Pest/disease questions
  if (q.includes('pest') || q.includes('bug') || q.includes('disease') || q.includes('problem')) {
    return `For pest management: 1) Inspect plants regularly, 2) Hand-pick large pests, 3) Use row covers for prevention, 4) Encourage beneficial insects with flowers, 5) Try insecticidal soap or neem oil for soft-bodied pests. For diseases: ensure good air circulation, avoid overhead watering, remove infected plant material, and practice crop rotation.`;
  }

  // Planting/timing questions
  if (q.includes('when') && (q.includes('plant') || q.includes('sow') || q.includes('start'))) {
    if (context.climateZone) {
      return `In zone ${context.climateZone}, timing depends on your last frost date (typically mid-April to mid-May). Cool season crops (lettuce, peas, broccoli) can go out 2-4 weeks before last frost. Warm season crops (tomatoes, peppers, squash) should wait until after last frost when soil is 60°F+. Check local extension office for specific dates.`;
    }
    return `Planting timing depends on your frost dates and crop type. Cool season crops tolerate frost and can be planted early spring or late summer. Warm season crops need frost-free conditions and warm soil (60°F+). Check your local cooperative extension for frost dates and planting calendars specific to your area.`;
  }

  // Harvesting questions
  if (q.includes('harvest') || q.includes('ready') || q.includes('ripe')) {
    if (context.cropName && context.expectedHarvest) {
      return `Your ${context.cropName} should be ready around ${new Date(context.expectedHarvest).toLocaleDateString()}. Look for signs of ripeness: proper size, color change, and firmness. Harvest in the morning after dew dries for best flavor. Most vegetables taste best when harvested slightly immature rather than overripe.`;
    }
    return `Harvest times vary by crop and variety. General signs of readiness: proper size for variety, appropriate color, firmness, and easy separation from plant. Harvest leafy greens in the morning, fruiting crops when fully colored, root crops when sized up. Regular harvesting encourages more production in many crops.`;
  }

  // Companion planting
  if (q.includes('companion') || q.includes('grow with') || q.includes('plant together')) {
    return `Good companion planting: Tomatoes with basil, carrots with onions, beans with corn/squash, lettuce with radishes. Avoid: Onions with beans/peas, fennel with most plants, tomatoes with brassicas. Benefits include pest control, efficient space use, and improved growth. Research specific pairings for your crops.`;
  }

  // Soil questions
  if (q.includes('soil') || q.includes('compost') || q.includes('amendment')) {
    return `Healthy soil is key to gardening success. Add 2-3 inches of compost annually, test pH every 2-3 years (most vegetables prefer 6.0-7.0), and maintain good structure with organic matter. Avoid tilling when wet. Use cover crops in off-season. Mulch to retain moisture and suppress weeds.`;
  }

  // Climate/location questions
  if (q.includes('climate') || q.includes('zone') || q.includes('frost')) {
    if (context.climateZone) {
      return `In your climate zone ${context.climateZone}, focus on crops suited to your conditions. Check seed packets and plant tags for hardiness zones. Extend your season with cold frames, row covers, or mulch. Consider microclimates in your garden - south-facing walls are warmer, low spots may frost earlier.`;
    }
    return `Your climate zone determines which crops will thrive and when to plant. Find your USDA hardiness zone and last/first frost dates. Choose varieties bred for your climate. Use season extension techniques like row covers, cold frames, and mulch to extend your growing season.`;
  }

  // Spacing/layout questions
  if (q.includes('space') || q.includes('spacing') || q.includes('distance') || q.includes('layout')) {
    return `Proper spacing ensures good air circulation, reduces disease, and maximizes yield. Follow seed packet recommendations but consider: square foot gardening uses closer spacing, succession planting needs planning, vertical growing saves space, and companion planting can allow tighter spacing. For your ${context.bedCount || ''} beds, plan for efficient access and harvest.`;
  }

  // Sunlight questions
  if (q.includes('sun') || q.includes('shade') || q.includes('light')) {
    if (context.sunExposure) {
      return `Your bed has ${context.sunExposure} sun exposure. Full sun (6-8+ hours) is best for fruiting crops like tomatoes, peppers, squash. Partial sun (4-6 hours) works for leafy greens, herbs, root crops. Shade (2-4 hours) limits options to lettuce, spinach, herbs. Consider sunlight mapping to optimize placement.`;
    }
    return `Most vegetables need 6-8+ hours of direct sun (full sun). Leafy greens and herbs tolerate 4-6 hours (partial sun). Few vegetables thrive in shade. Observe your garden throughout the day and seasons - summer sun is stronger, trees may create more shade when leafed out. Place tall plants where they won't shade shorter ones.`;
  }

  // General gardening advice
  if (context.experience === 'beginner') {
    return `As a beginner${context.activePlantings ? ` with ${context.activePlantings} active plantings` : ''}, focus on: 1) Start small and expand as you learn, 2) Choose easy crops (tomatoes, lettuce, herbs, radishes), 3) Water consistently, 4) Mulch to reduce weeds and retain moisture, 5) Keep a garden journal to track what works. You're doing great by asking questions!`;
  }

  // Default response
  return `Great question about your garden${context.gardenName ? ` "${context.gardenName}"` : ''}! ${
    context.activePlantings
      ? `With ${context.activePlantings} active plantings, you're off to a good start. `
      : ''
  }For specific advice, I recommend: 1) Check your local cooperative extension website for regional guidance, 2) Join local gardening groups for community support, 3) Keep notes on what works in your specific conditions, 4) Experiment with different varieties to find what thrives for you. Feel free to ask more specific questions about watering, pests, timing, or any other gardening topic!`;
}

export default router;
