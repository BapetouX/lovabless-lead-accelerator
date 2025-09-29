import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // Get published posts count
      const { count: publishedPosts } = await supabase
        .from("Posts En Ligne")
        .select("*", { count: "exact", head: true })
        .eq("poste", true);

      // Get total leads count
      const { count: totalLeads } = await supabase
        .from("Leads Linkedin")
        .select("*", { count: "exact", head: true });

      // Get competitors count
      const { count: competitorsCount } = await supabase
        .from("competitors")
        .select("*", { count: "exact", head: true });

      // Get posts from this month for calculation
      const currentMonth = new Date();
      currentMonth.setDate(1);
      const { count: postsThisMonth } = await supabase
        .from("Posts En Ligne")
        .select("*", { count: "exact", head: true })
        .eq("poste", true)
        .gte("created_at", currentMonth.toISOString());

      // Get leads from this month
      const { count: leadsThisMonth } = await supabase
        .from("Leads Linkedin")
        .select("*", { count: "exact", head: true })
        .gte("date", currentMonth.toISOString());

      // Get competitor posts for engagement calculation
      const { data: competitorPosts } = await supabase
        .from("competitor_posts")
        .select("likes_count, comments_count, repost_count")
        .not("likes_count", "is", null)
        .not("comments_count", "is", null)
        .gte("created_at", currentMonth.toISOString());

      // Calculate average engagement rate
      let engagementRate = 0;
      if (competitorPosts && competitorPosts.length > 0) {
        const totalEngagement = competitorPosts.reduce((sum, post) => {
          const engagement = (post.likes_count || 0) + (post.comments_count || 0) + (post.repost_count || 0);
          return sum + engagement;
        }, 0);
        engagementRate = totalEngagement / competitorPosts.length;
      }

      return {
        publishedPosts: publishedPosts || 0,
        totalLeads: totalLeads || 0,
        competitorsCount: competitorsCount || 0,
        postsThisMonth: postsThisMonth || 0,
        leadsThisMonth: leadsThisMonth || 0,
        engagementRate: engagementRate.toFixed(1),
      };
    },
  });
};