import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, MessageCircle, Target, Eye, Heart } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRecentActivity } from "@/hooks/useRecentActivity";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();

  const statsCards = [
    {
      title: "Posts publiés",
      value: statsLoading ? "..." : stats?.publishedPosts.toString() || "0",
      change: `+${stats?.postsThisMonth || 0} ce mois`,
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      title: "Taux d'engagement",
      value: statsLoading ? "..." : `${stats?.engagementRate || 0}%`,
      change: "Moyenne concurrents",
      icon: Heart,
      color: "text-primary",
    },
    {
      title: "Leads générés",
      value: statsLoading ? "..." : stats?.totalLeads.toString() || "0",
      change: `+${stats?.leadsThisMonth || 0} ce mois`,
      icon: Target,
      color: "text-primary",
    },
    {
      title: "Concurrents suivis",
      value: statsLoading ? "..." : stats?.competitorsCount.toString() || "0",
      change: "Analyse continue",
      icon: Users,
      color: "text-primary",
    },
  ];

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
        {statsCards.map((stat) => (
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
              {activityLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 animate-pulse">
                      <div className="h-2 w-2 bg-muted rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                recentActivity?.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
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
              {statsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2 animate-pulse">
                      <div className="flex justify-between">
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-muted h-2 rounded-full w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                [
                  { 
                    goal: "Posts à publier", 
                    current: stats?.postsThisMonth || 0, 
                    target: 25, 
                    percentage: Math.min(((stats?.postsThisMonth || 0) / 25) * 100, 100) 
                  },
                  { 
                    goal: "Leads à générer", 
                    current: stats?.leadsThisMonth || 0, 
                    target: 50, 
                    percentage: Math.min(((stats?.leadsThisMonth || 0) / 50) * 100, 100) 
                  },
                  { 
                    goal: "Engagement rate", 
                    current: parseFloat(stats?.engagementRate || "0"), 
                    target: 100, 
                    percentage: Math.min(parseFloat(stats?.engagementRate || "0"), 100) 
                  },
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
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}