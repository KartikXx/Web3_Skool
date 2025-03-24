import React from 'react';
import { QuestCard } from './QuestCard';
import { useQuests } from '@/contexts/QuestContext';
import { Loader2 } from 'lucide-react';

// Use the same ExtendedQuest interface used in QuestCard
interface ExtendedQuest {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'basics' | 'defi' | 'nft' | 'web3' | 'wallet' | 'security';
  rewards: {
    xp: number;
    tokens: number;
  };
  reward?: {
    xp: number;
    tokens: number;
  };
  estimatedTime: string;
  steps: {
    id: string;
    title: string;
    description: string;
    completed?: boolean;
  }[];
  resources?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'tutorial';
  }[];
  userProgress?: number;
  userStatus?: string;
}

interface QuestListProps {
  quests: ExtendedQuest[];
  emptyMessage?: string;
  isLoading?: boolean;
}

export const QuestList: React.FC<QuestListProps> = ({ 
  quests, 
  emptyMessage = "No quests available", 
  isLoading = false 
}) => {
  const { startQuest, claimReward } = useQuests();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-blockchain-500 mb-4" />
        <p className="text-muted-foreground">Loading quests...</p>
      </div>
    );
  }

  if (!quests || quests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quests.map((quest) => (
        <QuestCard 
          key={quest.id}
          quest={quest}
          onStart={() => startQuest(quest.id)}
          onClaim={() => claimReward(quest.id)}
        />
      ))}
    </div>
  );
}; 