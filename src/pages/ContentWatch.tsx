import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Bookmark, ExternalLink, TrendingUp, Users, MessageCircle } from "lucide-react";

const trendingTopics = [
  { topic: "Intelligence Artificielle", posts: 1249, engagement: "12.4%", trend: "+23%" },
  { topic: "Remote Work", posts: 892, engagement: "8.7%", trend: "+15%" },
  { topic: "Leadership", posts: 2341, engagement: "6.2%", trend: "+8%" },
  { topic: "Digital Marketing", posts: 1567, engagement: "9.1%", trend: "+19%" },
];

const contentSuggestions = [
  {
    title: "Les 5 tendances IA à suivre en 2024",
    source: "TechCrunch",
    engagement: "2.1K interactions",
    type: "Article",
    url: "#",
    tags: ["IA", "Tech", "Futur"],
  },
  {
    title: "Comment améliorer sa productivité en télétravail",
    source: "Harvard Business Review",
    engagement: "1.8K interactions",
    type: "Guide",
    url: "#",
    tags: ["Remote", "Productivité", "Tips"],
  },
  {
    title: "Le leadership à l'ère du digital",
    source: "Forbes",
    engagement: "3.2K interactions",
    type: "Article",
    url: "#",
    tags: ["Leadership", "Digital", "Management"],
  },
];

export default function ContentWatch() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Veille de contenu</h1>
        <p className="text-muted-foreground text-lg">
          Découvrez les tendances et contenus populaires de votre secteur
        </p>
      </div>

      {/* Search Bar */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des sujets, mots-clés ou entreprises..."
                className="pl-10"
              />
            </div>
            <Button className="bg-gradient-primary">
              Analyser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Sujets tendance
          </CardTitle>
          <CardDescription>
            Les sujets les plus populaires cette semaine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-foreground">{topic.topic}</h3>
                  <Badge variant="secondary" className="text-primary bg-primary-light">
                    {topic.trend}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {topic.posts} posts
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {topic.engagement} engagement
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Suggestions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            Contenus suggérés
          </CardTitle>
          <CardDescription>
            Contenus populaires et inspirants pour vos publications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentSuggestions.map((content, index) => (
              <div key={index} className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{content.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>{content.source}</span>
                      <span>•</span>
                      <span>{content.type}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {content.engagement}
                      </span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {content.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Bookmark className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}