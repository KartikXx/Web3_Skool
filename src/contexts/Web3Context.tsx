import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  connectWallet,
  disconnectWallet,
  getWalletInfo,
  handleAccountChange,
  handleChainChange,
  hasEthereumProvider,
  WalletInfo
} from '@/lib/web3';

interface Web3ContextType {
  wallet: WalletInfo | null;
  isConnecting: boolean;
  hasProvider: boolean;
  providerInfo: any;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  error: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasProvider, setHasProvider] = useState(false);
  const [providerInfo, setProviderInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for provider and saved connection on component mount
  useEffect(() => {
    const checkProvider = async () => {
      try {
        console.log('Checking for Ethereum provider...');
        const providerExists = hasEthereumProvider();
        setHasProvider(providerExists);
        
        if (providerExists && window.ethereum) {
          const info = {
            isMetaMask: window.ethereum.isMetaMask || false,
            isCoinbaseWallet: window.ethereum.isCoinbaseWallet || false,
            hasProviders: !!window.ethereum.providers,
            providerCount: window.ethereum.providers?.length || 0
          };
          console.log('Provider info:', info);
          setProviderInfo(info);
          
          // Check if already connected
          try {
            const walletInfo = await getWalletInfo();
            if (walletInfo) {
              console.log('Found existing wallet connection:', walletInfo);
              setWallet(walletInfo);
            } else {
              console.log('No existing wallet connection found');
            }
          } catch (error) {
            console.error('Error checking wallet connection:', error);
          }

          // Handle account changes
          handleAccountChange(async (accounts) => {
            if (accounts.length === 0) {
              // User disconnected their wallet
              setWallet(null);
              toast.info('Wallet disconnected');
            } else {
              // Account changed, update the wallet info
              const walletInfo = await getWalletInfo();
              if (walletInfo) {
                setWallet(walletInfo);
                toast.info('Wallet account changed');
              }
            }
          });

          // Handle network changes
          handleChainChange(async (chainId) => {
            const walletInfo = await getWalletInfo();
            if (walletInfo) {
              setWallet(walletInfo);
              toast.info(`Network changed to ${walletInfo.chainName}`);
            }
          });
        } else {
          console.log('No Ethereum provider found');
        }
      } catch (err) {
        console.error('Error during provider detection:', err);
      }
    };
    
    checkProvider();
  }, []);

  const connect = async (): Promise<boolean> => {
    setError(null);
    setIsConnecting(true);
    
    if (!hasProvider) {
      const errorMsg = 'No Ethereum wallet found. Please install MetaMask or another wallet.';
      console.error(errorMsg);
      setError(errorMsg);
      toast.error(errorMsg);
      setIsConnecting(false);
      return false;
    }

    try {
      console.log('Attempting to connect wallet...');
      const walletInfo = await connectWallet();
      
      if (walletInfo) {
        console.log('Wallet connected successfully:', walletInfo);
        setWallet(walletInfo);
        return true;
      } else {
        const errorMsg = 'Failed to connect wallet. The user may have rejected the connection request.';
        console.error(errorMsg);
        setError(errorMsg);
        setIsConnecting(false);
        return false;
      }
    } catch (error) {
      const errorMsg = error instanceof Error 
        ? `Wallet connection error: ${error.message}` 
        : 'Unknown wallet connection error';
      console.error(errorMsg, error);
      setError(errorMsg);
      setIsConnecting(false);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    try {
      disconnectWallet();
      setWallet(null);
      console.log('Wallet disconnected from application state');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        wallet,
        isConnecting,
        hasProvider,
        providerInfo,
        connect,
        disconnect,
        error
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  
  return context;
}; 