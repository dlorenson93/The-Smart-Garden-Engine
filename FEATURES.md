# Smart Garden Engine - Feature Overview

## ✅ Implemented Features

This document describes all the features implemented in The Smart Garden Engine MVP.

### 1. ✅ Watering & Fertilizing Reminders

**Status:** Fully Implemented

**Location:** `backend/src/utils/taskGenerator.ts`

**Description:**
- Automatic task generation when a new planting is created
- **Watering Schedule:**
  - First 2 weeks: Task every 2 days (7 tasks total)
  - Weeks 3-14: Weekly watering tasks (12 tasks total)
- **Fertilizing Schedule:**
  - One fertilization task at 4 weeks after planting

**API Integration:**
- Tasks are automatically created when plantings are added via `/api/v1/plantings`
- Tasks can be viewed and marked complete via `/api/v1/tasks`

**Frontend:**
- Visible in the Tasks page showing all upcoming and completed tasks
- Users can mark tasks as complete

---

### 2. ✅ Garden Layout Tool

**Status:** Fully Implemented

**Backend:**
- Schema fields added: `Garden.width`, `Garden.height`, `Bed.positionX`, `Bed.positionY`, `Bed.rotation`
- API endpoint: `GET /api/v1/gardens/:id/layout` - Returns complete layout with bed positions
- API endpoint: `PATCH /api/v1/beds/:id/position` - Update bed position and rotation
- Full bed update: `PUT /api/v1/beds/:id` - Update all bed properties including position

**Frontend Component:** `frontend/src/components/GardenLayout.tsx`

**Features:**
- Visual canvas showing garden layout scaled to real dimensions (20px per foot)
- Drag-and-drop bed positioning
- Grid overlay for precise placement
- Real-time position updates
- Rotation support (0-360 degrees)
- Color-coded beds based on sunlight hours
- Click to select bed and view details
- Shows active plantings on each bed

**Usage:**
- Navigate to any garden detail page
- Click the "Garden Layout" tab
- Drag beds to arrange them
- Positions automatically save

---

### 3. ✅ Sunlight Mapping

**Status:** Fully Implemented

**Backend:**
- Schema field: `Bed.sunHours` (Float, nullable) - Stores actual sun hours per day
- Existing: `Bed.sunExposure` (String: full/partial/shade) - Categorical classification
- API: All bed endpoints support `sunHours` field

