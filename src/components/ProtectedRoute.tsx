import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthentication } from '@/hooks/use-authentication';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, authLoading, hasCredentials } = useAuthentication();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to sign-in if user is not authenticated and not in loading state
    if (!isAuthenticated && !authLoading) {
      toast.error('Authentication required', {
        description: 'Please sign in to access this page',
        action: {
          label: 'Sign In',
          onClick: () => navigate('/sign-in', { state: { from: location.pathname } })
        }
      });
    }
  }, [isAuthenticated, authLoading, location.pathname, navigate]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-blockchain-500 mb-4" />
        <h2 className="text-xl font-medium">Checking authentication...</h2>
        <p className="text-muted-foreground">Please wait while we verify your credentials</p>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }

  // If user has credentials but no wallet connection when needed
  if (hasCredentials && location.pathname.includes('/quest/')) {
    // You can add more specific checks here if certain pages require wallet connection
    // This is just an example, modify as needed for your app
  }

  // Render children if authenticated
  return <>{children}</>;
}; 