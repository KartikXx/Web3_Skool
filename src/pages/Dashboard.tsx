import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestIcon, TokenIcon, AchievementIcon, WalletIcon, CopyIcon } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import QuestCard, { QuestProps } from '@/components/QuestCard';
import { useWeb3 } from '@/contexts/Web3Context';
import { useAuthentication } from '@/hooks/use-authentication';
import { toast } from 'sonner';
import WalletConnect from '@/components/WalletConnect';
import ShareAchievement from '@/components/ShareAchievement';
import { Share } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { QuestProgress } from '@/components/dashboard/QuestProgress';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuests } from '@/contexts/QuestContext';
import { useFirebase } from '@/contexts/FirebaseContext';
import { initializeDefaultUserProfile } from '@/lib/firebase';

const Dashboard: React.FC = () => {
  const { wallet, connect } = useWeb3();
  const { isAuthenticated, authMethod, hasCredentials, connectWallet } = useAuthentication();
  const { user } = useAuth();
  const { activeQuests, completedQuests, userQuests, isLoading, fetchUserQuests } = useQuests();
  const { userProfile, currentUser, isLoadingProfile, refreshUserProfile } = useFirebase();
  const [statsLoaded, setStatsLoaded] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Force a refresh of user data when dashboard loads
  useEffect(() => {
    const forceRefreshUserData = async () => {
      console.log("Dashboard: Attempting to refresh user data");
      
      if (currentUser && !isLoadingProfile) {
        console.log("Dashboard: User authenticated, refreshing profile data", { userId: currentUser.uid });
        
        try {
          // Force update default profile data
          const result = await initializeDefaultUserProfile(currentUser.uid);
          console.log("Dashboard: Profile initialization result:", result);
          
          // Refresh user quests data
          await fetchUserQuests();
          
          // Mark stats as loaded
          setStatsLoaded(true);
          console.log("Dashboard: User data refreshed successfully");
        } catch (error) {
          console.error("Dashboard: Error refreshing user data:", error);
          toast.error("Failed to load your profile data. Please try refreshing the page.");
        }
      }
    };

    forceRefreshUserData();
  }, [currentUser, isLoadingProfile, fetchUserQuests]);

  // Add a periodic refresh for real-time updates
  useEffect(() => {
    if (!currentUser || isLoadingProfile) return;
    
    console.log("Dashboard: Setting up periodic refresh");
    
    // Create an interval to refresh data every 15 seconds
    const refreshInterval = setInterval(() => {
      console.log("Dashboard: Running periodic refresh");
      refreshUserProfile()
        .then(() => fetchUserQuests())
        .then(() => console.log("Dashboard: Periodic refresh complete"))
        .catch(err => console.error("Dashboard: Error in periodic refresh:", err));
    }, 15000);
    
    // Clear interval on component unmount
    return () => {
      console.log("Dashboard: Clearing periodic refresh interval");
      clearInterval(refreshInterval);
    };
  }, [currentUser, isLoadingProfile, refreshUserProfile, fetchUserQuests]);

  // Debugging logs for profile data
  useEffect(() => {
    console.log("Dashboard: Current user profile data:", userProfile);
  }, [userProfile]);

  // Calculate stats from real data
  const inProgressQuestsData = activeQuests.filter(quest => quest.userStatus === 'in_progress');
  const completedQuestsData = activeQuests.filter(quest => quest.userStatus === 'completed' || quest.userStatus === 'rewarded');
  const userXP = userProfile?.xp || 0;
  const userLevel = userProfile?.level || 1;
  const userTokens = userProfile?.tokens || 0;
  const questsCompleted = userProfile?.questsCompleted || 0;

  const handleConnectWallet = async () => {
    try {
      if (!hasCredentials) {
        toast.error('You must be signed in before connecting a wallet');
        return;
      }

      const success = await connectWallet();
      if (success) {
        toast.success('Wallet connected successfully');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      toast.success('Address copied to clipboard');
    }
  };

  // Achievement badges - could be dynamically generated based on user progress
  const achievements = [
    { 
      name: 'First Steps', 
      description: 'Complete your first quest', 
      acquired: completedQuestsData.length > 0,
      image: '/placeholder.svg',
    },
    { 
      name: 'Crypto Beginner', 
      description: 'Complete 5 beginner quests', 
      acquired: completedQuestsData.filter(q => q.difficulty === 'beginner').length >= 5,
      image: '/placeholder.svg',
    },
    { 
      name: 'Wallet Master', 
      description: 'Set up your first crypto wallet', 
      acquired: wallet !== null,
      image: '/placeholder.svg',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Welcome header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {userProfile?.displayName || user?.name || 'Hero'}
            </h1>
            <p className="text-muted-foreground">
              Track your progress, complete quests, and earn rewards
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Wallet Status */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Wallet className="mr-2 h-5 w-5 text-blockchain-500" />
                    Wallet Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {wallet ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Address</span>
                        <span className="font-mono text-sm truncate max-w-[180px]">
                          {formatAddress(wallet.address)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">Network</span>
                        <span className="text-sm">{wallet.network}</span>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">HERO Balance</span>
                          <span className="font-bold">{userTokens} HERO</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Complete quests to earn HERO tokens
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-muted-foreground mb-3">No wallet connected</p>
                      <Button 
                        className="w-full bg-blockchain-500 hover:bg-blockchain-600"
                        onClick={handleConnectWallet}
                      >
                        Connect Wallet
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* User Stats */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{questsCompleted}</div>
                    <div className="text-xs text-muted-foreground">Quests Completed</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{userXP}</div>
                    <div className="text-xs text-muted-foreground">Total XP</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{userTokens}</div>
                    <div className="text-xs text-muted-foreground">HERO Tokens</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{userLevel}</div>
                    <div className="text-xs text-muted-foreground">Current Level</div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick links */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/quests" className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors">
                    <span>Browse All Quests</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/leaderboard" className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors">
                    <span>View Leaderboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/wallet-debug" className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors">
                    <span>Wallet Debug</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </div>
            
            {/* Right column - Quest progress */}
            <div className="lg:col-span-2">
              <QuestProgress />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 flex items-center">
      <div className="w-8 h-8 rounded-md bg-blockchain-50 dark:bg-blockchain-900 flex items-center justify-center mr-3 text-blockchain-500 dark:text-blockchain-400">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
};

const RecommendationItem: React.FC<{
  title: string;
  description: string;
  actionText: string;
  href: string;
  onClick?: () => void;
}> = ({ title, description, actionText, href, onClick }) => {
  return (
    <Card className="p-5 flex flex-col hover:border-blockchain-200 dark:hover:border-blockchain-700 transition-colors">
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 flex-1">{description}</p>
      <div className="mt-auto">
        <Button 
          variant="link" 
          asChild 
          className="p-0 h-auto text-blockchain-600 hover:text-blockchain-500 dark:text-blockchain-400 dark:hover:text-blockchain-300" 
          onClick={onClick}
        >
          <Link to={href}>{actionText} →</Link>
        </Button>
      </div>
    </Card>
  );
};

export default Dashboard;

