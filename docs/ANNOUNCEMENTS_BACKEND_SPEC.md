# Announcements Module - Backend Technical Specification

## Database Schema

### 1. Tables

#### `announcements`
```sql
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  punchline text,
  content text not null,
  from_date timestamptz not null default now(),
  to_date timestamptz not null,
  category text not null check (category in ('Head Office', 'State Council')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references auth.users(id) on delete set null,
  is_published boolean default false,
  view_count integer default 0
);

-- Indexes for performance
create index idx_announcements_category on public.announcements(category);
create index idx_announcements_to_date on public.announcements(to_date);
create index idx_announcements_is_published on public.announcements(is_published);
create index idx_announcements_created_at on public.announcements(created_at desc);
```

#### `announcement_documents`
```sql
create table public.announcement_documents (
  id uuid primary key default gen_random_uuid(),
  announcement_id uuid references public.announcements(id) on delete cascade not null,
  name text not null,
  file_path text not null,
  file_size bigint not null,
  file_type text not null,
  created_at timestamptz default now()
);

create index idx_announcement_docs_announcement on public.announcement_documents(announcement_id);
```

---

## Row-Level Security (RLS)

### Enable RLS
```sql
alter table public.announcements enable row level security;
alter table public.announcement_documents enable row level security;
```

### Security Definer Function
```sql
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;
```

### Announcements Policies
```sql
-- Public: Read published announcements
create policy "Anyone can view published announcements"
on public.announcements for select
using (is_published = true);

-- Admin: Full access
create policy "Admins can insert announcements"
on public.announcements for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update announcements"
on public.announcements for update
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete announcements"
on public.announcements for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));
```

### Documents Policies
```sql
-- Public: Read documents for published announcements
create policy "Anyone can view documents of published announcements"
on public.announcement_documents for select
using (
  exists (
    select 1 from public.announcements
    where id = announcement_id and is_published = true
  )
);

-- Admin: Manage documents
create policy "Admins can manage documents"
on public.announcement_documents for all
to authenticated
using (public.has_role(auth.uid(), 'admin'));
```

---

## Storage

### Bucket Setup
```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'announcement-documents',
  'announcement-documents',
  true,
  10485760, -- 10MB limit
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);
```

### Storage Policies
```sql
-- Public read access
create policy "Public can view announcement documents"
on storage.objects for select
using (bucket_id = 'announcement-documents');

-- Admin upload/delete
create policy "Admins can upload announcement documents"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'announcement-documents' 
  and public.has_role(auth.uid(), 'admin')
);

create policy "Admins can delete announcement documents"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'announcement-documents' 
  and public.has_role(auth.uid(), 'admin')
);
```

---

## API Queries

### List Announcements (Public)
```typescript
const { data, error } = await supabase
  .from('announcements')
  .select(`
    id,
    title,
    punchline,
    content,
    from_date,
    to_date,
    category,
    created_at,
    announcement_documents (id, name, file_path, file_size, file_type)
  `)
  .eq('is_published', true)
  .order('created_at', { ascending: false })
  .range(offset, offset + limit - 1);
```

### Get Single Announcement
```typescript
const { data, error } = await supabase
  .from('announcements')
  .select(`
    *,
    announcement_documents (*)
  `)
  .eq('id', id)
  .eq('is_published', true)
  .maybeSingle();
```

### Filter by Category
```typescript
const { data, error } = await supabase
  .from('announcements')
  .select('*, announcement_documents (*)')
  .eq('is_published', true)
  .eq('category', 'Head Office')
  .order('created_at', { ascending: false });
```

### Search Announcements
```typescript
const { data, error } = await supabase
  .from('announcements')
  .select('*, announcement_documents (*)')
  .eq('is_published', true)
  .or(`title.ilike.%${query}%,content.ilike.%${query}%,punchline.ilike.%${query}%`)
  .order('created_at', { ascending: false });
```

### Admin: Create Announcement
```typescript
// 1. Insert announcement
const { data: announcement, error } = await supabase
  .from('announcements')
  .insert({
    title,
    punchline,
    content,
    from_date: fromDate,
    to_date: toDate,
    category,
    is_published: true,
    created_by: user.id
  })
  .select()
  .single();

// 2. Upload documents
for (const file of files) {
  const filePath = `${announcement.id}/${file.name}`;
  await supabase.storage
    .from('announcement-documents')
    .upload(filePath, file);
  
  // 3. Link document to announcement
  await supabase
    .from('announcement_documents')
    .insert({
      announcement_id: announcement.id,
      name: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type
    });
}
```

### Admin: Update Announcement
```typescript
const { error } = await supabase
  .from('announcements')
  .update({
    title,
    punchline,
    content,
    from_date: fromDate,
    to_date: toDate,
    category,
    updated_at: new Date().toISOString()
  })
  .eq('id', id);
```

### Admin: Delete Announcement
```typescript
// Documents cascade-delete via FK, but clean up storage
const { data: docs } = await supabase
  .from('announcement_documents')
  .select('file_path')
  .eq('announcement_id', id);

for (const doc of docs) {
  await supabase.storage
    .from('announcement-documents')
    .remove([doc.file_path]);
}

await supabase.from('announcements').delete().eq('id', id);
```

---

## Database Functions

### Increment View Count
```sql
create or replace function public.increment_announcement_view(announcement_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.announcements
  set view_count = view_count + 1
  where id = announcement_id;
end;
$$;
```

### Get Active Announcements Count
```sql
create or replace function public.get_active_announcements_count()
returns integer
language sql
stable
as $$
  select count(*)::integer
  from public.announcements
  where is_published = true
    and to_date >= now();
$$;
```

---

## Edge Functions (Optional)

### Send Announcement Notification
```typescript
// supabase/functions/notify-announcement/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { announcementId } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: announcement } = await supabase
      .from('announcements')
      .select('title, punchline')
      .eq('id', announcementId)
      .single();

    // Send email/push notification logic here
    console.log('Notification sent for:', announcement?.title);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## TypeScript Types

```typescript
// src/types/announcements.ts
export interface Announcement {
  id: string;
  title: string;
  punchline: string | null;
  content: string;
  from_date: string;
  to_date: string;
  category: 'Head Office' | 'State Council';
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_published: boolean;
  view_count: number;
  announcement_documents?: AnnouncementDocument[];
}

export interface AnnouncementDocument {
  id: string;
  announcement_id: string;
  name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
}

export type AnnouncementInsert = Omit<Announcement, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'announcement_documents'>;
export type AnnouncementUpdate = Partial<AnnouncementInsert>;
```

---

## Validation Schema (Zod)

```typescript
import { z } from 'zod';

export const announcementSchema = z.object({
  title: z.string().min(5).max(200),
  punchline: z.string().max(300).optional(),
  content: z.string().min(20).max(10000),
  from_date: z.string().datetime(),
  to_date: z.string().datetime(),
  category: z.enum(['Head Office', 'State Council']),
  is_published: z.boolean().default(true)
});

export const documentSchema = z.object({
  name: z.string().min(1).max(255),
  file_size: z.number().max(10485760), // 10MB
  file_type: z.string()
});
```

---

## Migration Order

1. Create `app_role` enum and `user_roles` table
2. Create `has_role` security definer function
3. Create `announcements` table with indexes
4. Create `announcement_documents` table with indexes
5. Enable RLS on both tables
6. Create RLS policies
7. Create storage bucket
8. Create storage policies
9. Create database functions

---

## Environment Variables

```env
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]  # Edge functions only
```
