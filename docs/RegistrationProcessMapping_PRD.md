# Product Requirements Document
## Registration Process Mapping Module
### React 19 + MUI Replication Guide

**Version:** 1.0  
**Date:** 2026-02-20  
**Scope:** Two admin pages — Application-Process Mapping & Profession-Process Mapping  
**Target Stack:** React 19, MUI v6 (Material UI), `@dnd-kit/core` (drag-and-drop), `framer-motion` (animations), `react-router-dom` v6

---

## 1. Overview & Purpose

This module is part of the **NCAHP Admin Console** — a government healthcare regulation platform. It allows super-admins to configure which screens (processes/steps) appear, and in what order, when a healthcare professional submits a registration application.

There are two sub-pages:

| Page | Purpose |
|---|---|
| **Application-Process Mapping** | Defines the **default** ordered list of screens for each registration form type (e.g. Form 1A, Form 1B) |
| **Profession-Process Mapping** | Defines **profession-specific overrides** on top of the default. If a custom override exists, it takes priority. If not, the default applies. |

---

## 2. Design System & Tokens

### 2.1 Colour Palette

The project uses a **Teal-Blue-Orange government healthcare** palette. Map these to MUI's `createTheme`:

```ts
const theme = createTheme({
  palette: {
    primary:   { main: '#0d7a6b' },   // teal-700 equivalent (--primary)
    secondary: { main: '#1e40af' },   // blue-800 (--secondary)
    warning:   { main: '#ea580c' },   // orange-600 (--accent)
    error:     { main: '#dc2626' },   // red-600 (--destructive)
    background:{ default: '#f4f6f8', paper: '#ffffff' },
    text: {
      primary:   '#1a202c',
      secondary: '#64748b',
      disabled:  '#94a3b8',
    },
  },
});
```

**Per-application-type accent colours** (used for left border and badge colouring):

| Type | Color Name | Badge BG | Badge Text | Left Border |
|---|---|---|---|---|
| Form 1A | teal | `teal.50` | `teal.700` | `teal.500` |
| Form 1B | blue | `blue.50` | `blue.700` | `blue.500` |
| Form 1C | orange | `orange.50` | `orange.700` | `orange.500` |
| Form 2A | purple | `purple.50` | `purple.700` | `purple.500` |
| Form 2B | indigo | `indigo.50` | `indigo.700` | `indigo.500` |

### 2.2 Typography

- Page titles: `variant="h5"`, `fontWeight: 700`, `letterSpacing: -0.5px`
- Section labels (column headers): `variant="overline"`, `fontSize: 10px`, `letterSpacing: 1.5px`, `color: text.secondary`
- Card name: `variant="body2"`, `fontWeight: 600`
- Monospace paths: `fontFamily: 'monospace'`, `fontSize: 11px`, `color: text.secondary`
- Description text: `variant="caption"`, `color: text.secondary`

### 2.3 Spacing & Radius

- Card border radius: `12px`
- Chip / badge border radius: `20px` (pill)
- Page max-width: `1280px` centered
- Page padding: `24px` horizontal, `32px` vertical
- Gap between columns: `20px`

---

## 3. Shared Layout — `PageShell`

This wraps both pages with a consistent top bar + sub-navigation.

### 3.1 Top Bar

- Full-width `AppBar` with `position="static"` (not sticky)
- `color="primary"` (uses `palette.primary.main` background)
- **Left side content** (horizontal flex, vertically centered):
  - `← Back` button (MUI `Button` with `startIcon={<ArrowBackIcon />}`, `color="inherit"`, `size="small"`, 75% opacity at rest → 100% on hover)
  - Vertical divider (`|`), 40% opacity
  - Breadcrumb text: `"NCAHP Admin Console"` in uppercase overline style (60% opacity) + `"·"` separator + `"Registration System"` (85% opacity)
- **Below** the breadcrumb row (still inside AppBar): Sub-navigation tab strip

### 3.2 Sub-Navigation Tabs

Two tabs rendered as custom `Button` elements (NOT MUI `Tabs` component — they need precise border-bottom behaviour):

