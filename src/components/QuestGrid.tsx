import React from 'react';
import QuestCard from './QuestCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuests } from '@/contexts/QuestContext';

interface QuestGridProps {
  filterLevel?: 'beginner' | 'intermediate' | 'advanced' | null;
}

const QuestGrid: React.FC<QuestGridProps> = ({ filterLevel = null }) => {
  const { activeQuests, isLoading, error } = useQuests();
  
  // Filter quests by difficulty if a filter is applied
  const filteredQuests = filterLevel 
    ? activeQuests.filter(quest => quest.difficulty === filterLevel)
    : activeQuests.slice(0, 6); // Limit to 6 quests on home page
    
  return (
    <section className="py-8 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {!filterLevel && (
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Begin Your Blockchain Journey</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Complete interactive quests to earn rewards and build your blockchain knowledge from beginner to expert.
              </p>
            </motion.div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader className="animate-spin h-8 w-8 text-blockchain-500" />
            <span className="ml-3">Loading quests...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuests.length > 0 ? (
              filteredQuests.map((quest, index) => {
                // Transform quest object to match QuestCard props format
                const questProps = {
                  id: quest.id,
                  title: quest.title,
                  description: quest.description,
                  level: quest.difficulty,
                  reward: quest.rewards?.tokens || quest.reward?.tokens || 0,
                  estimatedTime: quest.estimatedTime,
                  locked: false,
                  completed: quest.userStatus === 'completed' || quest.userStatus === 'rewarded'
                };
                
                return (
                  <QuestCard 
                    key={quest.id} 
                    quest={questProps} 
                    index={index}
                  />
                );
              })
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">No quests available for this level yet. Check back soon!</p>
              </div>
            )}
          </div>
        )}
        
        {!filterLevel && (
          <div className="mt-12 text-center">
            <Link to="/quests">
              <Button 
                className="rounded-full px-8 py-6 bg-blockchain-500 hover:bg-blockchain-600 text-white shadow-lg shadow-blockchain-500/20 group relative overflow-hidden"
              >
                <span className="relative z-10">View All Quests</span>
                <span className="absolute inset-0 bg-gradient-to-r from-blockchain-600 to-blockchain-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuestGrid;
