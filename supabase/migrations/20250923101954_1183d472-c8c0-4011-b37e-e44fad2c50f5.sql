-- Fix the security warning by setting search_path for the function
CREATE OR REPLACE FUNCTION public.create_post_comments_table(post_id_param BIGINT)
RETURNS JSONB AS $$
DECLARE
  table_name TEXT;
  sql_statement TEXT;
BEGIN
  -- Generate table name
  table_name := 'post_comments_' || post_id_param::TEXT;
  
  -- Build SQL statement
  sql_statement := format('
    CREATE TABLE IF NOT EXISTS public.%I (
      id BIGSERIAL PRIMARY KEY,
      post_id BIGINT NOT NULL DEFAULT %L,
      received_dm BOOLEAN DEFAULT FALSE,
      comment_date TIMESTAMPTZ,
      person_name TEXT,
      linkedin_title TEXT,
      linkedin_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    
    ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS %I ON public.%I;
    CREATE POLICY %I
    ON public.%I
    FOR SELECT
    USING (true);
    
    DROP POLICY IF EXISTS %I ON public.%I;
    CREATE POLICY %I
    ON public.%I
    FOR INSERT
    WITH CHECK (true);
  ', 
  table_name, 
  post_id_param,
  table_name,
  'read_' || table_name, table_name,
  'read_' || table_name, table_name,
  'insert_' || table_name, table_name,
  'insert_' || table_name, table_name
  );
  
  -- Execute the SQL
  EXECUTE sql_statement;
  
  -- Return success response
  RETURN json_build_object(
    'success', true,
    'table_name', table_name,
    'post_id', post_id_param
  );
EXCEPTION WHEN OTHERS THEN
  -- Return error response
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM,
    'table_name', table_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;