```
[ 📋 Application-Process Mapping ]   [ 🔀 Profession-Process Mapping ]
```

Each button:
- `px: 16px, py: 10px`
- Active: `background: rgba(255,255,255,0.08)`, `color: white`, `borderBottom: 3px solid <accentOrange>`
- Inactive: `background: transparent`, `color: rgba(255,255,255,0.6)`, `borderBottom: 3px solid transparent`
- Transition: `all 0.2s ease`
- Icons: `LayersIcon` and `AccountTreeIcon` (MUI icons), size 16px

### 3.3 Page Content Area

```tsx
<Box sx={{ bgcolor: 'grey.100', minHeight: '100vh' }}>
  <AppBar>...</AppBar>
  <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3, py: 4 }}>
    {children}
  </Box>
</Box>
```

---

## 4. Data Models

```ts
interface ApplicationType {
  id: number;
  name: string;
  formCode: string;      // e.g. "Form 1A"
  description: string;
  color: 'teal' | 'blue' | 'orange' | 'purple' | 'indigo';
}

interface Process {
  id: number;
  name: string;
  path: string;          // e.g. "/personal-info"
  processType: 'SUB' | 'MENU' | 'REV';
  description: string;
}

interface ProcessMapping {
  mappingId: number;
  processId: number;
  sequence: number;
  isActive: boolean;
}

interface ProfessionMappingStatus {
  professionId: number;
  professionName: string;
  professionShortName: string;   // e.g. "PT"
  hasCustomMapping: boolean;
}
```

**Key data structures:**
- `applicationTypes: ApplicationType[]` — 5 form types
- `allSubProcesses: Process[]` — 14 screens (the global pool)
- `defaultMappings: Record<number, ProcessMapping[]>` — keyed by `applicationTypeId`
- `professionMappingStatuses: Record<number, ProfessionMappingStatus[]>` — keyed by `applicationTypeId`
- `customProfessionMappings: Record<string, ProcessMapping[]>` — keyed by `"typeId-professionId"` (e.g. `"1-1"`)

### 4.1 Helper Functions

```ts
// Build an ordered list of Process objects from a list of ProcessMappings
function buildProcessList(mappings: ProcessMapping[]): (Process & { sequence: number; mappingId: number })[] {
  return mappings
    .filter(m => m.isActive)
    .sort((a, b) => a.sequence - b.sequence)
    .map(m => ({ ...processById[m.processId], sequence: m.sequence, mappingId: m.mappingId }));
}

// Lookup map: processId → Process object
const processById = Object.fromEntries(allSubProcesses.map(p => [p.id, p]));
```

---

## 5. Page 1 — Application-Process Mapping

**Route:** `/registration-process-mapping/application`  
**Icon:** `LayersIcon`  
**Purpose:** Set the default screen sequence for each registration form type.

### 5.1 State

```ts
const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
const [draftItems, setDraftItems] = useState<DraftItem[]>([]);   // DraftItem = Process & { sequence, mappingId }
const [isEditMode, setIsEditMode] = useState(false);
const [showAddDrawer, setShowAddDrawer] = useState(false);
const [saving, setSaving] = useState(false);
const [savedTypeId, setSavedTypeId] = useState<number | null>(null);  // drives "Saved" flash badge
```

### 5.2 Page Header

```
[🔲 Layers icon box]  Application-Process Mapping
                      Configure the default sequence of registration screens
                      for each application type
```

- Icon box: `40×40px`, `borderRadius: 12px`, `bgcolor: primary.main`, icon `white`, `20px`
- Title: `variant="h5"`, bold, dark foreground
- Subtitle: `variant="body2"`, `color="text.secondary"`

### 5.3 Info Banner

Below the header, a full-width info card:
- Background: `rgba(59, 130, 246, 0.05)` (light blue)
- Border: `1px solid rgba(59, 130, 246, 0.2)`
- Text color: `hsl(217, 91%, 35%)` (dark blue)
- Left `InfoOutlinedIcon` (16px), then:
  - **Bold:** "Default Mapping" — 
  - Normal text: "This configuration applies to all professions unless a profession-specific override is defined in the Profession-Process Mapping module. Drag to reorder screens; use the add panel to include additional screens."

