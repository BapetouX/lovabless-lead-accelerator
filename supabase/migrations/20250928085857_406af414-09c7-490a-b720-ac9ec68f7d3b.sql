-- Create a table for example posts (temporary)
CREATE TABLE public.exemple_redaction_post (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exemple_redaction_post ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to example posts" 
ON public.exemple_redaction_post 
FOR SELECT 
USING (true);

-- Insert 4 example posts
INSERT INTO public.exemple_redaction_post (title, content, post_type) VALUES
('Comment améliorer votre productivité', 'Dans un monde en constante évolution, optimiser sa productivité est devenu essentiel. Voici 5 techniques éprouvées pour maximiser votre efficacité au quotidien...', 'conseil'),
('Les tendances du marketing digital 2024', 'Le marketing digital évolue rapidement. Découvrez les stratégies incontournables pour rester compétitif en 2024 et attirer votre audience cible...', 'tendance'),
('Histoire inspirante : De zéro à entrepreneur', 'Il y a 3 ans, je travaillais dans un bureau 9h-17h. Aujourd''hui, je dirige ma propre entreprise. Voici mon parcours et les leçons apprises...', 'histoire'),
('5 erreurs à éviter en freelance', 'Après 5 ans en tant que freelance, j''ai identifié les erreurs les plus courantes qui peuvent nuire à votre réussite. Voici comment les éviter...', 'conseil');