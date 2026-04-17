

## Plan: Secretary (UP State Council) Dashboard

### Route
`/dashboard/secretary-up` — new page added to `App.tsx`

### Layout Architecture
Single-page dashboard with sticky top header + 5 tab-style sections (matching user's preference for high-density single-page layouts over multi-page wizards).

```text
┌─────────────────────────────────────────────────────────────┐
│ HERO HEADER (teal gradient, glassmorphic)                   │
│ Secretary Dashboard · Uttar Pradesh State Council           │
│ [Avatar] Dr. Name · NCAHP-UP · Last login                   │
├─────────────────────────────────────────────────────────────┤
│ KPI STRIP (5 stat cards, one per section)                   │
│ New: 24 │ Evaluated: 18 │ Forwarded: 12 │ UID: 9 │ Cert: 7  │
├─────────────────────────────────────────────────────────────┤
│ TAB BAR (sticky) ─ pill-style, teal-active                  │
│ ① New │ ② Evaluated │ ③ Forwarded │ ④ UID │ ⑤ Certificates  │
├─────────────────────────────────────────────────────────────┤
│ FILTER TOOLBAR (always visible)                             │
│ [Search ID/name] [Form Type ▾] [Reg Type ▾] [Date ▾] [⚏/▦] │
├─────────────────────────────────────────────────────────────┤
│ APPLICATION LIST (table OR card grid, toggle)               │
│   Each row = ApplicationRow component with action button    │
└─────────────────────────────────────────────────────────────┘
```

### Color Application (from user's tokens)
- Header gradient: `--apt-header-gradient` (teal → orange)
- KPI cards: white surfaces with colored left-accent borders
  - New = teal (`--clr-teal`), Evaluated = mixed, Forwarded = orange, UID = navy, Cert = green
- Action buttons:
  - "Forward to Coordinating Officer" → teal primary (`--primary-color`)
  - "Forward to Secretary NCAHP" → orange (`--clr-orange`)
  - "Send rejection letter" → red (`--Danger`)
  - "Generate certificate" → green (`--update`)
- Recommended badge: `--secondary-light-color` bg + `--update` text
- Not Recommended badge: `--clr-red-light` bg + `--Danger` text
- Form-type chips: `--clr-teal-light` / `--clr-orange-light` / `--clr-navy-light` cycling per form code

### Sections (one per tab)

**1. New Applications** — flat list. Action: `Forward to Coordinating Officer` (teal). Bulk-select toolbar appears when rows checked → bulk forward.

**2. Evaluated Applications** — split into two collapsible accordion panels:
- ✓ Recommended (green header) → `Forward to Secretary NCAHP` (orange)
- ✗ Not Recommended (red header) → `Send Rejection Letter` (red)

**3. Proposals forwarded to NCAHP** — read-only list with status timeline chip ("Forwarded · 2 days ago"). No action button — just a "View Acknowledgement" ghost button.

**4. UID Generated** — each row shows UID badge (monospace, orange-tinted pill) next to App ID. Action: `Generate Certificate` (green).

**5. Certificates Generated** — final list with cert number, issue date. Actions: `Download PDF`, `View`.

### Reusable Components (new)
1. `ApplicationCard.tsx` — card variant of a row (for grid view)
2. `ApplicationTable.tsx` — dense table variant with sortable columns
3. `ApplicationRow` — shared logic, accepts `actionSlot` prop so each tab injects its own button(s)
4. `FilterToolbar.tsx` — search + form-type multi-select + registration-type filter + date range + view toggle
5. `KPIStat.tsx` — animated count-up stat card
6. `FormTypeBadge.tsx` — color-coded chip showing "Form 3A · Temporary"
7. `StatusBadge.tsx` — Recommended / Not Recommended / Forwarded / UID / Certified
8. `ConfirmActionDialog.tsx` — universal confirm modal for destructive/forward actions (uses shadcn Dialog + sonner toast on success)

### Data Layer
`src/pages/SecretaryDashboard/data/mockApplications.ts`:
- One pool of 34 applications (using exact App IDs supplied)
- Each tagged with: `applicationId`, `formCode` (3A/3B/3C/4A/1A/1B/1C/2A), `formMeta` (type + description from user's spec), `applicantName` (Indian names), `submittedAt`, `status`, optional `uid`, optional `certificateNo`
- Distributed across 5 buckets so each tab has a meaningful list (e.g. 10 new, 8 evaluated split 5/3, 5 forwarded, 6 UID, 5 certified)

### Filtering & Visualization
- **Global search**: matches App ID OR applicant name OR form code
- **Form type filter**: multi-select dropdown showing all 8 form codes with descriptions
- **Registration category filter**: Temporary / Interim / Regular / Provisional
- **Date range**: last 7 / 30 / 90 days / custom
- **View toggle**: Table (default, dense) ↔ Card grid (3-col)
- **Sort**: by date, by App ID, by name
- **Pagination**: 10 per page with shadcn Pagination
- Empty states with illustrative icon when no results

### Tech Stack
- React + TypeScript, Tailwind, existing shadcn primitives (Tabs, Table, Dialog, Badge, Select, Popover, Pagination, Card)
- `framer-motion` for tab transitions and KPI count-up
- `sonner` toasts for action feedback
- Local state only (no backend) — actions optimistically move items between buckets via a small Zustand store `secretaryDashboardStore.ts` so e.g. "Forward to CO" removes from New and surfaces in Evaluated bucket realistically

### File Plan
```text
src/pages/SecretaryDashboard/
├── index.tsx                          (main page + tabs orchestration)
├── data/
│   └── mockApplications.ts            (34 apps + form metadata)
├── store/
│   └── secretaryDashboardStore.ts     (Zustand, action handlers)
├── types.ts                           (Application, FormMeta, Status)
├── components/
│   ├── DashboardHeader.tsx
│   ├── KPIStrip.tsx
│   ├── KPIStat.tsx
│   ├── FilterToolbar.tsx
│   ├── ApplicationTable.tsx
│   ├── ApplicationCard.tsx
│   ├── FormTypeBadge.tsx
│   ├── StatusBadge.tsx
│   └── ConfirmActionDialog.tsx
└── sections/
    ├── NewApplicationsSection.tsx
    ├── EvaluatedApplicationsSection.tsx
    ├── ForwardedSection.tsx
    ├── UIDGeneratedSection.tsx
    └── CertificatesSection.tsx
```

Plus: edit `src/App.tsx` to add the route.

### Visual Polish
- Subtle teal grid background pattern on hero
- Glassmorphic KPI cards with soft `--paper-ring` shadow
- Hover-lift on table rows (translate + accent left-border)
- Animated tab indicator (framer-motion layoutId)
- Action buttons with leading icons (Forward, Send, Award, FileCheck from lucide)
- Sticky filter toolbar with backdrop blur once user scrolls
- Mobile-responsive: tabs collapse to a select dropdown, table → cards

