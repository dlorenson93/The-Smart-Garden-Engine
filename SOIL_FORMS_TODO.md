# Soil Intelligence - Next Steps: Form Components

## Overview
The Soil Intelligence feature is **95% complete**. The remaining 5% consists of form components that allow users to input data. These can be built incrementally without blocking the main feature.

---

## 🎯 Priority 1: Add Soil Test Form

### Component: `AddSoilTestForm.tsx`

**Location:** `frontend/src/components/soil/forms/AddSoilTestForm.tsx`

**Props:**
```typescript
interface AddSoilTestFormProps {
  scopeType: 'garden' | 'bed';
  scopeId: string;
  onSuccess: () => void;
  onCancel: () => void;
}
```

**Fields:**
- Test Date (date picker, required)
- pH (number input, 3.0-9.0, optional)
- Nitrogen (N) (number input, optional)
- Phosphorus (P) (number input, optional)
- Potassium (K) (number input, optional)
- Moisture % (number input, 0-100, optional)
- Salinity (number input, optional)
- Test Source (dropdown: manual, kit, lab, sensor, required)
- Notes (textarea, optional)

**Validation:**
- At least ONE value (pH, N, P, K, moisture, or salinity) must be entered
- pH must be between 3.0 and 9.0
- Moisture must be between 0 and 100
- Test date cannot be in the future

**API Call:**
```typescript
await soilApi.addTest({
  scopeType,
  scopeId,
  testDate: new Date(testDate).toISOString(),
  ph,
  nitrogen,
  phosphorus,
  potassium,
  moisture,
  salinity,
  source,
  notes,
});
```

**Integration Points:**
1. Import in `Soil.tsx`
2. Show modal when "+ Add Test" button clicked (line ~269)
3. On success, refresh tests list: `await loadSoilData()`

**Styling:**
- Modal overlay with centered form
- 2-column grid for N/P/K values
- Purple button for submit (matches theme)
- Validation errors in red below fields

---

## 🎯 Priority 2: Log Amendment Form

### Component: `AddSoilEventForm.tsx`

**Location:** `frontend/src/components/soil/forms/AddSoilEventForm.tsx`

**Props:**
```typescript
interface AddSoilEventFormProps {
  scopeType: 'garden' | 'bed';
  scopeId: string;
  onSuccess: () => void;
  onCancel: () => void;
  prefillType?: string; // For pre-filling from recommendations
  prefillAmount?: string;
}
```

**Fields:**
- Event Type (dropdown: compost, lime, sulfur, fertilizer, mulch, amendment, required)
- Amount (text input, human-readable like "2 cups" or "5 lbs", required)
- Event Date (date picker, required)
- Notes (textarea, optional)

**API Call:**
```typescript
await soilApi.addEvent({
  scopeType,
  scopeId,
  eventType,
  amount,
  eventDate: new Date(eventDate).toISOString(),
  notes,
});
```

**Integration Points:**
1. Import in `Soil.tsx`
2. Show modal when "+ Log Amendment" button clicked (line ~293)
3. Also show from recommended actions: "I did this" button
4. On success, refresh events list

**Pre-fill Logic:**
If user clicks "I did this" from a recommendation:
- Pre-fill event type based on action title:
  - "Add lime" → lime
  - "Add sulfur" → sulfur
  - "Add compost" → compost
- Pre-fill amount from action.howTo (extract "5 lbs" pattern)

---

## 🎯 Priority 3: Edit Soil Profile Form

### Component: `EditSoilProfileForm.tsx`

**Location:** `frontend/src/components/soil/forms/EditSoilProfileForm.tsx`

**Props:**
```typescript
interface EditSoilProfileFormProps {
  scopeType: 'garden' | 'bed';
  scopeId: string;
  currentProfile: SoilProfile | null;
  onSuccess: () => void;
  onCancel: () => void;
}
```

**Fields:**
- Soil Type (dropdown: Loam, Clay, Sandy, Silt, Peaty, Chalky, optional)
- Texture (text input, optional, placeholder: "e.g., sandy loam")
- Drainage (radio buttons: Poor, Average, Well, optional)
- pH (number input, 3.0-9.0, optional)
- Organic Matter % (number input, 0-100, optional)
- Notes (textarea, optional)

**Pre-fill:**
If `currentProfile` exists, pre-fill all fields with current values

**API Call:**
```typescript
await soilApi.updateProfile(scopeType, scopeId, {
  soilType,
  texture,
  drainage,
  ph,
  organicMatter,
  notes,
});
```

**Integration Points:**
1. Import in `Soil.tsx`
2. Add "Edit Profile" button near summary card
3. On success, refresh profile: `await loadSoilData()`

**Styling:**
- Larger modal (more fields)
- Radio buttons horizontal for drainage
- Dropdown with nice icons for soil types
- Help text for each field explaining what it means

---

## 🎯 Priority 4: Scope Selector

### Component: `ScopeSelectorGrid.tsx`

**Location:** `frontend/src/components/soil/ScopeSelectorGrid.tsx`

**Props:**
```typescript
interface ScopeSelectorGridProps {
  gardens: Array<{ id: string; name: string; beds: Array<{ id: string; name: string }> }>;
  onSelect: (type: 'garden' | 'bed', id: string, name: string) => void;
}
```

**Layout:**
```
[Garden 1 Card] [Garden 2 Card]
  → [Bed 1.1] [Bed 1.2]
[Garden 3 Card]
  → [Bed 3.1]
```

**Card Design:**
- Garden cards: Green border, 🏡 icon
- Bed cards: Slightly smaller, indented, 🌿 icon
- Hover effect: Lift + shadow
- Active state: Purple border

