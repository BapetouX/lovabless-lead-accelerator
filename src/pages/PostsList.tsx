import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Database, BarChart3, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: number;
  Post_id: number | null;
  Caption: string | null;
  created_at: string;
}

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
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

      setPosts(data || []);
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

  const handleCreateTable = (postId: number) => {
    console.log(`Création de table pour le post ${postId}`);
    toast({
      title: "Fonctionnalité à venir",
      description: "La création de table sera bientôt disponible",
    });
  };

  const handleViewData = (postId: number) => {
    console.log(`Affichage des données du post ${postId}`);
    toast({
      title: "Fonctionnalité à venir", 
      description: "La visualisation des données sera bientôt disponible",
    });
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
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {post.Caption || `Post #${post.Post_id || post.id}`}
                    </CardTitle>
                    <CardDescription>
                      Créé le {new Date(post.created_at).toLocaleDateString('fr-FR')}
                      {post.Post_id && ` • ID LinkedIn: ${post.Post_id}`}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    Pas de table
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleCreateTable(post.id)}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Créer table
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewData(post.id)}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Voir les données
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}