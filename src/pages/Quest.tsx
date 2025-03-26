import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuestDetail } from '@/components/quests/QuestDetail';
import { useQuests } from '@/contexts/QuestContext';
import { Loader2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { toast } from 'sonner';

const Quest: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  const { activeQuests, isLoading, error } = useQuests();
  const navigate = useNavigate();
  const [currentQuest, setCurrentQuest] = useState<any | null>(null);
  const [loadAttempted, setLoadAttempted] = useState(false);
  
  useEffect(() => {
    if (!isLoading && questId) {
      console.log(`Quest page - Looking for quest: ${questId}`);
      console.log(`Active quests available: ${activeQuests.length}`);
      
      // Try to find the quest with exact ID match
      let quest = activeQuests.find(q => q.id === questId);
      
      // Special handling for specific quest IDs that might be aliases
      if (!quest) {
        if (questId === 'blockchain-101') {
          quest = activeQuests.find(q => q.id === 'blockchain-interactive');
          console.log('Fallback: Using blockchain-interactive for blockchain-101');
        } else if (questId === 'blockchain-interactive') {
          quest = activeQuests.find(q => q.id === 'blockchain-101');
          console.log('Fallback: Using blockchain-101 for blockchain-interactive');
        }
      }
      
      if (quest) {
        console.log('Found quest:', quest.title);
        setCurrentQuest(quest);
      } else {
        console.log('Quest not found, checking specialized quest pages...');
        
        // If quest not found, it may be a specialized quest - try to redirect
        if (['blockchain-101', 'blockchain-interactive'].includes(questId)) {
          console.log('Redirecting to blockchain interactive page');
          navigate(`/quests/blockchain-interactive/${questId}`);
          return;
        } else if (questId === 'transaction-simulation') {
          console.log('Redirecting to transaction simulation page');
          navigate(`/quests/transaction-simulation/${questId}`);
          return;
        } else if (questId === 'interactive-quiz') {
          console.log('Redirecting to interactive quiz page');
          navigate(`/quests/interactive-quiz/${questId}`);
          return;
        } else {
          // Only show the toast and redirect if this is the first load attempt
          if (!loadAttempted) {
            console.log('Quest not found, redirecting to quests page');
            toast.error('Quest not found');
            navigate('/quests');
          }
        }
      }
      
      setLoadAttempted(true);
    }
  }, [questId, activeQuests, isLoading, navigate, loadAttempted]);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blockchain-500 mb-4" />
            <p className="text-muted-foreground">Loading quest...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Error loading quest</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : currentQuest ? (
          <QuestDetail quest={currentQuest} />
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Quest not found</h3>
            <p className="text-muted-foreground">The quest you're looking for doesn't exist or has been removed.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Quest;
