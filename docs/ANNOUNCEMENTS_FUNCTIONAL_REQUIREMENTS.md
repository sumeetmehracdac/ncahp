# Announcements - Requirements Document

## Module Name: Announcements

**Author:** System Generated  
**Document Type:** Functional Requirements Document  
**Version:** 1.0  
**Last Updated:** 01-Jan-2026

---

## Version History

| Version | Date        | Author           | Description of Change |
|---------|-------------|------------------|----------------------|
| 1.0     | 01-Jan-2026 | System Generated | Initial version      |

---

## Database Schema

### Table 1/4: announcements

**Purpose:** Stores all announcement records with metadata, content, and validity dates.

| Column Name  | Data Type    | Constraints                          | Description                              | Example                              |
|--------------|--------------|--------------------------------------|------------------------------------------|--------------------------------------|
| id           | UUID         | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier                        | `a1b2c3d4-e5f6-...`                  |
| title        | TEXT         | NOT NULL                             | Announcement headline                    | "Office Closure Notice"              |
| punchline    | TEXT         | NULLABLE                             | Brief summary/subtitle                   | "All offices closed on 26th Jan"     |
| content      | TEXT         | NOT NULL                             | Full announcement body (markdown)        | "Dear colleagues, we inform..."      |
| category     | TEXT         | NOT NULL, DEFAULT 'General'          | Classification category                  | "Head Office", "Regional", "General" |
| from_date    | TIMESTAMPTZ  | NOT NULL, DEFAULT now()              | Publication/validity start date          | `2026-01-01T00:00:00Z`               |
| to_date      | TIMESTAMPTZ  | NOT NULL                             | Validity end date (drives "New" badge)   | `2026-01-31T23:59:59Z`               |
| is_published | BOOLEAN      | NOT NULL, DEFAULT false              | Publication status flag                  | `true`                               |
| view_count   | INTEGER      | NOT NULL, DEFAULT 0                  | Number of times viewed                   | `142`                                |
| created_at   | TIMESTAMPTZ  | NOT NULL, DEFAULT now()              | Record creation timestamp                | `2026-01-01T10:30:00Z`               |
| updated_at   | TIMESTAMPTZ  | NOT NULL, DEFAULT now()              | Last modification timestamp              | `2026-01-02T14:15:00Z`               |
| created_by   | UUID         | REFERENCES auth.users(id)            | Admin user who created the announcement  | `user-uuid-here`                     |

**Constraints:**
- `idx_announcements_category` — Index on `category` for filtered queries
- `idx_announcements_dates` — Composite index on `(from_date, to_date)` for date range queries
- `idx_announcements_published` — Index on `is_published` for public listing filter

---

### Table 2/4: announcement_documents

**Purpose:** Stores file attachments linked to announcements (1:N relationship).

| Column Name     | Data Type   | Constraints                                      | Description                        | Example                              |
|-----------------|-------------|--------------------------------------------------|------------------------------------|--------------------------------------|
| id              | UUID        | PRIMARY KEY, DEFAULT gen_random_uuid()           | Unique identifier                  | `d1e2f3a4-b5c6-...`                  |
| announcement_id | UUID        | NOT NULL, REFERENCES announcements(id) ON DELETE CASCADE | Parent announcement reference | `a1b2c3d4-e5f6-...`                  |
| file_name       | TEXT        | NOT NULL                                         | Original uploaded file name        | "circular_2026.pdf"                  |
| file_path       | TEXT        | NOT NULL                                         | Storage bucket path                | "announcements/2026/01/file.pdf"     |
| file_type       | TEXT        | NOT NULL                                         | MIME type of the file              | "application/pdf"                    |
| file_size       | INTEGER     | NOT NULL                                         | File size in bytes                 | `245678`                             |
| uploaded_at     | TIMESTAMPTZ | NOT NULL, DEFAULT now()                          | Upload timestamp                   | `2026-01-01T10:35:00Z`               |

**Constraints:**
- `idx_documents_announcement` — Index on `announcement_id` for join queries
- Foreign key cascade ensures documents are deleted when parent announcement is removed

---

### Table 3/4: user_roles

**Purpose:** Stores user role assignments for admin access control (security-critical).

| Column Name | Data Type | Constraints                                      | Description                    | Example                 |
|-------------|-----------|--------------------------------------------------|--------------------------------|-------------------------|
| id          | UUID      | PRIMARY KEY, DEFAULT gen_random_uuid()           | Unique identifier              | `r1s2t3u4-v5w6-...`     |
| user_id     | UUID      | NOT NULL, REFERENCES auth.users(id) ON DELETE CASCADE | User reference          | `user-uuid-here`        |
| role        | app_role  | NOT NULL                                         | Role enum value                | `admin`                 |

