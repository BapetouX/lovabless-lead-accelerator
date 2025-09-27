import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PenTool, Calendar, Clock, Lightbulb, FileText, Image, Sparkles, Upload } from "lucide-react";

export default function Content() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [postType, setPostType] = useState("full");
  const [imageOption, setImageOption] = useState("upload");
  const [postContent, setPostContent] = useState("");
  const [keyIdea, setKeyIdea] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");

  const handleCreatePost = () => {
    // Logic pour créer le post
    console.log("Type de post:", postType);
    console.log("Option image:", imageOption);
    console.log("Contenu:", postType === "full" ? postContent : keyIdea);
    if (imageOption === "ai" && imagePrompt) {
      console.log("Prompt image:", imagePrompt);
    }
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Création de contenu</h1>
        <p className="text-muted-foreground text-lg">
          Créez et planifiez votre contenu LinkedIn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                        (postType === "full" && !postContent.trim()) ||
                        (postType === "idea" && !keyIdea.trim()) ||
                        (imageOption === "ai" && !imagePrompt.trim())
                      }
                    >
                      Créer le post
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Planifier
            </CardTitle>
            <CardDescription>Programmer vos publications</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Planifier
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Brouillons
            </CardTitle>
            <CardDescription>Vos posts en attente</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Voir brouillons
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card bg-gradient-subtle">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Créez du contenu engageant</h3>
          <p className="text-muted-foreground">
            Rédigez des posts complets ou partagez vos idées clés. Ajoutez des images personnalisées ou générées par IA.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}