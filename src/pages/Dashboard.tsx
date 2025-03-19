import React, { useEffect } from 'react';
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

const Dashboard: React.FC = () => {
  // Get wallet and authentication state
  const { wallet, connect } = useWeb3();
  const { isAuthenticated, authMethod } = useAuthentication();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleConnectWallet = async () => {
    try {
      const success = await connect();
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

  // Sample quests for the dashboard
  const inProgressQuests: QuestProps[] = [
    {
      id: 'blockchain-basics',
      title: 'Blockchain Basics',
      description: 'Learn the fundamentals of blockchain technology and how it works.',
      level: 'beginner',
      reward: 50,
      estimatedTime: '15 min',
    },
    {
      id: 'crypto-wallets',
      title: 'Create Your First Wallet',
      description: 'Set up a cryptocurrency wallet and learn about private keys and seed phrases.',
      level: 'beginner',
      reward: 75,
      estimatedTime: '20 min',
    },
  ];

  const completedQuests: QuestProps[] = [
    {
      id: 'what-is-web3',
      title: 'What is WEB3?',
      description: 'An introduction to Web3 and how it differs from previous versions of the web.',
      level: 'beginner',
      completed: true,
      reward: 25,
      estimatedTime: '10 min',
    },
  ];

  // Achievement badges
  const achievements = [
    { 
      name: 'First Steps', 
      description: 'Complete your first quest', 
      acquired: true,
      image: '/placeholder.svg',
    },
    { 
      name: 'Crypto Beginner', 
      description: 'Complete 5 beginner quests', 
      acquired: false,
      image: '/placeholder.svg',
    },
    { 
      name: 'Wallet Master', 
      description: 'Set up your first crypto wallet', 
      acquired: false,
      image: '/placeholder.svg',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <AnimatedTransition className="flex-1 pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
            <p className="text-muted-foreground">Track your progress and continue your learning journey</p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Progress overview */}
            <Card className="p-6 col-span-1 lg:col-span-2 glass-card">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold">Learning Progress</h2>
                <div className="ml-auto text-sm font-medium">3 / 24 completed</div>
              </div>
              <Progress value={12.5} className="h-2 mb-6" />
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  icon={<QuestIcon size={20} />}
                  label="Quests Completed"
                  value="3"
                />
                <StatCard
                  icon={<TokenIcon size={20} />}
                  label="Tokens Earned"
                  value="175"
                />
                <StatCard
                  icon={<AchievementIcon size={20} />}
                  label="Achievements"
                  value="1 / 15"
                />
              </div>
              
              <div className="mt-4 text-right">
                <Link to="/leaderboard" className="text-sm font-medium text-blockchain-600 hover:text-blockchain-500 flex items-center justify-end gap-1">
                  <Trophy size={14} />
                  View Leaderboard
                </Link>
              </div>
            </Card>
            
            {/* Wallet status */}
            <Card className="p-6 flex flex-col glass-card">
              <h2 className="text-xl font-semibold mb-4">Your Wallet</h2>
              
              {wallet ? (
                <div className="flex flex-col flex-1">
                  <div className="flex items-center mb-3 p-3 bg-blockchain-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blockchain-100 flex items-center justify-center mr-3">
                      <WalletIcon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <p className="font-medium">{formatAddress(wallet.address)}</p>
                        <button 
                          onClick={copyAddress}
                          className="ml-2 text-blockchain-500 hover:text-blockchain-600"
                          title="Copy address"
                        >
                          <CopyIcon size={14} />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">{wallet.chainName}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Balance</span>
                      <span className="text-sm font-medium">{Number(wallet.balance).toFixed(4)} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tokens</span>
                      <span className="text-sm font-medium">175 HERO</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">Your wallet is connected and ready to store your achievements and tokens.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                  <div className="w-16 h-16 bg-blockchain-100 rounded-full flex items-center justify-center mb-4">
                    <WalletIcon size={24} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Connect your wallet to store achievements and tokens</p>
                  <Button 
                    className="w-full bg-blockchain-500 hover:bg-blockchain-600"
                    onClick={handleConnectWallet}
                  >
                    Connect Wallet
                  </Button>
                </div>
              )}
            </Card>
          </div>
          
          <Tabs defaultValue="in-progress" className="mb-10">
            <TabsList>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="in-progress" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressQuests.map((quest, index) => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest} 
                    index={index}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedQuests.map((quest, index) => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest} 
                    index={index}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="achievements" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <Card 
                    key={index} 
                    className={`p-6 text-center ${achievement.acquired ? 'glass-card' : 'bg-gray-50 border-dashed opacity-60'}`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full mb-4 overflow-hidden">
                        <img 
                          src={achievement.image} 
                          alt={achievement.name} 
                          className={`w-full h-full object-cover ${!achievement.acquired ? 'filter grayscale' : ''}`}
                        />
                      </div>
                      <h3 className="font-semibold mb-1">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      
                      <div className="mt-4 flex items-center justify-center space-x-2">
                        {achievement.acquired ? (
                          <>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Acquired
                            </span>
                            <ShareAchievement
                              title={achievement.name}
                              description={achievement.description}
                              imageUrl={achievement.image}
                              type="achievement"
                              trigger={
                                <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
                                  <Share size={12} />
                                  Share
                                </Button>
                              }
                            />
                          </>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-semibold">Recommended Next Steps</h2>
            </div>
            
            <ul className="space-y-4">
              <RecommendationItem
                title="Complete the 'Create Your First Wallet' quest"
                description="Learn about cryptocurrency wallets and set up your first one."
                actionText="Continue Quest"
                href="/quest/crypto-wallets"
              />
              {!wallet ? (
                <RecommendationItem
                  title="Connect your wallet to the platform"
                  description="Store your achievements and tokens on the blockchain."
                  actionText="Connect Wallet"
                  href="#"
                  onClick={handleConnectWallet}
                />
              ) : null}
              <RecommendationItem
                title="Join the community"
                description="Connect with other blockchain learners to enhance your experience."
                actionText="Join Community"
                href="/community"
              />
            </ul>
          </div>
        </div>
      </AnimatedTransition>
      
      <Footer />
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => {
  return (
    <div className="bg-white rounded-lg p-4 border">
      <div className="flex items-center mb-1">
        {icon}
        <span className="text-sm text-muted-foreground ml-2">{label}</span>
      </div>
      <div className="font-bold text-2xl">{value}</div>
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
    <li className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4">
      <div className="mb-2 sm:mb-0 sm:mr-4">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      {onClick ? (
        <Button
          className="whitespace-nowrap bg-blockchain-500 text-white hover:bg-blockchain-600 border-none"
          onClick={onClick}
        >
          {actionText}
        </Button>
      ) : (
        <Button
          className="whitespace-nowrap bg-blockchain-500 text-white hover:bg-blockchain-600 border-none"
          asChild
        >
          <a href={href}>{actionText}</a>
        </Button>
      )}
    </li>
  );
};

export default Dashboard;