### 5.4 Two-Column Layout

```
Grid container: 12 columns, gap 24px
  Left column:  3 cols on xl / 4 cols on lg / 12 cols on xs
  Right column: 9 cols on xl / 8 cols on lg / 12 cols on xs
```

### 5.5 Left Column — Application Type Selector

**Column header:** `"APPLICATION TYPES"` — overline typography, secondary color, `mb: 12px`

**Type Cards** (one per `ApplicationType`, rendered as `ButtonBase` or `Paper` with `onClick`):

Structure of each card:
```
[left border 4px, color = type accent]
  [top row]
    [left] FormCode badge pill + name text
    [right] "{N} screens" text + ChevronRight (only when selected)
  [bottom] description text (2-line clamp)
```

Detailed spec:
- Container: `Paper` or `Box`, `borderRadius: 12px`, `p: "14px 16px"`, `cursor: pointer`
- Left accent border: `borderLeft: "4px solid {typeColor}"`, rest: `1px solid grey.200` (unselected) / `grey.300` (selected)
- Selected state: `boxShadow: theme.shadows[3]`, `bgcolor: 'background.paper'`
- Unselected state: `bgcolor: 'background.paper'`, hover: `bgcolor: grey.50`, `boxShadow: theme.shadows[1]`
- Transition: `all 0.15s ease`
- **FormCode badge:** MUI `Chip` component, `size="small"`, `label={type.formCode}`, `sx={{ bgcolor: typeColors.badgeBg, color: typeColors.badgeText, borderRadius: '20px', fontSize: '11px', fontWeight: 600, border: '1px solid ...' }}`
- **Name:** `Typography variant="body2"`, `fontWeight: 600`, `color="text.primary"`, `mt: 0.5`
- **Screen count:** `Typography variant="caption"` `fontWeight: 600`, `color="text.secondary"` + `" screens"` text
- **ChevronRight:** `ChevronRightIcon`, `fontSize: 14`, `color="primary.main"`, only rendered when `isSelected`
- **Description:** `Typography variant="caption"`, `color="text.disabled"`, `mt: 0.5`, CSS `-webkit-line-clamp: 2`

### 5.6 Right Column — Process List Panel

#### 5.6.1 Empty State (no type selected)

Centered vertically:
```
[icon box 64×64px, borderRadius 16px, bgcolor primary 10% opacity]
  LayersIcon 28px, color primary.main
"Select an Application Type"  — body1, fontWeight 600, grey.700
"Choose a registration type from the left panel..."  — body2, grey.400, maxWidth 280px
```

#### 5.6.2 Header Card (when type is selected)

`Paper` with `borderRadius: 12px`, `p: "20px"`, `boxShadow: 1`:

**Left side:**
- Coloured dot: `8×8px` circle, `bgcolor: typeAccentColor`, inline-flex
- Application name: `Typography variant="h6"`, `fontWeight: 700`
- FormCode `Chip` (same as left column badge)
- **"Saved" flash badge** (conditionally rendered when `savedTypeId === selectedTypeId`):
  - Animate in/out with Framer Motion: `initial={{ opacity: 0, scale: 0.8 }}`, `animate={{ opacity: 1, scale: 1 }}`
  - Green pill badge: `bgcolor: 'success.50'`, `color: 'success.700'`, `border: 1px solid success.200`
  - Contains `CheckCircleOutlineIcon` 11px + text "Saved"
  - Auto-disappears after 3 seconds (`setTimeout(() => setSavedTypeId(null), 3000)`)
- Screen count subtitle: `"{N} screen(s) in sequence"`, `body2`, `text.secondary`

**Right side — Action Buttons:**

When NOT in edit mode:
```
[primary filled button]  ↕ Edit Sequence
```

When IN edit mode:
```
[outlined button]   Cancel
[teal outlined]     + Add Screen       ← toggles add drawer
[accent filled]     💾 Save Changes    ← shows spinner when saving
```

