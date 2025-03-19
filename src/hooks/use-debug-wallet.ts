import { useState } from 'react';

interface DebugInfo {
  browserName: string;
  hasEthereum: boolean;
  isMetaMask: boolean;
  isCoinbaseWallet: boolean;
  hasMultipleProviders: boolean;
  providerCount: number;
  etherDetails: any;
}

export const useDebugWallet = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  const runDiagnostics = () => {
    try {
      // Get browser information
      const userAgent = navigator.userAgent;
      let browserName = 'Unknown';
      
      if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = 'Chrome';
      } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = 'Firefox';
      } else if (userAgent.match(/safari/i)) {
        browserName = 'Safari';
      } else if (userAgent.match(/edg/i)) {
        browserName = 'Edge';
      } else if (userAgent.match(/opera|opr/i)) {
        browserName = 'Opera';
      }

      // Get Ethereum provider info
      const hasEthereum = typeof window !== 'undefined' && !!window.ethereum;
      
      const info: DebugInfo = {
        browserName,
        hasEthereum,
        isMetaMask: false,
        isCoinbaseWallet: false,
        hasMultipleProviders: false,
        providerCount: 0,
        etherDetails: {}
      };

      if (hasEthereum) {
        info.isMetaMask = !!window.ethereum.isMetaMask;
        info.isCoinbaseWallet = !!window.ethereum.isCoinbaseWallet;
        info.hasMultipleProviders = !!window.ethereum.providers;
        info.providerCount = window.ethereum.providers?.length || 0;
        
        // Capture additional details about ethereum provider
        const etherDetails: any = {};
        
        // Safely extract properties
        for (const key in window.ethereum) {
          try {
            // Only get non-function properties
            if (typeof window.ethereum[key] !== 'function') {
              etherDetails[key] = window.ethereum[key];
            }
          } catch (error) {
            etherDetails[key] = 'Error accessing property';
          }
        }
        
        info.etherDetails = etherDetails;
      }

      setDebugInfo(info);
      console.log('Wallet Debug Information:', info);
      return info;
    } catch (error) {
      console.error('Error running wallet diagnostics:', error);
      return null;
    }
  };

  // Execute a simple request accounts call
  const testWalletConnection = async () => {
    if (!window.ethereum) {
      console.error('No ethereum provider found');
      return { success: false, error: 'No ethereum provider found' };
    }

    try {
      console.log('Testing wallet connection by requesting accounts...');
      const result = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Wallet test result:', result);
      return { success: true, accounts: result };
    } catch (error) {
      console.error('Error testing wallet connection:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        errorObject: error 
      };
    }
  };

  return { debugInfo, runDiagnostics, testWalletConnection };
};

export default useDebugWallet; 