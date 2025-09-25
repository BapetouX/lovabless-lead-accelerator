-- Drop the existing function and recreate with correct parameter handling
DROP FUNCTION IF EXISTS count_comments_by_status(text);

CREATE OR REPLACE FUNCTION count_comments_by_status(p_table_name TEXT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_count INTEGER := 0;
  received_dm_count INTEGER := 0;
  connection_request_count INTEGER := 0;
  sql_query TEXT;
BEGIN
  -- Check if table exists (fix ambiguous reference)
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.tables t
    WHERE t.table_schema = 'public' 
    AND t.table_name = p_table_name
  ) THEN
    RETURN json_build_object(
      'total', 0,
      'received_dm', 0,
      'connection_request', 0,
      'not_received_dm', 0,
      'not_connection_request', 0,
      'error', 'Table does not exist'
    );
  END IF;

  -- Count total comments
  sql_query := format('SELECT COUNT(*) FROM public.%I', p_table_name);
  EXECUTE sql_query INTO total_count;

  -- Count people who received DM
  sql_query := format('SELECT COUNT(*) FROM public.%I WHERE received_dm = true', p_table_name);
  EXECUTE sql_query INTO received_dm_count;

  -- Count people who received connection request
  sql_query := format('SELECT COUNT(*) FROM public.%I WHERE connection_request_statut = true', p_table_name);
  EXECUTE sql_query INTO connection_request_count;

  RETURN json_build_object(
    'total', total_count,
    'received_dm', received_dm_count,
    'connection_request', connection_request_count,
    'not_received_dm', total_count - received_dm_count,
    'not_connection_request', total_count - connection_request_count
  );
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'total', 0,
    'received_dm', 0,
    'connection_request', 0,
    'not_received_dm', 0,
    'not_connection_request', 0,
    'error', SQLERRM
  );
END;
$$;