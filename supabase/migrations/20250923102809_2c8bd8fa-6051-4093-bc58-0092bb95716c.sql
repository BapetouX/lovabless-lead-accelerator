-- Add a column to store the comments table name for each post
ALTER TABLE public."Posts" 
ADD COLUMN IF NOT EXISTS comments_table_name TEXT;