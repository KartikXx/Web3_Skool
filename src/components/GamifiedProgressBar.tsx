import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Trophy, Medal, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
// @ts-ignore
import confetti from 'canvas-confetti';

// Define the achievement levels
const achievementLevels = [
  { threshold: 0, title: "Blockchain Beginner", icon: Star, color: "text-slate-400" },
  { threshold: 20, title: "Chain Explorer", icon: Medal, color: "text-amber-500" },
  { threshold: 40, title: "Block Miner", icon: Award, color: "text-cyan-500" },
  { threshold: 60, title: "Crypto Enthusiast", icon: Trophy, color: "text-green-500" },
  { threshold: 80, title: "Blockchain Validator", icon: Star, color: "text-purple-500" },
  { threshold: 100, title: "Blockchain Hero", icon: Sparkles, color: "text-blockchain-500" }
];

interface GamifiedProgressBarProps {
  progress: number;
  xp: number;
  totalXp?: number;
  quests?: {
    total: number;
    completed: number;
  };
  className?: string;
  showConfetti?: boolean;
  showLevel?: boolean;
  showXP?: boolean;
  variant?: 'default' | 'compact';
  onLevelChange?: (level: {
    title: string;
    threshold: number;
  }) => void;
}

export const GamifiedProgressBar: React.FC<GamifiedProgressBarProps> = ({
  progress,
  xp,
  totalXp = 1000,
  quests = { total: 0, completed: 0 },
  className,
  showConfetti = true,
  showLevel = true,
  showXP = true,
  variant = 'default',
  onLevelChange
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [prevLevel, setPrevLevel] = useState(0);
  const [level, setLevel] = useState(0);

  // Trigger confetti when the progress increases significantly
  useEffect(() => {
    // Trigger level up
    const currentLevel = achievementLevels.reduce((acc, level, index) => {
      if (progress >= level.threshold) return index;
      return acc;
    }, 0);

    if (currentLevel > prevLevel) {
      setLevel(currentLevel);
      setPrevLevel(currentLevel);
      
      if (showConfetti) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6, x: 0.5 }
        });
      }
      
      if (onLevelChange) {
        onLevelChange(achievementLevels[currentLevel]);
      }
    }
  }, [progress, prevLevel, showConfetti, onLevelChange]);

  // Animate the progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [progress]);

  // Get the current achievement level
  const currentAchievement = achievementLevels[level];
  
  // Calculate next level threshold
  const nextLevelThreshold = level < achievementLevels.length - 1 
    ? achievementLevels[level + 1].threshold 
    : 100;

  // Calculate progress towards the next level
  const currentLevelThreshold = currentAchievement.threshold;
  const normalizedProgress = Math.min(100, Math.max(0,
    ((progress - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100
  ));

  // For compact variant
  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="relative flex-1">
          <Progress value={animatedProgress} className="h-2" />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-1 -right-1"
          >
            {React.createElement(currentAchievement.icon, { 
              className: cn("h-4 w-4", currentAchievement.color) 
            })}
          </motion.div>
        </div>
        {showXP && (
          <div className="text-xs font-medium">{xp} XP</div>
        )}
      </div>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Level display */}
          {showLevel && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {React.createElement(currentAchievement.icon, { 
                    className: cn("h-5 w-5", currentAchievement.color) 
                  })}
                </motion.div>
                <div>
                  <h4 className="font-medium text-sm">{currentAchievement.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {level < achievementLevels.length - 1 
                      ? `${nextLevelThreshold - progress}% to next level` 
                      : "Maximum level reached!"}
                  </p>
                </div>
              </div>
              
              <Badge variant="outline" className="bg-muted/50">
                Level {level + 1}
              </Badge>
            </div>
          )}
          
          {/* Main progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{animatedProgress}%</span>
            </div>
            <div className="relative">
              <Progress value={animatedProgress} className="h-3" />
              
              {/* Progress markers */}
              <div className="absolute inset-0 flex justify-between items-center px-1">
                {achievementLevels.slice(1).map((level, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-0.5 h-5 rounded-full transition-colors", 
                      progress >= level.threshold 
                        ? "bg-white/70 dark:bg-white/50" 
                        : "bg-white/20 dark:bg-white/10"
                    )}
                    style={{ left: `${level.threshold}%` }}
                  />
                ))}
              </div>
              
              {/* Current position indicator */}
              {animatedProgress > 5 && (
                <motion.div 
                  className="absolute top-0 -mt-1 w-2 h-2 bg-white rounded-full shadow-glow"
                  style={{ left: `${animatedProgress}%`, marginLeft: -4 }}
                  animate={{ 
                    y: [0, -3, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    ease: "easeInOut"
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Stats */}
          {showXP && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">XP Earned</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  {xp} / {totalXp} XP
                </p>
              </div>
              
              {quests.total > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Quests Completed</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Trophy className="h-3.5 w-3.5 text-green-500" />
                    {quests.completed} / {quests.total}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 