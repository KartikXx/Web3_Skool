import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BookOpen, Award, Loader2, Sparkles, Trophy, CheckCircle } from 'lucide-react';
import { useQuests } from '@/contexts/QuestContext';
import { InteractiveLearningQuest } from '@/components/quests/InteractiveLearningQuest';
import { blockchainBasicsModules } from '@/data/learning-modules';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { AnimatedGradientBackground } from '@/components/AnimatedGradientBackground';
import { GamifiedProgressBar } from '@/components/GamifiedProgressBar';
import { Badge } from '@/components/ui/badge';
// @ts-ignore
import confetti from 'canvas-confetti';

export const BlockchainInteractivePage: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const { activeQuests, isLoading, error, startQuest, claimReward } = useQuests();
  const [currentQuest, setCurrentQuest] = useState<any | null>(null);
  const [localLoading, setLocalLoading] = useState(true);
  
  // Default to the blockchain-interactive quest if no questId provided
  const targetQuestId = questId || 'blockchain-interactive';
  
  useEffect(() => {
    console.log('BlockchainInteractivePage - Loading state:', isLoading);
    console.log('BlockchainInteractivePage - Target Quest ID:', targetQuestId);
    console.log('BlockchainInteractivePage - Active Quests Count:', activeQuests?.length || 0);
    
    if (!isLoading) {
      setLocalLoading(true);
      try {
        // Find the quest in active quests - check for both possible IDs
        let foundQuest = activeQuests.find(q => q.id === targetQuestId);
        
        // If the quest isn't found and the ID is blockchain-101, try finding blockchain-interactive instead
        if (!foundQuest && targetQuestId === 'blockchain-101') {
          foundQuest = activeQuests.find(q => q.id === 'blockchain-interactive');
          console.log('Looking for blockchain-interactive instead of blockchain-101');
        }
        
        // If the quest isn't found and the ID is blockchain-interactive, try finding blockchain-101 instead
        if (!foundQuest && targetQuestId === 'blockchain-interactive') {
          foundQuest = activeQuests.find(q => q.id === 'blockchain-101');
          console.log('Looking for blockchain-101 instead of blockchain-interactive');
        }
        
        // If we still don't have a quest, create a fallback one for development
        if (!foundQuest) {
          // This fallback is for development purposes when Firebase permissions are an issue
          console.log('Creating fallback quest object');
          foundQuest = {
            id: targetQuestId,
            title: 'Understanding Blockchain: Interactive',
            description: 'Learn about blockchain with interactive lessons and quizzes',
            longDescription: 'This interactive quest will guide you through key blockchain concepts with bite-sized learning modules and interactive quizzes.',
            difficulty: 'beginner',
            category: 'basics',
            rewards: {
              xp: 100,
              tokens: 15
            },
            estimatedTime: '30 min',
            steps: [
              {
                id: 'step-1',
                title: 'What is Blockchain?',
                description: 'Learn the fundamental concepts of blockchain technology.'
              },
              {
                id: 'step-2',
                title: 'Key Features of Blockchain',
                description: 'Understand what makes blockchain unique and powerful.'
              },
              {
                id: 'step-3',
                title: 'Blockchain Use Cases',
                description: 'Explore real-world applications of blockchain technology.'
              },
              {
                id: 'step-4',
                title: 'Knowledge Assessment',
                description: 'Test your understanding with interactive quizzes.'
              }
            ],
            resources: [
              {
                title: 'Blockchain Explained',
                url: 'https://www.investopedia.com/terms/b/blockchain.asp',
                type: 'article'
              },
              {
                title: 'How Blockchain Works',
                url: 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
                type: 'video'
              }
            ],
            userStatus: 'in_progress',
            userProgress: 0
          };
        }
        
        console.log('BlockchainInteractivePage - Found Quest:', foundQuest);
        setCurrentQuest(foundQuest);
      } catch (err) {
        console.error('Error finding quest:', err);
      } finally {
        setLocalLoading(false);
      }
    }
  }, [targetQuestId, activeQuests, isLoading]);
  
  const handleStartQuest = async () => {
    try {
      console.log('Starting quest:', targetQuestId);
      await startQuest(targetQuestId);
      setActiveTab('simulation');
      toast.success('Quest started!');
    } catch (error) {
      console.error('Failed to start quest:', error);
      toast.error('Failed to start quest. Please try again.');
    }
  };
  
  const handleCompleteSimulation = async () => {
    setActiveTab('results');
    toast.success('Congratulations on completing the quest!');
  };
  
  const handleClaimReward = async () => {
    try {
      await claimReward(targetQuestId);
      toast.success('Reward claimed!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to claim reward:', error);
      toast.error('Failed to claim reward. Please try again.');
    }
  };
  
  // Combined loading state (from context or local)
  if (isLoading || localLoading) {
    return (
      <Layout>
        <div className="container py-6">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blockchain-500 mb-4" />
            <p className="text-muted-foreground">Loading quest content...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="container py-6">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => navigate('/quests')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quests
          </Button>
        </div>
      </Layout>
    );
  }
  
  if (!currentQuest) {
    return (
      <Layout>
        <div className="container py-6">
          <Alert>
            <AlertTitle>Quest not found</AlertTitle>
            <AlertDescription>The blockchain interactive quest could not be loaded.</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => navigate('/quests')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quests
          </Button>
        </div>
      </Layout>
    );
  }
  
  const isQuestStarted = currentQuest.userStatus === 'in_progress';
  const isQuestCompleted = currentQuest.userStatus === 'completed';
  const isQuestRewarded = currentQuest.userStatus === 'rewarded';
  const canClaimReward = isQuestCompleted && !isQuestRewarded;
  
  return (
    <Layout>
      <AnimatedGradientBackground colorTheme="blockchain" intensity="subtle">
        <div className="container py-6">
          <div className="flex flex-col gap-2 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button 
                variant="ghost" 
                className="w-fit" 
                onClick={() => navigate('/quests')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Quests
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                {currentQuest.title}
                <Sparkles className="h-6 w-6 text-blockchain-500" />
              </h1>
              <p className="text-muted-foreground">{currentQuest.description}</p>
            </motion.div>
          </div>
          
          {/* Progress Bar - Only show outside the card for in-progress quests */}
          {isQuestStarted && !isQuestCompleted && !isQuestRewarded && (
            <div className="mb-6">
              <GamifiedProgressBar 
                progress={currentQuest.userProgress || 0}
                xp={100}
                totalXp={300}
                quests={{ 
                  total: currentQuest.steps?.length || 4, 
                  completed: Math.ceil((currentQuest.userProgress || 0) / 25) 
                }}
                variant="compact"
                showLevel={false}
              />
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="border-2 shadow-lg overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 p-1 bg-muted/70">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="simulation"
                    disabled={!isQuestStarted && !isQuestCompleted && !isQuestRewarded}
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
                  >
                    Learning
                  </TabsTrigger>
                  <TabsTrigger 
                    value="results"
                    disabled={!isQuestCompleted && !isQuestRewarded}
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
                  >
                    Results
                  </TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview">
                  <CardHeader className="bg-gradient-to-br from-blockchain-50/50 to-purple-50/50 dark:from-blockchain-950/20 dark:to-purple-950/20 border-b">
                    <CardTitle className="flex items-center gap-2">
                      <span>Quest Details</span>
                      <Badge variant="outline" className="ml-2 bg-blockchain-100 text-blockchain-800 dark:bg-blockchain-900/30 dark:text-blockchain-200">
                        {currentQuest.difficulty}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Learn about blockchain with interactive content and quizzes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-lg">{currentQuest.longDescription}</p>
                      
                      <div className="grid md:grid-cols-2 gap-6 my-6">
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blockchain-500" />
                            What You'll Learn
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                              <span>The fundamental concepts of blockchain technology</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                              <span>Key features that make blockchain unique and powerful</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                              <span>Real-world applications and use cases of blockchain</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                              <span>How blockchain differs from traditional database systems</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            Your Rewards
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-muted/50">
                              <CardContent className="p-4 flex flex-col items-center text-center">
                                <Award className="h-8 w-8 text-blockchain-500 mb-2" />
                                <p className="text-2xl font-bold">{currentQuest.rewards.xp}</p>
                                <p className="text-sm text-muted-foreground">Experience Points</p>
                              </CardContent>
                            </Card>
                            <Card className="bg-muted/50">
                              <CardContent className="p-4 flex flex-col items-center text-center">
                                <Trophy className="h-8 w-8 text-amber-500 mb-2" />
                                <p className="text-2xl font-bold">{currentQuest.rewards.tokens}</p>
                                <p className="text-sm text-muted-foreground">HERO Tokens</p>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div className="pt-2">
                            <h4 className="font-medium mb-2">Estimated Time</h4>
                            <p className="flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="h-4 w-4" />
                              {currentQuest.estimatedTime}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold">Quest Steps</h3>
                      <ol className="space-y-2 pl-0 mt-4">
                        {currentQuest.steps.map((step, index) => (
                          <motion.li 
                            key={step.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className="flex items-start gap-3 bg-muted/40 p-3 rounded-md"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blockchain-100 text-blockchain-900 dark:bg-blockchain-900 dark:text-blockchain-100">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">{step.title}</h4>
                              <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                          </motion.li>
                        ))}
                      </ol>
                      
                      <h3 className="text-xl font-semibold mt-6">Helpful Resources</h3>
                      <div className="grid sm:grid-cols-2 gap-4 mt-4">
                        {currentQuest.resources?.map((resource, index) => (
                          <motion.a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {resource.type === 'article' ? (
                              <BookOpen className="h-5 w-5 text-blue-500" />
                            ) : resource.type === 'video' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-red-500">
                                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                              </svg>
                            ) : (
                              <BookOpen className="h-5 w-5 text-green-500" />
                            )}
                            <span>{resource.title}</span>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                    
                    {!isQuestStarted ? (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="pt-4"
                      >
                        <Button 
                          onClick={handleStartQuest} 
                          className="w-full bg-blockchain-600 hover:bg-blockchain-700 text-white"
                          size="lg"
                        >
                          Start Your Blockchain Journey
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="pt-4"
                      >
                        <Button 
                          onClick={() => setActiveTab('simulation')} 
                          className="w-full"
                          variant="outline"
                          size="lg"
                        >
                          Continue Learning
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </TabsContent>
                
                {/* Learning Tab */}
                <TabsContent value="simulation">
                  <div className="p-4">
                    {isQuestStarted && (
                      <InteractiveLearningQuest 
                        questId={currentQuest.id} 
                        modules={blockchainBasicsModules}
                        onComplete={handleCompleteSimulation}
                      />
                    )}
                  </div>
                </TabsContent>
                
                {/* Results Tab */}
                <TabsContent value="results">
                  <div className="flex flex-col items-center text-center p-8">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        duration: 0.6 
                      }}
                      className="mb-6"
                      onAnimationComplete={() => {
                        // Trigger confetti when animation completes
                        if (!canClaimReward) return; // Only show for first time viewing
                        
                        confetti({
                          particleCount: 100,
                          spread: 70,
                          origin: { y: 0.6 }
                        });
                      }}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full blur-md bg-yellow-400/30 animate-pulse"></div>
                        <div className="relative z-10">
                          <Trophy className="h-24 w-24 text-yellow-500" />
                        </div>
                      </div>
                      <h2 className="text-3xl font-bold mt-4 mb-2">Quest Completed!</h2>
                      <p className="text-muted-foreground max-w-md mb-8">
                        Congratulations on completing the Blockchain 101 Quest! You've gained valuable 
                        knowledge about blockchain technology fundamentals.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-6 mb-8 max-w-md">
                        <div className="flex flex-col items-center">
                          <div className="text-3xl font-bold text-blockchain-500 flex items-center gap-1">
                            {currentQuest.rewards.xp} <Award className="h-5 w-5" />
                          </div>
                          <div className="text-sm text-muted-foreground">XP Earned</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-3xl font-bold text-amber-500 flex items-center gap-1">
                            {currentQuest.rewards.tokens} <Trophy className="h-5 w-5" />
                          </div>
                          <div className="text-sm text-muted-foreground">HERO Tokens</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        {canClaimReward && (
                          <motion.div whileHover={{ scale: 1.05 }} className="w-full">
                            <Button 
                              className="w-full gap-2 bg-yellow-500 hover:bg-yellow-600" 
                              onClick={handleClaimReward}
                              size="lg"
                            >
                              <Trophy className="h-4 w-4" />
                              Claim Your Rewards
                            </Button>
                          </motion.div>
                        )}
                        
                        {isQuestRewarded && (
                          <Badge variant="outline" className="w-full py-2 text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Rewards Claimed
                          </Badge>
                        )}
                        
                        <motion.div whileHover={{ scale: 1.05 }} className="w-full">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => navigate('/quests')}
                            size="lg"
                          >
                            Explore More Quests
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </AnimatedGradientBackground>
    </Layout>
  );
};

export default BlockchainInteractivePage; 