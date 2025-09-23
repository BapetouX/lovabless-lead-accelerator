import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Database, BarChart3, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Post = {
  id: number;
  Post_id: number | null;
  Caption: string | null;
  created_at: string;
  table_exist?: boolean | null;
  keyword?: string | null;
  post_url?: string | null;
}

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
    
    // Rafraîchissement automatique toutes les minutes
    const interval = setInterval(() => {
      fetchPosts();
    }, 60000); // 60000ms = 1 minute

    // Nettoyage de l'interval au démontage du composant
    return () => clearInterval(interval);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des posts:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les posts",
          variant: "destructive",
        });
        return;
      }

      setPosts((data as Post[]) || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTable = async (postId: number) => {
    try {
      const { error } = await supabase
        .from('Posts')
        .update({ table_exist: true } as any)
        .eq('id', postId);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de créer la table",
          variant: "destructive",
        });
        return;
      }

      // Mettre à jour l'état local
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, table_exist: true }
          : post
      ));

      toast({
        title: "Table créée",
        description: "La table a été créée avec succès",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (postId: number) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des posts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Liste des posts</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos posts LinkedIn et leurs données associées ({posts.length} posts)
        </p>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun post trouvé</h3>
            <p className="text-muted-foreground text-center">
              Aucun post n'a été trouvé dans la base de données.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {posts.map((post) => {
            const isExpanded = expandedPostId === post.id;
            return (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 hover-scale">
                <CardHeader className="pb-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                        Post {post.id}
                      </CardTitle>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        #{post.Post_id || post.id}
                      </Badge>
                    </div>
                    
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </CardDescription>

                    {isExpanded && (
                      <div className="space-y-3 pt-3 border-t animate-fade-in">
                        {post.Caption && (
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Caption:</h4>
                            <p className="text-sm leading-relaxed">{post.Caption}</p>
                          </div>
                        )}
                        
                        {post.keyword && (
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Mots-clés:</h4>
                            <p className="text-sm">{post.keyword}</p>
                          </div>
                        )}
                        
                        {post.post_url && (
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-1">URL du post:</h4>
                            <a 
                              href={post.post_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm text-primary hover:underline break-all"
                            >
                              {post.post_url}
                            </a>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">Statut de la table:</h4>
                          <p className="text-sm">
                            {post.table_exist ? "Table créée" : "Aucune table"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewDetails(post.id)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {isExpanded ? "Masquer" : "Détail"}
                    </Button>
                    
                    {post.table_exist ? (
                      <Badge variant="secondary" className="flex-1 justify-center py-2">
                        <Database className="h-4 w-4 mr-2" />
                        Table créée
                      </Badge>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm"
                        className="flex-1 bg-blue-500/70 hover:bg-blue-500/90 text-white border-0"
                        onClick={() => handleCreateTable(post.id)}
                      >
                        <Database className="h-4 w-4 mr-2" />
                        Créer table
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}