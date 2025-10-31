import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ForgotPassword } from './pages/ForgotPassword';
import { initializeSecurity } from './utils/security';

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import Satellites from "./pages/Satellites";
import Workflows from "./pages/Workflows";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Users from "./pages/admin/Users";
import WorqhatShowcase from "./pages/WorqhatShowcase";
import WorkflowMetrics from "./pages/WorkflowMetrics";
import WorkflowExecutor from "./pages/WorkflowExecutor";

const queryClient = new QueryClient();

// Initialize security on app start
try {
  initializeSecurity();
} catch (error) {
  console.error('Failed to initialize security:', error);
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/satellites"
              element={
                <ProtectedRoute>
                  <Satellites />
                </ProtectedRoute>
              }
            />

            <Route
              path="/workflows"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Workflows />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/worqhat-showcase"
              element={
                <ProtectedRoute>
                  <WorqhatShowcase />
                </ProtectedRoute>
              }
            />

            <Route
              path="/workflow-metrics"
              element={
                <ProtectedRoute>
                  <WorkflowMetrics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/workflow-executor"
              element={
                <ProtectedRoute>
                  <WorkflowExecutor />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Users />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
