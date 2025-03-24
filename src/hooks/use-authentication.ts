import { useAuth } from "@/contexts/AuthContext";
import { useFirebase } from "@/contexts/FirebaseContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { useEffect, useState, useCallback } from "react";

export const useAuthentication = () => {
  const { isAuthenticated: isAuthAuthenticated, user, signOutUser, signInUser, signUpUser } = useAuth();
  const { currentUser } = useFirebase();
  const { wallet, connect, disconnect } = useWeb3();
  const [authMethod, setAuthMethod] = useState<'credentials' | 'wallet' | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Force immediate initialization when component mounts
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Update authentication method based on user status
  useEffect(() => {
    console.log("Authentication state updated:", { user, wallet });
    
    // If we have user data, we're authenticated with credentials
    if (user) {
      setAuthMethod('credentials');
      setAuthLoading(false);
    } 
    // If we have a wallet but no user, we're authenticated with wallet
    else if (wallet && !user) {
      setAuthMethod('wallet');
      setAuthLoading(false);
    }
    // Otherwise we're not authenticated
    else {
      setAuthMethod(null);
      setAuthLoading(false);
    }
  }, [user, wallet]);
  
  // Format user data object to be more consistent
  const normalizedUser = user
    ? {
        id: user.id,
        email: user.email,
        name: user.name || user.email?.split('@')[0] || "User",
      }
    : null;

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      console.log("Attempting login with email:", email);
      
      // Normalize email address (trim whitespace and convert to lowercase)
      const normalizedEmail = email.trim().toLowerCase();
      
      // Attempt to sign in with normalized email
      const success = await signInUser({ 
        email: normalizedEmail, 
        password 
      });
      
      console.log("Login result:", success);
      
      if (success && user) {
        setAuthMethod('credentials');
        return { user, token: 'token' }; // Mock token since we don't have direct access
      }
      
      throw new Error('Authentication failed');
    } catch (error) {
      console.error('Login error:', error);
      // Rethrow the error with more specific information if available
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Authentication failed. Please check your email and password.');
      }
    } finally {
      setAuthLoading(false);
    }
  };
  
  // Sign up with email and password
  const signup = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      
      // Normalize email address (trim whitespace and convert to lowercase)
      const normalizedEmail = email.trim().toLowerCase();
      
      const success = await signUpUser({ 
        name: normalizedEmail.split('@')[0], 
        email: normalizedEmail, 
        password 
      });
      
      if (success && user) {
        setAuthMethod('credentials');
        return { user, token: 'token' }; // Mock token since we don't have direct access
      }
      
      throw new Error('Sign up failed');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };
  
  // Connect wallet
  const connectWallet = async () => {
    try {
      setAuthLoading(true);
      const connected = await connect();
      
      if (connected) {
        setAuthMethod('wallet');
        localStorage.setItem('walletConnected', 'true');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Connect wallet error:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };
  
  // Logout
  const logout = async () => {
    try {
      setAuthLoading(true);
      
      // If wallet is connected, disconnect it first
      if (wallet) {
        console.log('Disconnecting wallet during logout');
        try {
          await disconnect();
        } catch (walletError) {
          console.error('Error disconnecting wallet:', walletError);
          // Continue with logout even if wallet disconnect fails
        }
      }
      
      // Sign out user from Firebase
      await signOutUser();
      
      // Reset auth method
      setAuthMethod(null);
      
      // Clear all storage items related to authentication
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('walletConnected');
      
      // Force a page reload after a brief timeout to ensure all state is cleared
      setTimeout(() => {
        window.location.href = '/';
      }, 300);
      
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    user: normalizedUser,
    wallet,
    isAuthenticated: !!authMethod,
    authMethod,
    authLoading,
    login,
    signup,
    logout,
    connectWallet,
    hasCredentials: isAuthAuthenticated && !!user,
  };
};

export default useAuthentication; 