- **Cancel:** `variant="outlined"`, `color="inherit"`, `size="small"`
- **Add Screen:** `variant="outlined"`, `sx={{ borderColor: 'teal[300]', color: 'teal[700]' }}`, active/toggled: `bgcolor: teal.50`
- **Save Changes:** `variant="contained"`, `color="warning"` (maps to accent orange), disabled+spinner when `saving`

#### 5.6.3 Edit Mode Hint Bar

Shown only in edit mode, directly above the process list:
```
[DragHandle icon] Drag rows to reorder · Click × to remove a screen
```
- Styling: `bgcolor: 'warning.50'` (or accent light), `color: 'warning.main'`, `borderRadius: 8px`, `px: 12px, py: 8px`, `typography: caption`, `fontWeight: 500`

#### 5.6.4 Empty Screen List State

When `draftItems.length === 0`:
```
Dashed border box, full width, borderRadius 12px, padding 48px, centered:
  "No screens configured"  — body2, grey.400
  [if in edit mode]  "+ Add first screen" button
```

#### 5.6.5 Process Flow List

**View mode** (not editing): Static list of `ProcessChip` components, animated entrance via Framer Motion (`initial={{ opacity: 0, y: 4 }}`, `animate={{ opacity: 1, y: 0 }}`, staggered `transition={{ delay: idx * 0.04 }}`).

**Edit mode**: Drag-and-drop list using `@dnd-kit/core` + `@dnd-kit/sortable`:
- Wrap list in `<DndContext onDragEnd={handleDragEnd}>`
- Wrap items in `<SortableContext items={draftItems.map(i => i.id)} strategy={verticalListSortingStrategy}>`
- Each item uses `useSortable(id)` hook

**`ProcessChip` Component:**

```
[grip icon (edit only)] [sequence badge] [name + path] [remove button (edit + hover only)]
```

Structure:
- Container: `Paper` or `Box` with `display: flex`, `alignItems: center`, `gap: 12px`, `px: 12px, py: 10px`, `borderRadius: 8px`, `border: 1px solid grey.200`
- **Dragging state** (when `isDragging` from dnd-kit): `border: 1px solid teal.300`, `bgcolor: teal.50`, `boxShadow: theme.shadows[6]`, `outline: 2px solid teal.200`
- **Hover (view mode):** `borderColor: grey.300`, `boxShadow: theme.shadows[1]`
- **Grip handle:** `DragIndicatorIcon`, `16px`, `color: grey.400`, `cursor: grab`, `active: cursor-grabbing`, only shown in edit mode
- **Sequence badge:** Circular `Box`, `24×24px`, `borderRadius: '50%'`, `bgcolor: primary.main`, `color: white`, `fontSize: 11px`, `fontWeight: 700`
- **Name:** `Typography variant="body2"`, `fontWeight: 500`, `color="text.primary"`, `noWrap`
- **Path:** `Typography`, `fontSize: 11px`, `fontFamily: 'monospace'`, `color="text.disabled"`, `noWrap`
- **Remove button:** MUI `IconButton`, `size="small"`, `sx={{ opacity: 0, '.MuiPaper-root:hover &': { opacity: 1 } }}`, `color="default"`, hover: `color="error"`. Use CSS group-hover: wrap the chip in a `Box` with class, or use `onMouseEnter/Leave` state to toggle visibility.

#### 5.6.6 Add Screen Drawer (Inline Panel)

When `showAddDrawer = true`, the right column splits into a **3:2 grid**:

```
[Process List — 3 cols] [Available Screens Drawer — 2 cols]
```

The drawer animates in with Framer Motion: `initial={{ opacity: 0, x: 20 }}`, `animate={{ opacity: 1, x: 0 }}`, `exit={{ opacity: 0, x: 20 }}`.

**Drawer structure** (`Paper`, `borderRadius: 12px`, `overflow: hidden`):

1. **Header bar** (`bgcolor: grey.100`, `borderBottom: 1px solid grey.200`):
   - Left: "Available Screens" (`body2`, `fontWeight: 600`) + "Click to add to the process flow" (`caption`, `grey.500`)
   - Right: `IconButton` with `CloseIcon`

