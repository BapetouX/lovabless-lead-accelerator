-- Drop the created_posts table
DROP TABLE IF EXISTS public.created_posts;

-- Add new columns to Posts table
ALTER TABLE public."Posts" 
ADD COLUMN IF NOT EXISTS poste BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS leadmagnet BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS type_post TEXT,
ADD COLUMN IF NOT EXISTS contenu TEXT,
ADD COLUMN IF NOT EXISTS option_image TEXT,
ADD COLUMN IF NOT EXISTS prompt_image TEXT;