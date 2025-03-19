import React, { useState, useEffect } from 'react';
import QuestCard, { QuestProps } from './QuestCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader } from 'lucide-react';

interface QuestGridProps {
  filterLevel?: 'beginner' | 'intermediate' | 'advanced' | null;
}

const QuestGrid: React.FC<QuestGridProps> = ({ filterLevel = null }) => {
  const [quests, setQuests] = useState<QuestProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchQuests = async () => {
      setIsLoading(true);
      try {
        let q = collection(db, 'quests');
        
        // If a filter is applied, create a filtered query
        if (filterLevel) {
          q = query(q, where('difficulty', '==', filterLevel));
        }
        
        const querySnapshot = await getDocs(q);
        const questsData: QuestProps[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          questsData.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            level: data.difficulty,
            reward: data.rewards,
            estimatedTime: data.estimatedTime,
            locked: data.locked || false,
            completed: data.completed || false,
          });
        });
        
        setQuests(questsData);
      } catch (err) {
        console.error('Error fetching quests:', err);
        setError('Failed to load quests. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuests();
  }, [filterLevel]);
    
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
            {quests.length > 0 ? (
              quests.map((quest, index) => (
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
        )}
        
        {!filterLevel && (
          <div className="mt-12 text-center">
            <Button 
              className="rounded-full px-8 py-6 bg-blockchain-500 hover:bg-blockchain-600 text-white shadow-lg shadow-blockchain-500/20 group relative overflow-hidden"
            >
              <span className="relative z-10">View All Quests</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blockchain-600 to-blockchain-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuestGrid;
