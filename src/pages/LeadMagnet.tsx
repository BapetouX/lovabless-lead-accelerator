import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, TrendingUp, Users, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type Post = {
  id: number;
  Caption: string | null;
  post_url: string | null;
  created_at: string;
  comments_table_name: string | null;
  table_exist: boolean | null;
};

type CommentsCount = {
  total: number;
  treated: number;
  untreated: number;
};

export default function LeadMagnet() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsData, setCommentsData] = useState<Record<number, CommentsCount>>({});
  const [totalLeads, setTotalLeads] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchTotalLeads();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('Posts')
        .select('*')
        .eq('table_exist', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
      
      // Fetch comments for each post
      if (data) {
        for (const post of data) {
          if (post.comments_table_name) {
            await fetchCommentsCount(post.id, post.comments_table_name);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentsCount = async (postId: number, tableName: string) => {
    try {
      // Pour l'instant, on simule les données car on ne peut pas requêter des tables dynamiques directement
      // En production, il faudrait créer des fonctions RPC pour compter les commentaires
      const mockTotal = Math.floor(Math.random() * 50) + 10;
      const mockTreated = Math.floor(mockTotal * Math.random());
      
      setCommentsData(prev => ({
        ...prev,
        [postId]: {
          total: mockTotal,
          treated: mockTreated,
          untreated: mockTotal - mockTreated
        }
      }));
    } catch (error) {
      console.error(`Error fetching comments for ${tableName}:`, error);
    }
  };

  const fetchTotalLeads = async () => {
    try {
      const { count, error } = await supabase
        .from('Leads Linkedin')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setTotalLeads(count || 0);
    } catch (error) {
      console.error('Error fetching total leads:', error);
    }
  };

  const totalComments = Object.values(commentsData).reduce((sum, data) => sum + data.total, 0);
  const totalTreated = Object.values(commentsData).reduce((sum, data) => sum + data.treated, 0);
  const totalUntreated = Object.values(commentsData).reduce((sum, data) => sum + data.untreated, 0);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Lead Magnet</h1>
          <p className="text-muted-foreground text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Lead Magnet</h1>
        <p className="text-muted-foreground text-lg">
          Analysez vos posts LinkedIn et récupérez un maximum de leads
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Posts avec table</p>
                <p className="text-2xl font-bold text-foreground">{posts.length}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
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
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Leads totaux</p>
                <p className="text-2xl font-bold text-foreground">{totalLeads}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card cursor-pointer" onClick={() => navigate('/competitors')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Voir tous les leads</p>
                <p className="text-sm font-medium text-primary">Accéder →</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ExternalLink className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Posts avec tables créées</CardTitle>
          <CardDescription>
            Liste de vos posts LinkedIn avec leurs statistiques de commentaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun post avec table créée</p>
                <p className="text-sm">Les posts doivent avoir une table de commentaires créée</p>
              </div>
            ) : (
              posts.map((post) => {
                const comments = commentsData[post.id] || { total: 0, treated: 0, untreated: 0 };
                return (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate pr-4">
                        {post.Caption || 'Post sans titre'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {new Date(post.created_at).toLocaleDateString()}
                        </Badge>
                        {post.post_url && (
                          <a
                            href={post.post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            Voir le post
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-lg font-semibold text-foreground">{comments.total}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Traités</p>
                        <p className="text-lg font-semibold text-green-600">{comments.treated}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Non traités</p>
                        <p className="text-lg font-semibold text-orange-600">{comments.untreated}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {posts.length > 0 && (
        <Card className="shadow-card bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{totalComments}</p>
                <p className="text-sm text-muted-foreground">Total commentaires</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{totalTreated}</p>
                <p className="text-sm text-muted-foreground">Commentaires traités</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{totalUntreated}</p>
                <p className="text-sm text-muted-foreground">Commentaires non traités</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}