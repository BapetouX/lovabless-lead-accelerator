-- Fix the security warning by setting search_path for the function
CREATE OR REPLACE FUNCTION count_comments_by_status(table_name TEXT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_count INTEGER := 0;
  treated_count INTEGER := 0;
  untreated_count INTEGER := 0;
  sql_query TEXT;
BEGIN
  -- Check if table exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = table_name
  ) THEN
    RETURN json_build_object(
      'total', 0,
      'treated', 0,
      'untreated', 0,
      'error', 'Table does not exist'
    );
  END IF;

  -- Count total comments
  sql_query := format('SELECT COUNT(*) FROM public.%I', table_name);
  EXECUTE sql_query INTO total_count;

  -- Count treated comments (received_dm = true)
  sql_query := format('SELECT COUNT(*) FROM public.%I WHERE received_dm = true', table_name);
  EXECUTE sql_query INTO treated_count;

  -- Calculate untreated
  untreated_count := total_count - treated_count;

  RETURN json_build_object(
    'total', total_count,
    'treated', treated_count,
    'untreated', untreated_count
  );
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'total', 0,
    'treated', 0,
    'untreated', 0,
    'error', SQLERRM
  );
END;
$$;