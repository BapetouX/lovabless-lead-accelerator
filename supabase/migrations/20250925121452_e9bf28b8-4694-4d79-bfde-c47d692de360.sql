-- Créer la table des concurrents
CREATE TABLE public.competitors (
  id BIGSERIAL PRIMARY KEY,
  id_linkedin TEXT NOT NULL UNIQUE,
  name TEXT,
  headline TEXT,
  entreprise TEXT,
  url TEXT,
  follower_count INTEGER,
  connection_level TEXT,
  industry TEXT,
  location TEXT,
  last_activity_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur la table competitors
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS pour la table competitors
CREATE POLICY "Allow public read access to competitors" 
ON public.competitors 
FOR SELECT 
USING (true);

CREATE POLICY "Allow insert access to competitors" 
ON public.competitors 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow update access to competitors" 
ON public.competitors 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow delete access to competitors" 
ON public.competitors 
FOR DELETE 
USING (true);

-- Créer la table des posts des concurrents
CREATE TABLE public.competitor_posts (
  id BIGSERIAL PRIMARY KEY,
  competitor_id BIGINT NOT NULL REFERENCES public.competitors(id) ON DELETE CASCADE,
  post_id_linkedin TEXT,
  urn_post_id TEXT,
  post_url TEXT,
  caption TEXT,
  media_urls TEXT[],
  post_date TIMESTAMP WITH TIME ZONE,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  keywords TEXT[],
  hashtags TEXT[],
  sentiment TEXT,
  content_type TEXT, -- article, image, video, carousel, etc.
  performance_score INTEGER,
  is_analyzed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur la table competitor_posts
ALTER TABLE public.competitor_posts ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS pour la table competitor_posts
CREATE POLICY "Allow public read access to competitor posts" 
ON public.competitor_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Allow insert access to competitor posts" 
ON public.competitor_posts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow update access to competitor posts" 
ON public.competitor_posts 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow delete access to competitor posts" 
ON public.competitor_posts 
FOR DELETE 
USING (true);

-- Créer des index pour améliorer les performances
CREATE INDEX idx_competitors_linkedin_id ON public.competitors(id_linkedin);
CREATE INDEX idx_competitors_entreprise ON public.competitors(entreprise);
CREATE INDEX idx_competitor_posts_competitor_id ON public.competitor_posts(competitor_id);
CREATE INDEX idx_competitor_posts_date ON public.competitor_posts(post_date DESC);
CREATE INDEX idx_competitor_posts_engagement ON public.competitor_posts(engagement_rate DESC);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Créer des triggers pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_competitors_updated_at
  BEFORE UPDATE ON public.competitors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_competitor_posts_updated_at
  BEFORE UPDATE ON public.competitor_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();