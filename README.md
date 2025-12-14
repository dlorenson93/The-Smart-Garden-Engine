# 🌱 Terra Plantari - MVP

A standalone garden and micro-farm planning application with future integration hooks for Terra Trionfo marketplace.

## 🚀 Quick Start

### First Time Setup

1. **Start the servers** (both terminals should already be running in Codespaces)
   - Backend: `cd backend && npm run dev` (port 3000)
   - Frontend: `cd frontend && npm run dev` (port 5173)

2. **Seed the database** (required for seasonal recommendations)
   ```bash
   cd backend && npm run seed
   ```

3. **Set up your profile**
   - Register/login to the app
   - Click **Profile** in navigation
   - Enter your ZIP code (e.g., `10001`)
   - This will auto-populate your USDA zone and frost dates

4. **Start using the app!**
   - Visit the Dashboard to see your overview
   - Create a garden and add beds
   - Check Seasonal Recommendations for crops to plant now
   - Use the AI Assistant for gardening advice

📖 **Having issues?** See [SETUP.md](SETUP.md) for detailed troubleshooting.

---

## 🎯 Overview

Terra Plantari helps gardeners and small growers plan, track, and manage their gardens. It provides:

- **Garden Layout Tool**: Visual drag-and-drop bed arrangement with real-time positioning
- **Sunlight Mapping**: Color-coded visualization of sun exposure across your garden
- **Location-Based Crop Suggestions**: USDA hardiness zone filtering for compatible crops
- **AI Garden Assistant**: Context-aware chatbot for instant gardening advice
- **Watering & Fertilizing Reminders**: Automated task generation with smart scheduling
- **Garden & Bed Management**: Create and organize multiple gardens and planting beds
- **Crop Library**: 30+ pre-loaded crops with growing information and climate compatibility
- **Smart Planting**: Auto-calculated harvest windows and personalized crop recommendations
- **Harvest Tracking**: Log harvests with surplus flagging for future marketplace integration
- **Growth Timeline**: Visual timeline from planting to harvest

### ✨ Featured Capabilities

1. **🗺️ Interactive Garden Layout**
   - Drag-and-drop bed positioning on a scaled canvas
   - Visual sunlight heat map (full sun, partial, shade)
   - Real-time position saving and bed rotation
   
2. **☀️ Sunlight Analysis**
   - Track actual sun hours per bed
   - Color-coded visualization
   - Optimized crop placement recommendations

3. **🌍 Climate-Smart Recommendations**
   - USDA hardiness zone integration (Zones 3-11)
   - Frost tolerance filtering
   - Location-specific planting calendars

4. **🤖 AI Gardening Assistant**
   - Natural language garden advice
   - Context-aware responses (uses your garden data)
   - Covers watering, pests, timing, soil, and more
   - Conversation history

5. **💧 Smart Task Automation**
   - Auto-generated watering schedule (intensive early, then weekly)
   - Fertilization reminders at key growth stages
   - Task completion tracking

## 🏗️ Architecture

**Monorepo Structure:**
```
├── backend/          # Node.js + TypeScript + Express API
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth & error handling
│   │   ├── integrations/  # Marketplace adapter (stubbed)
│   │   ├── utils/         # Task generation logic
│   │   └── seed/          # Crop database seeder
│   └── prisma/       # Database schema
├── frontend/         # React + TypeScript + Vite
│   └── src/
│       ├── pages/         # UI screens
│       ├── components/    # Reusable components
│       ├── contexts/      # Auth context
│       └── lib/           # API client
```

**Tech Stack:**
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend**: React, TypeScript, Vite, React Router
- **Auth**: JWT with bcrypt password hashing
- **API**: RESTful JSON API at `/api/v1`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd The-Smart-Garden-Engine
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   
   Create a PostgreSQL database:
   ```bash
   createdb smart_garden
   ```

4. **Configure environment variables:**
   
   Copy the example env file:
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env` with your settings:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/smart_garden?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=3000
   NODE_ENV=development
   ```

5. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

6. **Seed the crop database:**
   ```bash
   npm run db:seed
   ```

7. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This starts:
   - Backend API on http://localhost:3000
   - Frontend UI on http://localhost:5173

8. **Open your browser:**
   
   Navigate to http://localhost:5173

## 📚 API Documentation

### Authentication

**POST /api/v1/auth/signup**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**POST /api/v1/auth/login**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Profile

**GET /api/v1/profile** - Get user profile  
**POST /api/v1/profile** - Create profile  
**PUT /api/v1/profile** - Update profile

### Gardens

**GET /api/v1/gardens** - List all gardens  
**POST /api/v1/gardens** - Create garden  
**GET /api/v1/gardens/:id** - Get garden details  
**PUT /api/v1/gardens/:id** - Update garden  
**DELETE /api/v1/gardens/:id** - Delete garden

### Beds

**GET /api/v1/gardens/:gardenId/beds** - List beds in garden  
**POST /api/v1/gardens/:gardenId/beds** - Create bed  
**GET /api/v1/beds/:id** - Get bed details  
**PUT /api/v1/beds/:id** - Update bed  
**DELETE /api/v1/beds/:id** - Delete bed

### Crops

**GET /api/v1/crops** - List all crops (with optional filters)  
**GET /api/v1/crops/:id** - Get crop details  
**GET /api/v1/crops/recommendations?bedId=xxx** - Get crop recommendations for bed

### Plantings

**GET /api/v1/plantings** - List all plantings  
**POST /api/v1/plantings** - Create planting (auto-generates tasks)  
**GET /api/v1/plantings/:id** - Get planting details  
**PUT /api/v1/plantings/:id** - Update planting  
**DELETE /api/v1/plantings/:id** - Delete planting

