
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { QuestIcon, TokenIcon } from '@/assets/icons';
import { Link } from 'react-router-dom';

export interface QuestProps {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  completed?: boolean;
  locked?: boolean;
  reward: number;
  estimatedTime: string;
}

interface QuestCardProps {
  quest: QuestProps;
  index: number;
  className?: string;
}

const levelColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
};

const QuestCard: React.FC<QuestCardProps> = ({ 
  quest, 
  index,
  className 
}) => {
  const { id, title, description, level, completed, locked, reward, estimatedTime } = quest;

  // Staggered entrance animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        'group relative overflow-hidden rounded-xl transition-all duration-300',
        locked ? 'opacity-60 hover:opacity-80' : 'hover:shadow-xl',
        className
      )}
    >
      <Link
        to={locked ? '#' : `/quest/${id}`}
        className={cn(
          'block glass-card h-full p-6 border',
          completed ? 'border-blockchain-300' : 'border-transparent'
        )}
      >
        <div className="absolute top-3 right-3 flex space-x-2">
          {/* Level badge */}
          <span className={cn(
            'text-xs font-medium py-1 px-2 rounded-full',
            levelColors[level]
          )}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </span>
          
          {/* Status indicator */}
          {completed && (
            <span className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.5 7L6 9.5L10.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          )}
          
          {locked && (
            <span className="flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-500 rounded-full">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5V4C3 2.34315 4.34315 1 6 1C7.65685 1 9 2.34315 9 4V5M3 5H9M3 5H2V11H10V5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          )}
        </div>
        
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-blockchain-100 text-blockchain-500">
            <QuestIcon size={20} />
          </div>
          
          <div className="flex-grow">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-6">{description}</p>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1.5 text-blockchain-600">
                <TokenIcon size={16} />
                <span className="font-medium">{reward} Tokens</span>
              </div>
              
              <span className="text-muted-foreground">{estimatedTime}</span>
            </div>
          </div>
        </div>
        
        {/* Hover effect gradient border */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blockchain-300 to-blockchain-500 mask-border"></div>
      </Link>
    </motion.div>
  );
};

export default QuestCard;
