import React, { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { WalletIcon, NetworkIcon, CopyIcon, LogOutIcon, ExternalLinkIcon } from '@/assets/icons';
import { toast } from 'sonner';

const WalletConnect: React.FC = () => {
  const { wallet, isConnecting, hasProvider, providerInfo, connect, disconnect, error } = useWeb3();
  const [connectionAttempted, setConnectionAttempted] = useState(false);

  const handleConnect = async () => {
    setConnectionAttempted(true);
    
    if (!hasProvider) {
      toast.error('No wallet detected. Please install MetaMask or another wallet.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }
    
    try {
      console.log('Initiating wallet connection from UI button...');
      const success = await connect();
      
      if (success) {
        toast.success('Wallet connected successfully');
      } else {
        toast.error('Failed to connect wallet. Please check the console for more information.');
      }
    } catch (err) {
      console.error('Error in wallet connection UI handler:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Wallet connection error: ${errorMessage}`);
    }
  };

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      toast.success('Address copied to clipboard');
    }
  };

  const openExplorer = () => {
    if (wallet?.address) {
      // Default to Ethereum explorer, could add logic based on chainId
      const baseUrl = wallet.chainId === 1 
        ? 'https://etherscan.io/address/' 
        : `https://blockscan.com/address/`;
      window.open(`${baseUrl}${wallet.address}`, '_blank');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info('Wallet disconnected');
  };

  const getProviderInfo = () => {
    if (!providerInfo) return 'No provider information available';
    
    return [
      providerInfo.isMetaMask ? 'MetaMask detected' : 'MetaMask not detected',
      providerInfo.isCoinbaseWallet ? 'Coinbase Wallet detected' : '',
      providerInfo.hasProviders ? `Multiple providers: ${providerInfo.providerCount}` : '',
    ].filter(Boolean).join(', ');
  };

  if (!wallet) {
    return (
      <div className="flex flex-col gap-2">
        <Button 
          onClick={handleConnect}
          disabled={isConnecting}
          variant="outline"
          className="gap-2 min-w-[150px]"
        >
          <WalletIcon size={16} />
          {isConnecting 
            ? 'Connecting...' 
            : hasProvider 
              ? 'Connect Wallet' 
              : 'Install Wallet'
          }
        </Button>
        
        {error && connectionAttempted && (
          <div className="text-xs text-destructive mt-1">
            Error: {error}
          </div>
        )}
        
        {!hasProvider && (
          <div className="text-xs text-muted-foreground mt-1">
            No wallet detected. Please install MetaMask or another Ethereum wallet.
          </div>
        )}
        
        {hasProvider && (
          <div className="text-xs text-muted-foreground mt-1">
            {getProviderInfo()}
          </div>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <WalletIcon size={16} />
          {formatAddress(wallet.address)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Connected Wallet</p>
            <p className="text-xs leading-none text-muted-foreground">
              {formatAddress(wallet.address)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <NetworkIcon size={16} />
          <span>{wallet.chainName}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <WalletIcon size={16} />
          <span>{Number(wallet.balance).toFixed(4)} ETH</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2" onClick={copyAddress}>
          <CopyIcon size={16} />
          <span>Copy Address</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2" onClick={openExplorer}>
          <ExternalLinkIcon size={16} />
          <span>View on Explorer</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onClick={handleDisconnect}>
          <LogOutIcon size={16} />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletConnect; 