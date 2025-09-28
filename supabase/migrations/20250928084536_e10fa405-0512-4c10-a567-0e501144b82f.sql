-- Create a table for user-created posts
CREATE TABLE public.created_posts (
  id BIGSERIAL PRIMARY KEY,
  type_post TEXT NOT NULL CHECK (type_post IN ('full', 'idea')),
  contenu TEXT NOT NULL,
  option_image TEXT NOT NULL CHECK (option_image IN ('upload', 'ai')),
  prompt_image TEXT,
  webhook_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.created_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to created posts" 
ON public.created_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Allow insert access to created posts" 
ON public.created_posts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow update access to created posts" 
ON public.created_posts 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow delete access to created posts" 
ON public.created_posts 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_created_posts_updated_at
BEFORE UPDATE ON public.created_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();