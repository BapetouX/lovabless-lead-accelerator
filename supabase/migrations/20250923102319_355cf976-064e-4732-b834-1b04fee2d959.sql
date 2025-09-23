-- Allow public updates on Posts so the app can set table_exist = true
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'Posts' AND policyname = 'Allow public update posts'
  ) THEN
    CREATE POLICY "Allow public update posts"
    ON public."Posts"
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;