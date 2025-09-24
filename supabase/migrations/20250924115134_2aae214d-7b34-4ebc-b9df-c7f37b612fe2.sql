-- Fix the id_comment_primary column in post_comments_1 table
-- First, add a temporary sequence to generate unique values
CREATE TEMPORARY SEQUENCE IF NOT EXISTS temp_seq;

-- Update NULL values with unique sequential values using a subquery
WITH numbered_rows AS (
  SELECT ctid, 
         'comment_' || nextval('temp_seq') as new_id
  FROM public.post_comments_1 
  WHERE id_comment_primary IS NULL
)
UPDATE public.post_comments_1 
SET id_comment_primary = numbered_rows.new_id
FROM numbered_rows
WHERE public.post_comments_1.ctid = numbered_rows.ctid;

-- Drop the temporary sequence
DROP SEQUENCE IF EXISTS temp_seq;

-- Make the column NOT NULL and set a default value
ALTER TABLE public.post_comments_1 
ALTER COLUMN id_comment_primary SET NOT NULL,
ALTER COLUMN id_comment_primary SET DEFAULT gen_random_uuid()::text;

-- Add primary key constraint
ALTER TABLE public.post_comments_1 
ADD CONSTRAINT post_comments_1_pkey PRIMARY KEY (id_comment_primary);