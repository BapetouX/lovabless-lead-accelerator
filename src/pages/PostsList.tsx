import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Database, BarChart3 } from "lucide-react";

const mockPosts = [
  {
    id: "123456",
    title: "Comment générer 10 leads par jour sur LinkedIn",
    url: "https://linkedin.com/posts/exemple-123456",
    date: "2024-01-15",
    commentsCount: 42,
    hasTable: true,
    tableName: "post_123456_comments"
  },
  {
    id: "789012",
    title: "5 stratégies pour doubler votre taux d'engagement",
    url: "https://linkedin.com/posts/exemple-789012",
    date: "2024-01-12",
    commentsCount: 28,
    hasTable: false,
    tableName: null
  },
  {
    id: "345678",
    title: "Le secret d'un profil LinkedIn qui convertit",
    url: "https://linkedin.com/posts/exemple-345678",
    date: "2024-01-10",
    commentsCount: 65,
    hasTable: true,
    tableName: "post_345678_comments"
  }
];

export default function PostsList() {
  const handleCreateTable = (postId: string) => {
    console.log(`Création de table pour le post ${postId}`);
    // TODO: Implémenter la création de table Supabase
  };

  const handleViewData = (tableName: string) => {
    console.log(`Affichage des données de la table ${tableName}`);
    // TODO: Implémenter la vue des données
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Liste des posts</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos posts LinkedIn et leurs données associées
        </p>
      </div>

      <div className="grid gap-4">
        {mockPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  <CardDescription>
                    Publié le {new Date(post.date).toLocaleDateString('fr-FR')} • {post.commentsCount} commentaires
                  </CardDescription>
                </div>
                <Badge variant={post.hasTable ? "default" : "secondary"}>
                  {post.hasTable ? "Table créée" : "Pas de table"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a href={post.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir le post
                  </a>
                </Button>
                
                {post.hasTable ? (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleViewData(post.tableName!)}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Voir les données
                  </Button>
                ) : (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleCreateTable(post.id)}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Créer table
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}