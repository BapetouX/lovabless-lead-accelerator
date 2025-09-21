import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, Calendar, Clock } from "lucide-react";

export default function Content() {
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
            <Button className="w-full bg-gradient-primary">
              Créer un post
            </Button>
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
        <CardContent className="p-12 text-center">
          <PenTool className="h-16 w-16 mx-auto text-primary opacity-50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Fonctionnalité en développement</h3>
          <p className="text-muted-foreground">
            L'outil de création de contenu sera bientôt disponible
          </p>
        </CardContent>
      </Card>
    </div>
  );
}