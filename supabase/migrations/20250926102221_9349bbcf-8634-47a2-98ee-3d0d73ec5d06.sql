-- Create function to automatically create posts table for new competitors
CREATE OR REPLACE FUNCTION public.create_competitor_posts_table()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    table_name TEXT;
    sanitized_name TEXT;
BEGIN
    -- Sanitize the competitor name for table naming
    -- Remove special characters and spaces, convert to lowercase
    sanitized_name := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]', '_', 'g'));
    sanitized_name := regexp_replace(sanitized_name, '_+', '_', 'g');
    sanitized_name := trim(sanitized_name, '_');
    
    -- Generate table name
    table_name := sanitized_name || '_posts';
    
    -- Create the posts table for this competitor
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS public.%I (
            id BIGSERIAL PRIMARY KEY,
            competitor_id BIGINT NOT NULL REFERENCES public.competitors(id) ON DELETE CASCADE,
            urn TEXT,
            full_urn TEXT,
            date TIMESTAMPTZ,
            description TEXT,
            url TEXT,
            thumbnail TEXT,
            type_post TEXT,
            total_reactions INTEGER DEFAULT 0,
            comments INTEGER DEFAULT 0,
            reposts INTEGER DEFAULT 0,
            title TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        
        -- Enable RLS
        ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;
        
        -- Create policies for the new table
        CREATE POLICY %I ON public.%I FOR SELECT USING (true);
        CREATE POLICY %I ON public.%I FOR INSERT WITH CHECK (true);
        CREATE POLICY %I ON public.%I FOR UPDATE USING (true);
        CREATE POLICY %I ON public.%I FOR DELETE USING (true);
        
        -- Create trigger for updated_at
        CREATE TRIGGER %I
            BEFORE UPDATE ON public.%I
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
            
        -- Create index on competitor_id for better performance
        CREATE INDEX IF NOT EXISTS %I ON public.%I (competitor_id);
    ', 
    table_name,
    table_name,
    'read_' || table_name, table_name,
    'insert_' || table_name, table_name,
    'update_' || table_name, table_name,
    'delete_' || table_name, table_name,
    'update_' || table_name || '_updated_at', table_name,
    'idx_' || table_name || '_competitor_id', table_name
    );
    
    -- Update the competitor record with the table name
    UPDATE public.competitors 
    SET notes = COALESCE(notes || E'\n', '') || 'Posts table: ' || table_name
    WHERE id = NEW.id;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the insert
    RAISE NOTICE 'Error creating posts table for competitor %: %', NEW.name, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger to automatically create posts table when new competitor is added
DROP TRIGGER IF EXISTS create_competitor_posts_table_trigger ON public.competitors;
CREATE TRIGGER create_competitor_posts_table_trigger
    AFTER INSERT ON public.competitors
    FOR EACH ROW
    EXECUTE FUNCTION public.create_competitor_posts_table();