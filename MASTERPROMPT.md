# 🎯 MASTERPROMPT - LinkedIn Accelerator

## Vue d'ensemble de l'application

Crée une application web complète de gestion et d'automatisation LinkedIn appelée **LinkedIn Accelerator**. C'est un SaaS permettant aux professionnels de créer du contenu, analyser leurs concurrents et générer des leads via LinkedIn.

## 🎨 Design System

### Palette de couleurs (Light Rose & Blue Theme)
```css
/* Couleurs primaires Rose */
--primary: 330 81% 60% (Rose vif)
--primary-foreground: 0 0% 100% (Blanc)
--primary-light: 330 81% 95% (Rose très clair)
--primary-dark: 330 81% 45% (Rose foncé)

/* Couleurs secondaires Grises claires */
--background: 0 0% 100% (Blanc)
--foreground: 230 15% 15% (Gris très foncé)
--secondary: 330 20% 97% (Gris rosé très clair)
--muted: 330 20% 96% (Gris rosé clair)

/* Accents */
--tech-purple: 240 100% 70% (Bleu/Violet pour accents)
--success: 240 100% 60% (Bleu pour succès)
--border: 330 20% 90% (Bordures légères)

/* Effets spéciaux */
--gradient-primary: linear-gradient(135deg, rose vif, bleu violet)
--shadow-glow: 0 0 20px rose/0.2
--shadow-card: 0 4px 20px rose/0.08
```

### Design tokens à créer
- Tous les tokens en HSL uniquement
- Gradients: primary, tech, subtle
- Shadows: glow, glow-hover, card, soft
- Animations: fade-in, slide-up, pulse
- Transitions: tech (cubic-bezier rapide)

## 🏗️ Architecture de l'application

### Technologies utilisées
- **Frontend**: React 18, TypeScript, Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS avec design system personnalisé
- **UI Components**: shadcn/ui (tous les composants nécessaires)
- **Backend**: Supabase (base de données, authentification, storage, edge functions)
- **State Management**: React Query (@tanstack/react-query)
- **Forms**: React Hook Form + Zod
- **Dates**: date-fns avec locale FR
- **Icons**: Lucide React
- **Toasts**: Sonner

### Structure des pages

#### 1. Layout Principal
- **DashboardLayout** avec:
  - Sidebar collapsible (64px collapsed / 256px expanded)
  - Logo animé avec effet "vitesse" et glow
  - Navigation avec sections expandables
  - Outlet pour le contenu principal

#### 2. Sidebar Navigation
```typescript
Navigation structure:
├── Dashboard (/)
├── Objectifs (/objectives)
├── Création de contenu (section expandable)
│   ├── Création de posts (/content)
│   └── Liste des posts (/posts)
├── Veille de contenu (section expandable)
│   ├── Posts concurrents (/content-watch)
│   └── Liste concurrents (/competitors)
└── Leads (section expandable)
    ├── Liste des leads (/leads)
    └── Leads Magnet (/lead-magnet)
```

#### 3. Page Dashboard (/dashboard)
**Composants**:
- **3 Cards de stats** en grid responsive:
  - Posts publiés (avec variation mensuelle)
  - Concurrents suivis (analyse continue)
  - Leads générés (avec variation mensuelle)
  - Chaque card avec icône dans un container bg-primary-light et shadow-card

- **Card Activité récente**:
  - Liste des dernières actions (nouveaux posts, leads, etc.)
  - Affichage temps relatif (il y a X minutes/heures)
  - Point coloré primary + texte description

- **Card Objectifs du mois**:
  - Barres de progression pour:
    - Posts à publier (current/target)
    - Leads à générer (current/target)
  - Barres avec gradient-primary
  - Pourcentages calculés dynamiquement

#### 4. Page Objectifs (/objectives)
**Fonctionnalités**:
- Mode édition/visualisation avec bouton Edit
- 3 Cards d'objectifs éditables:
  - Posts mensuels (icône TrendingUp)
  - Leads mensuels (icône Target)
  - Concurrents à suivre (icône Users)
- Input type number pour modifier les objectifs
- Sauvegarde dans localStorage
- Card de conseils avec tips pour chaque objectif

#### 5. Page Création de contenu (/content)
**Fonctionnalités complexes**:

