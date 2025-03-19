import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Lock, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { startQuest } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

export interface QuestProps {
  id: string;
  title: string;
  description: string;
  level: string | 'beginner' | 'intermediate' | 'advanced';
  reward: number;
  estimatedTime?: string;
  locked?: boolean;
  completed?: boolean;
}

interface QuestCardProps {
  quest: QuestProps;
  index: number;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, index }) => {
  const { user, isAuthenticated } = useAuth();
  
  const getBadgeColor = (level: string) => {
    switch(level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const handleStartQuest = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start this quest",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await startQuest(user.id, quest.id);
      toast({
        title: "Quest Started",
        description: `You've started the quest: ${quest.title}`,
        variant: "default"
      });
      window.location.href = `/quest/${quest.id}`;
    } catch (error) {
      console.error("Error starting quest:", error);
      toast({
        title: "Error",
        description: "Failed to start quest. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      }
    })
  };
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
    >
      <Link to={quest.locked ? '#' : `/quest/${quest.id}`}>
        <Card className={`h-full overflow-hidden transition-all duration-300 hover:shadow-lg ${quest.locked ? 'opacity-70 pointer-events-none' : 'cursor-pointer'}`}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <Badge className={`${getBadgeColor(quest.level)} capitalize`}>
                {quest.level}
              </Badge>
              {quest.completed ? (
                <div className="text-green-500 flex items-center">
                  <CheckCircle size={16} className="mr-1" />
                  <span className="text-xs font-medium">Completed</span>
                </div>
              ) : quest.locked ? (
                <div className="text-muted-foreground flex items-center">
                  <Lock size={16} className="mr-1" />
                  <span className="text-xs font-medium">Locked</span>
                </div>
              ) : null}
            </div>
            
            <h3 className="text-xl font-bold mb-2 group-hover:text-blockchain-500 dark:group-hover:text-blockchain-400">
              {quest.title}
            </h3>
            
            <p className="text-muted-foreground text-sm mb-4">
              {quest.description}
            </p>
            
            <div className="flex justify-between items-center mt-auto">
              <div className="flex items-center text-muted-foreground text-xs">
                <Clock size={14} className="mr-1" />
                <span>{quest.estimatedTime || '15 min'}</span>
              </div>
              
              <div className="flex items-center">
                <Award size={16} className="text-blockchain-500 mr-1" />
                <span className="font-semibold">{quest.reward} HERO</span>
              </div>
            </div>
            
            {!quest.locked && !quest.completed && (
              <Button
                className="w-full mt-4 bg-blockchain-500 hover:bg-blockchain-600"
                onClick={handleStartQuest}
              >
                Start Quest
              </Button>
            )}
            
            {quest.completed && (
              <Button
                className="w-full mt-4 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950"
                variant="outline"
                disabled
              >
                <CheckCircle size={16} className="mr-2" /> Completed
              </Button>
            )}
            
            {quest.locked && (
              <Button
                className="w-full mt-4"
                variant="outline"
                disabled
              >
                <Lock size={16} className="mr-2" /> Locked
              </Button>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default QuestCard;
