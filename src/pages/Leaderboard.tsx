import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Award, Users, ChevronsUp, Flame, Loader } from 'lucide-react';
import { useAuthentication } from '@/hooks/use-authentication';
import { collection, query, orderBy, limit as fbLimit, onSnapshot, where, getDoc, getDocs, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  id: string;
  displayName: string;
  walletAddress?: string;
  tokens: number;
  questsCompleted: number;
  xp: number;
  level: number;
  avatarUrl?: string;
}

const Leaderboard: React.FC = () => {
  const { user, wallet } = useAuthentication();
  const [sortBy, setSortBy] = useState<'tokens' | 'quests'>('tokens');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [previousData, setPreviousData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentRewards, setRecentRewards] = useState<{questId: string, tokens: number, timeEarned: Date}[]>([]);
  
  // Set up real-time listener for leaderboard data
  useEffect(() => {
    const fieldToSort = sortBy === 'tokens' ? 'tokens' : 'questsCompleted';
    
    const q = query(
      collection(db, 'users'),
      orderBy(fieldToSort, 'desc'),
      fbLimit(20)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // Save previous data for animations
      setPreviousData(leaderboardData);
      
      const data: LeaderboardEntry[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        data.push({
          id: doc.id,
          displayName: userData.displayName || 'Anonymous Hero',
          walletAddress: userData.walletAddress,
          tokens: userData.tokens || 0,
          questsCompleted: userData.questsCompleted || 0,
          xp: userData.xp || 0,
          level: userData.level || 1,
          avatarUrl: userData.avatarUrl || `https://api.dicebear.com/6.x/avataaars/svg?seed=${userData.displayName || doc.id}`
        });
      });
      
      setLeaderboardData(data);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching leaderboard data:', error);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [sortBy]);
  
  // Fetch recent rewards for current user
  useEffect(() => {
    if (!user) return;
    
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    
    const q = query(
      collection(db, 'userQuests'),
      where('userId', '==', user.id),
      where('status', '==', 'rewarded'),
      where('rewardedAt', '>=', last24Hours),
      orderBy('rewardedAt', 'desc'),
      fbLimit(5)
    );
    
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const rewardsData: any[] = [];
      
      for (const doc of querySnapshot.docs) {
        const questData = doc.data();
        
        try {
          // Get quest details to get token amount
          const questRef = doc(db, 'quests', questData.questId);
          const questDoc = await getDoc(questRef);
          const questInfo = questDoc.exists() ? questDoc.data() : null;
          
          rewardsData.push({
            questId: questData.questId,
            tokens: questInfo?.reward?.tokens || 0,
            timeEarned: questData.rewardedAt.toDate()
          });
        } catch (error) {
          console.error('Error fetching quest details:', error);
          rewardsData.push({
            questId: questData.questId,
            tokens: 0,
            timeEarned: questData.rewardedAt.toDate()
          });
        }
      }
      
      setRecentRewards(rewardsData);
    });
    
    return () => unsubscribe();
  }, [user]);

  // Find the current user in the leaderboard
  const currentUserRank = user 
    ? leaderboardData.findIndex(entry => 
        (wallet && entry.walletAddress === wallet.address) || 
        (user.id === entry.id)) + 1
    : 0;
    
  // Get current user data
  const currentUserData = currentUserRank > 0 
    ? leaderboardData[currentUserRank - 1] 
    : null;
    
  // Calculate rank changes
  const getRankChange = (id: string, index: number): number => {
    if (previousData.length === 0) return 0;
    
    const prevIndex = previousData.findIndex(entry => entry.id === id);
    if (prevIndex === -1) return 0; // New entry
    
    return prevIndex - index; // Positive is moving up, negative is moving down
  };

  // Format time ago
  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <AnimatedTransition className="flex-1 pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <Trophy className="mr-2 text-yellow-500" size={30} />
                  Leaderboard
                </h1>
                <p className="text-muted-foreground">
                  See how you rank against other blockchain heroes
                </p>
              </div>
              
              <div className="hidden md:flex space-x-2">
                <Button 
                  variant={sortBy === 'tokens' ? 'default' : 'outline'} 
                  onClick={() => setSortBy('tokens')}
                  className="gap-2"
                >
                  <Flame size={16} />
                  Token Leaders
                </Button>
                <Button 
                  variant={sortBy === 'quests' ? 'default' : 'outline'} 
                  onClick={() => setSortBy('quests')}
                  className="gap-2"
                >
                  <Award size={16} />
                  Quest Champions
                </Button>
              </div>
            </div>
          </header>
          
          <div className="md:hidden mb-6">
            <Tabs defaultValue="tokens" className="w-full" onValueChange={(value) => setSortBy(value as 'tokens' | 'quests')}>
              <TabsList className="w-full">
                <TabsTrigger value="tokens" className="flex-1">Token Leaders</TabsTrigger>
                <TabsTrigger value="quests" className="flex-1">Quest Champions</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Recent rewards banner */}
          {recentRewards.length > 0 && (
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
              <div className="flex items-center">
                <Award className="text-yellow-500 mr-2" />
                <h3 className="font-medium">Recent Rewards</h3>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {recentRewards.map((reward, index) => (
                  <div key={index} className="text-sm bg-yellow-100 dark:bg-yellow-900/30 rounded-full px-3 py-1 flex items-center">
                    <Trophy className="w-3 h-3 mr-1 text-yellow-600" />
                    <span>+{reward.tokens} tokens</span>
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({formatTimeAgo(reward.timeEarned)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {currentUserRank > 0 && (
            <Card className="mb-6 p-4 bg-blockchain-50 dark:bg-blockchain-950 border-blockchain-200">
              <div className="flex items-center">
                <div className="mr-4 text-xl font-bold text-blockchain-600 w-10">
                  #{currentUserRank}
                </div>
                
                <div className="flex-shrink-0 mr-4">
                  <Avatar className="h-12 w-12 border-2 border-blockchain-200">
                    <AvatarImage src={currentUserData?.avatarUrl} alt={currentUserData?.displayName} />
                    <AvatarFallback>{currentUserData?.displayName?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center">
                    <span className="font-semibold">
                      {currentUserData?.displayName}
                    </span>
                    <span className="ml-2 text-xs py-0.5 px-2 rounded-full bg-blockchain-100 dark:bg-blockchain-900 text-blockchain-800 dark:text-blockchain-200">
                      Level {currentUserData?.level || 1}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Your current ranking on the leaderboard
                  </div>
                </div>
                
                <div className="ml-auto text-right">
                  <div className="font-bold">
                    {sortBy === 'tokens' ? (
                      <span>{currentUserData?.tokens || 0} tokens</span>
                    ) : (
                      <span>{currentUserData?.questsCompleted || 0} quests</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {sortBy === 'tokens' ? `${currentUserData?.questsCompleted || 0} quests completed` : `${currentUserData?.tokens || 0} tokens earned`}
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          <Card className="overflow-hidden">
            <div className="bg-blockchain-100 dark:bg-blockchain-900 py-3 px-4 border-b flex items-center text-sm font-medium">
              <div className="w-10">#</div>
              <div className="flex-1">User</div>
              <div className="w-24 text-right">{sortBy === 'tokens' ? 'Tokens' : 'Quests'}</div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader className="w-8 h-8 animate-spin text-blockchain-500" />
                <span className="ml-2">Loading leaderboard data...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboardData.slice(0, 10).map((entry, index) => {
                  const rankChange = getRankChange(entry.id, index);
                  const isCurrentUser = (wallet && entry.walletAddress === wallet.address) || 
                    (user && user.id === entry.id);

                  return (
                    <motion.div 
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`flex items-center p-4 rounded-lg border ${
                        isCurrentUser 
                          ? 'bg-blockchain-50 border-blockchain-200 dark:bg-blockchain-900/20 dark:border-blockchain-700' 
                          : 'bg-card border-border hover:bg-muted/50 transition-colors'
                      }`}
                    >
                      {/* Rank position */}
                      <div className="text-xl font-bold w-10 flex items-center">
                        {index < 3 ? (
                          <div className="flex items-center justify-center w-8 h-8 rounded-full">
                            {index === 0 && <Trophy className="w-6 h-6 text-yellow-500" />}
                            {index === 1 && <Medal className="w-6 h-6 text-zinc-400" />}
                            {index === 2 && <Award className="w-6 h-6 text-amber-700" />}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">#{index + 1}</span>
                        )}
                      </div>
                      
                      {/* Rank change indicator */}
                      {rankChange !== 0 && (
                        <div className="mr-2">
                          {rankChange > 0 ? (
                            <motion.div 
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              className="flex items-center text-green-500"
                            >
                              <ChevronsUp className="w-4 h-4" />
                              <span className="text-xs">{rankChange}</span>
                            </motion.div>
                          ) : (
                            <motion.div 
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              className="flex items-center text-red-500"
                            >
                              <ChevronsUp className="w-4 h-4 rotate-180" />
                              <span className="text-xs">{Math.abs(rankChange)}</span>
                            </motion.div>
                          )}
                        </div>
                      )}
                      
                      {/* Avatar */}
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={entry.avatarUrl} />
                        <AvatarFallback>{entry.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      
                      {/* User details */}
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium">{entry.displayName}</span>
                          
                          {isCurrentUser && (
                            <span className="text-xs bg-blockchain-100 text-blockchain-800 dark:bg-blockchain-800 dark:text-blockchain-100 px-2 py-0.5 rounded-full ml-2">
                              YOU
                            </span>
                          )}
                          
                          <span className="ml-2 text-xs py-0.5 px-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                            Lvl {entry.level || 1}
                          </span>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {entry.walletAddress ? (
                            <span>
                              Wallet: {entry.walletAddress.substring(0, 6)}...
                              {entry.walletAddress.substring(entry.walletAddress.length - 4)}
                            </span>
                          ) : (
                            <span>Verified Member</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Stats based on sort type */}
                      <div className="text-right">
                        <div className="font-semibold">
                          {sortBy === 'tokens' ? (
                            <div className="flex items-center justify-end">
                              <span>{entry.tokens}</span>
                              <Flame className="w-4 h-4 ml-1 text-orange-500" />
                            </div>
                          ) : (
                            <div className="flex items-center justify-end">
                              <span>{entry.questsCompleted}</span>
                              <Trophy className="w-4 h-4 ml-1 text-blockchain-500" />
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {sortBy === 'tokens' ? `${entry.questsCompleted} quests` : `${entry.tokens} tokens`}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>
          
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center mr-2">
                  <Trophy size={14} className="text-white" />
                </div>
                <span className="text-sm">1st Place</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center mr-2">
                  <Medal size={14} className="text-white" />
                </div>
                <span className="text-sm">2nd Place</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center mr-2">
                  <Medal size={14} className="text-white" />
                </div>
                <span className="text-sm">3rd Place</span>
              </div>
            </div>
            
            <div>
              <Button variant="ghost" size="sm" className="gap-2">
                <Users size={16} />
                View All Heroes
              </Button>
            </div>
          </div>
        </div>
      </AnimatedTransition>
      
      <Footer />
    </div>
  );
};

export default Leaderboard; 