**Tabs principal**:
- "Créer" : Formulaire de création
- "Mes posts" : Liste des posts créés

**Formulaire de création** avec 2 modes:
1. **Mode "Fait main" (full)**:
   - Textarea pour le contenu complet
   - Option CTA avec keyword
   - Option Lead Magnet

2. **Mode "IA" (ai)**:
   - Input pour idée clé
   - IA génère le post automatiquement

**Options d'image** (les 2 modes):
- Upload image (avec dropzone)
- Génération par IA (avec prompt)

**Sauvegarde**:
- Brouillon (draft)
- Post planifié (scheduled)

**Liste des posts créés**:
- Table avec colonnes: ID, Type, Contenu (tronqué), Image, Date, Statut, Actions
- Statuts: Brouillon, Planifié, Publié (badges colorés)
- Dialog détaillé pour chaque post avec:
  - Informations complètes
  - Contenu éditable (Textarea + Save)
  - Image preview
  - Actions: Publier maintenant / Planifier (avec date picker + time picker)

#### 6. Page Liste des posts (/posts)
- Affichage de tous les posts publiés de la table "Posts En Ligne"
- Filtrage par statut
- Recherche par contenu
- Export possible

#### 7. Page Veille - Posts concurrents (/content-watch)
**Fonctionnalités**:
- Liste déroulante des concurrents suivis
- Affichage des posts du concurrent sélectionné
- Métriques: likes, commentaires, reposts
- Analyse de performance
- Export des données

#### 8. Page Veille - Liste concurrents (/competitors)
**Fonctionnalités**:
- Table des concurrents avec:
  - Nom, LinkedIn URL, Date d'ajout, Actions
- Dialog "Ajouter concurrent" avec:
  - Input nom
  - Input URL LinkedIn
  - Appel automatique edge function "add-competitor"
- Création automatique d'une table dynamique pour les posts de chaque concurrent

#### 9. Page Leads - Liste (/leads)
- Affichage de tous les leads capturés
- Filtres: source, date, statut
- Actions: Export CSV, Contacter
- Statistiques de conversion

#### 10. Page Leads Magnet (/lead-magnet)
- Création de lead magnets
- Formulaires personnalisés
- Suivi des téléchargements
- Intégration avec posts

## 🗄️ Base de données Supabase

### Tables principales

