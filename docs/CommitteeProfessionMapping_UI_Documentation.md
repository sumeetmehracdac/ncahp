# Committee-Profession Mapping — Comprehensive UI Documentation

> **Target Stack**: React 19 + Vite + JSX  
> **Purpose**: This document provides an exhaustive specification to replicate the UI/UX of the Committee-Profession Mapping module in any frontend codebase.

---

## 1. Module Overview

A **many-to-many mapping interface** that allows administrators to associate regulatory committees with healthcare professions. The UI follows a **split-panel layout**:

| Panel | Purpose |
|-------|---------|
| **Left (33% width)** | Selectable list of committees |
| **Right (67% width)** | Categorized professions with mapping controls |

---

## 2. Page Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Header (global navigation)                                 │
├─────────────────────────────────────────────────────────────┤
│  Hero Section (gradient banner with stats)                  │
├─────────────────────────────────────────────────────────────┤
│  Main Content                                               │
│  ┌─────────────┬───────────────────────────────────────┐    │
│  │ Committees  │  Professions Panel                    │    │
│  │ Panel       │  (search, categories, profession      │    │
│  │ (sticky)    │   cards grouped by category)          │    │
│  └─────────────┴───────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  Footer                                                     │
└─────────────────────────────────────────────────────────────┘
```

### 2.1 Grid System
```css
/* Main container */
.main-content {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem; /* 24px */
}

/* Left panel: 4 columns on lg+ */
.committees-panel { grid-column: span 4; }

/* Right panel: 8 columns on lg+ */
.professions-panel { grid-column: span 8; }

/* Responsive: stack on mobile */
@media (max-width: 1024px) {
  .committees-panel,
  .professions-panel { grid-column: span 12; }
}
```

---

## 3. Loading State (Skeleton)

Display skeleton UI for **1200ms** on initial load.

### 3.1 Hero Skeleton
- Gradient background: `from-teal-700 via-teal-600 to-teal-700`
- Center-aligned placeholders:
  - Title: `h-10 w-96`
  - Subtitle: `h-5 w-[500px]`
- 3 stat boxes: `h-12 w-20` each with `h-4 w-24` label below

### 3.2 Committees Panel Skeleton
- Header: title `h-6 w-32`, button `h-9 w-36`, search `h-10 w-full`
- 8 committee cards: each with icon `h-10 w-10`, title `h-4 w-3/4`, subtitle `h-3 w-1/2`

### 3.3 Professions Panel Skeleton
- Header: title `h-6 w-48`, badge `h-5 w-16`, 3 toggle buttons `h-9 w-9` each
- Search row: input `h-10 flex-1`, filter button `h-10 w-32`
- 4 category sections, each containing 6 profession skeleton cards

---

## 4. Hero Section

### 4.1 Container Styling
```css
.hero {
  position: relative;
  background: linear-gradient(to bottom-right, 
    var(--primary), 
    var(--primary), 
    var(--primary-80)
  );
  color: var(--primary-foreground);
  overflow: hidden;
}

/* Background grid overlay */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/grid.svg');
  opacity: 0.1;
}

/* Gradient overlay */
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(primary, 0.5), transparent);
}
```

### 4.2 Hero Content
```
┌──────────────────────────────────────────────────────────┐
│  [Link2 Icon] in glass box    [Badge: Many-to-Many]     │
│                                                          │
│  Committee-Profession Mapping  (h1, font-serif, bold)   │
│  Description text (text-lg, 80% white opacity)          │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ 🏢 10       │  │ 👥 57       │  │ 🔗 X        │      │
│  │ Committees  │  │ Professions │  │ Active Maps │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└──────────────────────────────────────────────────────────┘
```

### 4.3 Stats Boxes
```css
.stat-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
}

