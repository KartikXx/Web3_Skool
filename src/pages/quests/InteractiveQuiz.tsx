import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { InteractiveQuiz } from '@/components/quests/InteractiveQuiz';
import { useQuests } from '@/contexts/QuestContext';
import { Loader2, ArrowLeft, BookOpen, Trophy, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const InteractiveQuizPage: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  const { activeQuests, isLoading, error, startQuest, claimReward } = useQuests();
  const navigate = useNavigate();
  const [currentQuest, setCurrentQuest] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('quiz');

  // Find the quest with ID 'interactive-blockchain-quiz'
  useEffect(() => {
    if (!isLoading) {
      // If questId is provided, use that specific quest
      if (questId) {
        const quest = activeQuests.find(q => q.id === questId);
        if (quest) {
          setCurrentQuest(quest);
          return;
        }
      }
      
      // Otherwise, look for the interactive quiz quest
      const quiz = activeQuests.find(q => q.id === 'interactive-blockchain-quiz');
      if (quiz) {
        setCurrentQuest(quiz);
      } else {
        // If quest not found, redirect to quests page
        navigate('/quests');
      }
    }
  }, [questId, activeQuests, isLoading, navigate]);

  const handleStartQuest = async () => {
    if (currentQuest) {
      await startQuest(currentQuest.id);
      setActiveTab('quiz');
    }
  };

  const handleCompleteQuiz = () => {
    setActiveTab('completed');
  };

  const handleClaimReward = async () => {
    if (currentQuest) {
      await claimReward(currentQuest.id);
      navigate('/dashboard');
    }
  };

  // Determine quest status
  const canStart = currentQuest?.userStatus === 'not_started';
  const isInProgress = currentQuest?.userStatus === 'in_progress';
  const isCompleted = currentQuest?.userStatus === 'completed';
  const isRewarded = currentQuest?.userStatus === 'rewarded';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blockchain-500 mb-4" />
            <p className="text-muted-foreground">Loading quiz...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Error loading quiz</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : !currentQuest ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Quiz not found</h3>
            <p className="text-muted-foreground">The quiz you're looking for doesn't exist or has been removed.</p>
          </div>
        ) : (
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
                    <CardTitle>Interactive Blockchain Quiz</CardTitle>
                    <CardDescription>
                      Test your knowledge with this multiple-choice quiz
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span>{currentQuest.rewards.tokens} HERO Tokens</span>
                    <Award className="h-5 w-5 text-purple-500 ml-2" />
                    <span>{currentQuest.rewards.xp} XP</span>
                  </div>
                </div>
              </CardHeader>
              
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                <div className="px-6">
                  <TabsList className="w-full">
                    <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                    <TabsTrigger 
                      value="quiz" 
                      className="flex-1"
                      disabled={canStart}
                    >
                      Quiz
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
                          Start Quiz
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="quiz">
                    {isInProgress && (
                      <InteractiveQuiz 
                        questId={currentQuest.id} 
                        onComplete={handleCompleteQuiz}
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="completed">
                    <div className="flex flex-col items-center text-center p-6">
                      <div className="mb-6">
                        <Trophy className="h-20 w-20 text-yellow-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
                        <p className="text-muted-foreground mb-6">
                          Congratulations on completing the Blockchain Interactive Quiz. 
                          You've demonstrated your knowledge of blockchain fundamentals and Web3 concepts.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                          {(isCompleted && !isRewarded) && (
                            <Button 
                              className="w-full gap-2 bg-yellow-500 hover:bg-yellow-600" 
                              onClick={handleClaimReward}
                            >
                              <Award className="h-4 w-4" />
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
        )}
      </div>
    </Layout>
  );
};

export default InteractiveQuizPage; 