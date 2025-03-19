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
import { collection, query, orderBy, limit as fbLimit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface LeaderboardEntry {
  id: string;
  displayName: string;
  walletAddress?: string;
  tokens: number;
  questsCompleted: number;
  avatarUrl?: string;
}

const Leaderboard: React.FC = () => {
  const { user, wallet } = useAuthentication();
  const [sortBy, setSortBy] = useState<'tokens' | 'quests'>('tokens');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Set up real-time listener for leaderboard data
  useEffect(() => {
    const fieldToSort = sortBy === 'tokens' ? 'tokens' : 'questsCompleted';
    
    const q = query(
      collection(db, 'users'),
      orderBy(fieldToSort, 'desc'),
      fbLimit(20)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: LeaderboardEntry[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        data.push({
          id: doc.id,
          displayName: userData.displayName || 'Anonymous Hero',
          walletAddress: userData.walletAddress,
          tokens: userData.tokens || 0,
          questsCompleted: userData.questsCompleted || 0,
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

  // Find the current user in the leaderboard
  const currentUserRank = user 
    ? leaderboardData.findIndex(entry => 
        (wallet && entry.walletAddress === wallet.address) || 
        (user.id === entry.id)) + 1
    : 0;

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
          
          {currentUserRank > 0 && (
            <Card className="mb-6 p-4 bg-blockchain-50 dark:bg-blockchain-950 border-blockchain-200">
              <div className="flex items-center">
                <div className="mr-4 text-xl font-bold text-blockchain-600 w-10">
                  #{currentUserRank}
                </div>
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={user?.avatar || `https://api.dicebear.com/6.x/avataaars/svg?seed=${user?.name}`} />
                  <AvatarFallback>{user?.name?.substring(0, 2) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-medium">{user?.name || 'You'} <span className="text-xs bg-blockchain-200 text-blockchain-700 px-2 py-0.5 rounded-full ml-2">YOU</span></p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {wallet ? `Wallet: ${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}` : 'No wallet connected'}
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="font-bold">{sortBy === 'tokens' ? leaderboardData.find(entry => 
                    (wallet && entry.walletAddress === wallet.address) || 
                    (user && user.id === entry.id))?.tokens || 0 : 
                    leaderboardData.find(entry => 
                    (wallet && entry.walletAddress === wallet.address) || 
                    (user && user.id === entry.id))?.questsCompleted || 0}</p>
                  <p className="text-xs text-muted-foreground">{sortBy === 'tokens' ? 'TOKENS' : 'QUESTS'}</p>
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
              <div className="flex justify-center items-center p-8">
                <Loader className="animate-spin h-8 w-8 text-blockchain-500" />
                <span className="ml-2">Loading leaderboard data...</span>
              </div>
            ) : (
              <div className="divide-y">
                {leaderboardData.slice(0, 10).map((entry, index) => (
                  <div 
                    key={entry.id} 
                    className={`flex items-center py-4 px-4 ${index < 3 ? 'bg-blockchain-50/50 dark:bg-blockchain-950/50' : ''}`}
                  >
                    <div className="w-10 flex items-center">
                      {index === 0 ? (
                        <Trophy size={20} className="text-yellow-500" />
                      ) : index === 1 ? (
                        <Medal size={20} className="text-gray-400" />
                      ) : index === 2 ? (
                        <Medal size={20} className="text-amber-600" />
                      ) : (
                        <span className="text-muted-foreground font-medium">{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={entry.avatarUrl} />
                        <AvatarFallback>{entry.displayName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{entry.displayName}</p>
                        {entry.walletAddress && (
                          <p className="text-xs text-muted-foreground">
                            {`${entry.walletAddress.substring(0, 6)}...${entry.walletAddress.substring(entry.walletAddress.length - 4)}`}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-24 text-right font-semibold">
                      <div className="flex items-center justify-end gap-1">
                        {sortBy === 'tokens' ? (
                          <>
                            {entry.tokens}
                            <span className="text-xs text-blockchain-500">HERO</span>
                          </>
                        ) : (
                          <>
                            {entry.questsCompleted}
                            <span className="text-xs text-blockchain-500">QUESTS</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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