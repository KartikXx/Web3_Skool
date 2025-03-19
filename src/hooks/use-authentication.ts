import { useAuth } from "@/contexts/AuthContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { useEffect, useState, useCallback } from "react";

export const useAuthentication = () => {
  const { isAuthenticated: isAuthAuthenticated, user, signOutUser } = useAuth();
  const { wallet, connect, disconnect } = useWeb3();
  const [authMethod, setAuthMethod] = useState<'credentials' | 'wallet' | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Force immediate initialization when component mounts
  useEffect(() => {
    if (!isInitialized) {
      console.log("Initializing authentication state with:", {
        isAuthAuthenticated,
        hasUser: !!user,
        hasWallet: !!wallet
      });
      
      // Initial state setup
      if (isAuthAuthenticated && user) {
        console.log("Initial auth method set to credentials");
        setAuthMethod('credentials');
      } else if (wallet) {
        console.log("Initial auth method set to wallet");
        setAuthMethod('wallet');
      } else {
        console.log("Initial auth method is null");
        setAuthMethod(null);
      }
      
      setIsInitialized(true);
    }
  }, [isInitialized, isAuthAuthenticated, user, wallet]);

  // Watch for changes to auth states
  useEffect(() => {
    if (isInitialized) {
      console.log("Authentication state changed:", { 
        isAuthAuthenticated, 
        hasUser: !!user, 
        hasWallet: !!wallet,
        walletConnected: localStorage.getItem('walletConnected'),
        walletAddress: localStorage.getItem('walletAddress')
      });
      
      if (isAuthAuthenticated && user) {
        console.log("Setting auth method to credentials");
        setAuthMethod('credentials');
      } else if (wallet) {
        console.log("Setting auth method to wallet");
        setAuthMethod('wallet');
      } else {
        console.log("Clearing auth method");
        setAuthMethod(null);
      }
    }
  }, [isInitialized, isAuthAuthenticated, user, wallet]);

  // Helper to normalize user data regardless of auth method
  const normalizedUser = authMethod === 'credentials' 
    ? { 
        id: user?.id || '',
        name: user?.name || 'User',
        email: user?.email || '',
        address: null,
      }
    : wallet 
      ? {
          id: wallet.address,
          name: `Wallet ${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}`,
          email: null,
          address: wallet.address,
        }
      : null;

  // Combined logout function that handles both auth types
  const logout = useCallback(() => {
    console.log("Logging out user with auth method:", authMethod);
    if (authMethod === 'credentials') {
      signOutUser();
    } else if (authMethod === 'wallet') {
      disconnect();
    }
    setAuthMethod(null);
  }, [authMethod, signOutUser, disconnect]);

  // Enhanced connect wallet function that ensures state updates
  const connectWallet = useCallback(async () => {
    console.log("Connecting wallet from useAuthentication");
    const success = await connect();
    
    // Force update the authMethod immediately after successful connection
    if (success) {
      console.log("Wallet connection successful, updating auth method");
      setAuthMethod('wallet');
    }
    
    return success;
  }, [connect]);

  return {
    isAuthenticated: !!authMethod,
    authMethod,
    user: normalizedUser,
    wallet,
    connectWallet,
    logout,
  };
};

export default useAuthentication; 