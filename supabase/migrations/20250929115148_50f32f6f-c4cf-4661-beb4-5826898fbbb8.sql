-- Create table for post creation
CREATE TABLE public.post_creation (
    id BIGSERIAL PRIMARY KEY,
    caption TEXT,
    url_media TEXT,
    statut TEXT,
    written_created_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.post_creation ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (following existing pattern)
CREATE POLICY "Allow public read access to post creation" 
ON public.post_creation 
FOR SELECT 
USING (true);

CREATE POLICY "Allow insert access to post creation" 
ON public.post_creation 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow update access to post creation" 
ON public.post_creation 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow delete access to post creation" 
ON public.post_creation 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_post_creation_updated_at
BEFORE UPDATE ON public.post_creation
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();