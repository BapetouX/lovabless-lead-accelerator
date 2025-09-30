-- Supprimer l'ancienne clé primaire et définir id_comment_primary comme nouvelle clé primaire
ALTER TABLE public.post_comments_5 DROP CONSTRAINT IF EXISTS post_comments_5_pkey;
ALTER TABLE public.post_comments_5 ADD PRIMARY KEY (id_comment_primary);