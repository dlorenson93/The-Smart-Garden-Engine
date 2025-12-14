# Testing Checklist - Smart Garden Engine MVP

## ✅ Pre-Flight Checks

- [ ] PostgreSQL is installed and running
- [ ] Node.js 18+ is installed
- [ ] Database `smart_garden` has been created
- [ ] Dependencies installed (`npm install`)
- [ ] Migrations run (`npm run db:migrate`)
- [ ] Crops seeded (`npm run db:seed`)
- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173

## 🔐 Authentication Testing

### Signup Flow
- [ ] Navigate to http://localhost:5173
- [ ] Click "Sign Up"
- [ ] Enter email and password
- [ ] Confirm password must match
- [ ] Password must be 6+ characters
- [ ] Successfully creates account
- [ ] Redirects to profile setup
- [ ] Token stored in localStorage

### Login Flow
- [ ] Navigate to login page
- [ ] Enter valid credentials
- [ ] Successfully logs in
- [ ] Redirects to dashboard
- [ ] Invalid credentials show error
- [ ] Token persists on page refresh

### Protected Routes
- [ ] Cannot access dashboard without login
- [ ] Cannot access gardens without login
- [ ] Logout clears token
- [ ] Logout redirects to login

## 👤 Profile Management

### Create Profile
- [ ] Form shows after first signup
- [ ] Name field required
- [ ] Location field required
- [ ] Experience level dropdown works
  - [ ] Beginner
  - [ ] Intermediate
  - [ ] Advanced
- [ ] Garden type dropdown works
  - [ ] Balcony
  - [ ] Backyard
  - [ ] Small Farm
- [ ] Successfully creates profile
- [ ] Redirects to dashboard

### Edit Profile
- [ ] Navigate to profile setup
- [ ] Fields pre-filled with existing data
- [ ] Can update all fields
- [ ] Changes persist

## 🏡 Garden Management

### Create Garden
- [ ] Navigate to Gardens page
- [ ] Click "+ New Garden"
- [ ] Enter garden name (required)
- [ ] Enter description (optional)
- [ ] Successfully creates garden
- [ ] Garden appears in list
- [ ] Shows bed count (0)
- [ ] Shows planting count (0)

### View Garden
- [ ] Click on garden card
- [ ] Shows garden name and description
- [ ] Shows beds list (empty initially)
- [ ] "Delete Garden" button visible

### Delete Garden
- [ ] Click "Delete Garden"
- [ ] Confirmation dialog appears
- [ ] Confirm deletion
- [ ] Garden removed from list
- [ ] Redirected to gardens page

## 🛏️ Bed Management

### Create Bed
- [ ] In garden detail, click "+ New Bed"
- [ ] Enter bed name (required)
- [ ] Enter length in feet (required, number)
- [ ] Enter width in feet (required, number)
- [ ] Select sun exposure
  - [ ] Full Sun
  - [ ] Partial Sun
  - [ ] Shade
- [ ] Enter notes (optional)
- [ ] Successfully creates bed
- [ ] Bed appears in garden

### View Bed
- [ ] Click "View & Add Plantings"
- [ ] Shows bed details (name, size, sun)
- [ ] Shows garden name
- [ ] Shows plantings list (empty initially)
- [ ] Back button returns to garden

## 🌱 Crop & Recommendations

### View Crops
- [ ] API returns 30+ crops
- [ ] Each crop has:
  - [ ] Name
  - [ ] Category (vegetable/herb/fruit/flower)
  - [ ] Sun requirement
  - [ ] Days to maturity
  - [ ] Difficulty (easy/medium/hard)

### Crop Recommendations
- [ ] In bed detail, click "+ New Planting"
- [ ] Recommendations show crops matching bed's sun exposure
- [ ] Recommendations filtered by user experience level
- [ ] Beginner sees only "easy" crops
- [ ] Intermediate sees "easy" and "medium"
- [ ] Advanced sees all difficulty levels
- [ ] Crops sorted by days to maturity

## 🌾 Planting Management

### Create Planting
- [ ] In bed detail, click "+ New Planting"
- [ ] Select crop from dropdown
- [ ] Dropdown shows recommended crops
- [ ] Select planting date (defaults to today)
- [ ] Enter quantity (required, min 1)
- [ ] Successfully creates planting
- [ ] Planting appears in bed
- [ ] Shows crop name and details
- [ ] Shows expected harvest dates

### View Planting Detail
- [ ] Click on planting card
- [ ] Shows crop name with badges
- [ ] Shows location (garden → bed)
- [ ] Shows planting date
- [ ] Shows expected harvest window
- [ ] Shows "Ready to harvest!" if in window
- [ ] Shows quantity

