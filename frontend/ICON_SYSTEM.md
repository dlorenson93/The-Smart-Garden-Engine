# Terra Plantari Custom Icon System

## Overview
Custom SVG icon set designed specifically for Terra Plantari's "Your Gardens" overview card, featuring nature-inspired, scalable icons that align with the brand's green/purple color palette.

---

## 🎨 Icons

### 1. GardenIcon
**Purpose:** Represents a garden area or property  
**Visual:** House with greenery and plants  
**Default Color:** `#22C55E` (Terra Plantari green)  
**Usage:** Gardens count display

### 2. BedIcon
**Purpose:** Represents raised beds or planting rows  
**Visual:** Rectangular raised bed with soil rows and small sprouts  
**Default Color:** `#3b82f6` (blue)  
**Usage:** Beds count display

### 3. PlantingIcon
**Purpose:** Represents active plantings  
**Visual:** Sprouting plant with leaves emerging from soil  
**Default Color:** `#8b5cf6` (Terra Plantari purple)  
**Usage:** Plantings count display  
**Special:** Gentle pulse animation (3s infinite)

---

## 📦 Installation & Usage

### Import Icons
```tsx
import { GardenIcon, BedIcon, PlantingIcon } from '@/components/icons';
```

### Basic Usage
```tsx
<GardenIcon size={32} />
<BedIcon size={32} style={{ color: '#3b82f6' }} />
<PlantingIcon size={48} className="custom-class" />
```

### Props Interface
```typescript
interface IconProps {
  size?: number;         // Default: 32px
  className?: string;    // Additional CSS classes
  style?: React.CSSProperties;  // Inline styles
}
```

---

## 🎯 Design Features

### Color System
- **Primary Green:** `#22C55E` - Used for Garden icons
- **Accent Purple:** `#8B5CF6` - Used for Planting icons
- **Blue:** `#3b82f6` - Used for Bed icons
- **Gradient Support:** Icons use `url(#gradient-id)` for subtle multi-tone effects
- **CurrentColor Support:** Icons respect parent text color when using `currentColor`

### Responsive Behavior
- **Desktop:** Default 32px (customizable)
- **Mobile (<640px):** Automatically scales to 28px
- **Scalable:** SVG-based, perfect quality at any size

### Hover & Animation
- **Scale Transform:** 1.05x on hover
- **Brightness:** 1.1x on hover
- **Transition:** 0.3s ease
- **Focus Ring:** 2px solid primary color with 4px offset (accessibility)
- **Planting Animation:** Gentle pulse (3s loop) to convey "living/growing"

### Accessibility
- **Reduced Motion:** Animations disabled for users who prefer reduced motion
- **Focus Visible:** Clear focus indicators for keyboard navigation
- **Semantic SVG:** Proper viewBox and aria attributes

---

## 📂 File Structure

```
frontend/src/components/icons/
├── GardenIcon.tsx        # Garden/property icon
├── BedIcon.tsx           # Raised bed icon
├── PlantingIcon.tsx      # Active planting icon
├── icons.css             # Hover animations & responsive styles
└── index.ts              # Barrel export
```

---

## 🔧 Customization Examples

### Single Color Mode
```tsx
<GardenIcon size={40} style={{ color: '#10b981' }} />
```

### Custom Size
```tsx
<BedIcon size={64} />
```

### With Custom Classes
```tsx
<PlantingIcon className="my-custom-icon" size={32} />
```

### Disable Animation (Planting Icon)
```tsx
<PlantingIcon style={{ animation: 'none' }} size={32} />
```

---

## 🌐 Integration Points

### Current Usage
- **Dashboard:** GardensOverviewCard component
  - Header: Large GardenIcon (64px) with vineyard background
  - Stats: Three stat cards with respective icons (32px each)
  
### Potential Future Usage
- Command Center stat cards
- Gardens page headers
- Mobile navigation
- Loading states
- Empty states

---

## 🎨 Design Principles

1. **Rounded & Friendly:** No sharp angles, soft curves throughout
2. **Consistent Weight:** All icons use 1.5px stroke width
3. **Nature-Inspired:** Organic shapes, botanical elements
4. **Scalable:** Pure SVG, viewBox-based (0 0 32 32)
5. **Layered Composition:** Multiple gradients/layers for depth
6. **Brand Alignment:** Colors match Terra Plantari's primary palette
7. **Performance:** Inline SVG, no external image requests
8. **Accessible:** Keyboard navigable, reduced motion support

---

## 🚀 Performance Notes

- **Bundle Size:** Minimal (~1KB per icon when tree-shaken)
- **Rendering:** Inline SVG, no HTTP requests
- **Animation:** CSS-based, GPU-accelerated
- **Lazy Loading:** Not needed (components are small)

---

## 📱 Mobile Optimizations

```css
@media (max-width: 640px) {
  /* Icons automatically scale to 28px */
  .garden-icon, .bed-icon, .planting-icon {
    width: 28px;
    height: 28px;
  }
  
  /* Stat cards adjust font sizes */
  .stat-card {
    padding: var(--space-2);
  }
}
```

---

## 🔮 Future Enhancements

- [ ] Add SeedIcon for seed inventory
- [ ] Add WeatherIcon set (sun, rain, cloud)
- [ ] Add TaskIcon variants (watering, harvesting, pruning)
- [ ] Create icon animation library (grow, bloom, harvest)
- [ ] Add dark mode variants
- [ ] Build Storybook documentation
- [ ] Add SVG sprite sheet for performance

---

## 📝 Maintenance

### Adding New Icons
1. Create `NewIcon.tsx` in `/components/icons/`
2. Follow existing structure (size, className, style props)
3. Use 1.5px stroke width
4. Add to `index.ts` barrel export
5. Define gradients in `<defs>` section
6. Add hover styles to `icons.css`
7. Document in this README

### Modifying Existing Icons
1. Update SVG paths in component file
2. Test at multiple sizes (24px, 32px, 48px, 64px)
3. Verify mobile responsiveness
4. Check accessibility (focus rings, reduced motion)
5. Update version notes

---

## 🎯 Success Metrics

✅ **Replaced emoji usage** - More professional appearance  
✅ **Brand consistency** - Matches Terra Plantari colors  
✅ **Scalability** - Works perfectly from 24px to 128px  
✅ **Performance** - Zero HTTP requests, minimal bundle size  
✅ **Accessibility** - Keyboard navigation, reduced motion support  
✅ **Mobile-optimized** - Responsive sizing, touch-friendly  
✅ **Reusability** - Can be used across entire application  
✅ **Maintainability** - Clean, documented, easy to extend  

---

**Version:** 1.0.0  
**Created:** December 12, 2025  
**Status:** ✅ Production Ready
