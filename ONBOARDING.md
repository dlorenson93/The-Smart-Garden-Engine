# Terra Plantari Onboarding Flow

## Overview
A 4-screen swipeable carousel that introduces new users to Terra Plantari's core features and climate impact mission.

## Implementation Details

### Files Created

#### Illustration Components
- **WelcomeIllustration.tsx** - Cute Earth character with sprout
- **ClimateIllustration.tsx** - Green sprout emerging from soil with sun
- **GardenBedIllustration.tsx** - Wooden raised garden bed with planted rows
- **OnTrackIllustration.tsx** - Garden bed with "On Track" checkmark sign

#### Main Components
- **Onboarding.tsx** - Main carousel page with swipe gestures
- **onboarding.css** - Mobile-first responsive styles

### Files Modified

#### Login.tsx
- Added onboarding completion check after successful login
- Routes to `/onboarding` if not completed, `/dashboard` if completed
- Uses localStorage key: `tp_onboarded_${userId}`

#### AuthContext.tsx
- Updated `login()` return type to `Promise<User>`
- Now returns user data after successful login

#### App.tsx
- Added `/onboarding` route with ProtectedRoute wrapper
- Imported Onboarding component

## User Flow

1. **New User Login**
   ```
   Login → Check localStorage → /onboarding (first time)
   ```

2. **Returning User Login**
   ```
   Login → Check localStorage → /dashboard (has key)
   ```

3. **Onboarding Completion**
   ```
   4th screen "Let's Go!" → localStorage.setItem() → /dashboard
   ```

## Features

### Carousel
- ✅ 4 screens with unique illustrations and backgrounds
- ✅ Swipe gestures (left/right)
- ✅ Progress dots (4 dots, active state)
- ✅ Back/Next navigation buttons
- ✅ Skip button (screens 1-3)
- ✅ "Let's Go!" final button (screen 4)

### Illustrations
- ✅ SVG-based (no external assets)
- ✅ Responsive sizing (280-340px)
- ✅ Warm, friendly aesthetics
- ✅ Brand colors: green (#22C55E), purple (#8B5CF6)

### Storage
- ✅ localStorage persistence per user
- ✅ Key format: `tp_onboarded_${userId}`
- ✅ Set on completion only

### Accessibility
- ✅ ARIA labels on all interactive elements
- ✅ aria-current for active dots
- ✅ Reduced motion support
- ✅ Touch-friendly button sizes (min 48px)

## Screen Details

### Screen 1: Welcome
- **Background**: Cream (#FFF8E1)
- **Illustration**: Earth with face + sprout
- **Title**: "Welcome to Terra Plantari"
- **Description**: Climate-aware garden companion

### Screen 2: Climate Impact
- **Background**: Light green (#E8F5E9)
- **Illustration**: Sprout with sun rays
- **Title**: "Track Your Climate Impact"
- **Description**: Monitor carbon, water, food miles

### Screen 3: Garden Management
- **Background**: Light blue (#E3F2FD)
- **Illustration**: Raised bed with plants
- **Title**: "Manage Multiple Gardens"
- **Description**: Create gardens, organize beds

### Screen 4: On Track
- **Background**: Light purple (#F3E5F5)
- **Illustration**: Garden bed + checkmark sign
- **Title**: "You're On Track!"
- **Description**: Seasonal tips and reminders

## localStorage Key Structure

```typescript
// Set on completion
localStorage.setItem(`tp_onboarded_${user.id}`, 'true');

// Check on login
const hasOnboarded = localStorage.getItem(`tp_onboarded_${user.id}`);
```

## Testing Instructions

1. **First-time User**
   - Clear localStorage (DevTools)
   - Login → should route to `/onboarding`
   - Complete all 4 screens → should route to `/dashboard`
   - Check localStorage for `tp_onboarded_<userId>` key

2. **Returning User**
   - Login → should skip onboarding, go straight to `/dashboard`

3. **Skip Button**
   - Click "Skip" on screen 1-3 → should complete onboarding

4. **Swipe Gestures**
   - Swipe left → next screen
   - Swipe right → previous screen
   - Test on mobile/touch device

## Constraints Met

✅ No changes to login/signup forms
✅ No changes to forgot password flow
✅ Only added routing logic after successful login
✅ localStorage per user (not global)
✅ No external image dependencies (SVG only)
✅ Mobile-first responsive design
✅ Accessibility compliant

## Future Enhancements (Optional)

- Add animations between screens (fade/slide)
- Add confetti effect on completion
- Add keyboard navigation (arrow keys)
- Add auto-advance timer option
- Add video/GIF support for illustrations
- Add analytics tracking for completion rate
