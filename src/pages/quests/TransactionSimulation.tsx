import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { TransactionSimulator } from '@/components/quests/TransactionSimulator';
import { useQuests } from '@/contexts/QuestContext';
import { Loader2, ArrowLeft, BookOpen, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const TransactionSimulationPage: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  const { activeQuests, isLoading, error, startQuest, claimReward } = useQuests();
  const navigate = useNavigate();
  const [currentQuest, setCurrentQuest] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [localLoading, setLocalLoading] = useState(true);

  // Find the quest with ID 'transaction-simulation'
  useEffect(() => {
    console.log('TransactionSimulationPage - Loading state:', isLoading);
    console.log('TransactionSimulationPage - Quest ID:', questId);
    console.log('TransactionSimulationPage - Active Quests Count:', activeQuests?.length || 0);
    
    if (!isLoading) {
      setLocalLoading(true);
      try {
        // If questId is provided, use that specific quest
        if (questId) {
          console.log('Looking for specific quest ID:', questId);
          const quest = activeQuests.find(q => q.id === questId);
          if (quest) {
            console.log('Found specific quest:', quest.title);
            setCurrentQuest(quest);
            setLocalLoading(false);
            return;
          }
        }
        
        // Otherwise, look for the transaction simulation quest
        console.log('Looking for transaction-simulation quest');
        const simQuest = activeQuests.find(q => q.id === 'transaction-simulation');
        if (simQuest) {
          console.log('Found transaction simulation quest:', simQuest.title);
          setCurrentQuest(simQuest);
        } else {
          console.log('Transaction simulation quest not found, creating fallback');
          // Create a fallback quest if not found (for development/error cases)
          setCurrentQuest({
            id: 'transaction-simulation',
            title: 'Blockchain Transaction Simulation',
            description: 'Practice sending and receiving blockchain tokens in a risk-free test environment',
            longDescription: "This simulation provides you with hands-on experience of blockchain transactions. You'll go through the process of setting up a testnet wallet, requesting test tokens, sending a transaction, and tracking it on a blockchain explorer - all without using real cryptocurrency.",
            difficulty: 'beginner',
            category: 'basics',
            rewards: {
              xp: 120,
              tokens: 20
            },
            estimatedTime: '40 min',
            steps: [
              {
                id: 'step-1',
                title: 'Set Up a Testnet Wallet',
                description: 'Create and configure a wallet that works with test networks'
              },
              {
                id: 'step-2',
                title: 'Get Test Tokens',
                description: 'Request free test tokens from a testnet faucet'
              },
              {
                id: 'step-3',
                title: 'Send a Test Transaction',
                description: 'Execute a transaction to send tokens to another address'
              },
              {
                id: 'step-4',
                title: 'Track Your Transaction',
                description: 'Use a blockchain explorer to verify and analyze your transaction'
              }
            ],
            resources: [
              {
                title: 'Understanding Ethereum Transactions',
                url: 'https://ethereum.org/en/developers/docs/transactions/',
                type: 'article'
              },
              {
                title: 'Top Ethereum Testnet Faucets',
                url: 'https://faucetlink.to/goerli',
                type: 'tool'
              },
              {
                title: 'Using Etherscan for Beginners',
                url: 'https://info.etherscan.com/how-to-use-etherscan/',
                type: 'tutorial'
              }
            ],
            userStatus: 'not_started',
            userProgress: 0
          });
        }
      } catch (err) {
        console.error('Error finding quest:', err);
      } finally {
        setLocalLoading(false);
      }
    }
  }, [questId, activeQuests, isLoading, navigate]);

  const handleStartQuest = async () => {
    if (currentQuest) {
      try {
        console.log('Starting quest:', currentQuest.id);
        await startQuest(currentQuest.id);
        setActiveTab('simulation');
        toast.success('Simulation started!');
      } catch (error) {
        console.error('Failed to start quest:', error);
        toast.error('Failed to start simulation. Please try again.');
      }
    }
  };

  const handleCompleteSimulation = () => {
    try {
      console.log('Simulation completed, navigating to results tab');
      setActiveTab('completed');
      toast.success('Simulation completed!');
      
      // Force refresh
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error completing simulation:', error);
      toast.error('Error processing completion. Please try again.');
    }
  };

  const handleClaimReward = async () => {
    if (currentQuest) {
      try {
        await claimReward(currentQuest.id);
        toast.success('Reward claimed successfully!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to claim reward:', error);
        toast.error('Failed to claim reward. Please try again.');
      }
    }
  };

  // Determine quest status
  const canStart = currentQuest?.userStatus === 'not_started';
  const isInProgress = currentQuest?.userStatus === 'in_progress';
  const isCompleted = currentQuest?.userStatus === 'completed';
  const isRewarded = currentQuest?.userStatus === 'rewarded';

  // Combined loading state
  if (isLoading || localLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blockchain-500 mb-4" />
            <p className="text-muted-foreground">Loading simulation...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Error loading simulation</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/quests')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quests
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentQuest) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Simulation not found</h3>
            <p className="text-muted-foreground">The simulation you're looking for doesn't exist or has been removed.</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/quests')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quests
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/quests')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Quests
            </Button>
            
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {currentQuest.difficulty} Quest
            </Badge>
          </div>
          
          {/* Title and description */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{currentQuest.title}</h1>
            <p className="text-muted-foreground">{currentQuest.description}</p>
          </div>
          
          {/* Main content */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Transaction Simulator</CardTitle>
                  <CardDescription>
                    Practice blockchain transactions in a safe test environment
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <div className="px-6">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger 
                    value="simulation" 
                    className="flex-1"
                    disabled={canStart}
                  >
                    Simulation
                  </TabsTrigger>
                  <TabsTrigger 
                    value="completed" 
                    className="flex-1"
                    disabled={!isCompleted && !isRewarded}
                  >
                    Results
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <CardContent className="pt-6">
                <TabsContent value="overview">
                  <div className="space-y-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <p>{currentQuest.longDescription}</p>
                      
                      <h3>What You'll Learn</h3>
                      <ul>
                        {currentQuest.steps.map((step: any) => (
                          <li key={step.id}>
                            <strong>{step.title}</strong>: {step.description}
                          </li>
                        ))}
                      </ul>
                      
                      <h3>Helpful Resources</h3>
                      <ul>
                        {currentQuest.resources?.map((resource: any, index: number) => (
                          <li key={index}>
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <BookOpen className="h-4 w-4" />
                              {resource.title} ({resource.type})
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {canStart && (
                      <Button 
                        onClick={handleStartQuest} 
                        className="w-full mt-4"
                      >
                        Start Simulation
                      </Button>
                    )}

                    {(isInProgress || isCompleted || isRewarded) && (
                      <Button 
                        onClick={() => setActiveTab('simulation')} 
                        className="w-full mt-4"
                        variant="outline"
                      >
                        Continue to Simulation
                      </Button>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="simulation">
                  {isInProgress && (
                    <TransactionSimulator 
                      questId={currentQuest.id} 
                      onComplete={handleCompleteSimulation}
                    />
                  )}

                  {(isCompleted || isRewarded) && (
                    <div className="flex flex-col items-center text-center p-6">
                      <div className="mb-6">
                        <Trophy className="h-20 w-20 text-yellow-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Simulation Completed!</h2>
                        <p className="text-muted-foreground mb-6">
                          You've successfully completed the transaction simulation.
                        </p>
                        
                        <Button 
                          onClick={() => setActiveTab('completed')}
                          className="w-full mt-4"
                        >
                          View Results
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="completed">
                  <div className="flex flex-col items-center text-center p-6">
                    <div className="mb-6">
                      <Trophy className="h-20 w-20 text-yellow-500 mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Quest Completed!</h2>
                      <p className="text-muted-foreground mb-6">
                        Congratulations on completing the Blockchain Transaction Simulation. 
                        You've gained practical experience with blockchain transactions in a safe environment.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        {(isCompleted && !isRewarded) && (
                          <Button 
                            className="w-full gap-2 bg-yellow-500 hover:bg-yellow-600" 
                            onClick={handleClaimReward}
                          >
                            <Trophy className="h-4 w-4" />
                            Claim {currentQuest.rewards.tokens} HERO Tokens
                          </Button>
                        )}
                        
                        {isRewarded && (
                          <Button 
                            className="w-full" 
                            variant="outline"
                            disabled
                          >
                            Reward Claimed
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate('/quests')}
                        >
                          Explore More Quests
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TransactionSimulationPage; 