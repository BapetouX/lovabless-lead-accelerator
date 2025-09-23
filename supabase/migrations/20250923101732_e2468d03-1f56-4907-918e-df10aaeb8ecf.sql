-- Create a single, scalable comments table linked to Posts
-- This replaces the need for per-post dynamic tables (safer, simpler for N8N)

-- 1) Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.post_comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES public."Posts"(id) ON DELETE CASCADE,
  received_dm BOOLEAN DEFAULT FALSE,
  comment_date TIMESTAMPTZ,
  person_name TEXT,
  linkedin_title TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Index for performance
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON public.post_comments (post_id);

-- 3) Enable RLS and allow public read + insert (for N8N)
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'post_comments' AND policyname = 'Public can read post comments'
  ) THEN
    CREATE POLICY "Public can read post comments"
    ON public.post_comments
    FOR SELECT
    USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'post_comments' AND policyname = 'Public can insert post comments'
  ) THEN
    CREATE POLICY "Public can insert post comments"
    ON public.post_comments
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;