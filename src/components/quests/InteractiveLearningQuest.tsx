import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertCircle, ArrowRight, BookOpen, Award, Check, X, Brain, Zap, ThumbsUp, RotateCw } from 'lucide-react';
import { useQuests } from '@/contexts/QuestContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { GamifiedProgressBar } from '@/components/GamifiedProgressBar';
import { BlockchainVisualizer } from '@/components/BlockchainVisualizer';
// @ts-ignore
import confetti from 'canvas-confetti';

// Interfaces for content and questions
interface LearningContent {
  id: string;
  title: string;
  content: string; // Can include HTML markup
  imageUrl?: string;
}

interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation?: string;
}

interface LearningModule {
  id: string;
  title: string;
  content: LearningContent;
  questions: Question[];
}

interface InteractiveLearningQuestProps {
  questId: string;
  modules: LearningModule[];
  onComplete?: () => void;
}

export const InteractiveLearningQuest: React.FC<InteractiveLearningQuestProps> = ({ 
  questId, 
  modules,
  onComplete 
}) => {
  const { updateProgress } = useQuests();

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [xpPoints, setXpPoints] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [badgesEarned, setBadgesEarned] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentModule = modules[currentModuleIndex];
  const currentQuestion = currentModule?.questions[0];

  // Calculate progress percentage based on completed modules
  const progress = Math.round((completedModules.length / modules.length) * 100);

  useEffect(() => {
    // Update quest progress
    console.log(`Attempting to update quest progress: questId=${questId}, progress=${progress}%`);
    try {
      updateProgress(questId, progress);
      console.log(`Progress update initiated: ${progress}%`);
    } catch (error) {
      console.error('Error updating progress:', error);
      // Continue execution even if progress update fails
    }
    
    // Check for completion and call onComplete if provided
    if (progress >= 100 && onComplete) {
      console.log('Quest 100% complete, triggering completion callback');
      setTimeout(() => {
        try {
          onComplete();
          // Trigger confetti for quest completion
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5, x: 0.5 }
          });
          console.log('Completion callback executed successfully');
        } catch (error) {
          console.error('Error in completion callback:', error);
        }
      }, 500);
    }
    
    // Award badges based on progress
    if (progress >= 50 && !badgesEarned.includes('halfway')) {
      console.log('Awarding halfway badge');
      setBadgesEarned(prev => [...prev, 'halfway']);
      toast.success('Halfway Badge Earned! 🏅');
    }
    
    if (progress >= 100 && !badgesEarned.includes('completed')) {
      console.log('Awarding completion badge');
      setBadgesEarned(prev => [...prev, 'completed']);
      toast.success('Completion Badge Earned! 🏆');
    }
    
  }, [progress, onComplete, questId, updateProgress, badgesEarned]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    const selectedOptionObj = currentQuestion.options.find(option => option.id === optionId);
    const correct = selectedOptionObj?.isCorrect || false;
    
    setIsCorrect(correct);
    
    if (correct) {
      // Increment streak for correct answers
      setCurrentStreak(prev => prev + 1);
      
      // Award XP based on the current streak (bonus for consecutive correct answers)
      const streakBonus = Math.min(currentStreak * 5, 20); // Cap bonus at 20 XP
      const pointsEarned = 10 + streakBonus;
      setXpPoints(prev => prev + pointsEarned);
      
      // Show different toast messages based on streak
      if (currentStreak >= 3) {
        toast.success(`${pointsEarned} XP! 🔥 ${currentStreak} correct in a row!`);
      } else {
        toast.success(`Correct! +${pointsEarned} XP`);
      }
      
      // Award streak badge at 5 consecutive correct answers
      if (currentStreak === 5 && !badgesEarned.includes('streak')) {
        setBadgesEarned(prev => [...prev, 'streak']);
        toast('Streak Master Badge Earned! 🎯', {
          icon: '🎯',
          duration: 3000
        });
      }
    } else {
      // Reset streak for incorrect answers
      setCurrentStreak(0);
      toast.error('Try again!');
    }
  };

  const handleNextModule = () => {
    // Mark current module as completed if not already in the array
    if (!completedModules.includes(currentModule.id)) {
      console.log(`Marking module ${currentModule.id} as completed`);
      setCompletedModules(prev => [...prev, currentModule.id]);
      
      // Calculate the new progress immediately to ensure it updates
      const newCompletedCount = completedModules.length + 1;
      const newProgress = Math.round((newCompletedCount / modules.length) * 100);
      console.log(`New progress calculated: ${newProgress}% (${newCompletedCount}/${modules.length} modules)`);
      
      // Ensure the progress update happens directly instead of waiting for the state update and useEffect
      try {
        updateProgress(questId, newProgress);
        console.log(`Direct progress update to ${newProgress}%`);
      } catch (error) {
        console.error('Error updating progress directly:', error);
      }
    }
    
    setIsLoading(true);
    
    // Reset states for the next module
    setSelectedOption(null);
    setIsCorrect(null);
    setShowQuiz(false);
    setShowVisualization(false);
    setShowHint(false);
    
    setTimeout(() => {
      // Move to the next module if available, otherwise stay on the last one
      if (currentModuleIndex < modules.length - 1) {
        console.log(`Moving to next module: ${currentModuleIndex + 1} of ${modules.length}`);
        setCurrentModuleIndex(prevIndex => prevIndex + 1);
      } else {
        console.log(`Reached final module: ${currentModuleIndex + 1} of ${modules.length}`);
        
        // Handle completion if it's the last module
        const finalProgress = 100;
        try {
          updateProgress(questId, finalProgress);
          console.log(`Final progress update to ${finalProgress}%`);
        } catch (error) {
          console.error('Error updating final progress:', error);
        }
      }
      setIsLoading(false);
    }, 500);
  };

  const resetQuest = () => {
    setCurrentModuleIndex(0);
    setShowQuiz(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setCompletedModules([]);
    setXpPoints(0);
    setCurrentStreak(0);
    setBadgesEarned([]);
  };

  const handleShowHint = () => {
    setShowHint(true);
    // Small XP penalty for using hints
    setXpPoints(prev => Math.max(0, prev - 2));
    toast.info('Hint revealed! (-2 XP)');
  };

  const handleToggleVisualization = () => {
    setShowVisualization(prev => !prev);
    
    if (!showVisualization && !badgesEarned.includes('explorer')) {
      setBadgesEarned(prev => [...prev, 'explorer']);
      setXpPoints(prev => prev + 5);
      toast.success('Explorer Badge Earned! +5 XP 🔍');
    }
  };

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };
  
  // Background gradient style for modules
  const getModuleStyle = (index: number) => {
    const colors = [
      'from-blue-500/20 to-purple-500/20',
      'from-green-500/20 to-cyan-500/20',
      'from-orange-500/20 to-red-500/20',
      'from-pink-500/20 to-indigo-500/20',
      'from-cyan-500/20 to-blue-500/20'
    ];
    
    return `bg-gradient-to-br ${colors[index % colors.length]}`;
  };

  return (
    <div className="space-y-6">
      {/* Gamified Progress Bar */}
      <GamifiedProgressBar 
        progress={progress} 
        xp={xpPoints}
        quests={{ total: modules.length, completed: completedModules.length }}
      />
      
      {/* Module Navigation */}
      <div className="flex flex-wrap gap-2 pb-4">
        {modules.map((module, index) => (
          <Badge
            key={module.id}
            variant={completedModules.includes(module.id) ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-all hover:shadow",
              completedModules.includes(module.id) ? "bg-blockchain-500" : "",
              currentModuleIndex === index ? "ring-2 ring-offset-2 ring-blockchain-500" : ""
            )}
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setCurrentModuleIndex(index);
                setShowQuiz(false);
                setSelectedOption(null);
                setIsCorrect(null);
                setShowVisualization(false);
                setShowHint(false);
                setIsLoading(false);
              }, 300);
            }}
          >
            {completedModules.includes(module.id) && (
              <CheckCircle className="w-3 h-3 mr-1" />
            )}
            Module {index + 1}
          </Badge>
        ))}
      </div>

      {/* Main Content Card */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <RotateCw className="animate-spin h-8 w-8 text-blockchain-500" />
          </div>
        ) : (
          <motion.div
            key={currentModule.id}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariants}
          >
            <Card className={cn(
              "overflow-hidden border-2 transition-all", 
              getModuleStyle(currentModuleIndex)
            )}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl group">
                      {currentModule.title}
                      <span className="ml-2 inline-block text-blockchain-500 group-hover:rotate-12 transition-transform">
                        {currentModuleIndex === 0 ? '🔍' : 
                          currentModuleIndex === modules.length - 1 ? '🏆' : '💡'}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Learning module {currentModuleIndex + 1} of {modules.length}
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex gap-1 items-center">
                      <Brain className="h-3 w-3" />
                      {showQuiz ? 'Quiz Mode' : 'Learning Mode'}
                    </Badge>
                    
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 flex gap-1 items-center border-amber-200">
                      <Zap className="h-3 w-3" />
                      {xpPoints} XP
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-0">
                {!showQuiz ? (
                  <div className="space-y-4">
                    {/* Learning Content */}
                    <div 
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: currentModule.content.content }}
                    />
                    
                    {/* Interactive Visualization Toggle */}
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={handleToggleVisualization}
                        className="flex items-center gap-2 text-sm"
                      >
                        {showVisualization ? 'Hide Visualization' : 'Show Interactive Visualization'}
                      </Button>
                    </div>
                    
                    {/* Blockchain Visualizer */}
                    <AnimatePresence>
                      {showVisualization && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <BlockchainVisualizer 
                            initialBlocks={2}
                            maxBlocks={4}
                            onBlockMined={(count) => {
                              if (count >= 3 && !badgesEarned.includes('miner')) {
                                setBadgesEarned(prev => [...prev, 'miner']);
                                setXpPoints(prev => prev + 15);
                                toast.success('Block Miner Badge Earned! +15 XP ⛏️');
                              }
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Quiz Question */}
                    <div className="text-lg font-medium">{currentQuestion.text}</div>
                    
                    {/* Quiz Options */}
                    <div className="space-y-3">
                      {currentQuestion.options.map(option => (
                        <motion.div 
                          key={option.id}
                          whileHover={{ scale: 1.01 }}
                          className={cn(
                            "border rounded-lg p-3 cursor-pointer transition-colors",
                            selectedOption === option.id && option.isCorrect ? "bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700" : "",
                            selectedOption === option.id && !option.isCorrect ? "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700" : "",
                            selectedOption !== option.id ? "hover:bg-muted" : "",
                            selectedOption && option.isCorrect ? "bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700" : ""
                          )}
                          onClick={() => selectedOption === null && handleOptionSelect(option.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option.text}</span>
                            {selectedOption === option.id && (
                              option.isCorrect ? 
                                <CheckCircle className="h-5 w-5 text-green-500" /> : 
                                <X className="h-5 w-5 text-red-500" />
                            )}
                            {selectedOption !== option.id && selectedOption !== null && option.isCorrect && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Explanation (shown after answering) */}
                    <AnimatePresence>
                      {selectedOption !== null && currentQuestion.explanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          <Alert className={isCorrect ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800" : "bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800"}>
                            <div className="flex items-start gap-2">
                              {isCorrect ? 
                                <ThumbsUp className="h-4 w-4 mt-0.5 text-green-500" /> : 
                                <AlertCircle className="h-4 w-4 mt-0.5 text-amber-500" />
                              }
                              <div>
                                <AlertTitle>{isCorrect ? "Correct!" : "Not quite right"}</AlertTitle>
                                <AlertDescription>{currentQuestion.explanation}</AlertDescription>
                              </div>
                            </div>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Hint Section */}
                    {!selectedOption && !showHint && (
                      <div className="text-center">
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={handleShowHint}
                          className="text-muted-foreground"
                        >
                          Need a hint? (-2 XP)
                        </Button>
                      </div>
                    )}
                    
                    <AnimatePresence>
                      {showHint && !selectedOption && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          <Alert variant="default" className="bg-muted">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Hint</AlertTitle>
                            <AlertDescription>
                              Try thinking about the core properties of blockchain technology discussed in the module.
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between pt-6 pb-6">
                {!showQuiz ? (
                  <motion.div 
                    className="w-full flex justify-end"
                    variants={buttonVariants}
                    whileHover="hover"
                    initial="idle"
                  >
                    <Button 
                      onClick={() => setShowQuiz(true)}
                      className="gap-2 bg-blockchain-600 hover:bg-blockchain-700"
                    >
                      Test Your Knowledge
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <div className="w-full flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowQuiz(false)}
                    >
                      Back to Content
                    </Button>
                    
                    <motion.div 
                      variants={buttonVariants}
                      whileHover="hover"
                      initial="idle"
                    >
                      <Button 
                        onClick={handleNextModule}
                        disabled={!isCorrect}
                        className={cn(
                          "gap-2",
                          isCorrect ? "bg-green-600 hover:bg-green-700" : ""
                        )}
                      >
                        {currentModuleIndex < modules.length - 1 ? "Next Module" : "Complete Quest"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Badges Showcase */}
      {badgesEarned.length > 0 && (
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Badges Earned:</h3>
          <div className="flex flex-wrap gap-2">
            {badgesEarned.includes('explorer') && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                🔍 Explorer
              </Badge>
            )}
            {badgesEarned.includes('miner') && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                ⛏️ Block Miner
              </Badge>
            )}
            {badgesEarned.includes('streak') && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                🎯 Streak Master
              </Badge>
            )}
            {badgesEarned.includes('halfway') && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                🏅 Halfway Hero
              </Badge>
            )}
            {badgesEarned.includes('completed') && (
              <Badge variant="secondary" className="bg-blockchain-100 text-blockchain-800 dark:bg-blockchain-900 dark:text-blockchain-200">
                🏆 Quest Champion
              </Badge>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Reset button - only shown for development/testing */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-center mt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetQuest}
            className="text-xs text-muted-foreground"
          >
            Reset Quest (Dev Only)
          </Button>
        </div>
      )}
    </div>
  );
}; 