.stat-box .icon { color: rgba(255, 255, 255, 0.7); }
.stat-box .value { font-weight: 600; }
.stat-box .label { color: rgba(255, 255, 255, 0.7); }
```

---

## 5. Committees Panel (Left)

### 5.1 Card Container
```css
.committees-card {
  background: var(--card);
  border-radius: 1rem; /* 16px */
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
  position: sticky;
  top: 1rem;
}
```

### 5.2 Header Section
| Element | Specification |
|---------|---------------|
| Title | "Committees" with Building2 icon |
| Add Button | Primary, small, icon + "Add" text |
| Search Input | Icon-left, placeholder "Search committees..." |

### 5.3 Committee List Item

```
┌────────────────────────────────────────────────────────┐
│ │  ┌────┐                                        ✓    │
│ ▌  │NAC │  National Advisory Committee              ◉ │
│ │  └────┘  Provides strategic guidance...             │
│            [🔗 5 mapped]                              │
└────────────────────────────────────────────────────────┘
  ↑     ↑           ↑              ↑            ↑
  │     │           │              │            └── Selection checkmark (abs positioned, -top-1 -right-1)
  │     │           │              └── Mapping count badge
  │     │           └── Description (text-xs, muted, line-clamp-2)
  │     └── Short name badge (colored background from committee.color)
  └── Selection indicator bar (w-1, h-8, primary color when selected)
```

### 5.4 Committee Item States

| State | Styling |
|-------|---------|
| **Default** | `bg-background`, `border-transparent`, hover: `border-border`, `bg-muted/50` |
| **Selected** | `bg-primary/5`, `border-primary`, `shadow-md shadow-primary/10` |
| **Selection Bar** | Vertical bar on left, `w-1 h-8`, primary color when selected |
| **Checkmark** | Absolute positioned circle at top-right, primary bg with Check icon |

### 5.5 Committee Short Name Badge
```css
.committee-badge {
  width: 2.5rem; /* 40px */
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  background-color: /* dynamic from committee.color */;
  flex-shrink: 0;
}
```

### 5.6 Mapping Count Badge
```css
.mapping-badge {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  /* Uses default secondary variant - no custom inline colors */
}
```

### 5.7 Animation Specs
| Animation | Trigger | Properties |
|-----------|---------|------------|
| List item entry | Mount | `opacity: 0 → 1`, `y: 10 → 0`, duration: 0.2s, stagger: 0.02s |
| List item exit | Unmount | `opacity: 1 → 0`, `scale: 1 → 0.95` |
| Selection checkmark | Selection | `scale: 0 → 1` |

---

## 6. Professions Panel (Right)

### 6.1 Header Section

```
┌─────────────────────────────────────────────────────────────┐
│  👥 Allied & Healthcare Professions [57 total]   [≡][☰] [⚙] │
│                                                              │
│  🔍 Search professions...                                    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  [NAC]  Mapping to: National Advisory Committee      │   │
│  │         2 of 57 professions mapped       [4% coverage]│   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Toolbar Elements

| Element | Description |
|---------|-------------|
| **Title** | "Allied & Healthcare Professions" with Users icon |
| **Count Badge** | Outline variant, shows total count |
| **View Toggle** | 2-button group (Grid/List icons), bg-muted container |
| **Filter Button** | "Show Mapped" / "Showing Mapped", disabled when no committee selected |

### 6.3 Search Functionality
- Searches by: **profession name** OR **category name** OR **category shortName**
- When category matches, all professions in that category appear

### 6.4 Selected Committee Indicator
```css
.selected-indicator {
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: rgba(primary, 0.05);
  border: 1px solid rgba(primary, 0.2);
}
```

Shows:
- Committee short badge (colored)
- "Mapping to: [Committee Name]"
- "X of Y professions mapped"
- Coverage percentage badge

### 6.5 Empty State (No Committee Selected)
```
┌──────────────────────────────────────────────────────────┐
│  →  Select a committee from the left panel to start     │
│     mapping professions                                  │
└──────────────────────────────────────────────────────────┘
```
- Muted background, dashed border
- ArrowRight icon + helper text

---

## 7. Profession Categories (Collapsible Sections)

