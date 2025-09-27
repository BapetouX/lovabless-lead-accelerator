import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Heart, MessageCircle, Repeat2, ExternalLink, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type CompetitorPost = Tables<'competitor_posts'>;

interface CompetitorPostsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competitor: {
    id: number;
    name: string;
    photo_profil: string;
  };
}

export function CompetitorPostsDialog({ open, onOpenChange, competitor }: CompetitorPostsDialogProps) {
  const [posts, setPosts] = useState<CompetitorPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && competitor.id) {
      fetchPosts();
    }
  }, [open, competitor.id]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('competitor_posts')
        .select('*')
        .eq('competitor_id', competitor.id)
        .order('post_date', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les posts",
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

  const getPostTypeIcon = (contentType: string) => {
    switch (contentType?.toLowerCase()) {
      case 'image':
      case 'photo':
        return <Image className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              {competitor.photo_profil ? (
                <img 
                  src={competitor.photo_profil} 
                  alt={competitor.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-sm font-medium">
                  {competitor.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div>
              <DialogTitle>Posts de {competitor.name}</DialogTitle>
              <DialogDescription>
                {posts.length} post{posts.length > 1 ? 's' : ''} trouvé{posts.length > 1 ? 's' : ''}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun post trouvé pour ce concurrent</p>
            </div>
          ) : (
            posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header du post */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getPostTypeIcon(post.content_type || '')}
                          {post.content_type || 'Post'}
                        </Badge>
                        {post.post_date && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.post_date)}
                          </div>
                        )}
                      </div>
                      {post.post_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={post.post_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>

                    {/* Image si présente */}
                    {post.media_urls && (
                      <div className="rounded-lg overflow-hidden">
                        <img 
                          src={Array.isArray(post.media_urls) ? post.media_urls[0] : post.media_urls} 
                          alt="Post media" 
                          className="w-full max-h-80 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Contenu */}
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {post.caption || 'Pas de description'}
                      </p>
                    </div>

                    {/* Keywords */}
                    {post.keywords && post.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.keywords.slice(0, 5).map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Statistiques */}
                    <div className="flex items-center gap-4 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{formatNumber(post.likes_count || 0)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{formatNumber(post.comments_count || 0)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Repeat2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{formatNumber(post.shares_count || 0)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}