# Announcements Module - Technical Specification

> A comprehensive technical document for replicating the NCAHP Announcements Module.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Routing Configuration](#routing-configuration)
4. [Data Model](#data-model)
5. [Components](#components)
   - [Pages](#pages)
   - [UI Components](#ui-components)
   - [Skeleton Loaders](#skeleton-loaders)
6. [Styling & Design System](#styling--design-system)
7. [State Management](#state-management)
8. [Features & Functionality](#features--functionality)
9. [Animations](#animations)
10. [Accessibility](#accessibility)
11. [File Structure](#file-structure)
12. [Dependencies](#dependencies)
13. [Implementation Guide](#implementation-guide)

---

## Overview

The Announcements Module is a public-facing information system for displaying official announcements, notifications, and circulars. It consists of:

- **Public List View** (`/announcements`): Grid-based list with filtering, search, and pagination
- **Detail View** (`/announcements/:id`): Full announcement content with documents, sharing, and related items
- **Admin Submission Form** (`/announcements/submit`): Multi-step form for creating new announcements (admin-only)

### Key Features
- Automatic "New" badge based on validity date range (`toDate >= today`)
- Category filtering (Head Office, State Council)
- Status filtering (All, New, Past/Archived)
- Full-text search across title, punchline, and content
- Pagination (6 items per page)
- Document preview with zoom/rotation
- Text selection toolbar with Copy, Quote, Share, Search, Ask AI options
- Related announcements based on same category
- Skeleton loading states for all data-driven sections
- Responsive 2-column grid layout

---

## Architecture

```
src/
├── pages/
│   ├── Announcements.tsx          # List view
│   ├── AnnouncementDetail.tsx     # Detail view
│   └── AnnouncementSubmit.tsx     # Admin form
├── components/
│   └── announcements/
│       ├── AnnouncementCard.tsx           # Individual card
│       ├── AnnouncementCardSkeleton.tsx   # Card loading state
│       ├── AnnouncementDetailSkeleton.tsx # Detail loading state
│       ├── AnnouncementFilters.tsx        # Filter bar
│       ├── DocumentPreviewModal.tsx       # PDF/image viewer
│       ├── FileUploadZone.tsx             # Drag-drop uploader
│       └── TextSelectionToolbar.tsx       # Selection actions
```

---

## Routing Configuration

### Routes (in `App.tsx`)

```tsx
<Route path="/announcements" element={<Announcements />} />
<Route path="/announcements/:id" element={<AnnouncementDetail />} />
<Route path="/announcements/submit" element={<AnnouncementSubmit />} />
```

### Route Parameters
- `/announcements` - No parameters
- `/announcements/:id` - `id: string` - Announcement unique identifier
- `/announcements/submit` - No parameters (admin-only access)

---

## Data Model

### Announcement Interface

```typescript
interface Announcement {
  id: string;                                    // Unique identifier
  title: string;                                 // Main heading (10-150 chars)
  punchline: string;                             // Tagline/subtitle (10-100 chars)
  content: string;                               // Full content (50-2000 chars), supports **bold** and • bullets
  fromDate: Date;                                // Validity start date
  toDate: Date;                                  // Validity end date (used for "New" badge logic)
  createdAt: Date;                               // Publication date (displayed to users)
  category?: 'Head Office' | 'State Council';   // Source category
  documents: Document[];                         // Attached files
}

interface Document {
  name: string;      // File name with extension
  url: string;       // Download/preview URL
  size: string;      // Human-readable size (e.g., "2.4 MB")
  type?: string;     // File extension without dot (e.g., "pdf", "docx")
}
```

### "New" Badge Logic

An announcement is considered "New" when:
```typescript
const isNew = announcement.toDate >= new Date();
```

- If `toDate` is in the future or today → Show "New" badge
- If `toDate` is in the past → Announcement is archived/expired

### Date Display Rules

- **List View (Card)**: Show only `createdAt` as "DD Mon YYYY"
- **Detail View**: Show only `createdAt` as "Published DD Month YYYY"
- **No expiry/validity date shown to public** - only used internally for badge logic

---

## Components

### Pages

#### 1. Announcements List (`/announcements`)

**File**: `src/pages/Announcements.tsx`

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ Header                                   │
├─────────────────────────────────────────┤
│ Navbar                                   │
├─────────────────────────────────────────┤
│ Hero Section (Compact)                   │
│ - Badge: "X New"                         │
│ - Title: "Official Announcements"        │
│ - Subtitle                               │
│ - [Submit Announcement] button (admin)   │
├─────────────────────────────────────────┤
│ Filter Bar (Sticky)                      │
│ [All|New|Past] [All|Head Office|State]  │
│                              [Search...] │
├─────────────────────────────────────────┤
│ ┌─────────────┐  ┌─────────────┐        │
│ │ Card 1      │  │ Card 2      │        │
│ └─────────────┘  └─────────────┘        │
│ ┌─────────────┐  ┌─────────────┐        │
│ │ Card 3      │  │ Card 4      │        │
│ └─────────────┘  └─────────────┘        │
│ ┌─────────────┐  ┌─────────────┐        │
│ │ Card 5      │  │ Card 6      │        │
│ └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────┤
│ Pagination                               │
├─────────────────────────────────────────┤
│ Footer                                   │
└─────────────────────────────────────────┘
```

**Key State**:
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'archived'>('all');
const [categoryFilter, setCategoryFilter] = useState<'all' | 'head-office' | 'state-council'>('all');
const [currentPage, setCurrentPage] = useState(1);
const [isLoading, setIsLoading] = useState(true);
```

**Pagination**:
- `ITEMS_PER_PAGE = 6`
- Ellipsis logic for large page counts
- Reset to page 1 on filter/search change

**Hero Section Styling**:
```tsx
<section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent py-8 lg:py-10">
```

---

#### 2. Announcement Detail (`/announcements/:id`)

**File**: `src/pages/AnnouncementDetail.tsx`

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ Header                                   │
├─────────────────────────────────────────┤
│ Navbar                                   │
├─────────────────────────────────────────┤
│ Breadcrumb                               │
│ Home > Announcements > [Title]           │
├─────────────────────────────────────────┤
│ [← Back to Announcements]                │
├─────────────────────────────────────────┤
│ Article Card                             │
│ ┌───────────────────────────────────┐   │
│ │ [New] [Head Office] • Published X  │   │
│ │                                    │   │
│ │ Title                              │   │
│ │ "Punchline in italics"             │   │
│ │                                    │   │
│ │ [Copy Link] [Share] [Print]        │   │
│ ├───────────────────────────────────┤   │
│ │ Content with markdown-like parsing │   │
│ │ - **Bold** text support            │   │
│ │ - • Bullet points                  │   │
│ ├───────────────────────────────────┤   │
│ │ 📎 Attached Documents              │   │
│ │ ┌────────┐ ┌────────┐             │   │
│ │ │ Doc 1  │ │ Doc 2  │             │   │
│ │ └────────┘ └────────┘             │   │
│ └───────────────────────────────────┘   │
├─────────────────────────────────────────┤
│ Related Announcements (same category)    │
│ ┌────────┐ ┌────────┐ ┌────────┐        │
│ │ Rel 1  │ │ Rel 2  │ │ Rel 3  │        │
│ └────────┘ └────────┘ └────────┘        │
├─────────────────────────────────────────┤
│ Footer                                   │
└─────────────────────────────────────────┘
```

**Content Parsing**:
```typescript
// Split by double newlines for paragraphs
announcement.content.split('\n\n').map((paragraph, idx) => (
  <p 
    dangerouslySetInnerHTML={{
      __html: paragraph
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
        .replace(/^• /gm, '<span class="text-primary mr-2">•</span>')
    }}
  />
))
```

**Text Selection Toolbar**:
- Appears when user selects text within content area
- Actions: Copy, Quote, Share, Search (Google), Ask AI
- Positioned above selection, centered horizontally
- Dark background with light text for contrast

**Sharing Features**:
```typescript
// Web Share API with clipboard fallback
const handleShare = async () => {
  if (navigator.share) {
    await navigator.share({
      title: announcement.title,
      text: announcement.punchline,
      url: window.location.href,
    });
  } else {
    await navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  }
};
```

---

#### 3. Announcement Submit (`/announcements/submit`)

**File**: `src/pages/AnnouncementSubmit.tsx`

**Access Control**:
```typescript
const useIsAdmin = () => {
  return true; // TODO: Replace with actual auth check
};
```

**Form Schema (Zod)**:
```typescript
const formSchema = z.object({
  title: z.string()
    .min(10, 'Title must be at least 10 characters')
    .max(150, 'Title must be under 150 characters'),
  punchline: z.string()
    .min(10, 'Punchline must be at least 10 characters')
    .max(100, 'Punchline must be under 100 characters'),
  content: z.string()
    .min(50, 'Content must be at least 50 characters')
    .max(2000, 'Content must be under 2000 characters'),
  fromDate: z.date({ required_error: 'Start date is required' }),
  toDate: z.date({ required_error: 'End date is required' }),
}).refine((data) => data.toDate >= data.fromDate, {
  message: 'End date must be after start date',
  path: ['toDate'],
});
```

**Progress Steps**:
```typescript
const steps = [
  { icon: Type, label: 'Title & Punchline', completed: !!title && !!punchline },
  { icon: FileText, label: 'Content', completed: !!content },
  { icon: Calendar, label: 'Date Range', completed: !!fromDate && !!toDate },
  { icon: Sparkles, label: 'Documents', completed: files.length > 0 },
];
```

**Form Sections** (each in a card):
1. **Title & Punchline** - Two text inputs
2. **Content** - Textarea with character counter
3. **Date Range** - Two calendar popovers
4. **Documents** - Drag-and-drop file upload

**Success State**:
- Full-screen success message with checkmark animation
- Options: "View All Announcements" or "Submit Another"

---

### UI Components

#### AnnouncementCard

**Props**:
```typescript
interface AnnouncementCardProps {
  announcement: Announcement;
  isNew: boolean;
  index: number;  // For staggered animation
}
```

**Features**:
- "New" badge (absolute positioned, top-right)
- Metadata row: Calendar icon + date + category icon + category name
- Title (link to detail page)
- Punchline in italics
- Content preview (3 lines) with inline "Read more" link
- Documents section with horizontal scroll
- Scroll buttons appear only when content overflows
- Document chips with Preview (Eye) and Download icons
- Bottom accent bar (gradient for new, muted for archived)

**Document Scroll Logic**:
```typescript
useEffect(() => {
  const container = scrollContainerRef.current;
  if (container) {
    const checkOverflow = () => {
      const hasOverflow = container.scrollWidth > container.clientWidth;
      const isAtStart = container.scrollLeft <= 5;
      const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
      setCanScrollLeft(hasOverflow && !isAtStart);
      setCanScrollRight(hasOverflow && !isAtEnd);
    };
    // ... event listeners
  }
}, [announcement.documents]);
```

---

#### AnnouncementFilters

**Props**:
```typescript
interface AnnouncementFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilter: 'all' | 'new' | 'archived';
  onFilterChange: (filter: 'all' | 'new' | 'archived') => void;
  categoryFilter: 'all' | 'head-office' | 'state-council';
  onCategoryChange: (category: 'all' | 'head-office' | 'state-council') => void;
  counts: { all: number; new: number; archived: number };
}
```

**Layout**:
- Sticky positioned (`sticky top-0 z-20`)
- Glass morphism effect (`bg-background/80 backdrop-blur-xl`)
- Left side: Status filters (pill group) + Category filters (buttons)
- Right side: Search input with icon

---

#### DocumentPreviewModal

**Props**:
```typescript
interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    name: string;
    url: string;
    size: string;
    type?: string;
  } | null;
}
```

**Features**:
- Zoom in/out (50% - 200%, 25% increments)
- Rotation (90° increments)
- Open in new tab
- Download button
- PDF: iframe embed
- Images: img tag with transforms
- Unsupported: Fallback with download prompt

---

#### TextSelectionToolbar

**Props**:
```typescript
interface TextSelectionToolbarProps {
  containerRef: React.RefObject<HTMLElement>;
  onAskAI?: (text: string) => void;
}
```

**Actions**:
```typescript
const actions = [
  { icon: <Copy />, label: 'Copy', onClick: handleCopy },
  { icon: <Quote />, label: 'Quote', onClick: handleQuote },
  { icon: <Share2 />, label: 'Share', onClick: handleShare },
  { icon: <Search />, label: 'Search', onClick: handleSearch },  // Opens Google
  { icon: <Sparkles />, label: 'Ask AI', onClick: handleAskAI },
];
```

**Positioning**:
```typescript
// Position above selection, centered
const x = rect.left + rect.width / 2 - containerRect.left;
const y = rect.top - containerRect.top - 8;

style={{
  left: position.x,
  top: position.y,
  transform: 'translate(-50%, -100%)',
}}
```

**Visibility Rules**:
- Minimum 3 characters selected
- Selection must be within container
- Hides on scroll
- Delay before hiding to allow button clicks

---

#### FileUploadZone

**Props**:
```typescript
interface FileUploadZoneProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;           // Default: 10
  maxSizeMB?: number;          // Default: 10
  acceptedTypes?: string[];    // Default: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg']
}
```

**Features**:
- Drag-and-drop with visual feedback
- Click to browse
- File type validation
- Size validation
- File list with icons based on type
- Remove button on hover
- Progress counter (X/10 files)

---

### Skeleton Loaders

#### AnnouncementCardSkeleton

**Props**: `{ count?: number }` - Default: 6

Renders animated placeholder cards matching the AnnouncementCard layout:
- Header row with date/category placeholders
- Title lines
- Punchline line
- Content lines
- Document chips
- Bottom accent bar

#### AnnouncementDetailSkeleton

Renders full-page skeleton for detail view:
- Back button placeholder
- Article card skeleton
- Header badges
- Title lines
- Content paragraphs
- Documents grid
- Related announcements grid (3 items)

---

## Styling & Design System

### Color Palette

```css
/* Primary Brand Teal */
--primary: 175 79% 27%;           /* #0E7A7A */
--primary-dark: 180 84% 16%;      /* #064C4C */

/* Accent Neutral Slate */
--accent: 215 19% 35%;            /* #4A5568 */
--accent-hover: 210 20% 23%;      /* #2F3A45 */

/* Surface Colors */
--background: 0 0% 100%;          /* White */
--muted: 210 25% 97%;             /* #F6F8FA */
--card: 0 0% 100%;                /* White */

/* Text Colors */
--foreground: 200 19% 18%;        /* #263238 */
--muted-foreground: 200 19% 35%;

/* Borders */
--border: 213 27% 84%;            /* #CBD5E1 */

/* Status Colors */
--success: 123 46% 34%;           /* #2E7D32 */
--warning: 28 86% 62%;            /* #F2994A */
--destructive: 0 65% 51%;         /* #D32F2F */
```

### Typography

```css
/* Headings */
font-family: 'IBM Plex Serif', 'Georgia', serif;
font-weight: 600;

/* Body Text */
font-family: 'Noto Sans', 'Helvetica', 'Arial', sans-serif;
```

### Key Classes

```css
/* Hero Gradient */
.bg-gradient-to-br.from-primary.via-primary-dark.to-accent

/* Card Styling */
.bg-card.rounded-xl.border.border-border.shadow-sm

/* New Card Variant */
.bg-card.border-accent/30.shadow-md

/* Archived Card Variant */
.bg-card/80.border-border.shadow-sm

/* Filter Bar */
.sticky.top-0.z-20.bg-background/80.backdrop-blur-xl.border-b.border-border

/* Bottom Accent Bars */
/* New: */ .bg-gradient-to-r.from-primary.via-accent.to-primary
/* Archived: */ .bg-gradient-to-r.from-muted.via-border.to-muted
```

### Text Selection Highlight

```css
::selection {
  background: hsl(var(--primary) / 0.3);
  color: hsl(var(--foreground));
}
```

---

## State Management

### Local State (useState)

The module uses React's built-in state management:

```typescript
// List Page State
const [searchQuery, setSearchQuery] = useState('');
const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'archived'>('all');
const [categoryFilter, setCategoryFilter] = useState<'all' | 'head-office' | 'state-council'>('all');
const [currentPage, setCurrentPage] = useState(1);
const [isLoading, setIsLoading] = useState(true);

// Detail Page State
const [isLoading, setIsLoading] = useState(true);

// Submit Form State
const [files, setFiles] = useState<UploadedFile[]>([]);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSubmitted, setIsSubmitted] = useState(false);
```

### Derived State (useMemo)

```typescript
// Categorized announcements
const categorizedAnnouncements = useMemo(() => {
  let announcements = [...sampleAnnouncements];
  // Apply category filter
  // Split into new/archived based on toDate
  return { new, archived, all };
}, [categoryFilter]);

// Filtered announcements
const filteredAnnouncements = useMemo(() => {
  let announcements = categorizedAnnouncements[activeFilter];
  // Apply search filter
  return announcements;
}, [activeFilter, searchQuery, categorizedAnnouncements]);

// Paginated announcements
const paginatedAnnouncements = useMemo(() => {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  return filteredAnnouncements.slice(startIndex, startIndex + ITEMS_PER_PAGE);
}, [filteredAnnouncements, currentPage]);
```

---

## Features & Functionality

### 1. Filtering

**Status Filters**:
- `all` - All announcements sorted by createdAt descending
- `new` - Where `toDate >= today`
- `archived` - Where `toDate < today`

**Category Filters**:
- `all` - No category filter
- `head-office` - `category === 'Head Office'`
- `state-council` - `category === 'State Council'`

### 2. Search

Full-text search across:
- `title`
- `punchline`
- `content`

Case-insensitive matching:
```typescript
const query = searchQuery.toLowerCase();
announcements.filter(a => 
  a.title.toLowerCase().includes(query) || 
  a.punchline.toLowerCase().includes(query) ||
  a.content.toLowerCase().includes(query)
);
```

### 3. Pagination

- 6 items per page
- Ellipsis for large page counts (> 5 pages)
- Previous/Next buttons with disabled states
- Page number buttons

### 4. Document Handling

**Preview Support**:
- PDF: Embedded iframe
- Images (jpg, jpeg, png, gif, webp): img tag
- Others: Download prompt

**Horizontal Scrolling**:
- Hidden scrollbar (CSS)
- Arrow buttons appear on overflow
- Smooth scroll (140px per click)

### 5. Loading States

Simulated loading with setTimeout:
```typescript
useEffect(() => {
  setIsLoading(true);
  const timer = setTimeout(() => {
    setIsLoading(false);
  }, 600); // 600-800ms typical
  return () => clearTimeout(timer);
}, []);
```

---

## Animations

### Framer Motion Usage

**Staggered Card Entry**:
```typescript
<motion.article
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: index * 0.05 }}
>
```

**Filter Bar Entry**:
```typescript
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
```

**Text Selection Toolbar**:
```typescript
<motion.div
  initial={{ opacity: 0, y: 8, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: 4, scale: 0.98 }}
  transition={{ duration: 0.15, ease: 'easeOut' }}
>
```

**File Upload Zone Drag State**:
```typescript
<motion.div
  animate={{
    scale: isDragging ? 1.01 : 1,
    borderColor: isDragging ? 'hsl(var(--primary))' : 'hsl(var(--border))',
  }}
>
```

### CSS Animations

**Marquee** (for ticker):
```css
@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
.animate-marquee {
  animation: marquee 30s linear infinite;
}
```

**Loading Spinner**:
```typescript
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
/>
```

---

## Accessibility

### Focus States

Global focus-visible styles:
```css
button:focus-visible,
a:focus-visible,
[role="button"]:focus-visible,
input:focus-visible {
  outline: 2px solid hsl(215 19% 35%);
  outline-offset: 2px;
}
```

### ARIA Attributes

- Document scroll buttons have `title` attributes
- Close button has `aria-label="Close announcements"`
- Print/Share/Copy buttons have descriptive titles

### Keyboard Navigation

- All interactive elements are focusable
- Forms use proper label associations via react-hook-form
- Dialogs trap focus (via Radix UI Dialog)

---

## File Structure

```
src/
├── pages/
│   ├── Announcements.tsx          # 513 lines
│   ├── AnnouncementDetail.tsx     # 530 lines
│   └── AnnouncementSubmit.tsx     # 464 lines
├── components/
│   └── announcements/
│       ├── AnnouncementCard.tsx           # 235 lines
│       ├── AnnouncementCardSkeleton.tsx   # 61 lines
│       ├── AnnouncementDetailSkeleton.tsx # 87 lines
│       ├── AnnouncementFilters.tsx        # 115 lines
│       ├── DocumentPreviewModal.tsx       # 181 lines
│       ├── FileUploadZone.tsx             # 221 lines
│       └── TextSelectionToolbar.tsx       # 193 lines
```

**Total**: ~2,600 lines of TypeScript/TSX

---

## Dependencies

### Required Packages

```json
{
  "framer-motion": "^12.x",        // Animations
  "lucide-react": "^0.462.x",       // Icons
  "react-router-dom": "^6.x",       // Routing
  "react-hook-form": "^7.x",        // Form handling
  "@hookform/resolvers": "^3.x",    // Zod integration
  "zod": "^3.x",                    // Validation
  "date-fns": "^3.x",               // Date formatting
  "sonner": "^1.x",                 // Toast notifications
  "@radix-ui/react-dialog": "^1.x", // Modal dialogs
  "@radix-ui/react-popover": "^1.x", // Calendar popover
  "tailwindcss-animate": "^1.x"     // Animation utilities
}
```

### Icons Used (lucide-react)

```
Megaphone, Plus, Bell, Volume2,
ArrowLeft, ArrowRight, Calendar, Clock,
FileText, Download, Sparkles, Share2,
Printer, ChevronRight, ChevronLeft, Eye,
Building2, MapPin, Copy, ExternalLink,
Search, Filter, Archive, X, ZoomIn,
ZoomOut, RotateCw, Type, Send, CheckCircle2,
Upload, File, Image, FileSpreadsheet,
AlertCircle, Quote, Highlighter
```

---

## Implementation Guide

### Step 1: Set Up Routing

Add routes to your main App component:
```tsx
<Route path="/announcements" element={<Announcements />} />
<Route path="/announcements/:id" element={<AnnouncementDetail />} />
<Route path="/announcements/submit" element={<AnnouncementSubmit />} />
```

### Step 2: Create Data Layer

Replace sample data with actual API calls or database queries:
```typescript
// Example with React Query
const { data: announcements, isLoading } = useQuery({
  queryKey: ['announcements'],
  queryFn: fetchAnnouncements
});
```

### Step 3: Implement Components

Create components in order:
1. `AnnouncementCard` (core display unit)
2. `AnnouncementFilters` (filter bar)
3. `AnnouncementCardSkeleton` (loading state)
4. `Announcements` page (assembles components)
5. `DocumentPreviewModal` (document viewer)
6. `TextSelectionToolbar` (selection actions)
7. `AnnouncementDetail` page (full content view)
8. `FileUploadZone` (admin form upload)
9. `AnnouncementSubmit` page (admin form)

### Step 4: Apply Styling

Ensure design tokens are configured in:
- `tailwind.config.ts` - Color mappings, fonts, shadows
- `src/index.css` - CSS variables, custom animations

### Step 5: Connect Backend

Replace placeholder functions:
```typescript
// Form submission
const onSubmit = async (data: FormData) => {
  const formData = new FormData();
  formData.append('title', data.title);
  // ... add other fields and files
  await fetch('/api/announcements', {
    method: 'POST',
    body: formData
  });
};

// Admin check
const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === 'admin';
};
```

### Step 6: Add Real Document Handling

Implement file storage and retrieval:
```typescript
// Upload documents to storage bucket
const uploadedDocs = await Promise.all(
  files.map(file => uploadToStorage(file))
);

// Generate preview URLs
const previewUrl = getPublicUrl(doc.path);
```

---

## Notes for Production

1. **Authentication**: Replace `useIsAdmin` mock with actual auth check
2. **Data Fetching**: Replace sample data with API calls
3. **File Storage**: Implement actual file upload/download
4. **SEO**: Add meta tags, Open Graph, structured data
5. **Error Handling**: Add error boundaries and toast notifications
6. **Performance**: Consider virtualization for large lists
7. **Analytics**: Track announcement views and downloads
8. **Caching**: Implement proper cache invalidation

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Total Module LOC: ~2,600 lines*
