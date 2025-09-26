-- Enable realtime for competitors table
ALTER TABLE public.competitors REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.competitors;