### Auto-Generated Tasks
- [ ] After creating planting, tasks are generated
- [ ] Check planting detail page shows tasks
- [ ] First 14 days: task every 2 days (7 tasks)
- [ ] After 14 days: task weekly (12 tasks)
- [ ] One fertilize task at 28 days
- [ ] Total: ~20 tasks created
- [ ] Each task shows:
  - [ ] Title
  - [ ] Due date
  - [ ] Type (water/fertilize)

### Harvest Window Calculation
- [ ] Create planting with 50-day crop
- [ ] Expected start = planting_date + 43 days
- [ ] Expected end = planting_date + 57 days
- [ ] Window is 14 days total
- [ ] Dates display correctly

## ✅ Task Management

### View Tasks
- [ ] Navigate to Tasks page
- [ ] Default shows "Today" filter
- [ ] Can switch to "Upcoming" filter
- [ ] Can switch to "Completed" filter
- [ ] Can switch to "All" filter

### Today's Tasks
- [ ] Shows tasks due today
- [ ] Shows uncompleted tasks only
- [ ] Empty state if no tasks

### Complete Task
- [ ] Click checkbox on task
- [ ] Task marked as completed
- [ ] Completed time recorded
- [ ] Task moves to completed list
- [ ] Dashboard updates

### Uncomplete Task
- [ ] In completed view, uncheck task
- [ ] Task marked incomplete
- [ ] Task returns to active list

### Task Details
- [ ] Each task shows:
  - [ ] Title and description
  - [ ] Related planting (clickable link)
  - [ ] Due date
  - [ ] Type badge
  - [ ] Completion status

## 📊 Dashboard

### Today's Tasks Section
- [ ] Shows tasks due today
- [ ] Shows count in header
- [ ] Can mark complete from dashboard
- [ ] Empty state if no tasks
- [ ] "View All Tasks" button works

### Upcoming Tasks Section
- [ ] Shows tasks for next 7 days
- [ ] Shows first 5 tasks
- [ ] Shows due dates
- [ ] Shows crop names

### Recent Plantings Section
- [ ] Shows last 5 plantings
- [ ] Shows crop name
- [ ] Shows location (bed and garden)
- [ ] Shows expected harvest date
- [ ] Links to planting detail
- [ ] "Manage Gardens" button works

## 🥕 Harvest Logging

### Log Harvest
- [ ] In planting detail, click "+ Log Harvest"
- [ ] Form appears with fields
- [ ] Date defaults to today
- [ ] Enter amount (required, number)
- [ ] Select units dropdown
  - [ ] lbs
  - [ ] kg
  - [ ] pieces
- [ ] Surplus checkbox works
- [ ] When checked, surplus amount field appears
- [ ] Enter surplus amount (optional)
- [ ] Enter notes (optional)
- [ ] Successfully logs harvest
- [ ] Harvest appears in list

### View Harvest History
- [ ] Harvest logs show in planting detail
- [ ] Shows date
- [ ] Shows amount and units
- [ ] Shows surplus badge if flagged
- [ ] Shows notes if provided
- [ ] Sorted by date (newest first)

### Surplus Tracking
- [ ] Surplus flag stored correctly
- [ ] Surplus amount stored correctly
- [ ] Data ready for marketplace integration

## 🔌 Integration Layer

### Integration Status
- [ ] GET /api/v1/integration/status
- [ ] Returns { marketplaceIntegration: "disabled" }
- [ ] Shows appropriate message

### Stubbed Endpoints
- [ ] POST /api/v1/integration/harvest-sync
  - [ ] Returns { status: "integration_disabled" }
- [ ] POST /api/v1/integration/grower-profile-sync
  - [ ] Returns { status: "integration_disabled" }
- [ ] POST /api/v1/integration/surplus-interest
  - [ ] Returns { status: "integration_disabled" }

## 🔒 Security Testing

### Authentication
- [ ] JWT token required for all protected routes
- [ ] Invalid token returns 401
- [ ] Expired token returns 401
- [ ] No token returns 401

### Data Isolation
- [ ] User A cannot access User B's gardens
- [ ] User A cannot access User B's plantings
- [ ] User A cannot see User B's tasks
- [ ] All queries filtered by userId

### Input Validation
- [ ] Email format validated on signup
- [ ] Password length enforced (6+ chars)
- [ ] Numeric fields reject non-numbers
- [ ] Required fields enforced
- [ ] Enum fields validated (sun exposure, difficulty, etc.)

### SQL Injection Protection
- [ ] Prisma prevents SQL injection
- [ ] Test with malicious input: `' OR '1'='1`
- [ ] Application handles safely

## 🎨 UI/UX Testing