#### 1. `Posts` (Brouillons et création)
```sql
CREATE TABLE Posts (
  id BIGSERIAL PRIMARY KEY,
  contenu TEXT,
  brouillon BOOLEAN DEFAULT TRUE,
  planifie BOOLEAN DEFAULT FALSE,
  poste BOOLEAN DEFAULT FALSE,
  leadmagnet BOOLEAN DEFAULT FALSE,
  type_post TEXT, -- 'full' ou 'ai'
  option_image TEXT, -- 'upload' ou 'ai'
  prompt_image TEXT,
  keyword TEXT,
  written_created_at TIMESTAMPTZ,
  added_at TIMESTAMPTZ DEFAULT now(),
  Caption TEXT,
  media TEXT, -- URL de l'image
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 2. `Posts En Ligne` (Posts publiés)
```sql
CREATE TABLE "Posts En Ligne" (
  id BIGSERIAL PRIMARY KEY,
  Caption TEXT,
  media TEXT,
  added_at TIMESTAMPTZ DEFAULT now(),
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0
);
```

#### 3. `competitors` (Concurrents suivis)
```sql
CREATE TABLE competitors (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  linkedin_url TEXT,
  posts_table_name TEXT, -- Nom de la table dynamique créée
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 4. Tables dynamiques `{competitor_name}_posts`
```sql
-- Créées automatiquement par trigger
CREATE TABLE competitor_name_posts (
  id BIGSERIAL PRIMARY KEY,
  competitor_id BIGINT REFERENCES competitors(id) ON DELETE CASCADE,
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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 5. Tables dynamiques `post_comments_{post_id}`
```sql
-- Pour chaque post ayant des commentaires
CREATE TABLE post_comments_{id} (
  id_comment_primary TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  linkedin_id TEXT NOT NULL,
  person_name TEXT,
  linkedin_title TEXT,
  linkedin_url TEXT,
  comment_date TIMESTAMPTZ,
  received_dm BOOLEAN DEFAULT FALSE,
  connection_request_statut BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 6. `objectives` (ou localStorage)
```typescript
// Stocké en localStorage pour cet exemple
{
  postsPerMonth: number,
  leadsPerMonth: number,
  competitorsToTrack: number
}
```

### Fonctions SQL

#### 1. `create_competitor_posts_table()`
```sql
-- Trigger function qui crée automatiquement une table de posts
-- pour chaque nouveau concurrent ajouté
-- Active sur INSERT dans 'competitors'
```

#### 2. `create_post_comments_table(post_id)`
```sql
-- Function callable qui crée une table de commentaires
-- pour un post spécifique
RETURNS jsonb -- {success, table_name, post_id}
```

#### 3. `count_comments_by_status(table_name)`
```sql
-- Compte les commentaires par statut (DM reçu, demande de connexion)
RETURNS jsonb
```

#### 4. `update_updated_at_column()`
```sql
-- Trigger function pour mettre à jour updated_at automatiquement
```

### Storage Buckets

#### `post-images` (Public)
- Stockage des images uploadées pour les posts
- Accessible publiquement
- Structure: /{user_id}/{filename}

### RLS Policies
```sql
-- Pour toutes les tables, enable RLS
ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;

-- Policies basiques (à adapter selon besoins auth)
CREATE POLICY "Enable read access for all users" ON {table_name}
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON {table_name}
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON {table_name}
  FOR UPDATE USING (true);
```

## 🔌 Edge Functions Supabase

### 1. `add-competitor`
```typescript
// POST /functions/v1/add-competitor
// Body: { name: string, linkedin_url: string }
// Actions:
// 1. Insert dans table competitors
// 2. Création automatique de la table {name}_posts via trigger
// 3. Retourne: { success, competitor_id, table_name }
```

## 🔗 Intégrations externes

### 1. N8N Webhook pour publication LinkedIn
```typescript
// Endpoint: https://n8n.srv802543.hstgr.cloud/webhook/planification-et-post
// POST avec body:
{
  action: "publish" | "schedule",
  post_id: number,
  content: string,
  media?: string,
  scheduled_for?: string (ISO date si schedule),
  timestamp: string (ISO date)
}
```

## 🎣 Hooks personnalisés à créer

### 1. `useDashboardStats()`
```typescript
// Récupère les stats pour le dashboard
// Returns: {
//   publishedPosts: number,
//   competitorsCount: number,
//   totalLeads: number,
//   postsThisMonth: number,
//   leadsThisMonth: number
// }
// Utilise React Query pour le caching
```

### 2. `useRecentActivity()`
```typescript
// Récupère les 5 dernières activités
// Returns: Array<{
//   action: string,
//   time: string, // "Il y a X minutes"
//   type: "post" | "lead" | "competitor"
// }>
```

### 3. `useObjectives()`
```typescript
// Gère les objectifs mensuels (localStorage)
// Returns: {
//   objectives: { postsPerMonth, leadsPerMonth, competitorsToTrack },
//   updateObjectives: (newObjectives) => void
// }
```

## 📦 Composants UI principaux

### Logo Component
```typescript
// Logo avec effet "vitesse" animé
// Props: collapsed?: boolean, className?: string
// Features:
// - Icône LinkedIn avec gradient-primary
// - Effet de lignes de vitesse animées
// - Glow effect avec blur
// - Texte "LinkedIn" + "Accelerator" avec icône Zap
```

### PostDetailsCard
```typescript
// Card détaillé d'un post avec toutes les infos et actions
// Props: { post: Post }
// Features:
// - Infos (ID, type, date, statuts)
// - Image preview avec fallback
// - Contenu éditable (Textarea + Save)
// - Actions: Publier / Planifier avec dialogs
```

## 🎯 Fonctionnalités clés à implémenter

### 1. Création de post avec IA
- Formulaire adaptatif selon mode (full/ai)
- Upload d'image vers Supabase Storage
- Génération d'image par IA (à implémenter)
- Lead magnet toggle avec keyword CTA
- Sauvegarde flexible (brouillon/planifié)

### 2. Publication et planification
- Publication immédiate via N8N webhook
- Planification avec date/time picker
- Feedback utilisateur (toasts) pour succès/erreurs
- Mise à jour statuts dans la base

### 3. Gestion des concurrents
- Ajout de concurrent crée automatiquement sa table de posts
- Affichage dynamique des posts par concurrent
- Métriques et analyses de performance

### 4. Système d'objectifs
- Définition d'objectifs mensuels personnalisés
- Suivi visuel avec barres de progression
- Pourcentages calculés automatiquement
- Conseils contextuels

### 5. Analyse de commentaires
- Tracking des commentaires par post
- Statuts: DM reçu, demande de connexion envoyée
- Compteurs et statistiques

## 🎨 Composants shadcn/ui à installer

```bash
# Liste complète des composants nécessaires:
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add label
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
```

## 🔐 Configuration Supabase

### Variables d'environnement (déjà configurées)
```
SUPABASE_URL=https://acfwdjrjtidghrfyzwgz.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
```

### Client Supabase
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px (1 colonne)
- Tablet: 768px - 1024px (2 colonnes)
- Desktop: > 1024px (3 colonnes pour les grids)

### Sidebar
- Desktop: 256px expanded, 64px collapsed
- Mobile: Overlay avec bouton hamburger

## ✨ Animations et transitions

### À utiliser systématiquement:
- `animate-fade-in` sur toutes les pages
- `transition-tech` sur les hovers
- `shadow-glow` sur les éléments actifs
- `shadow-card` sur toutes les cards
- Gradient backgrounds sur éléments primaires

## 🚨 Gestion des erreurs

### Toasts Sonner pour:
- Succès: Création, modification, publication, planification
- Erreurs: Échecs de requêtes, validations, connexions
- Infos: États intermédiaires, confirmations

### Console logs détaillés pour:
- Appels API (avec emoji pour faciliter le debug)
- Réponses et erreurs
- États de chargement

## 📝 Bonnes pratiques à suivre

1. **Utiliser UNIQUEMENT les tokens du design system** (pas de couleurs directes)
2. **Toutes les couleurs en HSL** (jamais RGB)
3. **Composants petits et réutilisables**
4. **React Query pour toutes les requêtes data**
5. **TypeScript strict** pour la sécurité des types
6. **Locale FR** pour toutes les dates
7. **Loading states** et **error boundaries** partout
8. **Feedback utilisateur immédiat** (toasts, spinners)
9. **Responsive first** (mobile → desktop)
10. **Accessibilité** (labels, aria-*, keyboard navigation)

## 🎬 Ordre de développement recommandé

1. Setup design system (index.css + tailwind.config.ts)
2. Composant Logo
3. Sidebar + DashboardLayout
4. Page Dashboard (sans données réelles)
5. Setup Supabase + tables principales
6. Hooks personnalisés (stats, activity, objectives)
7. Page Dashboard avec vraies données
8. Page Objectifs
9. Page Création de contenu (formulaire)
10. Page Création de contenu (liste + détails)
11. Edge function add-competitor
12. Page Concurrents
13. Pages Leads
14. Intégration N8N
15. Tests et optimisations

## 🔍 Points d'attention spécifiques

### Tables dynamiques
- Les tables de posts de concurrents sont créées automatiquement
- Les noms sont sanitizés (regex pour enlever caractères spéciaux)
- Les tables de commentaires sont créées sur demande (fonction callable)

### Images
- Upload vers Supabase Storage (bucket post-images)
- Fallback gracieux si image non disponible
- Preview avant publication

### Dates et horaires
- Toujours en UTC dans la base
- Affichage en locale FR dans l'UI
- date-fns pour toutes les manipulations

### État des posts
- Un post peut avoir plusieurs statuts simultanés
- Priorité d'affichage: Publié > Planifié > Brouillon
- Badges colorés pour visualisation rapide

---

## 🎯 Résultat attendu

Une application web moderne, rapide et élégante pour la gestion LinkedIn avec:
- Design professionnel rose et bleu
- Navigation fluide et intuitive
- Fonctionnalités complètes de création de contenu
- Veille concurrentielle automatisée
- Gestion de leads intégrée
- Planification et publication automatique
- Analytics et suivi d'objectifs
- Interface 100% responsive
- Expérience utilisateur optimale
