import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, hasRole } from '@/services/authService';
import MainLayout from '@/components/layout/MainLayout';
import { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
  requiredRole?: string;
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user has the required role
  if (requiredRole && !hasRole(requiredRole)) {
    // Redirect to unauthorized page or home
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // If authenticated and has required role, render the children with MainLayout
  return <MainLayout>{children}</MainLayout>;
};

export default ProtectedRoute;
