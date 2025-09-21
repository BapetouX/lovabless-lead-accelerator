import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, MessageCircle, TrendingUp } from "lucide-react";

// Données mockées pour les tests
const mockPosts = [
  {
    id: 1,
    title: "Comment automatiser votre génération de leads sur LinkedIn",
    url: "https://linkedin.com/feed/update/urn:li:activity:123456789",
    comments: 47,
    date: "2024-01-15",
  },
  {
    id: 2,
    title: "5 stratégies pour augmenter votre taux d'engagement",
    url: "https://linkedin.com/feed/update/urn:li:activity:987654321",
    comments: 32,
    date: "2024-01-12",
  },
  {
    id: 3,
    title: "LinkedIn en 2024 : Ce qui change vraiment",
    url: "https://linkedin.com/feed/update/urn:li:activity:456789123",
    comments: 89,
    date: "2024-01-10",
  },
  {
    id: 4,
    title: "Personal branding : construire sa marque personnelle",
    url: "https://linkedin.com/feed/update/urn:li:activity:789123456",
    comments: 76,
    date: "2024-01-08",
  },
];

export default function LeadMagnet() {
  const [url, setUrl] = useState("");
  const [posts, setPosts] = useState(mockPosts);
  const [loading, setLoading] = useState(false);

  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    // Simulation d'analyse
    setTimeout(() => {
      // Ajouter un nouveau post simulé
      const newPost = {
        id: Date.now(),
        title: "Nouveau post analysé depuis l'URL",
        url: url,
        comments: Math.floor(Math.random() * 50) + 10,
        date: new Date().toISOString().split('T')[0],
      };
      setPosts(prev => [newPost, ...prev]);
      setUrl("");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Lead Magnet</h1>
        <p className="text-muted-foreground text-lg">
          Analysez vos posts LinkedIn et récupérez un maximum de leads
        </p>
      </div>

      {/* URL Input Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Analyser un post LinkedIn
          </CardTitle>
          <CardDescription>
            Collez l'URL de votre post LinkedIn pour analyser les commentaires et identifier les leads potentiels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="flex gap-3">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://linkedin.com/feed/update/..."
              className="flex-1"
              disabled={loading}
            />
            <Button 
              type="submit" 
              disabled={loading || !url.trim()}
              className="bg-gradient-primary hover:bg-primary-dark min-w-[120px]"
            >
              {loading ? "Analyse..." : "Analyser"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Posts analysés</p>
                <p className="text-2xl font-bold text-foreground">{posts.length}</p>
              </div>
              <div className="h-12 w-12 bg-primary-light rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total commentaires</p>
                <p className="text-2xl font-bold text-foreground">{totalComments}</p>
              </div>
              <div className="h-12 w-12 bg-primary-light rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Leads potentiels</p>
                <p className="text-2xl font-bold text-foreground">{Math.floor(totalComments * 0.15)}</p>
              </div>
              <div className="h-12 w-12 bg-primary-light rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Posts analysés</CardTitle>
          <CardDescription>
            Liste de vos posts LinkedIn avec le nombre de commentaires pour chacun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun post analysé pour le moment</p>
                <p className="text-sm">Ajoutez l'URL d'un post LinkedIn pour commencer</p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-soft transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate pr-4">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {post.date}
                      </Badge>
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        Voir le post
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      <span className="font-medium">{post.comments}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Analyser
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {posts.length > 0 && (
        <Card className="shadow-card bg-gradient-subtle">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Résumé global
              </h3>
              <p className="text-2xl font-bold text-primary mb-1">
                {totalComments} commentaires
              </p>
              <p className="text-sm text-muted-foreground">
                sur {posts.length} posts • {Math.floor(totalComments * 0.15)} leads potentiels identifiés
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}