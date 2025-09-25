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
  id_linkedin: string;
  name: string;
  headline: string;
  entreprise: string;
  url: string;
  follower_count: number;
  connection_level: string;
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
  post_date: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  engagement_rate: number;
  keywords: string[];
  hashtags: string[];
  sentiment: string;
  content_type: string;
  performance_score: number;
  is_analyzed: boolean;
  created_at: string;
  updated_at: string;
}

export default function Competitors() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [competitorPosts, setCompetitorPosts] = useState<CompetitorPost[]>([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Form states
  const [newCompetitor, setNewCompetitor] = useState({
    id_linkedin: "",
    name: "",
    headline: "",
    entreprise: "",
    url: "",
    follower_count: 0,
    connection_level: "",
    industry: "",
    location: "",
    notes: ""
  });

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

  const addCompetitor = async () => {
    try {
      const { error } = await supabase
        .from('competitors')
        .insert([newCompetitor]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Concurrent ajouté avec succès",
      });

      setIsAddDialogOpen(false);
      setNewCompetitor({
        id_linkedin: "",
        name: "",
        headline: "",
        entreprise: "",
        url: "",
        follower_count: 0,
        connection_level: "",
        industry: "",
        location: "",
        notes: ""
      });
      fetchCompetitors();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le concurrent",
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
          post_date: new Date().toISOString(),
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
        description: "Impossible de supprimer le concurrent",
        variant: "destructive",
      });
    }
  };

  const filteredCompetitors = competitors.filter(competitor =>
    competitor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    competitor.entreprise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    competitor.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'monitoring': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Liste des concurrents</h1>
        <p className="text-muted-foreground text-lg">
          Gérez et analysez vos concurrents LinkedIn
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total concurrents</p>
                <p className="text-2xl font-bold text-foreground">{competitors.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Posts analysés</p>
                <p className="text-2xl font-bold text-foreground">
                  {competitorPosts.length}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Actifs</p>
                <p className="text-2xl font-bold text-foreground">
                  {competitors.filter(c => c.status === 'active').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Surveillance</p>
                <p className="text-2xl font-bold text-foreground">
                  {competitors.filter(c => c.status === 'monitoring').length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Add */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un concurrent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter concurrent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau concurrent</DialogTitle>
              <DialogDescription>
                Ajoutez un concurrent à surveiller
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin_id">ID LinkedIn *</Label>
                <Input
                  id="linkedin_id"
                  value={newCompetitor.id_linkedin}
                  onChange={(e) => setNewCompetitor({...newCompetitor, id_linkedin: e.target.value})}
                  placeholder="john-doe-123456"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={newCompetitor.name}
                  onChange={(e) => setNewCompetitor({...newCompetitor, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headline">Titre</Label>
                <Input
                  id="headline"
                  value={newCompetitor.headline}
                  onChange={(e) => setNewCompetitor({...newCompetitor, headline: e.target.value})}
                  placeholder="CEO at Company"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entreprise">Entreprise</Label>
                <Input
                  id="entreprise"
                  value={newCompetitor.entreprise}
                  onChange={(e) => setNewCompetitor({...newCompetitor, entreprise: e.target.value})}
                  placeholder="Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL LinkedIn</Label>
                <Input
                  id="url"
                  value={newCompetitor.url}
                  onChange={(e) => setNewCompetitor({...newCompetitor, url: e.target.value})}
                  placeholder="https://linkedin.com/in/john-doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followers">Nombre de followers</Label>
                <Input
                  id="followers"
                  type="number"
                  value={newCompetitor.follower_count}
                  onChange={(e) => setNewCompetitor({...newCompetitor, follower_count: parseInt(e.target.value) || 0})}
                  placeholder="5000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industrie</Label>
                <Input
                  id="industry"
                  value={newCompetitor.industry}
                  onChange={(e) => setNewCompetitor({...newCompetitor, industry: e.target.value})}
                  placeholder="Technology"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localisation</Label>
                <Input
                  id="location"
                  value={newCompetitor.location}
                  onChange={(e) => setNewCompetitor({...newCompetitor, location: e.target.value})}
                  placeholder="Paris, France"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newCompetitor.notes}
                  onChange={(e) => setNewCompetitor({...newCompetitor, notes: e.target.value})}
                  placeholder="Notes sur ce concurrent..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={addCompetitor} className="bg-gradient-primary">
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="competitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="competitors">Concurrents</TabsTrigger>
          <TabsTrigger value="posts">Posts analysés</TabsTrigger>
        </TabsList>

        <TabsContent value="competitors">
          <Card className="shadow-card">
            <CardContent className="p-0">
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
                    <TableRow key={competitor.id} className="cursor-pointer hover:bg-secondary/50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{competitor.name}</p>
                          <p className="text-sm text-muted-foreground">{competitor.headline}</p>
                        </div>
                      </TableCell>
                      <TableCell>{competitor.entreprise}</TableCell>
                      <TableCell>{competitor.industry}</TableCell>
                      <TableCell>{competitor.follower_count?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(competitor.status)}>
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

        <TabsContent value="posts">
          {selectedCompetitor ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Posts de {selectedCompetitor.name}
                </h3>
                <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Ajouter un post</DialogTitle>
                      <DialogDescription>
                        Ajoutez un post de {selectedCompetitor.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="post_url">URL du post *</Label>
                        <Input
                          id="post_url"
                          value={newPost.post_url}
                          onChange={(e) => setNewPost({...newPost, post_url: e.target.value})}
                          placeholder="https://linkedin.com/posts/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content_type">Type de contenu</Label>
                        <Select value={newPost.content_type} onValueChange={(value) => setNewPost({...newPost, content_type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Texte</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Vidéo</SelectItem>
                            <SelectItem value="article">Article</SelectItem>
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
                        <Label htmlFor="likes">Likes</Label>
                        <Input
                          id="likes"
                          type="number"
                          value={newPost.likes_count}
                          onChange={(e) => setNewPost({...newPost, likes_count: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="comments">Commentaires</Label>
                        <Input
                          id="comments"
                          type="number"
                          value={newPost.comments_count}
                          onChange={(e) => setNewPost({...newPost, comments_count: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shares">Partages</Label>
                        <Input
                          id="shares"
                          type="number"
                          value={newPost.shares_count}
                          onChange={(e) => setNewPost({...newPost, shares_count: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="engagement">Taux d'engagement (%)</Label>
                        <Input
                          id="engagement"
                          type="number"
                          step="0.01"
                          value={newPost.engagement_rate}
                          onChange={(e) => setNewPost({...newPost, engagement_rate: parseFloat(e.target.value) || 0})}
                        />
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

              <Card className="shadow-card">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contenu</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {competitorPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="max-w-xs">
                            <p className="truncate" title={post.caption}>
                              {post.caption || "Contenu non disponible"}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{post.content_type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 text-sm">
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {post.likes_count}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {post.comments_count}
                              </span>
                              <span className="flex items-center gap-1">
                                <Share2 className="h-3 w-3" />
                                {post.shares_count}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {post.engagement_rate?.toFixed(1)}%
                              </span>
                              {post.sentiment && (
                                <Badge className={getSentimentColor(post.sentiment)}>
                                  {post.sentiment}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {post.post_date && new Date(post.post_date).toLocaleDateString()}
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
                  {competitorPosts.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">
                        Aucun post trouvé pour ce concurrent
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sélectionnez un concurrent</h3>
                <p className="text-muted-foreground">
                  Choisissez un concurrent dans la liste pour voir ses posts
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}