### 7.1 Category Header

```
┌────────────────────────────────────────────────────────────┐
│  [▼] Medical Laboratory & Life Sciences                    │
│      11 professions • 2 mapped              [Map All]      │
└────────────────────────────────────────────────────────────┘
```

### 7.2 Category Header States

| State | Icon Background | Icon Color |
|-------|-----------------|------------|
| **No mappings** | `bg-muted` | `text-muted-foreground` |
| **Partially mapped** | `bg-amber-100` | `text-amber-600` |
| **Fully mapped** | `bg-green-100` | `text-green-600` |

### 7.3 Category Actions
| Condition | Button |
|-----------|--------|
| Not all mapped | "Map All" with Link2 icon |
| All mapped | "Unmap All" with Link2Off icon |

### 7.4 Category Animation
- Collapsible with chevron rotation
- ChevronRight when collapsed, ChevronDown when expanded

---

## 8. Profession Cards

### 8.1 Grid vs List Layout
```css
/* Grid mode */
.professions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

@media (max-width: 1280px) { 
  .professions-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) { 
  .professions-grid { grid-template-columns: repeat(1, 1fr); }
}

/* List mode */
.professions-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
```

### 8.2 Profession Card Structure

```
┌─────────────────────────────────────────────┐
│  ┌────┐                                     │
│  │ 🔬 │  Biotechnologist              [○]   │
│  └────┘                               [✓]   │
└─────────────────────────────────────────────┘
     ↑           ↑                       ↑
     │           │                       └── State indicator circle
     │           └── Profession name (text-sm, font-medium, line-clamp-2)
     └── Icon container with colored border
```

### 8.3 Card States

| State | Background | Border |
|-------|------------|--------|
| **Default** | `bg-muted/30` | `border-transparent` |
| **Hover** | `bg-muted/50` | `border-border` |
| **Mapped** | `bg-primary/5` | `border-primary` + `shadow-sm` |
| **Disabled** | `opacity-60`, `cursor-not-allowed` (when no committee selected) |

### 8.4 Profession Icon Container
```css
.profession-icon {
  width: 2.5rem; /* 40px */
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  border-width: 2px;
  border-color: /* from profession.color */;
  overflow: hidden;
  flex-shrink: 0;
}

.profession-icon img {
  width: 1.75rem; /* 28px */
  height: 1.75rem;
  object-fit: contain;
}
```

### 8.5 Mapping State Indicator
```css
.state-indicator {
  width: 1.5rem; /* 24px */
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

/* Unmapped */
.state-indicator.unmapped {
  background: var(--muted);
}
.state-indicator.unmapped:hover {
  background: rgba(muted-foreground, 0.2);
}

/* Mapped */
.state-indicator.mapped {
  background: var(--primary);
  color: var(--primary-foreground);
}
```

### 8.6 Card Animations
| Animation | Trigger | Properties |
|-----------|---------|------------|
| Hover | Mouse enter | `scale: 1 → 1.02` |
| Click | Mouse down | `scale: 1 → 0.98` |

---

## 9. Add Committee Dialog

### 9.1 Dialog Structure
```
┌─────────────────────────────────────────────┐
│  ➕ Add New Committee                    ✕   │
├─────────────────────────────────────────────┤
│  Create a new committee for profession      │
│  mapping.                                    │
│                                              │
│  Committee Name                              │
│  ┌─────────────────────────────────────────┐│
│  │ e.g., Technical Standards Committee     ││
│  └─────────────────────────────────────────┘│
│                                              │
│  Description (optional)                      │
│  ┌─────────────────────────────────────────┐│
│  │ Brief description of role...            ││
│  └─────────────────────────────────────────┘│
├─────────────────────────────────────────────┤
│                   [Cancel]  [➕ Add Committee]│
└─────────────────────────────────────────────┘
```

### 9.2 Auto-Generated Fields
- **shortName**: First letter of each word, uppercase, max 3 chars
- **color**: Random HSL: `hsl(random(0-360), 65%, 50%)`

