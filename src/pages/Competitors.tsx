import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Search, TrendingUp } from "lucide-react";

export default function Competitors() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Analyse concurrentielle</h1>
        <p className="text-muted-foreground text-lg">
          Analysez vos concurrents et leur stratégie LinkedIn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Ajouter concurrent
            </CardTitle>
            <CardDescription>Surveiller un nouveau concurrent</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-primary">
              Ajouter
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tendances
            </CardTitle>
            <CardDescription>Analyser les tendances du marché</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Voir tendances
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Benchmarks
            </CardTitle>
            <CardDescription>Comparer vos performances</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Comparer
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card bg-gradient-subtle">
        <CardContent className="p-12 text-center">
          <Users className="h-16 w-16 mx-auto text-primary opacity-50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Fonctionnalité en développement</h3>
          <p className="text-muted-foreground">
            L'analyse concurrentielle sera bientôt disponible
          </p>
        </CardContent>
      </Card>
    </div>
  );
}