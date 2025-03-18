
import React from 'react';
import QuestCard, { QuestProps } from './QuestCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const featuredQuests: QuestProps[] = [
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
  {
    id: 'smart-contracts',
    title: 'Smart Contracts 101',
    description: 'Understand what smart contracts are and how they power decentralized applications.',
    level: 'intermediate',
    reward: 100,
    estimatedTime: '30 min',
    locked: true,
  },
  {
    id: 'defi-basics',
    title: 'DeFi Fundamentals',
    description: 'Explore decentralized finance and discover how it\'s reinventing traditional banking.',
    level: 'intermediate',
    reward: 150,
    estimatedTime: '45 min',
    locked: true,
  },
  {
    id: 'nft-creation',
    title: 'Create Your First NFT',
    description: 'Mint a non-fungible token and understand the technology behind digital ownership.',
    level: 'intermediate',
    reward: 200,
    estimatedTime: '60 min',
    locked: true,
  },
  {
    id: 'dao-governance',
    title: 'DAO Governance',
    description: 'Learn about Decentralized Autonomous Organizations and their governance models.',
    level: 'advanced',
    reward: 250,
    estimatedTime: '75 min',
    locked: true,
  },
];

interface QuestGridProps {
  filterLevel?: 'beginner' | 'intermediate' | 'advanced' | null;
}

const QuestGrid: React.FC<QuestGridProps> = ({ filterLevel = null }) => {
  const filteredQuests = filterLevel 
    ? featuredQuests.filter(quest => quest.level === filterLevel)
    : featuredQuests;
    
  return (
    <section className="py-8 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {!filterLevel && (
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Begin Your Blockchain Journey</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Complete interactive quests to earn rewards and build your blockchain knowledge from beginner to expert.
              </p>
            </motion.div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuests.length > 0 ? (
            filteredQuests.map((quest, index) => (
              <QuestCard 
                key={quest.id} 
                quest={quest} 
                index={index}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">No quests available for this level yet. Check back soon!</p>
            </div>
          )}
        </div>
        
        {!filterLevel && (
          <div className="mt-12 text-center">
            <Button 
              className="rounded-full px-8 py-6 bg-blockchain-500 hover:bg-blockchain-600 text-white shadow-lg shadow-blockchain-500/20"
            >
              View All Quests
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuestGrid;
