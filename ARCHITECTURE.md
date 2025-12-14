# System Architecture - Smart Garden Engine

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                     http://localhost:5173                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Login/  │  │Dashboard │  │ Gardens  │  │  Tasks   │       │
│  │  Signup  │  │          │  │          │  │          │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Garden  │  │   Bed    │  │ Planting │  │ Profile  │       │
│  │  Detail  │  │  Detail  │  │  Detail  │  │  Setup   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐        │
│  │           AuthContext (JWT Token Storage)          │        │
│  └────────────────────────────────────────────────────┘        │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐        │
│  │        API Client (Axios) - /api/v1/*              │        │
│  └────────────────────────────────────────────────────┘        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                 BACKEND API (Express + TypeScript)              │
│                     http://localhost:3000                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Authentication Middleware                   │  │
│  │                  (JWT Verification)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────────── ROUTES ──────────────────────┐   │
│  │                                                          │   │
│  │  /auth         POST /signup, /login                     │   │
│  │  /profile      GET, POST, PUT                           │   │
│  │  /gardens      GET, POST, PUT, DELETE /:id              │   │
│  │  /beds         GET, PUT, DELETE /:id                    │   │
│  │  /crops        GET, GET /recommendations                │   │
│  │  /plantings    GET, POST, GET /:id, DELETE /:id         │   │
│  │  /tasks        GET, PUT /:id/complete                   │   │
│  │  /integration  GET /status, POST /harvest-sync          │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Business Logic                         │  │
│  │                                                          │  │
│  │  • taskGenerator.ts - Auto-generate care tasks          │  │
│  │  • Harvest window calculations                          │  │
│  │  • Crop recommendations algorithm                       │  │
│  │  • User data isolation                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Integration Layer (STUBBED)                   │  │
│  │                                                          │  │
│  │  MarketplaceAdapter:                                     │  │
│  │    • createListingFromSurplus() → disabled               │  │
│  │    • syncInventoryForGrower() → disabled                 │  │
│  │    • getSuggestedBuyersForSurplus() → disabled           │  │
│  │                                                          │  │
│  │  Ready for Terra Trionfo integration                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Prisma ORM Client                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ SQL
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    PostgreSQL Database                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  users              - Authentication & account data      │  │
│  │  grower_profiles    - User preferences                   │  │
│  │  gardens            - Garden information                 │  │
│  │  beds               - Planting bed details               │  │
│  │  crops              - Crop library (30+ seeded)          │  │
│  │  plantings          - Active plantings                   │  │
│  │  tasks              - Care tasks                         │  │
│  │  harvest_logs       - Harvest records + surplus          │  │
│  │  integration_config - Marketplace settings               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘


DATA FLOW EXAMPLE: Creating a Planting
═══════════════════════════════════════

1. User selects crop in BedDetail.tsx
2. Frontend POST /api/v1/plantings
   {
     gardenId, bedId, cropId,
     plantingDate, quantity
   }
3. Backend validates ownership & data
4. Fetches crop info (days_to_maturity)
5. Calculates harvest window:
   start = plantingDate + (days - 7)
   end = plantingDate + (days + 7)
6. Creates planting record
7. Calls taskGenerator.ts
8. Generates 20 tasks:
   - 7 tasks: water every 2 days (week 1-2)
   - 12 tasks: water weekly (week 3-14)
   - 1 task: fertilize (week 4)
9. Returns planting + tasks
10. Frontend displays planting detail


INTEGRATION ARCHITECTURE
═════════════════════════

Current (MVP):
┌──────────────┐
│  Surplus     │
│  Harvest     │──────► Stored in harvest_logs table
│  Logged      │        (surplus_flag = true)
└──────────────┘        (surplus_amount = X)
                               │
                               ▼
                        ┌──────────────┐
                        │ Marketplace  │
                        │   Adapter    │ ────► Returns "disabled"
                        └──────────────┘

Future (Terra Trionfo):
┌──────────────┐
│  Surplus     │
│  Harvest     │──────► Stored in harvest_logs table
│  Logged      │
└──────────────┘
        │
        ▼
┌──────────────┐        ┌──────────────┐
│ Marketplace  │        │   Terra      │
│   Adapter    │───────►│  Trionfo     │
└──────────────┘  API   │  Marketplace │
                        └──────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │   Buyers     │
                        │   Listings   │
                        │ Transactions │
                        └──────────────┘


AUTHENTICATION FLOW
════════════════════

Registration:
1. POST /api/v1/auth/signup
2. Hash password (bcrypt, 10 rounds)
3. Create user record
4. Generate JWT token (30-day exp)
5. Return { user, token }
6. Store token in localStorage

Protected Routes:
1. Extract Bearer token from header
2. Verify JWT signature
3. Decode userId
4. Attach to request
5. Continue to route handler

All data queries filtered by req.userId
```