**Constraints:**
- `UNIQUE (user_id, role)` — Prevents duplicate role assignments
- `app_role` is an ENUM: `('admin', 'moderator', 'user')`

---

### Table 4/4: profiles

**Purpose:** Stores user profile information for display purposes.

| Column Name | Data Type   | Constraints                                      | Description              | Example               |
|-------------|-------------|--------------------------------------------------|--------------------------|-----------------------|
| id          | UUID        | PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE | User reference   | `user-uuid-here`      |
| full_name   | TEXT        | NULLABLE                                         | Display name             | "Sumeet Mehra"        |
| avatar_url  | TEXT        | NULLABLE                                         | Profile image URL        | "https://..."         |
| updated_at  | TIMESTAMPTZ | NOT NULL, DEFAULT now()                          | Last update timestamp    | `2026-01-01T10:00:00Z`|

---

## Row-Level Security (RLS) Policies

### announcements Table

| Policy Name              | Operation | Target Role   | Condition                                      |
|--------------------------|-----------|---------------|------------------------------------------------|
| Public read published    | SELECT    | anon, authenticated | `is_published = true AND from_date <= now()` |
| Admin full access        | ALL       | authenticated | `public.has_role(auth.uid(), 'admin')`         |

### announcement_documents Table

| Policy Name              | Operation | Target Role   | Condition                                                     |
|--------------------------|-----------|---------------|---------------------------------------------------------------|
| Public read via parent   | SELECT    | anon, authenticated | Parent announcement is published and active              |
| Admin full access        | ALL       | authenticated | `public.has_role(auth.uid(), 'admin')`                        |

### user_roles Table

| Policy Name        | Operation | Target Role   | Condition                                      |
|--------------------|-----------|---------------|------------------------------------------------|
| Users read own     | SELECT    | authenticated | `user_id = auth.uid()`                         |
| Admin manage all   | ALL       | authenticated | `public.has_role(auth.uid(), 'admin')`         |

---

## Storage Configuration

### Bucket: announcement-documents

| Property          | Value                                              |
|-------------------|----------------------------------------------------|
| Bucket Name       | `announcement-documents`                           |
| Public Access     | `true` (files accessible via signed URLs)          |
| Max File Size     | 10 MB                                              |
| Allowed MIME Types| `application/pdf`, `image/jpeg`, `image/png`, `image/webp`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |

### Storage Policies

| Policy Name       | Operation | Condition                                          |
|-------------------|-----------|----------------------------------------------------|
| Public read       | SELECT    | `true` (all files publicly readable)               |
| Admin upload      | INSERT    | `public.has_role(auth.uid(), 'admin')`             |
| Admin delete      | DELETE    | `public.has_role(auth.uid(), 'admin')`             |

---

## Functional Requirements

| ID    | Requirement Description                                                                                          | Version |
|-------|------------------------------------------------------------------------------------------------------------------|---------|
| FR-01 | Public users can view a paginated list of published announcements sorted by `from_date` descending.             | V1.0    |
| FR-02 | Announcements display a "New" badge when `to_date >= current_date`.                                              | V1.0    |
| FR-03 | Public users can filter announcements by category and search by title/content.                                   | V1.0    |
| FR-04 | Public users can view announcement detail with full content, metadata, and attached documents.                   | V1.0    |
| FR-05 | Document attachments are downloadable and previewable (PDF, images) via storage URLs.                            | V1.0    |
| FR-06 | Admin users can create new announcements with title, punchline, content, category, date range, and attachments.  | V1.0    |
| FR-07 | Admin users can update existing announcements including replacing/removing attachments.                          | V1.0    |
| FR-08 | Admin users can delete announcements (cascades to delete associated documents from storage).                     | V1.0    |
| FR-09 | Admin users can toggle `is_published` status to control announcement visibility.                                 | V1.0    |
| FR-10 | System increments `view_count` when an announcement detail page is accessed.                                     | V1.0    |
| FR-11 | Only authenticated users with `admin` role can access submission/edit forms.                                     | V1.0    |
| FR-12 | File uploads validate MIME type and size before storage.                                                         | V1.0    |

---

## FR-01: Public Announcement Listing

**Version:** V1.0

**Description:** Public users retrieve a paginated list of active, published announcements.

**API Query:**
```sql
SELECT a.*, array_agg(d.*) as documents
FROM announcements a
LEFT JOIN announcement_documents d ON d.announcement_id = a.id
WHERE a.is_published = true AND a.from_date <= now()
GROUP BY a.id
ORDER BY a.from_date DESC
LIMIT 6 OFFSET :page_offset
```