**Frontend Integration:**
- Garden Layout component color-codes beds:
  - **Amber (#fbbf24)**: Full sun (6-8+ hours)
  - **Orange (#fdba74)**: Partial sun (4-6 hours)
  - **Lime (#a3e635)**: Shade (2-4 hours)
- Visual legend explains color coding
- Sunlight hours displayed in bed tooltips

**Crop Recommendations:**
- Enhanced `/api/v1/crops/recommendations` endpoint includes `sunHours` in response
- Helps users optimize crop placement based on actual sunlight measurement

**Usage:**
1. When creating/editing a bed, optionally set `sunHours` field
2. View garden layout to see sunlight distribution visually
3. Get crop recommendations that account for sun exposure

---

### 4. ✅ Location-Based Crop Suggestions

**Status:** Fully Implemented

**Backend:**
- Schema fields added to `GrowerProfile`: `climateZone` (String), `latitude` (Float), `longitude` (Float)
- Schema fields added to `Crop`: `minHardinessZone` (Int), `maxHardinessZone` (Int), `frostTolerant` (Boolean)
- Enhanced endpoint: `GET /api/v1/crops/recommendations?bedId=xxx`
  - Filters crops based on user's climate zone
  - Only shows crops compatible with USDA hardiness zone
  - Combines with sun exposure and experience level filtering

**Frontend:**
- Profile setup includes climate zone selector (Zones 3-11)
- Optional latitude/longitude inputs for precise location
- Crop recommendations automatically filtered by location

**Algorithm:**
```
For each crop:
  - Must match bed's sun exposure requirement
  - Must match user's experience level (or easier)
  - If user has climate zone set:
    - Crop's minHardinessZone <= userZone <= maxHardinessZone
    - Accounts for frost tolerance
```

**Usage:**
1. Set your climate zone in Profile Setup
2. When viewing crop recommendations for a bed, only compatible crops appear
3. System considers local frost dates and growing season length

---

### 5. ✅ Simple AI Assistant

**Status:** Fully Implemented

**Backend:** `backend/src/routes/ai-assistant.ts`

**API Endpoints:**
- `POST /api/v1/ai/ask` - Ask a gardening question
  - Accepts: `question` (string), optional `gardenId`, optional `plantingId`
  - Returns: AI-generated response with context-aware advice
- `GET /api/v1/ai/history` - Retrieve conversation history
  - Query param: `limit` (default: 20)

**Database:** `AIChat` model stores all conversations with context

**Frontend Component:** `frontend/src/components/AIAssistant.tsx`

**AI Capabilities:**
- Rule-based natural language processing
- Context-aware responses using user's garden data:
  - Experience level
  - Climate zone
  - Active garden details
  - Specific planting information
  - Current crop types

**Knowledge Domains:**
1. **Watering:** Frequency, depth, timing, soil moisture
2. **Fertilizing:** Types, frequency, NPK ratios
3. **Pest & Disease Management:** Prevention, identification, organic solutions
4. **Planting Timing:** Frost dates, zone-specific calendars
5. **Harvesting:** Ripeness indicators, optimal timing
6. **Companion Planting:** Compatible and incompatible pairings
7. **Soil Health:** Amendments, pH, composting
8. **Climate & Weather:** Zone-specific advice, season extension
9. **Spacing & Layout:** Plant distances, square foot gardening
10. **Sunlight Requirements:** Full sun, partial shade needs

**Features:**
- Chat interface with message history
- Context awareness of current garden/planting
- Beginner-friendly responses
- Professional gardening advice
- Conversation persistence

**Usage:**
- Access from Garden Detail page → "AI Assistant" tab
- Type any gardening question
- Get instant, context-aware advice
- View conversation history

---

## API Summary

### New Endpoints

```
POST   /api/v1/ai/ask              # Ask AI assistant a question
GET    /api/v1/ai/history          # Get chat history
GET    /api/v1/gardens/:id/layout  # Get garden layout with bed positions
PATCH  /api/v1/beds/:id/position   # Update bed position/rotation
```

### Enhanced Endpoints

```
POST   /api/v1/profile             # Now accepts climateZone, latitude, longitude
PUT    /api/v1/profile             # Now accepts climateZone, latitude, longitude
GET    /api/v1/crops/recommendations # Now filters by climate zone
PUT    /api/v1/beds/:id            # Now accepts positionX, positionY, rotation, sunHours
```

---

## Database Schema Updates

### New Model
- `AIChat`: Stores AI assistant conversations

### Enhanced Models
- `GrowerProfile`: Added `climateZone`, `latitude`, `longitude`
- `Garden`: Added `width`, `height`
- `Bed`: Added `positionX`, `positionY`, `rotation`, `sunHours`
- `Crop`: Added `minHardinessZone`, `maxHardinessZone`, `frostTolerant`
- `User`: Added `aiChats` relation

---

## Frontend Components

### New Components
1. **AIAssistant.tsx** - Chat interface for garden AI
2. **GardenLayout.tsx** - Drag-and-drop garden layout editor with sunlight visualization

### Enhanced Pages
1. **GardenDetail.tsx** - Added tabs for "Beds List", "Garden Layout", "AI Assistant"
2. **ProfileSetup.tsx** - Added climate zone, latitude, longitude inputs

---

## Feature Integration

All five requested features work together:

1. **Profile Setup** → User sets climate zone and location
2. **Crop Recommendations** → Filters by location, sun exposure, experience
3. **Garden Layout** → Visual arrangement with sunlight mapping
4. **Watering/Fertilizing** → Auto-generated task schedules
5. **AI Assistant** → Context-aware advice using all above data

---

## Testing the Features

### 1. Test Watering Reminders
```bash
# Create a planting
POST /api/v1/plantings
{
  "bedId": "...",
  "cropId": "...",
  "plantingDate": "2024-01-15",
  "quantity": 5
}

# Check tasks were created
GET /api/v1/tasks
# Should see 20 tasks (7 watering @ 2-day intervals, 12 weekly, 1 fertilize)
```

### 2. Test Garden Layout
1. Navigate to garden detail page
2. Click "Garden Layout" tab
3. Drag beds around the canvas
4. Check positions are saved (refresh page)

### 3. Test Sunlight Mapping
1. Edit a bed, set `sunHours` to 7.5
2. View garden layout
3. Bed should be amber colored (full sun)

### 4. Test Location Suggestions
1. Set profile climate zone to "7"
2. Request crop recommendations for a bed
3. Only crops with compatible zones appear

### 5. Test AI Assistant
1. Go to garden → "AI Assistant" tab
2. Ask: "When should I water my tomatoes?"
3. Get context-aware response
4. Check conversation history persists

---

## Migration Instructions

To apply all schema changes:

```bash
cd backend
npx prisma migrate dev --name add_missing_features
npx prisma generate
```

---

## Future Enhancements

Potential improvements (not in current scope):
- Advanced AI using LLM APIs (OpenAI, Anthropic)
- Weather API integration for automated watering adjustments
- Image recognition for pest/disease identification
- Mobile app with push notifications for tasks
- Social features (share gardens, follow friends)
- Marketplace integration with Terra Trionfo (hooks already present)

---

## Support

For issues or questions:
- Check API documentation in `/backend/src/routes/`
- Review component code in `/frontend/src/components/`
- See database schema in `/backend/prisma/schema.prisma`