2. **Search field** (below header, `borderBottom`):
   - MUI `TextField` with `size="small"`, `InputProps={{ startAdornment: <SearchIcon fontSize="small" /> }}`, `autoFocus`, `placeholder="Search screens…"`

3. **Scrollable list** (`maxHeight: 320px`, `overflowY: auto`, `p: 8px`):
   - Each available process row: `ButtonBase`, full-width, `borderRadius: 8px`, `p: 10px`, `gap: 12px`
   - Hover: `bgcolor: teal.50`, add 1px teal.200 border
   - Left icon: small circle, `bgcolor: rgba(primary, 0.15)`, `color: primary.main`, contains `+` text
   - Name + monospace path (same as chip)
   - Right: `AddIcon` (`teal.500`), `opacity: 0`, show on hover
   - When clicked: calls `onAdd(proc)`, removes screen from available list immediately (derived from `availableProcesses = allSubProcesses.filter(p => !draftItems.some(d => d.id === p.id))`)
   - Empty state: centered text "All screens are already added" or "No screens match your search"

---

## 6. Page 2 — Profession-Process Mapping

**Route:** `/registration-process-mapping/profession`  
**Icon:** `AccountTreeIcon` (or similar branch/fork icon)  
**Purpose:** Create profession-specific process overrides per application type.

### 6.1 State

```ts
const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
const [selectedProfessionId, setSelectedProfessionId] = useState<number | null>(null);
const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
const [isCustom, setIsCustom] = useState(false);       // true = profession has a custom mapping
const [isEditMode, setIsEditMode] = useState(false);
const [showAddDrawer, setShowAddDrawer] = useState(false);
const [saving, setSaving] = useState(false);
const [savedKey, setSavedKey] = useState<string | null>(null);     // `"typeId-professionId"`
const [resetTarget, setResetTarget] = useState<ProfessionMappingStatus | null>(null);  // drives confirm dialog
const [professionSearch, setProfessionSearch] = useState('');
```

### 6.2 Page Header

Same layout as Page 1, but:
- Icon: `AccountTreeIcon` (or `CallSplitIcon`)
- Title: "Profession-Process Mapping"
- Subtitle: "Override the default process flow for specific professions within each application type"

### 6.3 Info Banner

Same blue info banner style, content:
> **Two-step fallback:** If a custom mapping exists for a profession, it overrides the default. If none exists, the default application mapping is shown as an editable template. Use **Reset to Default** to remove all overrides for a profession.

### 6.4 Three-Column Layout

```
Grid: 12 columns, gap 20px
  Col 1 (Application Types):    3 cols lg / 12 xs
  Col 2 (Professions):          3 cols lg / 12 xs
  Col 3 (Process Editor):       6 cols lg / 12 xs
```

### 6.5 Column 1 — Application Type Selector

Identical to Page 1 left column **except**:
- Instead of "N screens", show: `"{N} professions"` text + (if `customCount > 0`) a small teal badge: `"{X} custom"`
- The custom count badge: `Chip size="small"`, `bgcolor: teal.50`, `color: teal.700`, `border: 1px solid teal.200`

### 6.6 Column 2 — Profession List

#### 6.6.1 Empty State (no type selected)

```
Centered vertically:
[PeopleIcon box, 48px, primary 8% opacity]
"Select a Type First"  — body2, fontWeight 600
"Choose an application type to see professions"  — caption, grey.400
```

#### 6.6.2 Profession Panel (type selected)

**Column header row:**
- Left: `"PROFESSIONS"` overline
- Right: `"{N} customised"` caption in `teal.600` (only if `customCount > 0`)

**Search field:** MUI `TextField`, `size="small"`, full width, `mb: 8px`, `placeholder="Search professions…"`, `InputProps={{ startAdornment: <SearchIcon /> }}`

**Profession Cards** (one per profession, scrollable list):

```
[left accent dot (4px wide bar)] [short name badge] [full name] [Custom OR Default badge]
```

