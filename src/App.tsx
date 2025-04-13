
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Schools from "@/pages/Schools";
import Teams from "@/pages/Teams";
import Matches from "@/pages/Matches";
import Standings from "@/pages/Standings";
import Rankings from "@/pages/Rankings";
import Districts from "@/pages/Districts";
import PlayerManagement from "@/pages/PlayerManagement";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  // Redirect to dashboard if logged in and trying to access login page
  if (user && window.location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/schools" element={
        <ProtectedRoute>
          <Layout>
            <Schools />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/teams" element={
        <ProtectedRoute>
          <Layout>
            <Teams />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/matches" element={
        <ProtectedRoute>
          <Layout>
            <Matches />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/standings" element={
        <ProtectedRoute>
          <Layout>
            <Standings />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/rankings" element={
        <ProtectedRoute>
          <Layout>
            <Rankings />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/districts" element={
        <ProtectedRoute>
          <Layout>
            <Districts />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/players" element={
        <ProtectedRoute>
          <Layout>
            <PlayerManagement />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </TooltipProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
