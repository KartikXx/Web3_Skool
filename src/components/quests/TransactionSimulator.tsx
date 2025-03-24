import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Wallet, ArrowRight, RefreshCw, Copy, ExternalLink, Info, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useQuests } from '@/contexts/QuestContext';
import { useWeb3 } from '@/contexts/Web3Context';

interface TransactionSimulatorProps {
  questId: string;
  onComplete?: () => void;
}

export const TransactionSimulator: React.FC<TransactionSimulatorProps> = ({ questId, onComplete }) => {
  const { updateProgress, completeQuest } = useQuests();
  const { wallet, connect } = useWeb3();
  const [activeStep, setActiveStep] = useState('wallet');
  const [testTokensRequested, setTestTokensRequested] = useState(false);
  const [hasCompletedTransaction, setHasCompletedTransaction] = useState(false);
  const [hasVerifiedTransaction, setHasVerifiedTransaction] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
  const [amount, setAmount] = useState('0.01');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate progress based on completed steps
  const calculateProgress = (): number => {
    let progress = 0;

    if (wallet) progress += 25; // Step 1: Wallet connected
    if (testTokensRequested) progress += 25; // Step 2: Test tokens requested
    if (hasCompletedTransaction) progress += 25; // Step 3: Transaction completed
    if (hasVerifiedTransaction) progress += 25; // Step 4: Transaction verified

    try {
      console.log(`Updating progress for quest ${questId}: ${progress}%`);
      updateProgress(questId, progress);
    } catch (error) {
      console.error('Error updating progress:', error);
      // Continue even if there's an error updating progress
    }
    
    return progress;
  };

  const progress = calculateProgress();

  // Step 1: Connect wallet
  const handleConnectWallet = async () => {
    try {
      await connect();
      toast.success('Wallet connected successfully');
      setActiveStep('faucet');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  // Step 2: Request test tokens
  const handleRequestTokens = () => {
    try {
      // This is a simulation, so we just mark it as completed
      setTestTokensRequested(true);
      toast.success('Test tokens requested successfully');
      setActiveStep('transaction');
    } catch (error) {
      console.error('Error requesting tokens:', error);
      toast.error('Failed to request tokens. Please try again.');
    }
  };

  // Step 3: Send transaction
  const handleSendTransaction = () => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!recipientAddress || !amount) {
      toast.error('Please enter a recipient address and amount');
      return;
    }

    try {
      setIsProcessing(true);
      toast.loading('Processing transaction...', { id: 'transaction' });

      // This is a simulation, so we generate a fake transaction hash
      setTimeout(() => {
        try {
          const fakeHash = '0x' + Array.from({ length: 64 }, () => 
            Math.floor(Math.random() * 16).toString(16)
          ).join('');
          
          setTransactionHash(fakeHash);
          setHasCompletedTransaction(true);
          setIsProcessing(false);
          toast.dismiss('transaction');
          toast.success('Transaction sent successfully');
          setActiveStep('verify');
        } catch (error) {
          console.error('Error completing transaction:', error);
          toast.dismiss('transaction');
          toast.error('Transaction failed. Please try again.');
          setIsProcessing(false);
        }
      }, 3000);
    } catch (error) {
      console.error('Error sending transaction:', error);
      toast.error('Failed to send transaction. Please try again.');
      setIsProcessing(false);
    }
  };

  // Step 4: Verify transaction
  const handleVerifyTransaction = () => {
    try {
      setHasVerifiedTransaction(true);
      
      // If all steps are completed, mark the quest as complete
      if (wallet && testTokensRequested && hasCompletedTransaction) {
        try {
          console.log('Completing quest:', questId);
          completeQuest(questId);
          
          if (onComplete) {
            console.log('Calling onComplete callback');
            onComplete();
          }
        } catch (error) {
          console.error('Error completing quest:', error);
          // Continue even if there's an error completing the quest
          // The user still completed the simulation
        }
      }
      
      toast.success('Transaction verified successfully');
    } catch (error) {
      console.error('Error verifying transaction:', error);
      toast.error('Failed to verify transaction. Please try again.');
    }
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const openExplorer = () => {
    // For simulation purposes, we'll open Etherscan's Goerli explorer
    window.open(`https://goerli.etherscan.io/tx/${transactionHash}`, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Blockchain Transaction Simulation</CardTitle>
            <CardDescription>Practice sending and receiving tokens on a test network</CardDescription>
          </div>
          <Badge variant="outline" className="bg-blockchain-50 dark:bg-blockchain-900/20">
            Progress: {progress}%
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <Tabs value={activeStep} onValueChange={setActiveStep}>
        <div className="px-6">
          <TabsList className="w-full">
            <TabsTrigger value="wallet" className="flex-1">
              <span className="mr-2">1.</span> Wallet Setup
            </TabsTrigger>
            <TabsTrigger value="faucet" className="flex-1" disabled={!wallet}>
              <span className="mr-2">2.</span> Get Test Tokens
            </TabsTrigger>
            <TabsTrigger value="transaction" className="flex-1" disabled={!wallet || !testTokensRequested}>
              <span className="mr-2">3.</span> Send Transaction
            </TabsTrigger>
            <TabsTrigger value="verify" className="flex-1" disabled={!hasCompletedTransaction}>
              <span className="mr-2">4.</span> Verify
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-6">
          <TabsContent value="wallet">
            <div className="space-y-4">
              <Alert variant="default" className="bg-muted border-blockchain-200">
                <Info className="h-4 w-4" />
                <AlertTitle>About Test Networks</AlertTitle>
                <AlertDescription>
                  Test networks (testnets) are separate blockchain networks that mimic main networks but use tokens with no real value. 
                  They provide a safe environment to practice transactions without risking real assets.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Connect Your Wallet</h3>
                <p className="text-muted-foreground">
                  For this simulation, you'll use your existing wallet connected through MetaMask or another provider. 
                  In a real test environment, you would configure your wallet to connect to a testnet like Goerli or Sepolia.
                </p>

                {wallet ? (
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Wallet Connected</span>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                      </Badge>
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => setActiveStep('faucet')}
                    >
                      Continue to Next Step
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleConnectWallet} 
                    className="w-full gap-2"
                  >
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faucet">
            <div className="space-y-4">
              <Alert variant="default" className="bg-muted border-blockchain-200">
                <Info className="h-4 w-4" />
                <AlertTitle>About Test Token Faucets</AlertTitle>
                <AlertDescription>
                  Faucets are services that provide free test tokens you can use on test networks. 
                  These tokens have no real value and are only used for testing and development purposes.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Get Test Tokens</h3>
                <p className="text-muted-foreground">
                  In a real environment, you would visit a faucet website and request test tokens by submitting your wallet address. 
                  For this simulation, we'll simulate receiving test tokens.
                </p>

                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Your Wallet Address</h4>
                  <div className="flex items-center gap-2 mb-4">
                    <Input 
                      value={wallet?.address} 
                      readOnly 
                      className="font-mono text-sm" 
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => copyToClipboard(wallet?.address || '', 'Address copied to clipboard')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  {testTokensRequested ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Test tokens received successfully</span>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => setActiveStep('transaction')}
                      >
                        Continue to Next Step
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <p className="text-sm text-muted-foreground">
                        Click below to simulate requesting test tokens from a faucet. In a real environment, 
                        you would visit a faucet website such as goerlifaucet.com, enter your address, and request tokens.
                      </p>
                      <Button 
                        onClick={handleRequestTokens} 
                        className="w-full gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Request Test Tokens
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transaction">
            <div className="space-y-4">
              <Alert variant="default" className="bg-muted border-blockchain-200">
                <Info className="h-4 w-4" />
                <AlertTitle>About Blockchain Transactions</AlertTitle>
                <AlertDescription>
                  Blockchain transactions are operations that change the state of the blockchain. 
                  They include a sender, recipient, amount, and gas fee that pays for processing the transaction.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Send a Test Transaction</h3>
                <p className="text-muted-foreground">
                  Now you'll practice sending a small amount of test tokens to another address. 
                  This is a simulation, so no real transaction will occur on any blockchain.
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input 
                      id="recipient"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      placeholder="0x..."
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (ETH)</Label>
                    <Input 
                      id="amount"
                      type="number"
                      step="0.001"
                      min="0.001"
                      max="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      For this simulation, you can send between 0.001 and 1 test ETH.
                    </p>
                  </div>

                  {hasCompletedTransaction ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Transaction sent successfully</span>
                      </div>
                      <div className="space-y-2">
                        <Label>Transaction Hash</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            value={transactionHash} 
                            readOnly 
                            className="font-mono text-sm" 
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => copyToClipboard(transactionHash, 'Transaction hash copied to clipboard')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => setActiveStep('verify')}
                      >
                        Continue to Next Step
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleSendTransaction} 
                      className="w-full gap-2"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4" />
                          Send Transaction
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="verify">
            <div className="space-y-4">
              <Alert variant="default" className="bg-muted border-blockchain-200">
                <Info className="h-4 w-4" />
                <AlertTitle>About Blockchain Explorers</AlertTitle>
                <AlertDescription>
                  Blockchain explorers are websites that allow you to view transaction details, wallet balances, 
                  and other information stored on a blockchain. They're essential tools for verifying transactions.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Verify Your Transaction</h3>
                <p className="text-muted-foreground">
                  After sending a transaction, you can verify it was successful by checking a blockchain explorer. 
                  Let's practice viewing transaction details.
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Transaction Details</h4>
                    <div className="bg-muted p-4 rounded-md space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">From:</span>
                        <span className="text-sm font-mono">
                          {wallet?.address.substring(0, 8)}...{wallet?.address.substring(wallet?.address.length - 6)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">To:</span>
                        <span className="text-sm font-mono">
                          {recipientAddress.substring(0, 8)}...{recipientAddress.substring(recipientAddress.length - 6)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <span className="text-sm">{amount} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span className="text-sm text-green-500 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Confirmed
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Transaction Hash:</span>
                        <span className="text-sm font-mono">
                          {transactionHash.substring(0, 10)}...{transactionHash.substring(transactionHash.length - 8)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-center gap-4">
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={openExplorer}
                      >
                        <ExternalLink className="h-4 w-4" />
                        View in Explorer
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => copyToClipboard(transactionHash, 'Transaction hash copied to clipboard')}
                      >
                        <Copy className="h-4 w-4" />
                        Copy TX Hash
                      </Button>
                    </div>

                    {hasVerifiedTransaction ? (
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Verification complete!</span>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleVerifyTransaction} 
                        className="w-full gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Confirm Verification
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>

      <CardFooter className="border-t pt-6 flex justify-between">
        <div className="text-sm text-muted-foreground">
          {progress === 100 ? (
            <span className="flex items-center gap-2 text-green-500">
              <CheckCircle className="h-4 w-4" />
              All steps completed!
            </span>
          ) : (
            <span>
              Step {Math.ceil(progress / 25)} of 4
            </span>
          )}
        </div>
        
        {progress === 100 && !hasVerifiedTransaction && (
          <Button 
            onClick={handleVerifyTransaction}
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Complete Quest
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}; 