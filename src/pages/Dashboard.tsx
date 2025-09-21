import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, MessageCircle, Target, Eye, Heart } from "lucide-react";

const stats = [
  {
    title: "Posts publiés",
    value: "24",
    change: "+12% ce mois",
    icon: TrendingUp,
    color: "text-primary",
  },
  {
    title: "Taux d'engagement",
    value: "8.4%",
    change: "+2.1% vs mois dernier",
    icon: Heart,
    color: "text-primary",
  },
  {
    title: "Leads générés",
    value: "156",
    change: "+34 cette semaine",
    icon: Target,
    color: "text-primary",
  },
  {
    title: "Vues de profil",
    value: "2,847",
    change: "+18% ce mois",
    icon: Eye,
    color: "text-primary",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Vue d'ensemble de vos performances LinkedIn
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className="h-12 w-12 bg-primary-light rounded-lg flex items-center justify-center">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Vos dernières actions sur LinkedIn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Nouveau post publié", time: "Il y a 2h", type: "post" },
                { action: "15 nouveaux commentaires", time: "Il y a 4h", type: "comment" },
                { action: "Profile visité 23 fois", time: "Aujourd'hui", type: "view" },
                { action: "5 nouveaux followers", time: "Hier", type: "follow" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Objectifs du mois</CardTitle>
            <CardDescription>Progression vers vos objectifs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { goal: "Posts à publier", current: 18, target: 25, percentage: 72 },
                { goal: "Leads à générer", current: 156, target: 200, percentage: 78 },
                { goal: "Engagement rate", current: 8.4, target: 10, percentage: 84 },
              ].map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.goal}</span>
                    <span className="text-muted-foreground">
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}