-- Modifier la table post_comments_5 pour correspondre à la structure de post_comments_1
ALTER TABLE public.post_comments_5
ADD COLUMN IF NOT EXISTS linkedin_id TEXT,
ADD COLUMN IF NOT EXISTS id_comment_primary TEXT DEFAULT (gen_random_uuid())::text,
ADD COLUMN IF NOT EXISTS connection_request_statut BOOLEAN;

-- Supprimer l'ancienne colonne id si elle existe (remplacée par id_comment_primary)
ALTER TABLE public.post_comments_5 DROP COLUMN IF EXISTS id;
ALTER TABLE public.post_comments_5 DROP COLUMN IF EXISTS post_id;

-- Créer une nouvelle fonction pour créer les tables de commentaires avec la bonne structure
CREATE OR REPLACE FUNCTION public.create_post_comments_table(post_id_param bigint)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  table_name TEXT;
  sql_statement TEXT;
BEGIN
  -- Generate table name
  table_name := 'post_comments_' || post_id_param::TEXT;
  
  -- Build SQL statement avec la même structure que post_comments_1
  sql_statement := format('
    CREATE TABLE IF NOT EXISTS public.%I (
      id_comment_primary TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::text,
      linkedin_id TEXT NOT NULL,
      person_name TEXT,
      linkedin_title TEXT,
      linkedin_url TEXT,
      comment_date TIMESTAMPTZ,
      received_dm BOOLEAN DEFAULT FALSE,
      connection_request_statut BOOLEAN,
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
    
    DROP POLICY IF EXISTS %I ON public.%I;
    CREATE POLICY %I
    ON public.%I
    FOR UPDATE
    USING (true);
  ', 
  table_name,
  table_name,
  'read_' || table_name, table_name,
  'read_' || table_name, table_name,
  'insert_' || table_name, table_name,
  'insert_' || table_name, table_name,
  'update_' || table_name, table_name,
  'update_' || table_name, table_name
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
$function$;