# 🚀 Quick Start Guide - Smart Garden Engine

## Prerequisites Checklist

- [ ] Node.js 18 or higher installed
- [ ] PostgreSQL 14 or higher installed and running
- [ ] Git installed
- [ ] A terminal/command prompt

## 5-Minute Setup

### Step 1: Database Setup (2 minutes)

Open your terminal and create the database:

```bash
# If you have PostgreSQL CLI tools:
createdb smart_garden

# Or use pgAdmin or your preferred PostgreSQL client to create a database named "smart_garden"
```

### Step 2: Project Setup (2 minutes)

```bash
# Clone and enter the project
cd The-Smart-Garden-Engine

# Install all dependencies
npm install

# Setup environment file
cp backend/.env.example backend/.env

# Edit backend/.env with your database credentials if needed
# Default: postgresql://postgres:password@localhost:5432/smart_garden

# Run migrations and seed data
npm run db:migrate
npm run db:seed
```

### Step 3: Launch (1 minute)

```bash
# Start both backend and frontend
npm run dev
```

This will start:
- ✅ Backend API on **http://localhost:3000**
- ✅ Frontend UI on **http://localhost:5173**

### Step 4: First Login

1. Open your browser to **http://localhost:5173**
2. Click "Sign Up"
3. Create an account with email and password
4. Complete your grower profile
5. Start creating gardens!

## Troubleshooting

### Database Connection Error

**Error**: `Error: connect ECONNREFUSED`

**Solution**: Make sure PostgreSQL is running
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL (varies by OS)
# macOS with Homebrew:
brew services start postgresql

# Linux:
sudo service postgresql start

# Windows: Start from Services panel
```

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**: Change the port in `backend/.env`
```env
PORT=3001
```

### Prisma Migration Error

**Error**: `Migration failed`

**Solution**: Reset and recreate the database
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev --name init
npm run seed
```

## What's Next?

After setup, try this workflow:

1. **Create a Garden**
   - Go to "Gardens" → Click "+ New Garden"
   - Name it (e.g., "Backyard Garden")

2. **Add a Bed**
   - Click on your garden
   - Click "+ New Bed"
   - Enter dimensions and sun exposure

3. **Start Planting**
   - Click on your bed
   - Click "+ New Planting"
   - Choose a crop from recommendations
   - Select planting date

4. **Check Tasks**
   - Go to "Tasks" or "Dashboard"
   - See automatically generated watering tasks
   - Mark them complete as you do them

5. **Log Harvests**
   - When crops mature, go to the planting
   - Click "+ Log Harvest"
   - Enter amount and mark surplus if applicable

## Development Commands

```bash
# Run backend only
npm run backend

# Run frontend only
npm run frontend

# Run both (recommended)
npm run dev

# Reset database (WARNING: deletes all data)
cd backend && npx prisma migrate reset

# Reseed crops
npm run db:seed

# Build for production
cd backend && npm run build
cd frontend && npm run build
```

## Project Structure

```
The-Smart-Garden-Engine/
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth & error handling
│   │   ├── integrations/ # Marketplace adapter
│   │   └── seed/         # Crop data
│   └── prisma/           # Database schema
│
├── frontend/             # React UI
│   └── src/
│       ├── pages/        # UI screens
│       ├── components/   # Reusable components
│       └── lib/          # API client
│
└── package.json          # Root dependencies
```

## Default Credentials

**Database:**
- Host: localhost
- Port: 5432
- Database: smart_garden
- User: postgres
- Password: password (change in .env)

**Application:**
- No default users - create during signup

## API Access

The API is accessible at `http://localhost:3000/api/v1`

**Health Check:**
```bash
curl http://localhost:3000/health
```

**Example API Call:**
```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Getting Help

- Check README.md for detailed documentation
- Check PROJECT_SUMMARY.md for technical details
- Review API endpoints in README.md
- Check browser console for frontend errors
- Check terminal for backend errors

## Common First-Time Issues

1. **Forgot to seed crops?**
   ```bash
   npm run db:seed
   ```

2. **Frontend not connecting to backend?**
   - Check backend is running on port 3000
   - Check browser console for errors

3. **Can't create profile after signup?**
   - Check backend logs for errors
   - Verify database connection

4. **Tasks not generating?**
   - This is automatic when you create a planting
   - Check the planting detail page

## Success Checklist

After setup, you should be able to:

- [x] Access http://localhost:5173
- [x] Sign up and login
- [x] Create a grower profile
- [x] See the dashboard
- [x] Create a garden
- [x] Add a bed to the garden
- [x] See crop recommendations
- [x] Create a planting
- [x] See automatically generated tasks
- [x] Mark tasks complete
- [x] Log harvests

If all checkboxes pass, you're ready to grow! 🌱

---

**Need more help?** Check the full README.md or PROJECT_SUMMARY.md
