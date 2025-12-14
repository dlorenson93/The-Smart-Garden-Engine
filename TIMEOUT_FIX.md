# Weather Service Timeout Fix

## Issue
Weather service was timing out when attempting to fetch data from the Open-Meteo API.

## Root Cause
- Backend axios calls to Open-Meteo API had **no timeout configuration**
- Frontend had a 5-second timeout, but external API calls could take longer
- No specific error handling for timeout scenarios

## Changes Made

### 1. Backend Service Timeouts
**File:** `backend/src/services/weather.service.ts`

- Added **10-second timeout** to all axios calls:
  - Main weather API call to Open-Meteo forecast endpoint
  - Geocoding API calls (both primary and fallback)
- This prevents indefinite hanging on slow/unavailable APIs

### 2. Frontend Timeout Increase
**File:** `frontend/src/pages/Dashboard.tsx`

- Increased timeout from **5 seconds → 12 seconds**
- Gives backend time to:
  1. Make request to Open-Meteo (10s timeout)
  2. Process response
  3. Return data to frontend
- Total chain: Frontend (12s) > Backend (10s) > Open-Meteo API

### 3. Enhanced Error Handling
**File:** `backend/src/routes/weather.ts`

Added specific error handling for all three weather endpoints:

- **ECONNABORTED / ETIMEDOUT**: Returns 504 Gateway Timeout
  - Message: "Weather service request timed out. Please try again."
  
- **ENOTFOUND / ECONNREFUSED**: Returns 503 Service Unavailable
  - Message: "Weather service is temporarily unavailable."
  
- **Other errors**: Returns 500 Internal Server Error
  - Generic fallback for unexpected issues

## Testing
After backend restarts automatically (TypeScript watch mode):

1. Weather should load within 12 seconds or show timeout error
2. Retry button in UI will work properly
3. Specific error messages help users understand the issue
4. Console logs will show detailed axios error codes

## User Experience
- **Success case**: Weather loads in ~1-3 seconds (typical)
- **Slow API case**: Weather loads in up to 10 seconds
- **Timeout case**: Clear error message after 12 seconds with retry option
- **Service down**: Helpful message indicating temporary unavailability

## No Action Needed
Backend should auto-reload with TypeScript watch. Frontend changes are instant.
Simply refresh the Dashboard page to test the fixes.
