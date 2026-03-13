<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Implementation Notes for Lovable v1 - Workflow Mapping UI

## 1. Tech Stack \& Constraints

```
Frontend: Next.js 15 (App Router) + TypeScript 5.6+
Styling: Tailwind CSS 4 + shadcn/ui components
Diagramming: React Flow 12.x (primary) or xyflow as fallback
State Management: Zustand (single store for workflow state)
Routing: Next.js App Router
Icons: Lucide React
Forms: react-hook-form + Zod
Date/Other: date-fns
Deployment: Vercel-ready
```

**No other major dependencies.** Keep bundle small. Use shadcn/ui for all form components, buttons, modals, tables.

## 2. MVP Scope (v1 - 4-6 weeks effort)

### ✅ **Must Have (Core Loop)**

```
1. Workflow Catalog page (/workflows)
   - Data table with Application Types (mock 50+ items)
   - Filters, search, bulk select
   - Row actions: View, Edit, Copy From..., Copy To...

2. Workflow Editor (/workflows/[id]/editor)
   - React Flow canvas with horizontal swimlanes
   - Basic nodes: Start (circle), Task (rounded rect), End (circle)  
   - Edges with action labels (Approve/Reject/Forward)
   - Left palette: drag new steps to lanes
   - Right properties panel: step config + actions/transitions
   - Bottom rules table (synchronized selection)
   - Save/Publish/Validate buttons

3. Copy/Reuse Wizard (modal flow)
   - Source selection → Target scope → Conflict resolution → Confirm
   - Bulk apply to 10+ application types

4. Basic validation
   - No dead ends from Start node
   - Every action has target state
   - Show errors on canvas + list
```


### 🎯 **Nice To Have (v1.1)**

```
- Version history
- Templates library  
- Keyboard navigation
- Export PDF/BPMN
- Real backend integration
```


### ❌ **Out Of Scope (Never)**

```
- Parallel gateways
- BPMN 2.0 full compliance
- Real-time collaboration
- Mobile/responsive (desktop 1440px+ only)
- Complex conditions (simple amount checks only)
- User management/permissions
```


## 3. Data Models (TypeScript Interfaces)

```typescript
interface ApplicationType {
  id: string;
  name: string;
  category: string;
  hasWorkflow: boolean;
  status: 'none' | 'draft' | 'published';
  updatedAt: string;
  updatedBy: string;
}

interface Role {
  id: string;
  name: string;
  color: string; // hex for lane background
}

interface Step {
  id: string;
  type: 'start' | 'task' | 'decision' | 'end';
  name: string;
  roleId: string;
  position: { x: number; y: number };
}

interface Action {
  id: string;
  name: string; // "Approve", "Reject", etc.
}

interface Transition {
  id: string;
  fromStepId: string;
  actionId: string;
  toStepId: string;
  condition?: string; // "amount > 100000"
}

interface Workflow {
  id: string;
  applicationTypeId: string;
  version: string;
  roles: Role[];
  steps: Step[];
  actions: Action[];
  transitions: Transition[];
  status: 'draft' | 'published';
}
```

**Mock these in Zustand store with 3 sample workflows.**

## 4. Routes \& Page Structure

```
📁 app/
├── workflows/
│   ├── page.tsx          # Catalog (DataTable)
│   └── [id]/
│       └── editor/
│           └── page.tsx  # Editor (3-panel layout)
├── api/                  # Mock endpoints
│   └── workflows/...
└── globals.css           # Tailwind + custom canvas styles
```


## 5. File Structure Expected

```
src/
├── components/
│   ├── ui/              # shadcn components
│   ├── workflow/        # Editor, Canvas, Swimlanes, PropertiesPanel, RulesTable
│   └── catalog/         # CatalogTable, BulkActions
├── lib/
│   ├── workflow-store.ts # Zustand store
│   └── validation.ts    # Workflow validation logic
├── types/               # All interfaces above
└── data/                # Mock workflows
```


## 6. UX Must-Haves (Polish These)

```
✅ Canvas feels smooth (60fps drag/drop, snap to grid)
✅ Swimlane headers sticky on scroll  
✅ Properties panel auto-updates on canvas selection
✅ Rules table ↔ canvas selection sync (highlight + scroll)
✅ Copy wizard handles 50+ targets without lag
✅ Validation shows instantly, clickable errors
✅ Empty states + loading states everywhere
✅ Cmd+K search (jump to app type, role, step)
```

**Basic is fine for:** Save logic, modals, forms.

## 7. Visual Design Rules

```
Primary: slate-50 canvas bg, neutral grays
Swimlanes: role.color/10% opacity bands
Nodes: rounded, subtle shadows, role-based border colors
Edges: thick (3px), action labels mid-edge, curved paths
Focus: thick blue outline (3px slate-400)
Errors: red outline + ⚠️ icon (never color-only)
Buttons: shadcn default (destructive for Delete/Publish)
Spacing: 24px gutters, 8px node padding
```


## 8. Lovable Prompt Template

```
"Build a workflow mapping admin UI for government applications exactly per this PRD [link] and Implementation Notes [link]. 

MVP scope only: Catalog + Editor + Copy wizard. Use Next.js + React Flow + Tailwind + shadcn. 

3 sample workflows in code. No backend needed. Make canvas buttery smooth. Follow data models exactly.

Desktop only. Prioritize: swimlane drag/drop, canvas↔table sync, copy wizard with conflicts."
```


## 9. Success Criteria

```
✅ Catalog loads 100 rows instantly, searchable/filterable
✅ Can build 5-step workflow in <2min via drag/drop  
✅ Copy workflow to 25 app types → conflict modal → success toast
✅ Canvas handles 50 nodes/100 edges without stutter
✅ Ctrl+S saves, Cmd+K search works
✅ Zero console errors, TypeScript clean
✅ Deployable to Vercel instantly
```


***

**Give Lovable: PRD + this doc + your preferred color palette.** This gets you 85% there in one shot. Iterate canvas smoothness + copy wizard UX after first build.

