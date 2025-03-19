import React, { useEffect, useState } from 'react';
import { useDebugWallet } from '@/hooks/use-debug-wallet';
import { useWeb3 } from '@/contexts/Web3Context';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { toast } from 'sonner';

const WalletDebug: React.FC = () => {
  const { debugInfo, runDiagnostics, testWalletConnection } = useDebugWallet();
  const { wallet, connect, disconnect, hasProvider, providerInfo } = useWeb3();
  const [testResult, setTestResult] = useState<any>(null);
  const [directRequestResult, setDirectRequestResult] = useState<any>(null);

  // Run diagnostics on component mount
  useEffect(() => {
    runDiagnostics();
  }, []);

  const handleTestWallet = async () => {
    try {
      const result = await testWalletConnection();
      setTestResult(result);
      
      if (result.success) {
        toast.success('Wallet connection test successful');
      } else {
        toast.error(`Test failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error running wallet test:', error);
      setTestResult({ success: false, error: String(error) });
      toast.error('Error running wallet test');
    }
  };

  const handleDirectRequest = async () => {
    if (!window.ethereum) {
      toast.error('No Ethereum provider found');
      return;
    }

    try {
      const result = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setDirectRequestResult({ success: true, accounts: result });
      toast.success('Direct wallet request successful');
    } catch (error) {
      console.error('Direct request error:', error);
      setDirectRequestResult({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      });
      toast.error('Direct wallet request failed');
    }
  };

  const handleEthersConnect = async () => {
    try {
      const success = await connect();
      if (success) {
        toast.success('Ethers wallet connection successful');
      } else {
        toast.error('Ethers wallet connection failed');
      }
    } catch (error) {
      console.error('Ethers connection error:', error);
      toast.error(`Ethers connection error: ${String(error)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container max-w-5xl mx-auto py-24 px-4">
        <h1 className="text-3xl font-bold mb-2">Wallet Connection Debug</h1>
        <p className="text-muted-foreground mb-8">
          Use this page to diagnose wallet connection issues
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={18} className="text-blue-500" />
                Browser & Provider Status
              </CardTitle>
              <CardDescription>
                Details about your browser and detected wallet providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {debugInfo ? (
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">Browser:</span>
                    <span>{debugInfo.browserName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">Ethereum Provider:</span>
                    <span className={debugInfo.hasEthereum ? 'text-green-500' : 'text-red-500'}>
                      {debugInfo.hasEthereum ? 'Detected' : 'Not Detected'}
                    </span>
                  </div>
                  {debugInfo.hasEthereum && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="font-medium">MetaMask:</span>
                        <span className={debugInfo.isMetaMask ? 'text-green-500' : 'text-red-500'}>
                          {debugInfo.isMetaMask ? 'Detected' : 'Not Detected'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="font-medium">Coinbase Wallet:</span>
                        <span className={debugInfo.isCoinbaseWallet ? 'text-green-500' : 'text-red-500'}>
                          {debugInfo.isCoinbaseWallet ? 'Detected' : 'Not Detected'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="font-medium">Multiple Providers:</span>
                        <span>
                          {debugInfo.hasMultipleProviders ? `Yes (${debugInfo.providerCount})` : 'No'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  No debug information available
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={runDiagnostics} className="w-full">
                Refresh Diagnostics
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={18} className="text-blue-500" />
                Connection Status
              </CardTitle>
              <CardDescription>
                Current wallet connection status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium">Wallet Connected:</span>
                  <span className={wallet ? 'text-green-500' : 'text-red-500'}>
                    {wallet ? 'Yes' : 'No'}
                  </span>
                </div>
                {wallet && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">Address:</span>
                      <span className="truncate">{wallet.address}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">Network:</span>
                      <span>{wallet.chainName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">Balance:</span>
                      <span>{Number(wallet.balance).toFixed(4)} ETH</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {!wallet ? (
                <Button onClick={handleEthersConnect} className="w-full">
                  Connect with Ethers
                </Button>
              ) : (
                <Button variant="outline" onClick={disconnect} className="w-full">
                  Disconnect Wallet
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={18} className="text-blue-500" />
                Direct Connection Test
              </CardTitle>
              <CardDescription>
                Test wallet connection using direct ethereum.request
              </CardDescription>
            </CardHeader>
            <CardContent>
              {directRequestResult ? (
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">Test Status:</span>
                    <span className={directRequestResult.success ? 'text-green-500' : 'text-red-500'}>
                      {directRequestResult.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  {directRequestResult.success ? (
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">Accounts:</span>
                      <span className="truncate">
                        {directRequestResult.accounts?.join(', ') || 'None returned'}
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">Error:</span>
                      <span className="text-red-500">{directRequestResult.error}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  No test results yet
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleDirectRequest} className="w-full">
                Test Direct Connection
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={18} className="text-blue-500" />
                Hook-based Test
              </CardTitle>
              <CardDescription>
                Test wallet connection using useDebugWallet hook
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResult ? (
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">Test Status:</span>
                    <span className={testResult.success ? 'text-green-500' : 'text-red-500'}>
                      {testResult.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  {testResult.success ? (
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">Accounts:</span>
                      <span className="truncate">
                        {testResult.accounts?.join(', ') || 'None returned'}
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">Error:</span>
                      <span className="text-red-500">{testResult.error}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  No test results yet
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleTestWallet} className="w-full">
                Run Test Connection
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-yellow-500" />
                  Wallet Connection Troubleshooting
                </CardTitle>
                <CardDescription>
                  Common issues and solutions for wallet connection problems
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">1. MetaMask not installed or detected</h3>
                  <p className="text-sm text-muted-foreground">
                    Make sure you have MetaMask installed in your browser. If already installed, 
                    try refreshing the page or restarting your browser.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">2. MetaMask popup not appearing</h3>
                  <p className="text-sm text-muted-foreground">
                    Check if MetaMask is locked. Open the extension manually and unlock it.
                    Also check if popups are blocked by your browser.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">3. Multiple wallet extensions conflicting</h3>
                  <p className="text-sm text-muted-foreground">
                    If you have multiple wallet extensions (MetaMask, Coinbase Wallet, etc.), 
                    they might conflict. Try disabling all except the one you want to use.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">4. Browser permissions</h3>
                  <p className="text-sm text-muted-foreground">
                    Check that your browser allows MetaMask to create popups for this site.
                    Try adding this site to the allowed sites in MetaMask settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default WalletDebug; 