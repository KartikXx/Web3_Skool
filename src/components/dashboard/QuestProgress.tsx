import React, { useEffect, useState } from 'react';
import { useQuests } from '@/contexts/QuestContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Trophy, CheckCircle, Timer, ExternalLink, RefreshCw, Loader2, Coins, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirebase } from '@/contexts/FirebaseContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export const QuestProgress = () => {
  const navigate = useNavigate();
  const { 
    activeQuests, 
    availableQuests, 
    completedQuests, 
    claimReward, 
    isLoading,
    fetchUserQuests
  } = useQuests();
  
  const { refreshUserProfile } = useFirebase();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isClaiming, setIsClaiming] = useState<string | null>(null);
  
  const inProgressQuests = activeQuests.filter(q => q.userStatus === 'in_progress');
  const completedAwaitingRewardQuests = activeQuests.filter(q => q.userStatus === 'completed');
  const rewardedQuests = activeQuests.filter(q => q.userStatus === 'rewarded');
  
  // Refresh immediately on component mount
  useEffect(() => {
    refreshData(true);
  }, []);
  
  // Set up periodic refresh
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData(false); // silent refresh
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);
  
  const refreshData = async (showToast = true) => {
    try {
      setIsRefreshing(true);
      
      if (showToast) {
        toast.loading('Refreshing quest data...');
      }
      
      // Refresh both user profile and quests concurrently
      await Promise.all([
        fetchUserQuests(),
        refreshUserProfile(true)
      ]);
      
      if (showToast) {
        toast.success('Quest data refreshed successfully');
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
      if (showToast) {
        toast.error('Failed to refresh quest data');
      }
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleClaimReward = async (questId: string) => {
    try {
      setIsClaiming(questId);
      toast.loading('Claiming your reward...');
      
      // First claim the reward
      await claimReward(questId);
      
      // Then immediately refresh both user profile and quests to show updated state
      await fetchUserQuests();
      await refreshUserProfile(true);
      
      toast.success('🎉 Reward claimed successfully!');
    } catch (error) {
      console.error('Failed to claim reward:', error);
      toast.error(`Failed to claim reward: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsClaiming(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Your Quest Progress</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refreshData()}
            disabled={isRefreshing || isLoading}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        <CardDescription>Track your adventure progress and claim rewards</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && !isRefreshing ? (
          <div className="py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading your quest data...</p>
          </div>
        ) : (
          <Tabs defaultValue="in-progress" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="in-progress" className="flex-1">
                In Progress <Badge variant="outline" className="ml-2">{inProgressQuests.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">
                Completed <Badge variant="outline" className="ml-2">{completedAwaitingRewardQuests.length + rewardedQuests.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex-1">
                Rewards to Claim <Badge variant="secondary" className="ml-2">{completedAwaitingRewardQuests.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="in-progress" className="space-y-4 mt-4">
              {inProgressQuests.length > 0 ? (
                inProgressQuests.map((quest) => (
                  <div key={quest.id} className="border rounded-lg p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{quest.title}</h3>
                        <p className="text-sm text-muted-foreground">{quest.description}</p>
                      </div>
                      <Badge variant="outline">{quest.level}</Badge>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-2">
                      <Button onClick={() => navigate(`/quests/${quest.id}`)}>
                        Continue Quest
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p>No quests in progress.</p>
                  <Button onClick={() => navigate('/quests')} className="mt-2">
                    Start a New Quest
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-4">
              {[...completedAwaitingRewardQuests, ...rewardedQuests].length > 0 ? (
                [...completedAwaitingRewardQuests, ...rewardedQuests].map((quest) => (
                  <div key={quest.id} className="border rounded-lg p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{quest.title}</h3>
                        <p className="text-sm text-muted-foreground">{quest.description}</p>
                      </div>
                      <Badge variant={quest.userStatus === 'rewarded' ? 'secondary' : 'outline'}>
                        {quest.userStatus === 'rewarded' ? 'Rewarded' : 'Completed'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Coins className="w-4 h-4" />
                          <span>+{quest.reward?.tokens || 0} HERO Tokens</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Award className="w-4 h-4" />
                          <span>+{quest.reward?.xp || 0} XP</span>
                        </div>
                      </div>
                      
                      {quest.userStatus === 'completed' ? (
                        <Button 
                          onClick={() => handleClaimReward(quest.id)}
                          disabled={isClaiming === quest.id}
                        >
                          {isClaiming === quest.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Claiming...
                            </>
                          ) : (
                            'Claim Reward'
                          )}
                        </Button>
                      ) : (
                        <Button variant="outline" disabled>
                          Rewarded
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p>No completed quests.</p>
                  <Button onClick={() => navigate('/quests')} className="mt-2">
                    Explore Quests
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rewards" className="space-y-4 mt-4">
              {completedAwaitingRewardQuests.length > 0 ? (
                completedAwaitingRewardQuests.map((quest) => (
                  <div key={quest.id} className="border rounded-lg p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{quest.title}</h3>
                        <p className="text-sm text-muted-foreground">{quest.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Coins className="w-4 h-4" />
                          <span>+{quest.reward?.tokens || 0} HERO Tokens</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Award className="w-4 h-4" />
                          <span>+{quest.reward?.xp || 0} XP</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleClaimReward(quest.id)}
                        disabled={isClaiming === quest.id}
                      >
                        {isClaiming === quest.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Claiming...
                          </>
                        ) : (
                          'Claim Reward'
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p>No rewards to claim.</p>
                  <Button onClick={() => navigate('/quests')} className="mt-2">
                    Complete More Quests
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}; 