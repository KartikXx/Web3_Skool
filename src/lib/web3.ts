import { ethers } from 'ethers';

// Types for wallet info
export interface WalletInfo {
  address: string;
  balance: string;
  chainId: number;
  chainName: string;
  isConnected: boolean;
}

// Check if MetaMask or other Ethereum provider is available
export const hasEthereumProvider = (): boolean => {
  const hasProvider = typeof window !== 'undefined' && !!window.ethereum;
  console.log('Ethereum provider detected:', hasProvider);
  
  if (hasProvider) {
    // Log provider details for debugging
    console.log('Provider details:', {
      isMetaMask: window.ethereum.isMetaMask,
      isCoinbaseWallet: window.ethereum.isCoinbaseWallet,
      providers: window.ethereum.providers, // For multiple injected providers
    });
  }
  
  return hasProvider;
};

// Get Ethereum provider
export const getProvider = (): ethers.providers.Web3Provider | null => {
  if (!hasEthereumProvider()) {
    console.error('No Ethereum provider found');
    return null;
  }
  
  try {
    // If window.ethereum.providers exists, prioritize MetaMask
    if (window.ethereum.providers) {
      const providers = window.ethereum.providers;
      const metamaskProvider = providers.find(p => p.isMetaMask);
      if (metamaskProvider) {
        console.log('Using MetaMask provider from multiple injected providers');
        return new ethers.providers.Web3Provider(metamaskProvider);
      }
    }
    
    console.log('Using default Ethereum provider');
    return new ethers.providers.Web3Provider(window.ethereum);
  } catch (error) {
    console.error('Error creating Web3Provider:', error);
    return null;
  }
};

// Connect to wallet
export const connectWallet = async (): Promise<WalletInfo | null> => {
  try {
    console.log('Connecting to wallet...');
    const provider = getProvider();
    if (!provider) {
      console.error('No Ethereum provider found. Please install MetaMask.');
      throw new Error('No Ethereum provider found. Please install MetaMask.');
    }

    // Request account access
    console.log('Requesting account access...');
    const accounts = await provider.send('eth_requestAccounts', []);
    console.log('Connected accounts:', accounts);
    
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log('Connected address:', address);
    
    const balanceWei = await provider.getBalance(address);
    const balance = ethers.utils.formatEther(balanceWei);
    console.log('Account balance:', balance, 'ETH');
    
    // Get network information
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    const chainName = getNetworkName(chainId);
    console.log('Connected to network:', chainName, '(Chain ID:', chainId, ')');
    
    // Store wallet connection info in localStorage
    localStorage.setItem('walletConnected', 'true');
    localStorage.setItem('walletAddress', address);
    
    return {
      address,
      balance,
      chainId,
      chainName,
      isConnected: true
    };
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    return null;
  }
};

// Get the current wallet info without requesting connection
export const getWalletInfo = async (): Promise<WalletInfo | null> => {
  try {
    const provider = getProvider();
    if (!provider) return null;
    
    const accounts = await provider.listAccounts();
    if (accounts.length === 0) return null;
    
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const balanceWei = await provider.getBalance(address);
    const balance = ethers.utils.formatEther(balanceWei);
    
    // Get network information
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    const chainName = getNetworkName(chainId);
    
    return {
      address,
      balance,
      chainId,
      chainName,
      isConnected: true
    };
  } catch (error) {
    console.error('Error getting wallet info:', error);
    return null;
  }
};

// Disconnect wallet (for UI purposes only - there's no real "disconnect" in standard EIP-1193)
export const disconnectWallet = (): void => {
  // This doesn't actually disconnect but can be used to clear the application's state
  console.log('Wallet disconnected from application');
  
  // Clear wallet connection info from localStorage
  localStorage.removeItem('walletConnected');
  localStorage.removeItem('walletAddress');
};

// Get human-readable network name from chainId
export const getNetworkName = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet';
    case 5:
      return 'Goerli Testnet';
    case 11155111:
      return 'Sepolia Testnet';
    case 137:
      return 'Polygon Mainnet';
    case 80001:
      return 'Mumbai Testnet';
    case 42161:
      return 'Arbitrum One';
    case 10:
      return 'Optimism';
    case 56:
      return 'BNB Smart Chain';
    case 43114:
      return 'Avalanche C-Chain';
    default:
      return `Chain ID ${chainId}`;
  }
};

// Handle chain (network) change
export const handleChainChange = (callback: (chainId: number) => void): void => {
  if (!hasEthereumProvider()) return;
  
  window.ethereum.on('chainChanged', (chainId: string) => {
    console.log('Chain changed to:', chainId);
    const chainIdDecimal = parseInt(chainId, 16);
    callback(chainIdDecimal);
  });
};

// Handle account change
export const handleAccountChange = (callback: (accounts: string[]) => void): void => {
  if (!hasEthereumProvider()) return;
  
  window.ethereum.on('accountsChanged', (accounts: string[]) => {
    console.log('Accounts changed:', accounts);
    callback(accounts);
  });
};

// Manual disconnect method - only clears local state
export const forceDisconnect = (): void => {
  console.log('Forcing wallet disconnect');
};

// Add global ethereum window type
declare global {
  interface Window {
    ethereum: any;
  }
} 