---

## 10. Data Models

### 10.1 Committee Interface
```typescript
interface Committee {
  id: string;           // Unique identifier (e.g., "c1", "c2")
  name: string;         // Full name
  shortName: string;    // 2-3 letter abbreviation (e.g., "NAC")
  description: string;  // Brief description
  color: string;        // HSL color string (e.g., "hsl(220, 70%, 50%)")
}
```

### 10.2 Profession Interface
```typescript
interface Profession {
  id: string;           // Unique ID (e.g., "p1", "p2")
  name: string;         // Full profession name
  iconFile: string;     // Filename for icon (e.g., "biotechnologist.png")
  color: string;        // HSL color for border
  categoryId: string;   // Parent category ID
  categoryName: string; // Parent category full name
}
```

### 10.3 Profession Category Interface
```typescript
interface ProfessionCategory {
  id: string;           // Category ID (e.g., "cat1")
  name: string;         // Full category name
  shortName: string;    // Abbreviated name
  professions: Array<{
    id: string;
    name: string;
    iconFile: string;
    color: string;
  }>;
}
```

### 10.4 Mappings Data Structure
```typescript
// Key: committeeId, Value: Set of professionIds
type MappingsType = Record<string, Set<string>>;

// Example:
{
  "c1": new Set(["p1", "p2", "p5"]),
  "c2": new Set(["p1", "p18", "p24"])
}
```

---

## 11. State Management

### 11.1 Component State
```javascript
const [isLoading, setIsLoading] = useState(true);
const [committees, setCommittees] = useState(initialCommittees);
const [mappings, setMappings] = useState({});
const [selectedCommittee, setSelectedCommittee] = useState(null);
const [searchProfession, setSearchProfession] = useState("");
const [searchCommittee, setSearchCommittee] = useState("");
const [expandedCategories, setExpandedCategories] = useState(new Set(allCategoryIds));
const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
const [showOnlyMapped, setShowOnlyMapped] = useState(false);

// Dialog states
const [isAddCommitteeOpen, setIsAddCommitteeOpen] = useState(false);
const [newCommitteeName, setNewCommitteeName] = useState("");
const [newCommitteeDesc, setNewCommitteeDesc] = useState("");
```

### 11.2 Derived State (useMemo)
```javascript
// Selected committee's mapped professions
const selectedMappings = useMemo(() => {
  if (!selectedCommittee) return new Set();
  return mappings[selectedCommittee] || new Set();
}, [selectedCommittee, mappings]);

// Filtered categories based on search
const filteredCategories = useMemo(() => {
  const searchLower = searchProfession.toLowerCase();
  return professionCategories.map(category => {
    const categoryMatchesSearch = 
      category.name.toLowerCase().includes(searchLower) ||
      category.shortName.toLowerCase().includes(searchLower);
    
    const filteredProfessions = category.professions.filter(prof => {
      const professionMatchesSearch = prof.name.toLowerCase().includes(searchLower);
      const matchesSearch = professionMatchesSearch || categoryMatchesSearch;
      const isMapped = selectedMappings.has(prof.id);
      const matchesMappedFilter = !showOnlyMapped || isMapped;
      return matchesSearch && matchesMappedFilter;
    });
    
    return { ...category, professions: filteredProfessions };
  }).filter(cat => cat.professions.length > 0);
}, [searchProfession, selectedMappings, showOnlyMapped]);
```

---

## 12. User Interactions & Toast Notifications

### 12.1 Interaction Table

| Action | UI Response | Toast |
|--------|-------------|-------|
| Click profession (no committee) | Nothing | ❌ "Select a committee first" |
| Click profession (mapped) | Unmap | — |
| Click profession (unmapped) | Map | — |
| Click "Map All" on category | Map all in category | ✅ "Category mapped: [ShortName] (N professions)" |
| Click "Unmap All" on category | Unmap all in category | ✅ "Category unmapped: [ShortName]" |
| Add new committee | Add to list | ✅ "Committee added: [Name]" |
| Delete committee | Remove from list | ✅ "Committee deleted" |

