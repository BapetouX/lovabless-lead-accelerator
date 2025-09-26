import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  TrendingUp, 
  Plus, 
  ExternalLink, 
  Calendar, 
  MessageCircle, 
  Heart, 
  Share2,
  Edit,
  Trash2,
  BarChart3,
  Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Competitor {
  id: number;
  public_identifier: string;
  name: string;
  headline: string;
  entreprise: string;
  url: string;
  follower_count: number;
  connection_count: number;
  industry: string;
  location: string;
  last_activity_date: string;
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CompetitorPost {
  id: number;
  competitor_id: number;
  post_id_linkedin: string;
  urn_post_id: string;
  post_url: string;
  caption: string;
  media_urls: string[];
  keywords: string[];
  hashtags: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  engagement_rate: number;
  performance_score: number;
  sentiment: string;
  content_type: string;
  post_date: string;
  is_analyzed: boolean;
  created_at: string;
  updated_at: string;
}

export default function Competitors() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [competitorPosts, setCompetitorPosts] = useState<CompetitorPost[]>([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [newPost, setNewPost] = useState({
    post_id_linkedin: "",
    urn_post_id: "",
    post_url: "",
    caption: "",
    likes_count: 0,
    comments_count: 0,
    shares_count: 0,
    engagement_rate: 0,
    content_type: "",
    sentiment: "",
    performance_score: 0
  });

  // Realtime subscription for new competitors
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'competitors'
        },
        (payload) => {
          console.log('New competitor added:', payload);
          fetchCompetitors(); // Refresh the list
          toast({
            title: "Nouveau concurrent",
            description: "Un nouveau concurrent a été ajouté !",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    fetchCompetitors();
  }, []);

  useEffect(() => {
    if (selectedCompetitor) {
      fetchCompetitorPosts(selectedCompetitor.id);
    }
  }, [selectedCompetitor]);

  const fetchCompetitors = async () => {
    try {
      const { data, error } = await supabase
        .from('competitors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompetitors(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les concurrents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompetitorPosts = async (competitorId: number) => {
    try {
      const { data, error } = await supabase
        .from('competitor_posts')
        .select('*')
        .eq('competitor_id', competitorId)
        .order('post_date', { ascending: false });

      if (error) throw error;
      setCompetitorPosts(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les posts du concurrent",
        variant: "destructive",
      });
    }
  };

  const addPost = async () => {
    if (!selectedCompetitor) return;

    try {
      const { error } = await supabase
        .from('competitor_posts')
        .insert([{
          ...newPost,
          competitor_id: selectedCompetitor.id,
          post_date: new Date().toISOString()
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Post ajouté avec succès",
      });

      setIsPostDialogOpen(false);
      setNewPost({
        post_id_linkedin: "",
        urn_post_id: "",
        post_url: "",
        caption: "",
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
        engagement_rate: 0,
        content_type: "",
        sentiment: "",
        performance_score: 0
      });
      fetchCompetitorPosts(selectedCompetitor.id);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le post",
        variant: "destructive",
      });
    }
  };

  const deleteCompetitor = async (id: number) => {
    try {
      const { error } = await supabase
        .from('competitors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Concurrent supprimé avec succès",
      });

      fetchCompetitors();
      if (selectedCompetitor?.id === id) {
        setSelectedCompetitor(null);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'monitoring': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      case 'neutral': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredCompetitors = competitors;

  // Calculate KPIs
  const totalCompetitors = competitors.length;
  const totalPosts = competitorPosts.length;
  const activeCompetitors = competitors.filter(c => c.status === 'active').length;
  const monitoringCompetitors = competitors.filter(c => c.status === 'monitoring').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Concurrents</h1>
          <p className="text-muted-foreground">
            Surveillez et analysez vos concurrents sur LinkedIn
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Concurrents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompetitors}</div>
            <p className="text-xs text-muted-foreground">
              Profils surveillés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts Analysés</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              Contenus collectés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCompetitors}</div>
            <p className="text-xs text-muted-foreground">
              Concurrents actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Surveillance</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monitoringCompetitors}</div>
            <p className="text-xs text-muted-foreground">
              Suivi en cours
            </p>
          </CardContent>
        </Card>
      </div>


      <Tabs defaultValue="competitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="competitors">Concurrents</TabsTrigger>
          <TabsTrigger value="posts">Posts du concurrent</TabsTrigger>
        </TabsList>

        <TabsContent value="competitors" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Liste des Concurrents</CardTitle>
                  <CardDescription>
                    Gérez vos concurrents et consultez leurs informations
                  </CardDescription>
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <Input
                      placeholder="URL du profil LinkedIn..."
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-80"
                    />
                  </div>
                  <Button 
                    className="bg-gradient-primary"
                    disabled={isSubmitting || !linkedinUrl.trim()}
                    onClick={async () => {
                      if (!linkedinUrl.trim()) return;
                      
                      setIsSubmitting(true);
                      try {
                        console.log('Envoi vers edge function:', {
                          data: { url: linkedinUrl.trim() }
                        });

                        const response = await supabase.functions.invoke('add-competitor', {
                          body: { url: linkedinUrl.trim() }
                        });

                        const { data, error } = response;

                        console.log('Réponse de l\'edge function:', {
                          data,
                          error
                        });

                        if (!error && data) {
                          toast({
                            title: "Succès",
                            description: "Concurrent ajouté avec succès",
                          });
                          setLinkedinUrl("");
                        } else {
                          throw new Error(error?.message || 'Erreur inconnue');
                        }
                      } catch (error) {
                        console.error('Erreur détaillée lors de l\'ajout du concurrent:', error);
                        
                        let errorMessage = "Impossible d'ajouter le concurrent. Veuillez réessayer.";
                        
                        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                          errorMessage = "Impossible de joindre le webhook. Vérifiez que l'URL est correcte et accessible.";
                        } else if (error instanceof Error) {
                          errorMessage = `Erreur: ${error.message}`;
                        }
                        
                        toast({
                          title: "Erreur",
                          description: errorMessage,
                          variant: "destructive",
                        });
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Ajout en cours..." : "Ajouter concurrent"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Industrie</TableHead>
                    <TableHead>Followers</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompetitors.map((competitor) => (
                    <TableRow key={competitor.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{competitor.name}</div>
                          <div className="text-sm text-muted-foreground">{competitor.headline}</div>
                        </div>
                      </TableCell>
                      <TableCell>{competitor.entreprise}</TableCell>
                      <TableCell>{competitor.industry}</TableCell>
                      <TableCell>{competitor.follower_count?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${getStatusColor(competitor.status)} text-white`}>
                          {competitor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedCompetitor(competitor)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {competitor.url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={competitor.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteCompetitor(competitor.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          {selectedCompetitor ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Posts de {selectedCompetitor.name}</CardTitle>
                    <CardDescription>
                      Analysez les contenus publiés par ce concurrent
                    </CardDescription>
                  </div>
                  <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un post
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Ajouter un post</DialogTitle>
                        <DialogDescription>
                          Ajoutez un nouveau post pour {selectedCompetitor.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="post_url">URL du Post</Label>
                          <Input
                            id="post_url"
                            value={newPost.post_url}
                            onChange={(e) => setNewPost({...newPost, post_url: e.target.value})}
                            placeholder="https://linkedin.com/posts/..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="content_type">Type de contenu</Label>
                          <Select 
                            value={newPost.content_type}
                            onValueChange={(value) => setNewPost({...newPost, content_type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="post">Post classique</SelectItem>
                              <SelectItem value="article">Article</SelectItem>
                              <SelectItem value="video">Vidéo</SelectItem>
                              <SelectItem value="image">Image</SelectItem>
                              <SelectItem value="carousel">Carrousel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="caption">Contenu du post</Label>
                          <Textarea
                            id="caption"
                            value={newPost.caption}
                            onChange={(e) => setNewPost({...newPost, caption: e.target.value})}
                            placeholder="Contenu du post..."
                            rows={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="likes_count">Likes</Label>
                          <Input
                            id="likes_count"
                            type="number"
                            value={newPost.likes_count}
                            onChange={(e) => setNewPost({...newPost, likes_count: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="comments_count">Commentaires</Label>
                          <Input
                            id="comments_count"
                            type="number"
                            value={newPost.comments_count}
                            onChange={(e) => setNewPost({...newPost, comments_count: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shares_count">Partages</Label>
                          <Input
                            id="shares_count"
                            type="number"
                            value={newPost.shares_count}
                            onChange={(e) => setNewPost({...newPost, shares_count: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sentiment">Sentiment</Label>
                          <Select 
                            value={newPost.sentiment}
                            onValueChange={(value) => setNewPost({...newPost, sentiment: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sentiment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="positive">Positif</SelectItem>
                              <SelectItem value="neutral">Neutre</SelectItem>
                              <SelectItem value="negative">Négatif</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsPostDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button onClick={addPost} className="bg-gradient-primary">
                          Ajouter
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Contenu</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Sentiment</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {competitorPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(post.post_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {post.caption || "Pas de contenu"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{post.content_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {post.likes_count}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {post.comments_count}
                            </div>
                            <div className="flex items-center gap-1">
                              <Share2 className="h-3 w-3" />
                              {post.shares_count}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${getSentimentColor(post.sentiment)} text-white`}>
                            {post.sentiment}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{post.performance_score}/10</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun concurrent sélectionné</h3>
                <p className="text-muted-foreground text-center">
                  Sélectionnez un concurrent dans la liste pour voir ses posts
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}