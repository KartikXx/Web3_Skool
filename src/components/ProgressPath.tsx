
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BlockchainIcon, StarIcon } from '@/assets/icons';

interface PathNodeProps {
  title: string;
  completed?: boolean;
  active?: boolean;
  locked?: boolean;
  index: number;
  total: number;
}

const PathNode: React.FC<PathNodeProps> = ({ 
  title, 
  completed = false, 
  active = false, 
  locked = false,
  index,
  total
}) => {
  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: index * 0.2,
        duration: 0.5,
        ease: "easeOut" 
      }
    }
  };

  const isLast = index === total - 1;

  return (
    <motion.div 
      className="flex flex-col items-center"
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      <div className={cn(
        'w-16 h-16 flex items-center justify-center rounded-full border-4 relative z-10',
        completed ? 'bg-green-500 border-white text-white' : 
        active ? 'bg-blockchain-500 border-white text-white animate-pulse' : 
        locked ? 'bg-gray-200 border-white text-gray-400' : 
        'bg-blockchain-100 border-white text-blockchain-500'
      )}>
        {completed ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : locked ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 11H5V21H19V11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 11V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : index === total - 1 ? (
          <StarIcon size={24} className="stroke-current" />
        ) : (
          <BlockchainIcon size={24} className="stroke-current" />
        )}
      </div>
      
      {!isLast && (
        <div className={cn(
          'h-20 w-1 bg-gray-200',
          completed ? 'bg-green-300' : ''
        )} />
      )}
      
      <div className="text-center mt-2">
        <p className={cn(
          'font-medium',
          completed ? 'text-green-500' : 
          active ? 'text-blockchain-500' : 
          locked ? 'text-gray-400' : 
          'text-foreground'
        )}>
          {title}
        </p>
      </div>
    </motion.div>
  );
};

const ProgressPath: React.FC = () => {
  const pathNodes = [
    { title: 'Introduction', completed: true },
    { title: 'Wallets', active: true },
    { title: 'Smart Contracts', locked: false },
    { title: 'DeFi', locked: true },
    { title: 'Advanced', locked: true },
  ];

  return (
    <section className="py-20 px-6 md:px-10 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Learning Path</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track your progress as you advance from blockchain basics to becoming a WEB3 expert.
            </p>
          </motion.div>
        </div>
        
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col space-y-0"
          >
            {pathNodes.map((node, index) => (
              <PathNode 
                key={index}
                title={node.title}
                completed={node.completed}
                active={node.active}
                locked={node.locked}
                index={index}
                total={pathNodes.length}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProgressPath;
