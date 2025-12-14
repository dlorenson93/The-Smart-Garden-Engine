# Garden Tab - Visual Layout Guide

## Overview Tab Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Garden Detail Page                                    [Delete] │
│  Backyard Garden                                                │
│  "My main vegetable growing area"                               │
├─────────────────────────────────────────────────────────────────┤
│  🌱 Garden Health                                               │
│  🌍 Soil Intelligence    🌰 Seed Inventory                      │
├─────────────────────────────────────────────────────────────────┤
│  [Overview] [Beds List] [Garden Layout] [AI Assistant]         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ 🏡 Your Gardens      │  │ 🌱 Garden Health     │            │
│  │                      │  │                      │            │
│  │ Backyard Garden      │  │ Overall status       │            │
│  │ "My main vegetable   │  │                      │            │
│  │  growing area"       │  │ ⚠️ 2 Plants Need    │            │
│  │                      │  │    Attention         │            │
│  │ 4 Beds | 12 Plantings│  │                      │            │
│  │                      │  │ 🎉 3 Crops Ready    │            │
│  │ ZIP: 12345           │  │    Soon              │            │
│  │ Zone 6a              │  │                      │            │
│  │                      │  │ [12 Growing]         │            │
│  │ [Manage Beds →]      │  │ [3 Harvest Soon]     │            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ 🌍 Soil Intelligence │  │ 💧 Smart Watering    │            │
│  │                      │  │                      │            │
│  │ Track soil health,   │  │ Recommendations      │            │
│  │ amendments, and test │  │ based on weather and │            │
│  │ results              │  │ plant needs          │            │
│  │                      │  │                      │            │
│  │ [Manage Soil Data]   │  │ Coming soon...       │            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ 🌿 Plant             │  │ 📸 Photo Journal     │            │
│  │    Recommendations   │  │                      │            │
│  │                      │  │ Track growth         │            │
│  │ What to plant next   │  │ progress with photos │            │
│  │ based on season,     │  │ over time            │            │
│  │ zone, and space      │  │                      │            │
│  │                      │  │ Document 12 active   │            │
│  │ [Browse Seeds →]     │  │ plantings            │            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🌱 Ask Terra AI                                           │ │
│  │                                                           │ │
│  │ Using: 🏡 Backyard Garden • 4 beds • 12 plantings • 6a   │ │
│  │                                                           │ │
│  │ How can I help your garden today?                        │ │
│  │                                                           │ │
│  │ ┌───────────────────────────────────────────────────┐   │ │
│  │ │  Chat Window (scrollable)                         │   │ │
│  │ │                                                   │   │ │
│  │ │  ┌────────────────────────────────┐              │   │ │
│  │ │  │ You: When should I water       │              │   │ │
│  │ │  │      my tomatoes?              │              │   │ │
│  │ │  └────────────────────────────────┘              │   │ │
│  │ │                                                   │   │ │
│  │ │  ┌────────────────────────────────┐              │   │ │
│  │ │  │ Terra AI:                      │              │   │ │
│  │ │  │ Water tomatoes deeply 1-2      │              │   │ │
│  │ │  │ times per week, about 1-2      │              │   │ │
│  │ │  │ inches total. Check soil       │              │   │ │
│  │ │  │ moisture before watering...    │              │   │ │
│  │ │  │                     10:23 AM   │              │   │ │
│  │ │  └────────────────────────────────┘              │   │ │
│  │ └───────────────────────────────────────────────────┘   │ │
│  │                                                           │ │
│  │ Quick questions:                                          │ │
│  │ [What should I plant this month?] [How often water?]     │ │
│  │ [Tips for soil health?]                                   │ │
│  │                                                           │ │
│  │ ┌────────────────────────────────────────┐ [📤]          │ │
│  │ │ Ask about your garden...               │               │ │
│  │ └────────────────────────────────────────┘               │ │
│  │                                                           │ │
│  │            Open Full Assistant →                          │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Responsive Behavior

### Desktop (≥768px)
- **2 columns**: Cards arranged in 2-column grid
- **Ask Terra AI**: Spans full width (both columns)
- **Minimum card width**: 400px
- **Grid auto-fits** based on screen width

### Tablet (600-767px)
- **1-2 columns**: Auto-adjusts based on available space
- Cards may stack to single column as needed