Detailed card spec:
- Container: `Paper`, `borderRadius: 8px`, `px: 12px, py: 10px`, `cursor: pointer`, `border: 1px solid grey.200`
- **Selected state:** `border: 1px solid primary.main`, `bgcolor: primary.50` (light teal tint), `boxShadow: shadows[1]`
- **Left bar:** `4px × 100%` strip on the left, `bgcolor: primary.main`, only visible when selected (or always visible as subtle grey otherwise)
- **Short name badge:** `Chip size="small"`, `bgcolor: grey.100`, `color: text.secondary`, `fontFamily: monospace`, `fontSize: 11px`
- **Profession name:** `Typography variant="body2"`, `fontWeight: 500`, `color="text.primary"`, truncated
- **"Custom" badge** (when `hasCustomMapping`): `Chip size="small"`, `bgcolor: teal.50`, `color: teal.700`, `border: 1px solid teal.200`, label "Custom", with `SparklesIcon` (or `AutoAwesomeIcon`) 10px
- **"Default" badge** (when `!hasCustomMapping`): `Chip size="small"`, `bgcolor: grey.50`, `color: text.disabled`, `border: 1px solid grey.200`, label "Default"
- Smooth transition on selection
- `ChevronRightIcon` shown on right only when selected

### 6.7 Column 3 — Process Editor

#### 6.7.1 Empty State (no profession selected)

```
Centered:
[ShieldIcon box, 64px]  (or similar config icon)
"Select a profession"  — body1, fontWeight 600
"Choose a profession from the centre panel..."  — body2, grey.400
```

Show this when `!selectedProfession`.

#### 6.7.2 Process Editor Header Card

`Paper`, `borderRadius: 12px`, `p: 20px`, `boxShadow: 1`:

**Left side:**
- Profession name: `Typography variant="h6"`, `fontWeight: 700`
- Short name `Chip` (same style as profession list)
- **Mapping status badge:**
  - If `isCustom`: teal `Chip` with `SparklesIcon`, label "Custom Mapping"
  - If `!isCustom`: grey `Chip` with `InfoOutlinedIcon`, label "Using Default"
- **"Saved ✓" flash badge** (same as Page 1, using `savedKey === currentKey`)
- Subtitle: `"{N} screen(s) in sequence"`

**Right side action buttons:**

When NOT editing:
```
[outlined destructive]  ↺ Reset to Default   ← only if isCustom
[primary filled]        ↕ Edit Sequence / Create Custom
```

- "Edit Sequence" if `isCustom`, "Create Custom" if not `isCustom`

When IN edit mode:
```
[outlined]       Cancel
[teal outlined]  + Add Screen
[accent filled]  💾 Save Changes
```

#### 6.7.3 Custom vs Default Status Banner

Below the header card, a thin status row:

- **Custom mapping** (`isCustom = true`): teal banner — `"✓ Custom mapping is active for this profession"`
- **Default mapping** (`isCustom = false`): amber/grey banner — `"⚠ Showing default mapping. Changes will create a custom override."`

#### 6.7.4 Process List

Identical to Page 1 process list, with one addition in **view mode**:

Each chip has a subtle `"default"` badge on the right (grey, small) when `isCustom = false`. This indicates it's from the default and not a custom entry. In custom mode, no such badge appears.

#### 6.7.5 Add Screen Drawer

Identical to Page 1, splits the editor column into a sub-grid when open.

### 6.8 Reset Confirmation Dialog

Triggered when admin clicks "Reset to Default". Implemented as a **modal overlay** (not MUI `Dialog` — use a fixed overlay div with backdrop blur, centered `Paper`):

```
Fixed overlay: bgcolor rgba(0,0,0,0.3), backdropFilter: blur(4px), zIndex: 9999
  Paper: borderRadius 12px, p: 24px, maxWidth: 400px, boxShadow: shadows[24]
  
  [Row: amber warning icon circle + text block]
    Icon circle: 40px, borderRadius 50%, bgcolor amber.50, border amber.200
    AlertTriangleIcon: 18px, amber.600
    
    Title: "Reset to Default?" — body1, fontWeight 700
    Body: "All custom process overrides for [ProfessionName] will be permanently removed. 
           The default application mapping will apply going forward." — body2, text.secondary
  
  [Button row, right-aligned]
    "Cancel"           — outlined, inherit color
    "Reset to Default" — contained, error color
```

