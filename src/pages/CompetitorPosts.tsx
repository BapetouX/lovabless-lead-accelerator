import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ExternalLink, Heart, MessageCircle, Repeat2, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type CompetitorPost = Tables<'competitor_posts'>;

interface Competitor {
  id: number;
  name: string;
  headline: string;
  photo_profil: string;
  entreprise: string;
}

export default function CompetitorPosts() {
  const { competitorId } = useParams<{ competitorId: string }>();
  const [posts, setPosts] = useState<CompetitorPost[]>([]);
  const [competitor, setCompetitor] = useState<Competitor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (competitorId) {
      fetchCompetitorAndPosts();
    }
  }, [competitorId]);

  const fetchCompetitorAndPosts = async () => {
    try {
      // Fetch competitor info
      const { data: competitorData, error: competitorError } = await supabase
        .from('competitors')
        .select('id, name, headline, photo_profil, entreprise')
        .eq('id', parseInt(competitorId!))
        .single();

      if (competitorError) throw competitorError;
      setCompetitor(competitorData);

      // Fetch competitor posts
      const { data: postsData, error: postsError } = await supabase
        .from('competitor_posts')
        .select('*')
        .eq('competitor_id', parseInt(competitorId!))
        .order('post_date', { ascending: false });

      if (postsError) throw postsError;
      setPosts(postsData as CompetitorPost[] || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      return `Il y a ${diffInHours}h`;
    } else if (diffInDays < 7) {
      return `Il y a ${diffInDays}j`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec info concurrent */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.close()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        
        {competitor && (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              {competitor.photo_profil ? (
                <img 
                  src={competitor.photo_profil} 
                  alt={competitor.name || 'Photo de profil'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-sm font-medium">
                  {competitor.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{competitor.name}</h1>
              <p className="text-muted-foreground">{competitor.headline}</p>
              <p className="text-sm text-muted-foreground">{competitor.entreprise}</p>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">Posts totaux</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {formatNumber(posts.reduce((sum, post) => sum + (post.likes_count || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">Likes totaux</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {formatNumber(posts.reduce((sum, post) => sum + (post.comments_count || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">Commentaires totaux</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {formatNumber(posts.reduce((sum, post) => sum + (post.shares_count || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">Partages totaux</p>
          </CardContent>
        </Card>
      </div>

      {/* Table des posts */}
      <Card>
        <CardHeader>
          <CardTitle>Posts du concurrent</CardTitle>
          <CardDescription>
            Liste de tous les posts de {competitor?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun post trouvé pour ce concurrent</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contenu</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Commentaires</TableHead>
                    <TableHead>Partages</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
          <div className="space-y-1 max-w-md">
                          <div className="text-sm text-muted-foreground line-clamp-3">
                            {post.caption || 'Pas de description'}
                          </div>
                          {post.keywords && post.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {post.keywords.slice(0, 3).map((keyword, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {post.content_type || 'Post'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {post.post_date ? formatDate(post.post_date) : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span className="text-sm">{formatNumber(post.likes_count || 0)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3 text-blue-500" />
                          <span className="text-sm">{formatNumber(post.comments_count || 0)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Repeat2 className="h-3 w-3 text-green-500" />
                          <span className="text-sm">{formatNumber(post.shares_count || 0)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.post_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={post.post_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}