### Mobile (<600px)
- **1 column**: All cards stack vertically
- **Full width**: Each card takes full container width
- **Touch-friendly**: Larger tap targets, appropriate spacing

## Color Scheme

### Chat Bubbles
- **User messages**: Light green background (#d1fae5)
- **AI responses**: White with light gray border
- **Context strip**: Light muted background

### Cards
- **Default background**: White
- **Hover state**: Primary color tint
- **Border**: Light gray (var(--color-border-light))

### Status Indicators
- **Success/Healthy**: Green (#10b981)
- **Warning/Attention**: Yellow/Orange
- **Info/Harvest**: Blue/Primary
- **Critical**: Red

## Typography

### Card Titles
- **Size**: var(--text-lg) to var(--text-xl)
- **Weight**: Semibold (600)
- **Icon**: Emoji prefix (🏡, 🌱, etc.)

### Body Text
- **Size**: var(--text-base) (0.95-1rem)
- **Color**: var(--color-text-secondary)
- **Line height**: 1.6 for readability

### Stats
- **Number size**: var(--text-2xl)
- **Number weight**: Bold (700)
- **Label size**: var(--text-sm)
- **Label color**: Muted

## Spacing

### Card Grid
- **Gap**: var(--space-6) (1.5rem)
- **Card padding**: var(--space-4) to var(--space-6)

### Internal Spacing
- **Section margins**: var(--space-4) (1rem)
- **Element gaps**: var(--space-2) to var(--space-3)

### Chat Window
- **Height**: 280-320px (scrollable)
- **Message margin**: var(--space-4)
- **Bubble padding**: 0.75rem 1rem

## Interactive Elements

### Buttons
- **Primary**: Green background, white text
- **Outline**: White background, primary border
- **Ghost**: Transparent, text only
- **Hover**: Scale/color transition (0.2s)

### Links
- **Color**: Primary (var(--color-primary))
- **Underline**: On hover
- **Arrow**: Right arrow → for navigation

### Suggested Prompts
- **Style**: Pill-shaped buttons
- **Background**: White with light border
- **Hover**: Primary color tint
- **Responsive**: Wrap on small screens

## Accessibility

### Screen Readers
- Proper semantic HTML (headers, sections, lists)
- ARIA labels where needed
- Form labels associated with inputs

### Keyboard Navigation
- Tab order follows visual layout
- Enter/Space for button activation
- Escape to dismiss modals (future)

### Touch Targets
- Minimum 44x44px for mobile
- Adequate spacing between clickable elements

## Animation & Transitions

### Hover Effects
- **Duration**: 0.2s
- **Easing**: ease-in-out
- **Properties**: background-color, border-color, transform

### Chat Auto-scroll
- **Behavior**: smooth
- **Trigger**: New message added
- **Target**: Bottom of chat window

### Loading States
- Disabled buttons during async operations
- Loading text ("Looking at your garden...")
- Skeleton loaders (future enhancement)

## Data Flow

```
User clicks garden → GardenDetail loads
  ↓
Fetches garden data (beds, plantings, stats)
  ↓
Renders Overview tab (GardenTab component)
  ↓
GardenTab calculates stats:
  - Bed count
  - Active plantings
  - Stressed plants
  - Harvest soon count
  ↓
Passes props to AskTerraAICard
  ↓
Card loads scoped chat history:
  GET /api/v1/ai/history?scope_type=garden&scope_id={id}
  ↓
Displays chat messages + suggested prompts
  ↓
User sends message:
  POST /api/v1/ai/ask {
    question, gardenId, scope_type, scope_id
  }
  ↓
Response added to chat window
  ↓
Auto-scroll to new message
```

## Edge Cases Handled

1. **No chat history**: Shows welcome message and suggestions
2. **No active plantings**: Adjusts suggestions accordingly
3. **No location data**: Hides zone-specific info
4. **Loading states**: Shows "Loading..." during async ops
5. **API errors**: Console logs, user sees last valid state
6. **Empty garden**: Still shows cards with zero counts

## Future Enhancements

- [ ] Photo upload for Photo Journal card
- [ ] Real-time watering schedule calculations
- [ ] Plant recommendation algorithm
- [ ] Soil test data visualization
- [ ] Weather integration for Smart Watering
- [ ] Push notifications for harvest alerts
- [ ] Pagination for long chat histories
- [ ] Export chat history feature
- [ ] Voice input for questions
- [ ] Image analysis for pest/disease detection