Clicking the overlay backdrop also closes the dialog (without resetting).

---

## 7. Drag-and-Drop Implementation with `@dnd-kit`

The original codebase uses Framer Motion's `Reorder` component. In MUI, use `@dnd-kit/core` + `@dnd-kit/sortable` instead.

### 7.1 Dependencies

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 7.2 Setup

```tsx
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableProcessChip({ item, isEditMode, onRemove, isCustom }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ProcessChip
        process={item}
        sequence={item.sequence}
        isEditMode={isEditMode}
        isDragging={isDragging}
        onRemove={onRemove}
        dragHandleProps={listeners}
        isCustom={isCustom}
      />
    </div>
  );
}

function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;
  if (over && active.id !== over.id) {
    setDraftItems(items => {
      const oldIdx = items.findIndex(i => i.id === active.id);
      const newIdx = items.findIndex(i => i.id === over.id);
      const reordered = arrayMove(items, oldIdx, newIdx);
      return reordered.map((item, idx) => ({ ...item, sequence: idx + 1 }));
    });
  }
}

// In JSX:
<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext items={draftItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
    {draftItems.map((item, idx) => (
      <SortableProcessChip key={item.id} item={item} ... />
    ))}
  </SortableContext>
</DndContext>
```

Pass `listeners` from `useSortable` to the grip handle icon specifically (not the entire chip) to avoid conflicts with the remove button click.

---

## 8. Animations

### 8.1 Libraries

Use `framer-motion` for:
- List item entrance stagger (view mode)
- Add drawer slide-in/out
- "Saved" badge fade/scale
- Reset dialog scale-in

### 8.2 Animation Specs

**List item entrance (view mode):**
```ts
initial={{ opacity: 0, y: 4 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: idx * 0.04, duration: 0.2 }}
```

**Add Screen Drawer:**
```ts
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: 20 }}
transition={{ duration: 0.2 }}
```

**"Saved" badge:**
```ts
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.8 }}
transition={{ duration: 0.15 }}
```

**Reset dialog:**
```ts
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.95 }}
transition={{ duration: 0.15 }}
```

Wrap all conditional renders in `<AnimatePresence mode="wait">`.

---

## 9. Business Logic

### 9.1 Application-Process Mapping Logic

| Action | Behaviour |
|---|---|
| Select application type | Load `defaultMappings[typeId]`, build process list, set `draftItems`, reset edit/drawer state |
| Enter edit mode | `setIsEditMode(true)`, close drawer |
| Cancel edit | Restore `draftItems` from `defaultMappings[selectedTypeId]`, exit edit mode |
| Remove process | Filter it out of `draftItems` |
| Add process | Append to end of `draftItems` with `sequence = prev.length + 1`, `mappingId = Date.now()` |
| Drag reorder | `arrayMove` then re-assign sequences `0, 1, 2...` → `1, 2, 3...` |
| Save | Simulate 900ms async, exit edit mode, set `savedTypeId`, clear after 3s |
| Available processes | `allSubProcesses.filter(p => !draftItems.some(d => d.id === p.id))` |

### 9.2 Profession-Process Mapping Logic

| Action | Behaviour |
|---|---|
| Select application type | Clear profession selection, reset all draft state |
| Select profession | Check `customProfessionMappings["typeId-professionId"]`; if exists → load custom, `setIsCustom(true)`; else → load default, `setIsCustom(false)` |
| "Create Custom" / "Edit Sequence" | Enter edit mode |
| Cancel edit | If `isCustom`: restore from `customProfessionMappings[key]`; else: restore from `defaultMappings[typeId]` |
| Save | 900ms async, set `isCustom(true)`, set `savedKey`, clear after 3s |
| Reset to Default | Show confirm dialog → on confirm: reload default, `setIsCustom(false)`, clear edit state |
| `currentKey` | Derived as `"${selectedTypeId}-${selectedProfessionId}"` |
| `customCount` | `professions.filter(p => p.hasCustomMapping).length` |

---

## 10. Component File Structure (Recommended)