---

## 13. Icon Requirements

### 13.1 Lucide Icons Used
```javascript
import {
  Search,           // Search inputs
  Plus,             // Add buttons
  X,                // Close/cancel
  Users,            // Professions panel header
  Link2,            // Mapping icon, stats
  Link2Off,         // Unmap icon
  Circle,           // Unmapped state indicator
  Check,            // Mapped state, selected committee
  ChevronDown,      // Expanded category
  ChevronRight,     // Collapsed category
  Filter,           // Filter button
  LayoutGrid,       // Grid view toggle
  List,             // List view toggle
  Building2,        // Committees header, stats
  ArrowRight,       // Empty state helper
} from "lucide-react";
```

### 13.2 Profession Icons
- Location: `/profession-icons/[filename].png`
- Size: 28x28px display, contain fit
- Fallback: `/placeholder.svg` on error

---

## 14. Responsive Breakpoints

| Breakpoint | Committees Panel | Professions Panel | Profession Grid |
|------------|------------------|-------------------|-----------------|
| `< 640px` | Full width | Full width | 1 column |
| `640px - 1024px` | Full width | Full width | 2 columns |
| `1024px - 1280px` | 4/12 cols | 8/12 cols | 2 columns |
| `> 1280px` | 4/12 cols | 8/12 cols | 3 columns |

---

## 15. Animation Library Requirements

Use **Framer Motion** for:
- Page section entrance animations
- Committee list item stagger
- Profession card hover/tap
- Selected committee indicator appearance
- Dialog transitions

### 15.1 Page Section Animations
```javascript
// Left panel
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.4, delay: 0.1 }}

// Right panel
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.4, delay: 0.2 }}
```

---

## 16. Accessibility Considerations

- All clickable elements must be keyboard accessible
- Use semantic HTML (`<button>`, `<input>`, proper headings)
- ARIA labels on icon-only buttons
- Focus visible states on all interactive elements
- Toast notifications should be ARIA-live regions
- Collapsible sections use proper ARIA expanded states

---

## 17. CSS Custom Properties (Design Tokens)

```css
:root {
  --primary: /* your primary color */;
  --primary-foreground: /* text on primary */;
  --background: /* page background */;
  --card: /* card background */;
  --muted: /* muted background */;
  --muted-foreground: /* muted text */;
  --border: /* border color */;
  --destructive: /* error/delete color */;
}
```

---

## 18. External Dependencies

| Package | Purpose |
|---------|---------|
| `framer-motion` | Animations |
| `lucide-react` | Icons |
| UI Component Library | Button, Input, Badge, Checkbox, ScrollArea, Tooltip, Collapsible, Dialog |
| Toast Hook | Notifications |

---

## 19. File Structure Recommendation

```
src/
├── pages/
│   └── CommitteeProfessionMapping.jsx
├── components/
│   ├── skeletons/
│   │   └── CommitteeMappingSkeleton.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Badge.jsx
│       ├── ScrollArea.jsx
│       ├── Tooltip.jsx
│       ├── Collapsible.jsx
│       └── Dialog.jsx
├── data/
│   └── professions.js
├── hooks/
│   └── useToast.js
└── assets/
    └── profession-icons/
        ├── biotechnologist.png
        ├── ... (57 icons)
        └── placeholder.svg
```

---

## 20. Quick Reference: Color Palette

| Usage | Color |
|-------|-------|
| Hero gradient | Primary color |
| Selected committee | `primary/5` bg, `primary` border |
| Mapped profession | `primary/5` bg, `primary` border |
| Fully mapped category icon | `green-100` bg, `green-600` text |
| Partially mapped category | `amber-100` bg, `amber-600` text |
| Stats boxes | `white/10` bg with backdrop blur |

---

*Document generated for exhaustive UI replication. All measurements, colors, and behaviors are specified for exact reproduction.*
