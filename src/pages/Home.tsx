import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, PenTool, Target, TrendingUp, Users, Magnet } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const pillars = [
    {
      id: "veille",
      title: "Veille Concurrentielle",
      description: "Surveillez vos concurrents et analysez les tendances du marché LinkedIn",
      icon: Eye,
      secondaryIcon: TrendingUp,
      route: "/competitors",
      gradient: "from-blue-500 to-cyan-500",
      features: ["Analyse des concurrents", "Détection de tendances", "Benchmarks de performance"]
    },
    {
      id: "content",
      title: "Création de Contenu",
      description: "Créez et planifiez du contenu engageant pour maximiser votre impact",
      icon: PenTool,
      secondaryIcon: Users,
      route: "/content",
      gradient: "from-purple-500 to-pink-500",
      features: ["Création de posts", "Planification", "Gestion des brouillons"]
    },
    {
      id: "leads",
      title: "Génération de Leads",
      description: "Générez des leads qualifiés grâce à vos publications LinkedIn",
      icon: Target,
      secondaryIcon: Magnet,
      route: "/lead-magnet",
      gradient: "from-emerald-500 to-teal-500",
      features: ["Analyse des commentaires", "Identification de prospects", "Lead Magnet"]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            LinkedIn Accelerator
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Boostez votre présence LinkedIn avec notre plateforme tout-en-un pour la veille, 
            la création de contenu et la génération de leads
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/dashboard")} className="hover-scale">
              Accéder au Dashboard
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/posts")} className="hover-scale">
              Voir mes posts
            </Button>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Les 3 Piliers de Votre Succès</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une approche complète pour maximiser votre impact sur LinkedIn
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <Card 
                key={pillar.id} 
                className="group relative overflow-hidden border-0 shadow-card hover:shadow-xl transition-all duration-500 hover-scale animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <CardHeader className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${pillar.gradient} text-white shadow-lg`}>
                      <pillar.icon className="h-6 w-6" />
                    </div>
                    <pillar.secondaryIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {pillar.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {pillar.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative">
                  <ul className="space-y-2 mb-6">
                    {pillar.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => navigate(pillar.route)}
                    className="w-full group-hover:shadow-lg transition-all duration-300"
                    variant="outline"
                  >
                    Explorer
                    <pillar.icon className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à transformer votre présence LinkedIn ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Commencez dès maintenant avec nos outils puissants et intuitifs
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              onClick={() => navigate("/content")}
              className="hover-scale"
            >
              Créer du contenu
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate("/competitors")}
              className="hover-scale"
            >
              Analyser la concurrence
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate("/lead-magnet")}
              className="hover-scale"
            >
              Générer des leads
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}