```
src/
  pages/
    RegistrationProcessMapping/
      index.tsx                          ← router entry, exports both pages
      mockData.ts                        ← all data + interfaces
      components/
        PageShell.tsx                    ← top bar + sub-nav wrapper
        ProcessChip.tsx                  ← single draggable/static chip
        AddScreenDrawer.tsx              ← available screens panel
        ResetConfirmDialog.tsx           ← modal overlay
        TypeSelectorColumn.tsx           ← shared left column (used by both pages)
      ApplicationProcessMappingPage.tsx
      ProfessionProcessMappingPage.tsx
```

---

## 11. MUI Component Equivalents

| Original (Tailwind) | MUI Equivalent |
|---|---|
| `<button>` card | `<ButtonBase component={Paper}>` or `<Paper onClick={...} sx={{ cursor: 'pointer' }}>` |
| Tailwind badge/pill | `<Chip size="small">` |
| Custom grip button | `<IconButton size="small">` wrapping `<DragIndicatorIcon>` |
| Dashed border empty state | `<Box sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 3 }}>` |
| Inline search input | `<TextField size="small" InputProps={{ startAdornment: <SearchIcon /> }}>` |
| `group-hover` opacity trick | Use `sx={{ opacity: 0, 'tr:hover &': { opacity: 1 } }}` or local state with `onMouseEnter/Leave` on parent |
| `AnimatePresence` + `motion.div` | Same — `framer-motion` works alongside MUI |
| CSS `line-clamp: 2` | `sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}` |
| `font-mono` class | `sx={{ fontFamily: '"Roboto Mono", monospace' }}` |
| `border-l-4` accent | `sx={{ borderLeft: '4px solid teal[500]', borderRadius: '12px' }}` |

---

## 12. Accessibility Requirements

- All clickable cards must be keyboard-navigable (`tabIndex={0}`, `onKeyDown` handling `Enter`/`Space`)
- Drag handles must have `aria-label="Drag to reorder"`
- Remove buttons: `aria-label="Remove {process.name} from sequence"`
- Reset dialog: trap focus within dialog, `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Save button: `aria-busy={saving}` during saving state
- Selected type/profession cards: `aria-pressed={isSelected}`

---

## 13. Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| `xs–md` | All columns stack vertically (full width). Profession column shows below type column. Process editor shows below profession column. |
| `lg` | Page 1: 4+8 columns. Page 2: 3+3+6 columns |
| `xl` | Page 1: 3+9 columns. Page 2: 3+3+6 columns (unchanged) |

On mobile, the "Add Screen" drawer appears as a full-width section below the process list instead of a side-by-side split.

---

## 14. Exact Colour References for Type Accents in MUI `sx`

Use `@mui/material/colors` imports:

```ts
import { teal, blue, orange, purple, indigo } from '@mui/material/colors';

const typeColorMap = {
  teal:   { badgeBg: teal[50],   badgeText: teal[700],   border: teal[200],   leftBorder: teal[500] },
  blue:   { badgeBg: blue[50],   badgeText: blue[700],   border: blue[200],   leftBorder: blue[500] },
  orange: { badgeBg: orange[50], badgeText: orange[700], border: orange[200], leftBorder: orange[500] },
  purple: { badgeBg: purple[50], badgeText: purple[700], border: purple[200], leftBorder: purple[500] },
  indigo: { badgeBg: indigo[50], badgeText: indigo[700], border: indigo[200], leftBorder: indigo[500] },
};
```

---

## 15. Save Flow (Both Pages)

```ts
const handleSave = async () => {
  setSaving(true);
  // Replace with real API call
  await new Promise(resolve => setTimeout(resolve, 900));
  setSaving(false);
  setIsEditMode(false);
  setShowAddDrawer(false);
  // Page 1:
  setSavedTypeId(selectedTypeId);
  setTimeout(() => setSavedTypeId(null), 3000);
  // Page 2 (additionally):
  setIsCustom(true);
  setSavedKey(currentKey);
  setTimeout(() => setSavedKey(null), 3000);
};
```

---

*End of PRD — Use this document as a complete specification to implement both pages in React 19 + MUI.*