**Implementation:**
```typescript
<div className="scope-selector-grid">
  {gardens.map(garden => (
    <div key={garden.id}>
      <button 
        className="scope-card garden-card"
        onClick={() => onSelect('garden', garden.id, garden.name)}
      >
        🏡 {garden.name}
      </button>
      
      <div className="beds-grid">
        {garden.beds.map(bed => (
          <button
            key={bed.id}
            className="scope-card bed-card"
            onClick={() => onSelect('bed', bed.id, bed.name)}
          >
            🌿 {bed.name}
          </button>
        ))}
      </div>
    </div>
  ))}
</div>
```

**Integration:**
1. Import in `Soil.tsx`
2. Replace `<p>Garden selector will go here</p>` (line ~105)
3. Load gardens with beds in useEffect
4. OnSelect: Update `selectedScope` state

---

## 🎯 Optional: Quick Action Buttons

### Add to Recommended Actions

**Current:** Actions just show text

**Enhancement:** Add action buttons

```typescript
<div className="action-buttons">
  <button 
    className="btn btn-primary btn-small"
    onClick={() => handleCreateTask(action)}
  >
    Create Task
  </button>
  
  <button 
    className="btn btn-secondary btn-small"
    onClick={() => handleMarkDone(action)}
  >
    I Did This
  </button>
  
  {action.linkToMarketplace && (
    <a href={action.linkToMarketplace} className="btn btn-link btn-small">
      Shop Products
    </a>
  )}
</div>
```

**Handler:**
```typescript
const handleCreateTask = (action: RecommendedAction) => {
  // Navigate to tasks page with pre-filled form
  navigate('/tasks/new', {
    state: {
      title: action.title,
      description: action.howTo,
      type: 'general',
      plantingId: null, // Not linked to specific planting
    }
  });
};

const handleMarkDone = (action: RecommendedAction) => {
  // Open AddSoilEventForm with pre-filled data
  // Extract event type from action.title:
  // "Add lime" → lime
  // "Add compost" → compost
  setEventFormOpen(true);
  setPrefillData({
    type: extractEventType(action.title),
    amount: extractAmount(action.howTo),
  });
};
```

---

## 🎨 Reusable Form Components

### Create a base Modal component

**File:** `frontend/src/components/ui/Modal.tsx`

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}
```

**Usage:**
```typescript
<Modal isOpen={testFormOpen} onClose={() => setTestFormOpen(false)} title="Add Soil Test">
  <AddSoilTestForm 
    scopeType={selectedScope.type}
    scopeId={selectedScope.id}
    onSuccess={() => {
      setTestFormOpen(false);
      loadSoilData();
    }}
    onCancel={() => setTestFormOpen(false)}
  />
</Modal>
```

**Benefits:**
- Consistent modal styling
- Accessibility (ESC to close, focus trap)
- Backdrop click to close
- Animation (fade in/out)

---

## 📝 Implementation Order

1. **Modal component** (30 min) - Reusable foundation
2. **ScopeSelectorGrid** (45 min) - Unblocks testing
3. **AddSoilTestForm** (1.5 hr) - Core functionality
4. **AddSoilEventForm** (1 hr) - Core functionality
5. **EditSoilProfileForm** (1 hr) - Nice to have
6. **Quick Action Buttons** (30 min) - Polish

**Total estimated time: 5.5 hours**

---

## 🧪 Testing After Forms

1. Create a garden (if not already)
2. Navigate to /soil
3. Select garden from grid
4. Click "Edit Profile" → Fill in soil type, drainage, pH → Save
5. See health score appear
6. Click "+ Add Test" → Log pH test → See in Tests tab
7. Go to Overview tab → See recommendation
8. Click "Create Task" → Verify task created
9. Click "I Did This" → Log amendment → See in Amendments tab
10. Check Crop Fit tab → See recommendations

---

## 💡 Tips for Development

### Form Validation Pattern
```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

const validate = () => {
  const newErrors: Record<string, string> = {};
  
  if (!testDate) {
    newErrors.testDate = 'Test date is required';
  }
  
  if (ph && (ph < 3.0 || ph > 9.0)) {
    newErrors.ph = 'pH must be between 3.0 and 9.0';
  }
  
  if (!ph && !nitrogen && !phosphorus && !potassium && !moisture) {
    newErrors.values = 'At least one test value is required';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;
  
  try {
    await soilApi.addTest({ ... });
    onSuccess();
  } catch (error) {
    setErrors({ submit: 'Failed to save test' });
  }
};
```

### Loading State Pattern
```typescript
const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  
  try {
    await soilApi.addTest({ ... });
    onSuccess();
  } catch (error) {
    setErrors({ submit: error.message });
  } finally {
    setSubmitting(false);
  }
};

// In JSX:
<button type="submit" disabled={submitting}>
  {submitting ? 'Saving...' : 'Save Test'}
</button>
```

### Date Input Helper
```typescript
const formatDateForInput = (date: Date) => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const today = formatDateForInput(new Date());

<input 
  type="date" 
  max={today} 
  value={testDate}
  onChange={(e) => setTestDate(e.target.value)}
/>
```

---

## 📚 Reference

**API Methods Available:**
- `soilApi.updateProfile(scopeType, scopeId, data)`
- `soilApi.addTest(data)`
- `soilApi.addEvent(data)`

**Type Definitions:**
- See `frontend/src/types/soil.ts`
- Constants: `SOIL_TYPES`, `DRAINAGE_OPTIONS`, `EVENT_TYPES`, `TEST_SOURCES`

**Existing Components to Study:**
- Dashboard cards: `frontend/src/components/dashboard/cards/`
- Layout modal: Check if there's an existing modal component
- Form patterns: Look at Seeds or Tasks forms for reference

---

*These forms are the final 5% needed to make Soil Intelligence fully user-interactive.*
*The core system (scoring, API, display) is already complete and functional.*
