import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coins, Clock, Award, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Import the extended quest type
interface ExtendedQuest {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'basics' | 'defi' | 'nft' | 'web3' | 'wallet' | 'security';
  rewards: {
    xp: number;
    tokens: number;
  };
  reward?: {
    xp: number;
    tokens: number;
  };
  estimatedTime: string;
  steps: {
    id: string;
    title: string;
    description: string;
    completed?: boolean;
  }[];
  resources?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'tutorial';
  }[];
  imageUrl?: string;
  userProgress?: number;
  userStatus?: 'not_started' | 'in_progress' | 'completed' | 'rewarded';
}

interface QuestCardProps {
  quest: ExtendedQuest;
  onStart?: () => void;
  onClaim?: () => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onStart, onClaim }) => {
  const { 
    id, 
    title, 
    description, 
    difficulty, 
    rewards,
    reward,
    imageUrl, 
    category,
    estimatedTime,
    resources = [],
    userProgress = 0,
    userStatus = 'not_started'
  } = quest;
  
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Handle rewards from either source
  const tokenReward = rewards?.tokens || reward?.tokens || 0;
  const xpReward = rewards?.xp || reward?.xp || 0;

  const isStarted = userStatus === 'in_progress';
  const isCompleted = userStatus === 'completed';
  const isRewarded = userStatus === 'rewarded';
  const canStart = userStatus === 'not_started';
  const canClaim = isCompleted && !isRewarded;

  // Set card appearance based on status
  const cardStyles = cn(
    "h-full flex flex-col transition-all hover:shadow-md overflow-hidden",
    {
      "border-gray-200": canStart,
      "border-blockchain-300 bg-blockchain-50/50 dark:bg-blockchain-900/10": isStarted,
      "border-green-300 bg-green-50/50 dark:bg-green-900/10": isCompleted,
      "border-yellow-300 bg-yellow-50/50 dark:bg-yellow-900/10": isRewarded,
    }
  );

  // Get the badge color for difficulty
  const difficultyColor = {
    'beginner': 'bg-green-500 hover:bg-green-600',
    'intermediate': 'bg-orange-500 hover:bg-orange-600',
    'advanced': 'bg-red-500 hover:bg-red-600'
  }[difficulty] || 'bg-green-500 hover:bg-green-600';

  // Get the category display name
  const categoryDisplayNames = {
    'basics': 'Basics',
    'defi': 'DeFi',
    'nft': 'NFTs',
    'web3': 'Web3',
    'wallet': 'Wallets',
    'security': 'Security'
  };
  
  const handleStartQuest = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated || !user) {
      console.log("Authentication required");
      toast.error("Please sign in to start this quest");
      navigate('/sign-in');
      return;
    }
    
    try {
      console.log(`Starting quest: ${id}`);
      toast.loading(`Starting quest: ${title}...`, { id: 'start-quest' });
      
      if (onStart) {
        await onStart();
        toast.dismiss('start-quest');
        toast.success(`You've started the quest: ${title}`);
        
        // Determine where to navigate based on quest type
        console.log(`Checking quest type for ${id} to determine navigation`);
        if (id === 'blockchain-101' || id === 'blockchain-interactive') {
          console.log('Navigating to blockchain interactive page');
          navigate(`/quests/blockchain-interactive/${id}`);
        } else if (id === 'transaction-simulation') {
          console.log('Navigating to transaction simulation page');
          navigate(`/quests/transaction-simulation/${id}`);
        } else if (id === 'interactive-quiz') {
          console.log('Navigating to interactive quiz page');
          navigate(`/quests/interactive-quiz/${id}`);
        } else {
          // Default navigation
          console.log('Navigating to default quest page');
          navigate(`/quest/${id}`);
        }
      } else {
        toast.dismiss('start-quest');
        console.error("onStart handler is not provided");
        toast.error("Failed to start quest. Please try again.");
      }
    } catch (error) {
      toast.dismiss('start-quest');
      console.error("Error starting quest:", error);
      toast.error("Failed to start quest. Please try again.");
      
      // Keep the user on the current page when there's an error
    }
  };
  
  const handleClaimReward = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log(`Claiming reward for quest: ${id}`);
      
      if (onClaim) {
        await onClaim();
        toast.success(`You've claimed the reward for: ${title}`);
      } else {
        console.error("onClaim handler is not provided");
        toast.error("Failed to claim reward. Please try again.");
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast.error("Failed to claim reward. Please try again.");
    }
  };

  return (
    <Card className={cardStyles}>
      {/* Card Header */}
      <CardHeader className="pb-2 relative">
        {/* Category Badge */}
        <Badge 
          variant="outline" 
          className="absolute top-2 right-2 capitalize"
        >
          {categoryDisplayNames[category] || category}
        </Badge>

        {/* Difficulty */}
        <Badge 
          className={cn(
            "capitalize mb-2 w-fit",
            difficultyColor
          )}
        >
          {difficulty}
        </Badge>

        <CardTitle className="line-clamp-1 text-lg">{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="pb-2 grow">
        {/* Progress bar */}
        {(isStarted || isCompleted || isRewarded) && (
          <div className="mb-4 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{userProgress}%</span>
            </div>
            <Progress value={userProgress} className="h-2" />
          </div>
        )}

        {/* Quest metadata */}
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          {/* Time estimate */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{estimatedTime}</span>
          </div>

          {/* Reward */}
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            <span>{tokenReward} HERO tokens</span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>{xpReward} XP</span>
          </div>

          {/* Resources */}
          {resources && resources.length > 0 && (
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{resources.length} resource{resources.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="pt-2">
        {canClaim ? (
          <Button 
            onClick={handleClaimReward} 
            className="w-full bg-yellow-500 hover:bg-yellow-600"
          >
            Claim Reward
          </Button>
        ) : canStart ? (
          <Button 
            onClick={handleStartQuest} 
            className="w-full"
            variant="outline"
          >
            Start Quest
          </Button>
        ) : (
          <Link to={`/quest/${id}`} className="w-full">
            <Button 
              className="w-full"
              variant={isRewarded ? "ghost" : "secondary"}
            >
              {isRewarded ? "View Details" : "Continue"}
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}; 