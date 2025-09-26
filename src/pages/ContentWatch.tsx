import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  ExternalLink, 
  Heart, 
  Share2, 
  Play,
  ArrowUpDown 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  competitor: {
    name: string;
    photo_profil: string;
    entreprise: string;
  };
}

const trendingTopics = [
  { topic: "Intelligence Artificielle", posts: 1249, engagement: "12.4%", trend: "+23%" },
  { topic: "Remote Work", posts: 892, engagement: "8.7%", trend: "+15%" },
  { topic: "Leadership", posts: 2341, engagement: "6.2%", trend: "+8%" },
  { topic: "Digital Marketing", posts: 1567, engagement: "9.1%", trend: "+19%" },
];

export default function ContentWatch() {
  const [competitorReels, setCompetitorReels] = useState<CompetitorPost[]>([]);
  const [sortBy, setSortBy] = useState<'likes_count' | 'comments_count' | 'shares_count' | 'post_date'>('likes_count');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch competitor reels from last 7 days
  useEffect(() => {
    fetchCompetitorReels();
  }, [sortBy, sortOrder]);

  const fetchCompetitorReels = async () => {
    try {
      setIsLoading(true);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('competitor_posts')
        .select(`
          *,
          competitors!inner(name, photo_profil, entreprise)
        `)
        .eq('content_type', 'video') // On filtre sur les réels/vidéos
        .gte('post_date', sevenDaysAgo.toISOString())
        .order(sortBy, { ascending: sortOrder === 'asc' });

      if (error) throw error;

      // Transform data to match our interface
      const transformedData = data?.map(post => ({
        ...post,
        competitor: Array.isArray(post.competitors) ? post.competitors[0] : post.competitors
      })) as CompetitorPost[];

      setCompetitorReels(transformedData || []);
    } catch (error) {
      console.error('Error fetching competitor reels:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réels des concurrents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays}j`;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Veille de contenu</h1>
        <p className="text-muted-foreground text-lg">
          Découvrez les tendances et contenus populaires de votre secteur
        </p>
      </div>

      {/* Trending Topics */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Sujets tendance
          </CardTitle>
          <CardDescription>
            Les sujets les plus populaires cette semaine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-foreground">{topic.topic}</h3>
                  <Badge variant="secondary" className="text-primary bg-primary-light">
                    {topic.trend}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {topic.posts} posts
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {topic.engagement} engagement
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitor Reels Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Réels des concurrents - 7 derniers jours
          </CardTitle>
          <CardDescription>
            Analysez les performances des réels de vos concurrents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concurrent</TableHead>
                    <TableHead>Contenu</TableHead>
                    <TableHead className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSort('likes_count')}
                        className="font-medium"
                      >
                        Vues (Likes)
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSort('comments_count')}
                        className="font-medium"
                      >
                        Commentaires
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSort('shares_count')}
                        className="font-medium"
                      >
                        Partages
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSort('post_date')}
                        className="font-medium"
                      >
                        Date
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitorReels.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucun réel trouvé pour les 7 derniers jours
                      </TableCell>
                    </TableRow>
                  ) : (
                    competitorReels.map((reel) => (
                      <TableRow key={reel.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                              {reel.competitor?.photo_profil ? (
                                <img 
                                  src={reel.competitor.photo_profil} 
                                  alt={reel.competitor.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Users className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{reel.competitor?.name || 'Nom inconnu'}</div>
                              <div className="text-sm text-muted-foreground">{reel.competitor?.entreprise || ''}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm line-clamp-2 mb-1">
                              {reel.caption ? reel.caption.substring(0, 100) + (reel.caption.length > 100 ? '...' : '') : 'Pas de description'}
                            </p>
                            {reel.hashtags && reel.hashtags.length > 0 && (
                              <div className="flex gap-1 flex-wrap">
                                {reel.hashtags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span className="font-medium">{formatNumber(reel.likes_count || 0)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <MessageCircle className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{formatNumber(reel.comments_count || 0)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Share2 className="h-4 w-4 text-green-500" />
                            <span className="font-medium">{formatNumber(reel.shares_count || 0)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {reel.post_date ? formatDate(reel.post_date) : 'Date inconnue'}
                        </TableCell>
                        <TableCell>
                          {reel.post_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={reel.post_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}