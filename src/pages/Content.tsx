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

type Post = {
  id: number;
  contenu: string | null;
  brouillon: boolean | null;
  planifie: boolean | null;
  poste: boolean | null;
  leadmagnet: boolean | null;
  type_post: string | null;
  option_image: string | null;
  prompt_image: string | null;
  keyword: string | null;
  written_created_at: string | null;
  added_at: string | null;
  Caption: string | null;
  media: string | null;
  created_at: string | null;
};

// Composant pour les détails du post avec actions
const PostDetailsCard = ({ post }: { post: any }) => {
  const [editedContent, setEditedContent] = useState(post.Caption || post.contenu || "");
  const { toast } = useToast();

  const handleUpdateContent = async () => {
    try {
      const response = await fetch(`https://acfwdjrjtidghrfyzwgz.supabase.co/rest/v1/Posts?id=eq.${post.id}`, {
        method: "PATCH",
        headers: {
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZndkanJqdGlkZ2hyZnl6d2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MzM0MDYsImV4cCI6MjA3NDEwOTQwNn0.cClC4_xaT_hhcwkpgGQ7n8QMVRI3vJRk1vbydVXcNLI",
          "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZndkanJqdGlkZ2hyZnl6d2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MzM0MDYsImV4cCI6MjA3NDEwOTQwNn0.cClC4_xaT_hhcwkpgGQ7n8QMVRI3vJRk1vbydVXcNLI",
          "accept-profile": "public",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Caption: editedContent,
          contenu: editedContent
        })
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Contenu mis à jour avec succès",
        });
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le contenu",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async () => {
    try {
      const response = await fetch("https://n8n.srv802543.hstgr.cloud/webhook/planification-et-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "publish",
          post_id: post.id,
          content: editedContent,
          media: post.media,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Post publié avec succès",
        });
      } else {
        throw new Error("Erreur lors de la publication");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de publier le post",
        variant: "destructive",
      });
    }
  };

  const handleSchedule = async () => {
    try {
      const response = await fetch("https://n8n.srv802543.hstgr.cloud/webhook/planification-et-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "schedule",
          post_id: post.id,
          content: editedContent,
          media: post.media,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Post planifié avec succès",
        });
      } else {
        throw new Error("Erreur lors de la planification");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de planifier le post",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations du post */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">ID du post</Label>
              <p className="text-sm">{post.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Type de post</Label>
              <div className="mt-1">
                <Badge variant={post.type_post === "full" ? "default" : "secondary"}>
                  {post.type_post === "full" ? "Fait main" : "IA"}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Type d'image</Label>
              <div className="mt-1">
                <Badge variant="outline">
                  {post.option_image === "upload" ? "Upload" : post.option_image === "ai" ? "IA" : "Non défini"}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Date de création</Label>
              <p className="text-sm">
                {new Date(post.written_created_at || post.added_at || post.created_at || "").toLocaleString("fr-FR")}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
              <div className="mt-1 flex gap-1">
                {post.poste && <Badge className="bg-green-600">Publié</Badge>}
                {post.brouillon && <Badge variant="secondary">Brouillon</Badge>}
                {post.planifie && <Badge variant="outline">Planifié</Badge>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image du post */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Image</CardTitle>
          </CardHeader>
          <CardContent>
            {post.media ? (
              <div className="w-full max-w-sm">
                <img 
                  src={post.media} 
                  alt="Image du post" 
                  className="w-full h-auto rounded border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-32 bg-muted rounded border flex items-center justify-center text-muted-foreground">Image non disponible</div>';
                    }
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-32 bg-muted rounded border flex items-center justify-center text-muted-foreground">
                Pas d'image
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contenu éditable */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contenu du post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={8}
            className="min-h-[200px]"
            placeholder="Contenu du post..."
          />
          <Button onClick={handleUpdateContent} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder les modifications
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button onClick={handlePublish} className="flex-1 bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Publier
            </Button>
            <Button onClick={handleSchedule} variant="outline" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Planifier
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Content() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [postType, setPostType] = useState("full");
  const [imageOption, setImageOption] = useState("upload");
  const [postContent, setPostContent] = useState("");
  const [keyIdea, setKeyIdea] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPosts, setCreatedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeadMagnet, setIsLeadMagnet] = useState(false);
  const [hasCTA, setHasCTA] = useState(false);
  const [ctaKeyword, setCtaKeyword] = useState("");
  const [saveAsType, setSaveAsType] = useState("draft"); // Always draft by default
  const { toast } = useToast();

  // Fetch created posts from all tables (Posts et post_creation)
  const fetchCreatedPosts = async () => {
    try {
      setIsLoading(true);
      
      // Récupérer d'abord les posts de la table Posts En Ligne
      const postsResponse = await fetch(`https://acfwdjrjtidghrfyzwgz.supabase.co/rest/v1/Posts%20En%20Ligne?order=added_at.desc&select=*`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZndkanJqdGlkZ2hyZnl6d2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MzM0MDYsImV4cCI6MjA3NDEwOTQwNn0.cClC4_xaT_hhcwkpgGQ7n8QMVRI3vJRk1vbydVXcNLI',
          'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZndkanJqdGlkZ2hyZnl6d2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MzM0MDYsImV4cCI6MjA3NDEwOTQwNn0.cClC4_xaT_hhcwkpgGQ7n8QMVRI3vJRk1vbydVXcNLI',
          'accept-profile': 'public'
        }
      });

      // Récupérer ensuite les posts de la table post_creation
      const creationResponse = await fetch(`https://acfwdjrjtidghrfyzwgz.supabase.co/rest/v1/post_creation?order=written_created_at.desc&select=*`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZndkanJqdGlkZ2hyZnl6d2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MzM0MDYsImV4cCI6MjA3NDEwOTQwNn0.cClC4_xaT_hhcwkpgGQ7n8QMVRI3vJRk1vbydVXcNLI',
          'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZndkanJqdGlkZ2hyZnl6d2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MzM0MDYsImV4cCI6MjA3NDEwOTQwNn0.cClC4_xaT_hhcwkpgGQ7n8QMVRI3vJRk1vbydVXcNLI',
          'accept-profile': 'public'
        }
      });
      
      let allPosts = [];
      
      // Traiter les posts de Posts En Ligne
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        if (Array.isArray(postsData)) {
          allPosts = [...allPosts, ...postsData];
        }
      }
      
      // Traiter les posts de post_creation
      if (creationResponse.ok) {
        const creationData = await creationResponse.json();
        if (Array.isArray(creationData)) {
          // Adapter les champs de post_creation au format attendu
          const adaptedCreationPosts = creationData.map(post => ({
            ...post,
            Caption: post.caption,
            media: post.url_media,
            added_at: post.written_created_at,
            type_post: 'creation',
            brouillon: post.statut?.toLowerCase() === 'brouillon' || !post.statut,
            planifie: post.statut?.toLowerCase() === 'planifié',
            poste: post.statut?.toLowerCase() === 'publié'
          }));
          allPosts = [...allPosts, ...adaptedCreationPosts];
        }
      }
      
      // Trier tous les posts par date (plus récent en premier)
      allPosts.sort((a, b) => {
        const dateA = new Date(a.added_at || a.written_created_at || a.created_at || 0);
        const dateB = new Date(b.added_at || b.written_created_at || b.created_at || 0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setCreatedPosts(allPosts);
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
      setCreatedPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatedPosts();
  }, []);

  const handleCreatePost = async () => {
    setIsSubmitting(true);
    
    // Fermer la modal immédiatement
    setIsCreateDialogOpen(false);
    
    try {
      let imageUrl = null;

      // Si une image a été uploadée, la traiter
      if (imageOption === "upload") {
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = fileInput?.files?.[0];
        
        if (file) {
          try {
            // Générer un nom unique pour le fichier
            const timestamp = new Date().getTime();
            // Nettoyer le nom de fichier (supprimer espaces et caractères spéciaux)
            const cleanFileName = file.name
              .replace(/[^a-zA-Z0-9.\-_]/g, '_')  // Remplacer caractères spéciaux par _
              .replace(/_+/g, '_')                // Supprimer underscores multiples
              .replace(/^_|_$/g, '');            // Supprimer underscores début/fin
            const fileName = `${timestamp}_${cleanFileName}`;
            
            // Upload vers Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('post-images')
              .upload(fileName, file);

            if (uploadError) {
              throw new Error(`Erreur upload: ${uploadError.message}`);
            }

            // Obtenir l'URL publique
            const { data: urlData } = supabase.storage
              .from('post-images')
              .getPublicUrl(fileName);

            imageUrl = urlData.publicUrl;
            console.log("Image uploadée avec succès:", imageUrl);
          } catch (uploadError) {
            console.error("Erreur lors de l'upload d'image:", uploadError);
            toast({
              title: "Erreur d'upload",
              description: "Impossible d'uploader l'image. Le post sera créé sans image.",
              variant: "destructive",
            });
          }
        }
      }

      const webhookData = {
        type_post: postType,
        contenu: postType === "full" ? postContent : keyIdea,
        option_image: imageOption,
        prompt_image: imageOption === "ai" ? imagePrompt : null,
        image_url: imageUrl, // Ajouter l'URL de l'image si elle existe
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

      toast({
        title: "Post envoyé",
        description: "Post sauvé en brouillon et envoyé au workflow",
      });

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

      // Refresh des posts plus fréquent pendant 30 secondes pour détecter le nouveau post
      let attempts = 0;
      const maxAttempts = 15; // 15 tentatives sur 30 secondes
      const checkForNewPost = setInterval(async () => {
        attempts++;
        await fetchCreatedPosts();
        
        if (attempts >= maxAttempts) {
          clearInterval(checkForNewPost);
        }
      }, 2000); // Vérifier toutes les 2 secondes
      
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
                    <Label className="text-base font-semibold">CTA / Lead magnet</Label>
                    <div className="space-y-2">
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
                        <Label>Description de l'image à générer (optionnel)</Label>
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
                         (postType === "idea" && !keyIdea.trim()) ||
                         (imageOption === "upload" && !(document.querySelector('input[type="file"]') as HTMLInputElement)?.files?.[0])
                       }
                     >
                       {isSubmitting ? "Envoi en cours..." : "Créer le post"}
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
            Tous vos posts créés avec filtrage par statut
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
              <p className="text-muted-foreground">Aucun brouillon pour le moment</p>
              <p className="text-sm text-muted-foreground">
                Commencez par créer votre premier post ci-dessus
              </p>
            </div>
          ) : (
            <Tabs defaultValue="drafts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
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
            <TableHead>Media</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                {post.media ? (
                  <div className="w-16 h-16 overflow-hidden rounded-lg">
                    <img 
                      src={post.media} 
                      alt="Aperçu du post" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full bg-muted rounded flex items-center justify-center"><span class="text-xs text-muted-foreground">Pas d\'image</span></div>';
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Image className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </TableCell>
              <TableCell className="max-w-md">
                <p className="text-sm font-medium">
                  {(() => {
                    const caption = post.Caption || post.contenu || "";
                    const firstFiveWords = caption.split(" ").slice(0, 5).join(" ");
                    return firstFiveWords || `Post ${post.id}`;
                  })()}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {post.poste && <Badge className="bg-green-600">Publié</Badge>}
                  {post.brouillon && <Badge variant="secondary">Brouillon</Badge>}
                  {post.planifie && <Badge variant="outline">Planifié</Badge>}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {new Date(post.written_created_at || post.added_at || post.created_at || "").toLocaleDateString("fr-FR")}
                </span>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Afficher plus
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Détails du Post</DialogTitle>
                    </DialogHeader>
                    
                    <PostDetailsCard post={post} />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};