**Response:** Array of announcement objects with nested documents array.

---

## FR-02: New Badge Logic

**Version:** V1.0

**Description:** Announcements are tagged as "New" based on validity period.

**Logic:** `isNew = announcement.to_date >= new Date()`

**Implementation:** Computed client-side; no backend flag required.

---

## FR-03: Filtering and Search

**Version:** V1.0

**Description:** Filter by category, search by title/content using case-insensitive matching.

**API Query:**
```sql
SELECT * FROM announcements
WHERE is_published = true
  AND from_date <= now()
  AND (:category IS NULL OR category = :category)
  AND (:search IS NULL OR title ILIKE '%' || :search || '%' OR content ILIKE '%' || :search || '%')
ORDER BY from_date DESC
```

---

## FR-04: Announcement Detail

**Version:** V1.0

**Description:** Retrieve single announcement with all fields and attached documents.

**API Query:**
```sql
SELECT a.*, array_agg(d.*) as documents
FROM announcements a
LEFT JOIN announcement_documents d ON d.announcement_id = a.id
WHERE a.id = :id AND a.is_published = true
GROUP BY a.id
```

---

## FR-05: Document Access

**Version:** V1.0

**Description:** Documents served via Supabase Storage public URLs.

**URL Pattern:** `{STORAGE_URL}/announcement-documents/{file_path}`

**Supported Preview:** PDF (inline), Images (inline), Others (download).

---

## FR-06: Admin Create Announcement

**Version:** V1.0

**Description:** Authenticated admin creates announcement with optional file attachments.

**Process:**
1. Validate user has `admin` role via `has_role()` function
2. Insert announcement record
3. Upload files to storage bucket
4. Insert document records with storage paths
5. Return created announcement ID

---

## FR-07: Admin Update Announcement

**Version:** V1.0

**Description:** Admin modifies announcement fields and manages attachments.

**Process:**
1. Validate admin role
2. Update announcement record
3. Handle attachment changes (add new, remove deleted)
4. Update `updated_at` timestamp

---

## FR-08: Admin Delete Announcement

**Version:** V1.0

**Description:** Admin removes announcement and all associated data.

**Process:**
1. Validate admin role
2. Delete files from storage bucket
3. Delete announcement (documents cascade via FK)

---

## FR-09: Publish Toggle

**Version:** V1.0

**Description:** Admin controls announcement visibility.

**API:**
```sql
UPDATE announcements SET is_published = :status, updated_at = now() WHERE id = :id
```

---

## FR-10: View Count Tracking

**Version:** V1.0

**Description:** Increment view counter on detail page access.

**Database Function:**
```sql
CREATE FUNCTION increment_announcement_view(announcement_id UUID)
RETURNS VOID AS $$
  UPDATE announcements SET view_count = view_count + 1 WHERE id = announcement_id
$$ LANGUAGE SQL SECURITY DEFINER;
```

---

## FR-11: Role-Based Access Control

**Version:** V1.0

**Description:** Admin routes protected via role verification.

**Security Function:**
```sql
CREATE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM user_roles WHERE user_id = _user_id AND role = _role)
$$ LANGUAGE SQL STABLE SECURITY DEFINER;
```

---

## FR-12: File Upload Validation

**Version:** V1.0

**Description:** Validate uploads before storage.

**Validation Rules:**
- Max size: 10 MB (10,485,760 bytes)
- Allowed types: PDF, JPEG, PNG, WEBP, DOC, DOCX

---

## Frontend Overview (High-Level)

| Route                  | Component             | Description                                    |
|------------------------|-----------------------|------------------------------------------------|
| `/announcements`       | `Announcements.tsx`   | Public grid listing with filters, search, pagination |
| `/announcements/:id`   | `AnnouncementDetail.tsx` | Detail view with content, documents, sharing  |
| `/announcements/submit`| `AnnouncementSubmit.tsx` | Admin-only multi-step submission form         |

**Key UI Features:**
- Responsive 2-column card grid (6 items/page)
- Category filter dropdown + search input
- Document preview modal (PDF/images)
- Text selection toolbar for copying/sharing
- Skeleton loaders during data fetch
- Framer Motion animations

---

## Future Enhancements

| ID   | Enhancement Description                                         |
|------|-----------------------------------------------------------------|
| FE-01| Email notifications on new announcement publication             |
| FE-02| Announcement scheduling (future `from_date` with auto-publish)  |
| FE-03| Rich text editor (WYSIWYG) for content authoring                |
| FE-04| Analytics dashboard for view counts and engagement metrics      |
| FE-05| Multi-language support for announcements                        |
