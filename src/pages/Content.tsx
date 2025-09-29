import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenTool, Calendar, Clock, Lightbulb, FileText, Image, Sparkles, Upload, Type, Eye, CheckCircle, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Content() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [postType, setPostType] = useState("full");
  const [imageOption, setImageOption] = useState("upload");
  const [postContent, setPostContent] = useState("");
  const [keyIdea, setKeyIdea] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPosts, setCreatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeadMagnet, setIsLeadMagnet] = useState(false);
  const [hasCTA, setHasCTA] = useState(false);
  const [ctaKeyword, setCtaKeyword] = useState("");
  const [saveAsType, setSaveAsType] = useState("publish"); // publish, draft, schedule
  const { toast } = useToast();

  // Fetch created posts from Posts table
  const fetchCreatedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('Posts')
        .select('*')
        .not('contenu', 'is', null)
        .order('written_created_at', { ascending: false });

      if (error) throw error;
      setCreatedPosts(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatedPosts();
  }, []);

  const handleCreatePost = async () => {
    setIsSubmitting(true);
    
    try {
      const webhookData = {
        type_post: postType,
        contenu: postType === "full" ? postContent : keyIdea,
        option_image: imageOption,
        prompt_image: imageOption === "ai" ? imagePrompt : null,
        has_cta: hasCTA,
        cta_keyword: hasCTA ? ctaKeyword : null,
        save_as: saveAsType,
        timestamp: new Date().toISOString(),
      };

      console.log("Envoi vers webhook:", webhookData);

      const response = await fetch("https://n8n.srv802543.hstgr.cloud/webhook/creation-contenu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("Réponse du webhook:", result);

      // Save to Posts table with proper status based on saveAsType
      const { error: dbError } = await supabase
        .from('Posts')
        .insert({
          contenu: postType === "full" ? postContent : keyIdea,
          poste: saveAsType === "publish",
          brouillon: saveAsType === "draft",
          planifie: saveAsType === "schedule",
          leadmagnet: isLeadMagnet,
          type_post: postType,
          option_image: imageOption,
          prompt_image: imageOption === "ai" ? imagePrompt : null,
          keyword: hasCTA ? ctaKeyword : null
        } as any);

      if (dbError) {
        console.error('Erreur lors de la sauvegarde:', dbError);
        toast({
          title: "Erreur",
          description: "Erreur lors de la sauvegarde en base de données",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succès",
          description: `Post ${saveAsType === "draft" ? "sauvé en brouillon" : saveAsType === "schedule" ? "planifié" : "créé"} avec succès`,
        });
      }

      // Refresh posts list
      await fetchCreatedPosts();

      // Réinitialiser le formulaire
      setPostContent("");
      setKeyIdea("");
      setImagePrompt("");
      setPostType("full");
      setImageOption("upload");
      setIsLeadMagnet(false);
      setHasCTA(false);
      setCtaKeyword("");
      setSaveAsType("publish");
      setIsCreateDialogOpen(false);
      
    } catch (error) {
      console.error("Erreur lors de l'envoi vers le webhook:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'envoi vers le webhook",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Création de contenu</h1>
        <p className="text-muted-foreground text-lg">
          Créez et planifiez votre contenu LinkedIn
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5 text-primary" />
              Nouveau post
            </CardTitle>
            <CardDescription>Créer un nouveau post LinkedIn</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-primary">
                  Créer un post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau post</DialogTitle>
                  <DialogDescription>
                    Choisissez le type de post et personnalisez votre contenu
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Type de post */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Type de post</Label>
                    <RadioGroup value={postType} onValueChange={setPostType}>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50">
                        <RadioGroupItem value="full" id="full" />
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <Label htmlFor="full" className="cursor-pointer">
                            Post entier - Créer un post complet avec tout le contenu
                          </Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50">
                        <RadioGroupItem value="idea" id="idea" />
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          <Label htmlFor="idea" className="cursor-pointer">
                            Idée clé - Laisser l'IA développer votre idée en post complet
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Contenu */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      {postType === "full" ? "Contenu du post" : "Votre idée clé"}
                    </Label>
                    {postType === "full" ? (
                      <Textarea
                        placeholder="Rédigez votre post LinkedIn ici..."
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        rows={6}
                        className="min-h-[150px]"
                      />
                    ) : (
                      <Textarea
                        placeholder="Décrivez votre idée en quelques mots (ex: 'Les 5 erreurs à éviter en freelance')"
                        value={keyIdea}
                        onChange={(e) => setKeyIdea(e.target.value)}
                        rows={3}
                        className="min-h-[100px]"
                      />
                    )}
                  </div>

                  {/* Lead Magnet */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Options du post</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border">
                        <input
                          type="checkbox"
                          id="leadmagnet"
                          checked={isLeadMagnet}
                          onChange={(e) => setIsLeadMagnet(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="leadmagnet" className="cursor-pointer">
                          Ce post contient un lead magnet
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border">
                        <input
                          type="checkbox"
                          id="cta"
                          checked={hasCTA}
                          onChange={(e) => setHasCTA(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="cta" className="cursor-pointer">
                          Ajouter un CTA (demande de commentaire avec mot-clé)
                        </Label>
                      </div>
                      
                      {hasCTA && (
                        <div className="ml-6">
                          <Label className="text-sm">Mot-clé pour le CTA</Label>
                          <Input
                            placeholder="Ex: GRATUIT, GUIDE, INFO..."
                            value={ctaKeyword}
                            onChange={(e) => setCtaKeyword(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Options d'image */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Image du post</Label>
                    <RadioGroup value={imageOption} onValueChange={setImageOption}>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50">
                        <RadioGroupItem value="upload" id="upload" />
                        <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4 text-primary" />
                          <Label htmlFor="upload" className="cursor-pointer">
                            Uploader une image existante
                          </Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50">
                        <RadioGroupItem value="ai" id="ai" />
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <Label htmlFor="ai" className="cursor-pointer">
                            Générer avec l'IA
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>

                    {imageOption === "upload" && (
                      <div className="mt-3">
                        <Input
                          type="file"
                          accept="image/*"
                          className="cursor-pointer"
                        />
                      </div>
                    )}

                    {imageOption === "ai" && (
                      <div className="mt-3">
                        <Label>Description de l'image à générer</Label>
                        <Textarea
                          placeholder="Décrivez l'image que vous souhaitez générer (ex: 'Une photo moderne d'un bureau avec un ordinateur portable')"
                          value={imagePrompt}
                          onChange={(e) => setImagePrompt(e.target.value)}
                          rows={2}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </div>

                  {/* Type de sauvegarde */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Action après création</Label>
                    <RadioGroup value={saveAsType} onValueChange={setSaveAsType}>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50">
                        <RadioGroupItem value="publish" id="publish" />
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <Label htmlFor="publish" className="cursor-pointer">
                            Publier directement
                          </Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50">
                        <RadioGroupItem value="draft" id="draft" />
                        <div className="flex items-center gap-2">
                          <Save className="h-4 w-4 text-primary" />
                          <Label htmlFor="draft" className="cursor-pointer">
                            Sauvegarder en brouillon
                          </Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50">
                        <RadioGroupItem value="schedule" id="schedule" />
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <Label htmlFor="schedule" className="cursor-pointer">
                            Planifier pour plus tard
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleCreatePost}
                      className="flex-1 bg-gradient-primary"
                      disabled={
                        isSubmitting ||
                        (postType === "full" && !postContent.trim()) ||
                        (postType === "idea" && !keyIdea.trim()) ||
                        (imageOption === "ai" && !imagePrompt.trim()) ||
                        (hasCTA && !ctaKeyword.trim())
                      }
                    >
                      {isSubmitting ? "Envoi en cours..." : 
                        saveAsType === "draft" ? "Sauvegarder en brouillon" :
                        saveAsType === "schedule" ? "Planifier le post" :
                        "Créer le post"
                      }
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Posts créés avec onglets */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Mes posts créés
          </CardTitle>
          <CardDescription>
            Tous vos posts avec filtrage par statut
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : createdPosts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun post créé pour le moment</p>
              <p className="text-sm text-muted-foreground">
                Commencez par créer votre premier post ci-dessus
              </p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Tous
                  <Badge variant="secondary">{createdPosts.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="drafts" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Brouillons
                  <Badge variant="secondary">{createdPosts.filter(p => p.brouillon).length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="scheduled" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Planifiés
                  <Badge variant="secondary">{createdPosts.filter(p => p.planifie).length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="published" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Publiés
                  <Badge variant="secondary">{createdPosts.filter(p => p.poste).length}</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <PostsTable posts={createdPosts} />
              </TabsContent>

              <TabsContent value="drafts" className="mt-6">
                <PostsTable posts={createdPosts.filter(p => p.brouillon)} />
              </TabsContent>

              <TabsContent value="scheduled" className="mt-6">
                <PostsTable posts={createdPosts.filter(p => p.planifie)} />
              </TabsContent>

              <TabsContent value="published" className="mt-6">
                <PostsTable posts={createdPosts.filter(p => p.poste)} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Composant pour afficher la table des posts
const PostsTable = ({ posts }: { posts: any[] }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Aucun post dans cette catégorie</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Contenu</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Date de création</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  <Badge variant={post.type_post === 'full' ? 'default' : 'secondary'}>
                    {post.type_post === 'full' ? (
                      <><FileText className="h-3 w-3 mr-1" /> Post entier</>
                    ) : (
                      <><Lightbulb className="h-3 w-3 mr-1" /> Idée clé</>
                    )}
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
                </div>
              </TableCell>
              <TableCell className="max-w-md">
                <p className="truncate text-sm">
                  {post.contenu && post.contenu.length > 100 
                    ? `${post.contenu.substring(0, 100)}...` 
                    : post.contenu || 'Pas de contenu'
                  }
                </p>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {post.poste && (
                    <Badge variant="default" className="text-xs bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Publié
                    </Badge>
                  )}
                  {post.brouillon && (
                    <Badge variant="secondary" className="text-xs">
                      <Save className="h-3 w-3 mr-1" />
                      Brouillon
                    </Badge>
                  )}
                  {post.planifie && (
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      Planifié
                    </Badge>
                  )}
                  {!post.poste && !post.brouillon && !post.planifie && (
                    <Badge variant="secondary" className="text-xs">
                      En attente
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {post.option_image === 'upload' ? (
                    <><Upload className="h-3 w-3 mr-1" /> Upload</>
                  ) : (
                    <><Sparkles className="h-3 w-3 mr-1" /> IA</>
                  )}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {new Date(post.written_created_at || post.added_at).toLocaleDateString('fr-FR')}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};