### Navigation
- [ ] All nav links work
- [ ] Back buttons work
- [ ] Breadcrumb navigation clear
- [ ] Logo links to dashboard

### Forms
- [ ] All form fields have labels
- [ ] Required fields marked
- [ ] Error messages display clearly
- [ ] Success messages display
- [ ] Form resets after submission

### Responsive Design
- [ ] Desktop view (1920x1080): ✓
- [ ] Laptop view (1366x768): ✓
- [ ] Tablet view (768x1024): Test needed
- [ ] Mobile view (375x667): Test needed

### Loading States
- [ ] "Loading..." shows during data fetch
- [ ] No flash of wrong content
- [ ] Smooth transitions

### Error Handling
- [ ] Network errors show message
- [ ] 404 errors show message
- [ ] Validation errors show inline
- [ ] Console clean (no errors)

## 🗄️ Database Testing

### Data Integrity
- [ ] Creating user creates UUID
- [ ] Timestamps auto-populate
- [ ] Foreign keys enforced
- [ ] Cascade deletes work
  - [ ] Delete user → deletes profile
  - [ ] Delete garden → deletes beds
  - [ ] Delete bed → deletes plantings
  - [ ] Delete planting → deletes tasks & harvests

### Seed Data
- [ ] Crops table has 30+ records
- [ ] All crops have required fields
- [ ] Variety of categories
- [ ] Variety of difficulties
- [ ] Variety of sun requirements

## 🚀 Performance

### API Response Times
- [ ] Auth endpoints < 500ms
- [ ] List endpoints < 200ms
- [ ] Detail endpoints < 150ms
- [ ] Create operations < 300ms

### Frontend Load Times
- [ ] Initial page load < 2s
- [ ] Navigation between pages < 500ms
- [ ] Form submissions feel instant

### Database Queries
- [ ] No N+1 query problems
- [ ] Proper use of includes/joins
- [ ] Indexes on foreign keys

## 🐛 Edge Cases

### Empty States
- [ ] No gardens → friendly message
- [ ] No beds → friendly message
- [ ] No plantings → friendly message
- [ ] No tasks → "No tasks for today! 🎉"
- [ ] No harvests → appropriate message

### Date Handling
- [ ] Past dates allowed for planting
- [ ] Future dates allowed for planting
- [ ] Harvest dates can be any date
- [ ] Dates display in correct timezone

### Large Data Sets
- [ ] 50+ gardens: performs well
- [ ] 100+ plantings: performs well
- [ ] 1000+ tasks: performs well

### Concurrent Users
- [ ] Multiple users can use simultaneously
- [ ] No data leakage between users

## 📋 Final Checks

### Code Quality
- [ ] No TypeScript errors
- [ ] No console.errors in browser
- [ ] No warnings in terminal
- [ ] Consistent code style

### Documentation
- [ ] README.md complete
- [ ] QUICKSTART.md clear
- [ ] PROJECT_SUMMARY.md accurate
- [ ] ARCHITECTURE.md helpful

### Deployment Readiness
- [ ] .env.example provided
- [ ] .gitignore comprehensive
- [ ] Dependencies locked
- [ ] Build scripts work
  - [ ] `cd backend && npm run build` ✓
  - [ ] `cd frontend && npm run build` ✓

## 🎯 MVP Acceptance Criteria

### Core Features
- [x] User authentication (signup/login)
- [x] Profile management
- [x] Garden CRUD
- [x] Bed CRUD
- [x] Crop library with 30+ crops
- [x] Crop recommendations
- [x] Planting creation
- [x] Auto-harvest window calculation
- [x] Auto-task generation
- [x] Task management
- [x] Harvest logging
- [x] Surplus tracking
- [x] Integration layer (stubbed)

### Technical Requirements
- [x] TypeScript throughout
- [x] REST API design
- [x] JWT authentication
- [x] PostgreSQL database
- [x] Prisma ORM
- [x] React frontend
- [x] Responsive CSS

### Integration Requirements
- [x] MarketplaceAdapter exists
- [x] All methods stubbed correctly
- [x] Returns "integration_disabled"
- [x] Clean separation of concerns
- [x] No refactoring needed for future integration

## ✨ Result

**STATUS**: [ ] All tests passed, ready for production  
**STATUS**: [ ] Some issues found (list below)  
**STATUS**: [ ] Major issues, needs fixes

**Issues Found:**
1. _[List any issues here]_
2. _[...]_

**Notes:**
_[Any additional notes or observations]_

---

**Tested By**: _______________  
**Date**: _______________  
**Environment**: Dev / Staging / Production  
**Browser**: _______________  
**Node Version**: _______________  
**PostgreSQL Version**: _______________
