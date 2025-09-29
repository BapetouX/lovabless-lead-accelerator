import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ExternalLink, Database, BarChart3, Loader2, Save, FileText, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Post = {
  id: number;
  Post_id: number | null;
  Caption: string | null;
  written_created_at: string;
  table_exist?: boolean | null;
  keyword?: string | null;
  post_url?: string | null;
  media?: string | null;
  urn_post_id?: string | null;
  Url_lead_magnet?: string | null;
  poste?: boolean | null;
  leadmagnet?: boolean | null;
  type_post?: string | null;
  contenu?: string | null;
  option_image?: string | null;
  prompt_image?: string | null;
}

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadMagnetUrls, setLeadMagnetUrls] = useState<{[key: number]: string}>({});
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
        .from('Posts En Ligne')
        .select('*')
        .eq('poste', true)
        .order('written_created_at', { ascending: false });

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
      // Appeler la fonction RPC pour créer la table
      const { data, error: rpcError } = await supabase.rpc('create_post_comments_table', {
        post_id_param: postId
      });

      if (rpcError) {
        console.error('RPC Error:', rpcError);
        toast({
          title: "Erreur",
          description: "Impossible de créer la table",
          variant: "destructive",
        });
        return;
      }

      // Type assertion pour la réponse
      const result = data as { success: boolean; error?: string; table_name?: string };

      if (!result.success) {
        console.error('Function Error:', result.error);
        toast({
          title: "Erreur",
          description: `Erreur lors de la création: ${result.error}`,
          variant: "destructive",
        });
        return;
      }

      // Mettre à jour le post avec table_exist = true et le nom de la table
      const { error: updateError } = await supabase
        .from('Posts En Ligne')
        .update({ 
          table_exist: true,
          comments_table_name: result.table_name 
        })
        .eq('id', postId);

      if (updateError) {
        console.error('Update error:', updateError);
        toast({
          title: "Erreur",
          description: "Impossible de marquer la table comme créée",
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
        description: `Table ${result.table_name} créée avec succès`,
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

  const handleUpdateLeadMagnet = async (postId: number, url: string) => {
    try {
      const { error } = await supabase
        .from('Posts En Ligne')
        .update({ Url_lead_magnet: url } as any)
        .eq('id', postId);

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour l'URL du lead magnet",
          variant: "destructive",
        });
        return;
      }

      // Mettre à jour l'état local
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, Url_lead_magnet: url }
          : post
      ));

      // Vider le champ input
      setLeadMagnetUrls(prev => ({
        ...prev,
        [postId]: ''
      }));

      toast({
        title: "Succès",
        description: "URL du lead magnet mise à jour",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des posts...</span>
      </div>
    );
  }

  const PostCard = ({ post }: { post: Post }) => (
    <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 hover-scale">
      <CardHeader className="pb-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
              {(() => {
                const description = post.Caption || post.contenu || '';
                const firstSixWords = description.split(' ').slice(0, 6).join(' ');
                return firstSixWords || `Post ${post.id}`;
              })()}
            </CardTitle>
            <div className="flex gap-2 shrink-0">
              <Badge variant="default" className="text-xs bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Publié
              </Badge>
              {post.leadmagnet && (
                <Badge variant="default" className="text-xs">
                  Lead Magnet
                </Badge>
              )}
              {post.keyword && (
                <Badge variant="outline" className="text-xs">
                  CTA: {post.keyword}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                #{post.Post_id || post.id}
              </Badge>
            </div>
          </div>
          
          <CardDescription className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              {new Date(post.written_created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Afficher le contenu du post créé s'il existe */}
          {post.contenu && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Contenu:</h4>
              <div className="text-xs bg-muted/50 p-2 rounded">
                {post.contenu.length > 150 
                  ? `${post.contenu.substring(0, 150)}...` 
                  : post.contenu}
              </div>
            </div>
          )}

          {/* Section Lead Magnet - uniquement si leadmagnet = true */}
          {post.leadmagnet && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Lead Magnet URL:</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Coller l'URL du lead magnet..."
                  value={leadMagnetUrls[post.id] || ''}
                  onChange={(e) => setLeadMagnetUrls(prev => ({
                    ...prev,
                    [post.id]: e.target.value
                  }))}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleUpdateLeadMagnet(post.id, leadMagnetUrls[post.id] || '')}
                  disabled={!leadMagnetUrls[post.id]?.trim()}
                >
                  <Save className="h-4 w-4 mr-1" />
                  OK
                </Button>
              </div>
              {post.Url_lead_magnet && (
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                  Actuel: <a href={post.Url_lead_magnet} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{post.Url_lead_magnet}</a>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Détail
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Détails du Post {post.id}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Date de création:</h4>
                    <p className="text-sm">
                      {new Date(post.written_created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {post.Caption && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Caption:</h4>
                      <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-md">{post.Caption}</p>
                    </div>
                  )}

                  {post.contenu && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Contenu généré:</h4>
                      <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-md whitespace-pre-wrap">{post.contenu}</p>
                    </div>
                  )}

                  {post.media && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Media:</h4>
                      {post.media.toLowerCase().includes('.pdf') ? (
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="text-sm mb-2">Document PDF:</p>
                          <a 
                            href={post.media} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-primary hover:underline break-all"
                          >
                            {post.media}
                          </a>
                        </div>
                      ) : (
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="text-sm mb-2">Image:</p>
                          <img 
                            src={post.media} 
                            alt="Media du post" 
                            className="max-w-full h-auto rounded-md border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const nextEl = target.nextElementSibling as HTMLElement;
                              if (nextEl) nextEl.style.display = 'block';
                            }}
                          />
                          <p className="text-sm text-muted-foreground hidden">
                            Impossible de charger l'image: 
                            <a 
                              href={post.media} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:underline break-all ml-1"
                            >
                              {post.media}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {post.keyword && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Mot-clé CTA:</h4>
                      <p className="text-sm bg-muted/50 p-3 rounded-md">{post.keyword}</p>
                    </div>
                  )}
                  
                  {post.post_url && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">URL du post:</h4>
                      <a 
                        href={post.post_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-primary hover:underline break-all bg-muted/50 p-3 rounded-md block"
                      >
                        {post.post_url}
                      </a>
                    </div>
                  )}

                  {post.urn_post_id && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">URN Post ID:</h4>
                      <p className="text-xs bg-muted/50 p-3 rounded-md font-mono break-all">{post.urn_post_id}</p>
                    </div>
                  )}

                  {post.Url_lead_magnet && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">URL Lead Magnet:</h4>
                      <a 
                        href={post.Url_lead_magnet} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-primary hover:underline break-all bg-muted/50 p-3 rounded-md block"
                      >
                        {post.Url_lead_magnet}
                      </a>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {!post.table_exist ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleCreateTable(post.id)}
                className="flex-1"
              >
                <Database className="h-4 w-4 mr-2" />
                Créer une table
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                asChild
              >
                <a 
                  href={`/post-comments/${post.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Statistiques
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Posts LinkedIn</h1>
          <p className="text-muted-foreground mt-2">
            Posts publiés sur LinkedIn
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">
            {posts.length} post{posts.length > 1 ? 's' : ''} publié{posts.length > 1 ? 's' : ''}
          </div>
          <div className="text-xs text-muted-foreground">
            Actualisé automatiquement
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun post publié</h3>
              <p className="text-muted-foreground text-center">
                Vous n'avez pas encore de posts publiés sur LinkedIn.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>
    </div>
  );
}