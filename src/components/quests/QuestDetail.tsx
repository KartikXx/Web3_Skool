import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CircleCheck, Coins, Clock, Award, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Quest } from '@/lib/firebase';
import { useQuests } from '@/contexts/QuestContext';
import { toast } from 'sonner';

interface QuestDetailProps {
  quest: Quest & { 
    userProgress?: number;
    userStatus?: 'not_started' | 'in_progress' | 'completed' | 'rewarded';
  };
}

export const QuestDetail: React.FC<QuestDetailProps> = ({ quest }) => {
  const { 
    id, 
    title, 
    description, 
    requirements, 
    difficulty, 
    reward, 
    category,
    estimatedTime,
    userProgress = 0,
    userStatus = 'not_started'
  } = quest;

  const { startQuest, updateProgress, completeQuest, claimReward } = useQuests();
  const navigate = useNavigate();

  const isStarted = userStatus === 'in_progress';
  const isCompleted = userStatus === 'completed';
  const isRewarded = userStatus === 'rewarded';
  const canStart = userStatus === 'not_started';
  const canClaim = isCompleted && !isRewarded;

  // Update the isSpecializedQuest check to include all possible quest IDs
  const isSpecializedQuest = [
    'blockchain-interactive', 
    'transaction-simulation', 
    'interactive-quiz',
    'blockchain-101'  // Add the blockchain-101 quest ID if it should use the interactive component
  ].includes(id);

  const handleStart = async () => {
    try {
      await startQuest(id);
      
      // Redirect to specialized quest pages if needed
      if (id === 'blockchain-interactive') {
        navigate(`/quests/blockchain-interactive/${id}`);
        return;
      } else if (id === 'transaction-simulation') {
        navigate(`/quests/transaction-simulation/${id}`);
        return;
      } else if (id === 'interactive-quiz') {
        navigate(`/quests/interactive-quiz/${id}`);
        return;
      } else if (id === 'blockchain-101') {
        navigate(`/quests/blockchain-101/${id}`);
        return;
      }
    } catch (error) {
      console.error('Failed to start quest:', error);
    }
  };

  const handleUpdateProgress = async (newProgress: number) => {
    try {
      await updateProgress(id, newProgress);
      if (newProgress >= 100) {
        toast.success('You\'ve completed all requirements!');
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const handleComplete = async () => {
    try {
      await completeQuest(id);
    } catch (error) {
      console.error('Failed to complete quest:', error);
    }
  };

  const handleClaimReward = async () => {
    try {
      await claimReward(id);
    } catch (error) {
      console.error('Failed to claim reward:', error);
    }
  };

  const statusLabel = () => {
    switch (userStatus) {
      case 'not_started':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'rewarded':
        return 'Reward Claimed';
      default:
        return 'Unknown';
    }
  };

  // Add console logging in useEffect to debug quest loading
  useEffect(() => {
    console.log('QuestDetail - Quest ID:', id);
    console.log('QuestDetail - Quest Status:', userStatus);
    console.log('QuestDetail - Is Started:', isStarted);
    console.log('QuestDetail - Is Specialized:', isSpecializedQuest);
    
    // For specialized quests, add a slight delay to avoid redirect race conditions
    if (isStarted && isSpecializedQuest) {
      const timer = setTimeout(() => {
        console.log('Redirecting to specialized quest page');
        if (id === 'blockchain-interactive' || id === 'blockchain-101') {
          navigate(`/quests/blockchain-interactive/${id}`);
        } else if (id === 'transaction-simulation') {
          navigate(`/quests/transaction-simulation/${id}`);
        } else if (id === 'interactive-quiz') {
          navigate(`/quests/interactive-quiz/${id}`);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [id, isStarted, navigate, isSpecializedQuest, userStatus]);

  return (
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
        
        <Badge 
          className={`
            capitalize 
            ${difficulty === 'beginner' ? 'bg-green-500' : ''} 
            ${difficulty === 'intermediate' ? 'bg-orange-500' : ''} 
            ${difficulty === 'advanced' ? 'bg-red-500' : ''}
          `}
        >
          {difficulty}
        </Badge>
      </div>

      {/* Title and description */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Status and progress */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="font-medium">Status</h3>
                <Badge 
                  variant="outline" 
                  className={`
                    ${isStarted ? 'border-blockchain-500 text-blockchain-500' : ''} 
                    ${isCompleted ? 'border-green-500 text-green-500' : ''} 
                    ${isRewarded ? 'border-yellow-500 text-yellow-500' : ''}
                    ${canStart ? 'border-gray-300 text-gray-500' : ''}
                  `}
                >
                  {statusLabel()}
                </Badge>
              </div>
              <Progress value={userProgress} className="h-2" />
              <p className="text-sm text-muted-foreground text-right">{userProgress}% complete</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{estimatedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {category}
                </Badge>
              </div>
            </div>
          </div>

          <div className="border-t md:border-l md:border-t-0 pt-4 md:pt-0 md:pl-6 flex-1">
            <h3 className="font-medium mb-3">Rewards</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <span>{reward.tokens} HERO tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                <span>{reward.xp} XP</span>
              </div>
              {reward.badges && reward.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {reward.badges.map((badge, index) => (
                    <Badge key={index} variant="secondary">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Requirements */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Requirements</h2>
        <Card className="p-6">
          <ul className="space-y-3">
            {requirements.map((requirement, index) => (
              <li key={index} className="flex items-start gap-3">
                <CircleCheck 
                  className={`h-5 w-5 mt-0.5 ${
                    userProgress >= ((index + 1) / requirements.length) * 100
                      ? 'text-green-500'
                      : 'text-gray-300'
                  }`} 
                />
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        {canStart ? (
          <Button 
            size="lg" 
            className="w-full" 
            onClick={handleStart}
          >
            Start Quest
          </Button>
        ) : isStarted ? (
          <>
            <Button 
              size="lg"
              className="px-8"
              onClick={() => {
                if (isSpecializedQuest) {
                  if (id === 'blockchain-interactive') {
                    navigate(`/quests/blockchain-interactive/${id}`);
                  } else if (id === 'transaction-simulation') {
                    navigate(`/quests/transaction-simulation/${id}`);
                  } else if (id === 'interactive-quiz') {
                    navigate(`/quests/interactive-quiz/${id}`);
                  }
                } else {
                  // Handle regular quest progression
                  handleUpdateProgress(Math.min(userProgress + 25, 100));
                }
              }}
            >
              {isSpecializedQuest ? "Continue Interactive Quest" : "Continue Quest"}
            </Button>
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleComplete}
              disabled={userProgress < 100}
            >
              Complete Quest
            </Button>
          </>
        ) : canClaim ? (
          <Button 
            size="lg" 
            className="w-full bg-yellow-500 hover:bg-yellow-600"
            onClick={handleClaimReward}
          >
            Claim Reward
          </Button>
        ) : (
          <Button 
            size="lg" 
            variant="secondary" 
            className="w-full"
            disabled
          >
            Reward Claimed
          </Button>
        )}
      </div>
    </div>
  );
}; 