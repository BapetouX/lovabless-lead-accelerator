import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, TrendingUp, Users, Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Objectives() {
  const [objectives, setObjectives] = useState({
    postsPerMonth: 25,
    leadsPerMonth: 50,
    competitorsToTrack: 10,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSaveObjectives = () => {
    // Ici on pourrait sauvegarder dans la base de données
    toast.success("Objectifs mis à jour avec succès");
    setIsEditing(false);
  };

  const objectiveCards = [
    {
      title: "Posts mensuels",
      current: objectives.postsPerMonth,
      icon: TrendingUp,
      color: "text-primary",
      description: "Nombre de posts à publier chaque mois",
      key: "postsPerMonth",
    },
    {
      title: "Leads mensuels",
      current: objectives.leadsPerMonth,
      icon: Target,
      color: "text-primary",
      description: "Nombre de leads à générer chaque mois",
      key: "leadsPerMonth",
    },
    {
      title: "Concurrents à suivre",
      current: objectives.competitorsToTrack,
      icon: Users,
      color: "text-primary",
      description: "Nombre de concurrents à analyser",
      key: "competitorsToTrack",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Objectifs</h1>
          <p className="text-muted-foreground text-lg">
            Définissez et suivez vos objectifs mensuels
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          {isEditing ? "Annuler" : "Modifier"}
        </Button>
      </div>

      {/* Objectifs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {objectiveCards.map((objective) => (
          <Card key={objective.title} className="shadow-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 bg-primary-light rounded-lg flex items-center justify-center">
                  <objective.icon className={`h-6 w-6 ${objective.color}`} />
                </div>
              </div>
              <CardTitle className="text-lg">{objective.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {objective.description}
              </p>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor={objective.key}>Objectif</Label>
                  <Input
                    id={objective.key}
                    type="number"
                    value={objectives[objective.key as keyof typeof objectives]}
                    onChange={(e) =>
                      setObjectives({
                        ...objectives,
                        [objective.key]: parseInt(e.target.value) || 0,
                      })
                    }
                    className="text-2xl font-bold text-center"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {objective.current}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    par mois
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-2">
          <Button onClick={handleSaveObjectives} className="flex items-center gap-2">
            Sauvegarder les objectifs
          </Button>
        </div>
      )}

      {/* Conseils */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>💡 Conseils pour définir vos objectifs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Posts mensuels</h4>
              <p className="text-sm text-muted-foreground">
                Visez 20-30 posts par mois pour maintenir une présence constante. 
                La qualité prime sur la quantité.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Leads mensuels</h4>
              <p className="text-sm text-muted-foreground">
                Un objectif réaliste est 2-5% de votre audience en leads qualifiés. 
                Adaptez selon votre secteur.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Concurrents</h4>
              <p className="text-sm text-muted-foreground">
                5-15 concurrents permettent une veille efficace sans surcharge. 
                Choisissez des profils complémentaires.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}