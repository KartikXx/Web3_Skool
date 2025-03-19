import { Navigate, useLocation } from 'react-router-dom';
import { useAuthentication } from '@/hooks/use-authentication';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, authMethod, user, wallet } = useAuthentication();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  // Check localStorage for authentication tokens as a fallback verification
  const hasLocalAuthData = () => {
    return !!(localStorage.getItem('user') && localStorage.getItem('token')) || !!localStorage.getItem('walletConnected');
  };
  
  // Add loading state to avoid flashing redirect
  useEffect(() => {
    // Add a brief delay to allow auth state to be checked
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Add detailed debugging
  useEffect(() => {
    console.log('ProtectedRoute - Auth status:', { 
      isAuthenticated, 
      authMethod,
      hasUser: !!user,
      hasWallet: !!wallet,
      localStorageAuth: hasLocalAuthData(),
      location: location.pathname,
      isLoading
    });
  }, [isAuthenticated, authMethod, user, wallet, location, isLoading]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blockchain-500" />
      </div>
    );
  }

  // Check authentication from both React state and localStorage as a fallback
  const isUserAuthenticated = isAuthenticated || hasLocalAuthData();

  // Redirect to sign-in if not authenticated
  if (!isUserAuthenticated) {
    // Log the current location for debugging
    console.log('Not authenticated, redirecting to sign-in from:', location.pathname);
    
    // Save the current location the user was trying to navigate to
    return (
      <Navigate 
        to="/sign-in" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Render the protected component
  return <>{children}</>;
};

export default ProtectedRoute; 