### Harvest Logs

**GET /api/v1/plantings/:id/harvests** - List harvests for planting  
**POST /api/v1/plantings/:id/harvests** - Log a harvest

### Tasks

**GET /api/v1/tasks?scope=[today|upcoming|completed|all]** - List tasks  
**GET /api/v1/tasks/:id** - Get task details  
**PUT /api/v1/tasks/:id/complete** - Mark task complete  
**PUT /api/v1/tasks/:id/incomplete** - Mark task incomplete

### Integration (Stubbed)

**GET /api/v1/integration/status** - Check integration status  
**POST /api/v1/integration/harvest-sync** - Sync harvest to marketplace (disabled)  
**POST /api/v1/integration/grower-profile-sync** - Sync profile (disabled)  
**POST /api/v1/integration/surplus-interest** - Get surplus buyers (disabled)

All integration endpoints return `{ status: "integration_disabled" }` in MVP.

## 🌾 Key Features Explained

### 1. Crop Recommendations

The system recommends crops based on:
- **Sun Exposure**: Matches bed's sun exposure to crop requirements
- **Experience Level**: Filters by difficulty (beginner/intermediate/advanced)
- **Days to Maturity**: Shows faster-growing crops first

### 2. Auto-Generated Tasks

When you create a planting, the system automatically generates:
- Watering tasks every 2 days for the first 2 weeks
- Weekly watering tasks for the following 12 weeks
- A fertilization task at 4 weeks

### 3. Harvest Window Calculation

Harvest windows are auto-calculated as:
```
expected_harvest_start = planting_date + (days_to_maturity - 7)
expected_harvest_end   = planting_date + (days_to_maturity + 7)
```

This gives a 2-week harvest window centered on the crop's maturity date.

### 4. Surplus Tracking

When logging harvests, you can flag surplus produce. This data is stored for future marketplace integration but doesn't currently trigger any marketplace actions.

## 🔌 Integration Layer

The MVP includes **stubbed integration endpoints** for Terra Trionfo marketplace:

**MarketplaceAdapter** (`backend/src/integrations/MarketplaceAdapter.ts`):
- `createListingFromSurplus(harvestLogId)`
- `syncInventoryForGrower(growerId)`
- `getSuggestedBuyersForSurplus(harvestLogId)`

All methods return `{ status: "integration_disabled" }` until marketplace integration is enabled.

**To enable integration in the future:**
1. Update `MarketplaceAdapter` methods with real API calls
2. Set `externalMarketplaceEnabled = true` in `IntegrationConfig` table
3. No refactoring of existing code required!

## 📦 Database Schema

**Core Models:**
- `User` - Authentication and user accounts
- `GrowerProfile` - Grower information and preferences
- `Garden` - User's gardens
- `Bed` - Planting beds within gardens
- `Crop` - Crop library (seeded with 30+ crops)
- `Planting` - Individual crop plantings
- `Task` - Care tasks (watering, fertilizing, etc.)
- `HarvestLog` - Harvest records with surplus tracking
- `IntegrationConfig` - Marketplace integration settings

## 🧪 Development

### Running Backend Only
```bash
npm run backend
```

### Running Frontend Only
```bash
npm run frontend
```

### Database Commands
```bash
# Generate Prisma client
cd backend && npx prisma generate

# Create new migration
cd backend && npx prisma migrate dev --name migration_name

# Reset database (WARNING: Deletes all data)
cd backend && npx prisma migrate reset

# Seed crops
npm run db:seed
```

### Building for Production
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

## 🎨 UI Screens

1. **Login/Signup** - User authentication
2. **Profile Setup** - Configure grower profile
3. **Dashboard** - Today's tasks + recent plantings
4. **Gardens List** - View all gardens
5. **Garden Detail** - Manage beds in a garden
6. **Bed Detail** - View plantings and add new ones
7. **Planting Detail** - Timeline, tasks, and harvest logs
8. **Tasks** - Filter and manage all tasks
9. **Harvest Logging** - Record harvests with surplus flag

## 🔐 Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for authentication (30-day expiration)
- All API routes (except auth) require authentication
- SQL injection protection via Prisma
- CORS enabled for cross-origin requests

## 🚢 Deployment

### Environment Variables (Production)

Set these in your production environment:

```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
JWT_SECRET="use-a-strong-random-secret-here"
PORT=3000
NODE_ENV=production
```

### Docker Deployment (Optional)

The application can be containerized. Example Dockerfile structure:

```dockerfile
# Backend
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend .
RUN npx prisma generate
CMD ["npm", "start"]

# Frontend (build and serve)
FROM node:18-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

## 📝 Future Enhancements

**Integration Ready:**
- Connect to Terra Trionfo marketplace
- Enable surplus produce listings
- Buyer discovery for local surplus

**Potential Features:**
- Weather integration for task adjustments
- Pest/disease tracking
- Companion planting suggestions
- Mobile app (React Native)
- Multi-language support
- Garden layout visualizer
- Photo uploads for plantings

## 🤝 Contributing

This is an MVP. Future contributions welcome for:
- Additional crops in seed data
- Improved recommendation algorithms
- UI/UX enhancements
- Mobile responsiveness
- Accessibility improvements

## 📄 License

[Your License Here]

## 🙏 Acknowledgments

Built as a standalone MVP with clean integration hooks for Terra Trionfo marketplace platform.

---

**Ready to grow?** 🌱 Start by creating an account and setting up your first garden!
