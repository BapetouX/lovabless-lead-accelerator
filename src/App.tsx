import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LeadMagnet from "./pages/LeadMagnet";
import Content from "./pages/Content";
import PostsList from "./pages/PostsList";
import Competitors from "./pages/Competitors";
import CompetitorPosts from "./pages/CompetitorPosts";
import Leads from "./pages/Leads";
import ContentWatch from "./pages/ContentWatch";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/competitor-posts/:competitorId" element={<CompetitorPosts />} />
            <Route path="/" element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="content-watch" element={<ContentWatch />} />
              <Route path="competitors" element={<Competitors />} />
              <Route path="content" element={<Content />} />
              <Route path="posts" element={<PostsList />} />
              <Route path="leads" element={<Leads />} />
              <Route path="lead-magnet" element={<LeadMagnet />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
