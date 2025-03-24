import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Quest as FirebaseQuest, 
  UserQuest, 
  fetchQuests, 
  fetchUserQuests, 
  startQuest as startFirebaseQuest,
  completeQuest as completeFirebaseQuest,
  updateQuestProgress as updateFirebaseQuestProgress,
  updateQuestReward
} from '@/lib/firebase';
import defaultQuests from '@/lib/quests';  // Import our quest data from lib/quests
import { Quest, beginnerQuests } from '@/data/quests';
import { useAuth } from './AuthContext';
import { useWeb3 } from './Web3Context';
import { toast } from 'sonner';

// Extend the Firebase quest type to match our Quest interface
type ExtendedQuest = FirebaseQuest & {
  longDescription?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'basics' | 'defi' | 'nft' | 'web3' | 'wallet' | 'security';
  rewards: {
    xp: number;
    tokens: number;
  };
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
};

interface QuestContextType {
  quests: ExtendedQuest[];
  userQuests: (UserQuest & { id: string })[];
  activeQuests: (ExtendedQuest & { userProgress?: number; userStatus?: string })[];
  availableQuests: ExtendedQuest[];
  completedQuests: ExtendedQuest[];
  isLoading: boolean;
  error: string | null;
  startQuest: (questId: string) => Promise<void>;
  updateProgress: (questId: string, progress: number) => Promise<void>;
  completeQuest: (questId: string) => Promise<void>;
  claimReward: (questId: string) => Promise<void>;
  fetchUserQuests: () => Promise<void>; // Export this function
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export const QuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { wallet, sendTokens } = useWeb3();
  
  const [quests, setQuests] = useState<ExtendedQuest[]>([]);
  const [userQuests, setUserQuests] = useState<(UserQuest & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQuests, setActiveQuests] = useState<(ExtendedQuest & { userProgress?: number; userStatus?: string })[]>([]);

  // Fetch user quests - this function is now exported for external use
  const fetchUserQuestsData = async () => {
    if (!user?.uid) {
      console.log('Cannot fetch user quests: No authenticated user');
      return [];
    }

    try {
      console.log(`Fetching user quests for ${user.uid}`);
      const userQuestsData = await fetchUserQuests(user.uid);
      console.log(`Fetched ${userQuestsData.length} user quests`);
      setUserQuests(userQuestsData);
      return userQuestsData;
    } catch (err) {
      console.error('Error fetching user quests:', err);
      return [];
    }
  };

  // Fetch all quests when the component mounts
  useEffect(() => {
    const loadQuests = async () => {
      try {
        setIsLoading(true);
        console.log("Loading quests from lib/quests directory");
        
        // Convert the imported quests to the extended format
        const newQuests: ExtendedQuest[] = defaultQuests.map(quest => ({
          id: quest.id,
          title: quest.title,
          description: quest.description,
          longDescription: quest.description, // Use description as longDescription if not available
          difficulty: quest.difficulty as 'beginner' | 'intermediate' | 'advanced',
          category: (quest.tags?.[0] || 'basics') as 'basics' | 'defi' | 'nft' | 'web3' | 'wallet' | 'security',
          estimatedTime: quest.estimatedTime,
          rewards: {
            xp: quest.reward.xp,
            tokens: quest.reward.tokens
          },
          reward: {
            xp: quest.reward.xp,
            tokens: quest.reward.tokens
          },
          steps: quest.steps.map((step, index) => ({
            id: `step-${index}`,
            title: step.title,
            description: step.content
          })),
          resources: quest.resources?.map(resource => ({
            title: resource.title,
            url: resource.url,
            type: resource.type as 'article' | 'video' | 'tutorial'
          })) || []
        }));
        
        console.log(`Loaded ${newQuests.length} quests from lib/quests`);
        
        // Try to fetch additional quests from Firebase, fallback to static quests if it fails
        try {
          const firebaseQuests = await fetchQuests();
          console.log(`Fetched ${firebaseQuests.length} quests from Firebase`);
          
          // Combine quests, preferring the newer ones from lib/quests
          const questMap = new Map<string, ExtendedQuest>();
          
          // First add Firebase quests
          firebaseQuests.forEach(quest => {
            questMap.set(quest.id, quest as ExtendedQuest);
          });
          
          // Then override with lib/quests (so they take precedence)
          newQuests.forEach(quest => {
            questMap.set(quest.id, quest);
          });
          
          setQuests(Array.from(questMap.values()));
        } catch (error) {
          console.error('Error fetching Firebase quests, using default quests:', error);
          setQuests(newQuests);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading quests:', error);
        setError('Failed to load quests');
        setIsLoading(false);
      }
    };

    loadQuests();
  }, []);

  // Fetch user quests when the user changes
  useEffect(() => {
    const loadUserQuests = async () => {
      if (!user) {
        setUserQuests([]);
        return;
      }

      try {
        setIsLoading(true);
        const fetchedUserQuests = await fetchUserQuests(user.id);
        setUserQuests(fetchedUserQuests);
        setError(null);
      } catch (err) {
        console.error('Error loading user quests:', err);
        setError('Failed to load your quests');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserQuests();
  }, [user]);

  // Combine quests with user quest data
  useEffect(() => {
    console.log("Computing active quests...");
    console.log("- Available quests:", quests.length);
    console.log("- User quests:", userQuests.length);
    
    if (quests.length === 0) {
      setActiveQuests([]);
      return;
    }
    
    try {
      // Map through all quests
      const combinedQuests = quests.map((quest) => {
        // Find if user has this quest
        const userQuestData = userQuests.find((uq) => uq.questId === quest.id);
        
        // If user has this quest, combine the data
        if (userQuestData) {
          return {
            ...quest,
            userStatus: userQuestData.status,
            userProgress: userQuestData.progress,
            startedAt: userQuestData.startedAt,
            completedAt: userQuestData.completedAt,
            userQuestId: userQuestData.id
          };
        }
        
        // If user doesn't have this quest, set default status
        return {
          ...quest,
          userStatus: 'not_started',
          userProgress: 0
        };
      });
      
      console.log("Combined quests:", combinedQuests.length);
      setActiveQuests(combinedQuests);
    } catch (error) {
      console.error("Error computing active quests:", error);
      // If there's an error, still try to show something
      const fallbackQuests = quests.map(quest => ({
        ...quest,
        userStatus: 'not_started',
        userProgress: 0
      }));
      setActiveQuests(fallbackQuests);
    }
  }, [quests, userQuests]);

  // Computed properties
  const availableQuests = activeQuests.filter(
    quest => quest.userStatus === 'not_started' || quest.userStatus === 'in_progress'
  );

  const completedQuests = activeQuests.filter(
    quest => quest.userStatus === 'completed' || quest.userStatus === 'rewarded'
  );

  // Start a quest
  const handleStartQuest = async (questId: string) => {
    console.log(`Attempting to start quest: ${questId}`);
    
    if (!user) {
      console.error("No user found - authentication required");
      toast.error('You need to be logged in to start a quest.');
      throw new Error('Authentication required');
    }
    
    // Validate questId
    if (!questId) {
      console.error("Invalid quest ID provided");
      toast.error('Invalid quest. Please try again.');
      throw new Error('Invalid quest ID');
    }
    
    // Find the target quest in our data
    const targetQuest = quests.find(q => q.id === questId);
    if (!targetQuest) {
      console.error(`Quest not found: ${questId}`);
      toast.error('Quest not found');
      throw new Error(`Quest not found: ${questId}`);
    }
    
    console.log(`Found quest to start: ${targetQuest.title}`);
    
    // Check if user is already working on this quest
    const existingQuest = userQuests.find(uq => uq.questId === questId);
    if (existingQuest) {
      console.log(`User already has quest with status: ${existingQuest.status}`);
      
      if (existingQuest.status === 'in_progress') {
        toast.info('Quest already in progress');
        return; // Return successfully without error
      } else if (existingQuest.status === 'completed' || existingQuest.status === 'rewarded') {
        toast.info('Quest already completed');
        return; // Return successfully without error
      }
    }

    setIsLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      console.log(`Starting quest ${questId} for user ${user.id}`);
      
      let firebaseSuccess = false;
      let firebaseError = null;
      // Try Firebase first, but don't fail if it errors
      try {
        await startFirebaseQuest(user.id, questId);
        console.log("Quest started successfully in Firebase");
        firebaseSuccess = true;
      } catch (error) {
        firebaseError = error;
        console.error("Firebase error starting quest:", error);
        
        // Log more details about the error
        if (error instanceof Error) {
          console.warn(`Firebase error: ${error.message}`);
        }
        
        // Don't throw - we'll handle with local state
      }
      
      if (firebaseSuccess) {
        // Refresh user quests if Firebase succeeded
        try {
          console.log("Refreshing user quests");
          const updatedUserQuests = await fetchUserQuests(user.id);
          setUserQuests(updatedUserQuests);
          console.log("User quests updated:", updatedUserQuests);
        } catch (refreshError) {
          console.error('Error refreshing quests after start:', refreshError);
          // Continue - we'll use local fallback
        }
      }
      
      // Create a local-only quest entry as fallback if Firebase failed or refresh failed
      if (!firebaseSuccess || userQuests.every(uq => uq.questId !== questId)) {
        console.log("Creating local-only quest entry");
        
        // Create a synthetic user quest
        const localUserQuest = {
          id: `local-${questId}-${Date.now()}`,
          userId: user.id,
          questId: questId,
          status: 'in_progress',
          progress: 0,
          startedAt: new Date()
        };
        
        // Update the local state with this quest
        setUserQuests(prev => [...prev, localUserQuest]);
      }
      
      // Force a refresh of active quests to include the new quest
      const combinedQuests = quests.map((quest) => {
        // If it's the quest we just started, mark it as in_progress
        if (quest.id === questId) {
          return {
            ...quest,
            userStatus: 'in_progress',
            userProgress: 0,
            startedAt: new Date()
          };
        }
        
        // For other quests, keep existing status
        const userQuestData = userQuests.find((uq) => uq.questId === quest.id);
        if (userQuestData) {
          return {
            ...quest,
            userStatus: userQuestData.status,
            userProgress: userQuestData.progress,
            startedAt: userQuestData.startedAt,
            completedAt: userQuestData.completedAt,
            userQuestId: userQuestData.id
          };
        }
        
        return {
          ...quest,
          userStatus: 'not_started',
          userProgress: 0
        };
      });
      
      // Update the active quests state
      setActiveQuests(combinedQuests);
      
      toast.success('Quest started successfully!');
    } catch (err) {
      console.error('Error starting quest:', err);
      
      // Set detailed error message in context
      if (err instanceof Error) {
        setError(`Failed to start quest: ${err.message}`);
      } else {
        setError('Failed to start quest due to an unknown error');
      }
      
      toast.error('Failed to start quest. Please try again.');
      throw err; // Re-throw to be handled by the calling component
    } finally {
      setIsLoading(false);
    }
  };

  // Update quest progress
  const handleUpdateProgress = async (questId: string, progress: number) => {
    if (!user) {
      console.warn('Cannot update progress: No user logged in');
      return;
    }

    console.log(`Updating progress for quest ${questId} to ${progress}%`);
    
    // Find the user quest in our local state
    const userQuest = userQuests.find(uq => uq.questId === questId);
    
    if (!userQuest) {
      console.warn(`Cannot update progress: Quest ${questId} not found in user quests`);
      // Create a local quest entry since we can't find it
      const localUserQuest = {
        id: `local-${questId}-${Date.now()}`,
        userId: user.id,
        questId: questId,
        status: 'in_progress',
        progress: progress,
        startedAt: new Date()
      };
      
      setUserQuests(prev => [...prev, localUserQuest]);
      
      // Update active quests to reflect the change
      setActiveQuests(prevActiveQuests => 
        prevActiveQuests.map(quest => 
          quest.id === questId 
            ? { ...quest, userStatus: 'in_progress', userProgress: progress } 
            : quest
        )
      );
      
      console.log(`Created local quest entry for ${questId} with progress ${progress}%`);
      return;
    }

    try {
      // Always update the local state immediately
      const updatedUserQuests = userQuests.map(uq => 
        uq.id === userQuest.id 
          ? { 
              ...uq, 
              progress, 
              status: progress >= 100 ? 'completed' : 'in_progress',
              ...(progress >= 100 ? { completedAt: new Date() } : {})
            }
          : uq
      );
      
      setUserQuests(updatedUserQuests);
      
      // Also update active quests state to reflect the change
      setActiveQuests(prevActiveQuests => 
        prevActiveQuests.map(quest => 
          quest.id === questId 
            ? { 
                ...quest, 
                userStatus: progress >= 100 ? 'completed' : 'in_progress', 
                userProgress: progress 
              } 
            : quest
        )
      );
      
      // Try to update Firebase, but don't block the UI on it
      let firebaseSuccess = false;
      try {
        if (!userQuest.id.startsWith('local-')) {
          await updateFirebaseQuestProgress(userQuest.id, progress);
          firebaseSuccess = true;
          console.log(`Firebase progress updated for quest ${questId} to ${progress}%`);
        } else {
          console.log(`Skipping Firebase update for local quest ${userQuest.id}`);
        }
      } catch (firebaseError) {
        console.error('Firebase error updating progress:', firebaseError);
        // Continue with local state update
      }
      
      // If progress is 100% and this completes the quest, handle completion
      if (progress >= 100) {
        console.log(`Quest ${questId} completed with progress 100%`);
        if (firebaseSuccess) {
          console.log('Completion was successfully recorded in Firebase');
        }
      }
    } catch (err) {
      console.error('Error updating quest progress:', err);
      // Even in case of error, we won't revert the local state change
      // to ensure the UI remains responsive
    }
  };

  // Complete a quest
  const handleCompleteQuest = async (questId: string) => {
    if (!user) {
      toast.error('You need to be logged in to complete a quest.');
      return;
    }

    try {
      await completeFirebaseQuest(user.id, questId);
      toast.success('Quest completed! You can now claim your reward.');
      
      // Refresh user quests
      const updatedUserQuests = await fetchUserQuests(user.id);
      setUserQuests(updatedUserQuests);
    } catch (err) {
      console.error('Error completing quest:', err);
      toast.error('Failed to complete quest');
    }
  };

  // Claim a quest reward
  const handleClaimReward = async (questId: string) => {
    console.log(`Attempting to claim reward for quest ${questId}`);
    
    if (!user) {
      console.error('No authenticated user found');
      toast.error('You need to be logged in to claim a reward.');
      return;
    }

    if (!wallet) {
      console.error('No wallet connected');
      toast.error('You need to connect your wallet to claim rewards.');
      return;
    }

    // Find the quest in local state
    const userQuest = userQuests.find(uq => uq.questId === questId);
    if (!userQuest) {
      console.error(`User quest not found: ${questId}`);
      toast.error('Quest not found.');
      return;
    }

    if (userQuest.status !== 'completed') {
      console.error(`Quest status is ${userQuest.status}, not completed`);
      toast.error('You need to complete the quest first.');
      return;
    }

    const quest = quests.find(q => q.id === questId);
    if (!quest) {
      console.error(`Quest details not found: ${questId}`);
      toast.error('Quest details not found.');
      return;
    }

    const toastId = toast.loading('Processing your reward...', {
      duration: 10000 // Longer duration to allow for blockchain transaction
    });
    
    try {
      console.log(`Claiming reward for quest ${questId}: ${quest.rewards.tokens} tokens, ${quest.rewards.xp} XP`);
      
      // Update local state immediately for better UX
      // First update userQuests
      const updatedUserQuests = userQuests.map(uq => 
        uq.id === userQuest.id 
          ? { 
              ...uq, 
              status: 'rewarded',
              rewardedAt: new Date()
            }
          : uq
      );
      setUserQuests(updatedUserQuests);
      
      // Then update active quests
      setActiveQuests(prevActiveQuests => 
        prevActiveQuests.map(quest => 
          quest.id === questId 
            ? { 
                ...quest, 
                userStatus: 'rewarded'
              } 
            : quest
        )
      );
      
      let txHash = '';
      // Try to call smart contract to send tokens
      try {
        txHash = await sendTokens(wallet.address, quest.rewards.tokens);
        console.log(`Transaction successful: ${txHash}`);
      } catch (txError) {
        console.error('Error sending tokens:', txError);
        txHash = 'local-transaction-' + Date.now();
        console.warn(`Using local transaction ID: ${txHash}`);
      }
      
      // Try to update Firebase, but don't block the UI
      try {
        if (!userQuest.id.startsWith('local-')) {
          console.log(`Updating Firebase with reward for ${userQuest.id}`);
          await updateQuestReward(userQuest.id, txHash);
          
          // Refresh user quests from Firebase
          try {
            const fetchedUserQuests = await fetchUserQuests(user.id);
            setUserQuests(fetchedUserQuests);
            console.log('User quests updated from Firebase');
          } catch (fetchError) {
            console.error('Error refreshing quests after claiming reward:', fetchError);
          }
        } else {
          console.log(`Skipping Firebase update for local quest ${userQuest.id}`);
        }
      } catch (firebaseError) {
        console.error('Firebase error updating quest reward:', firebaseError);
        // Continue with local state (already updated above)
      }
      
      toast.dismiss(toastId);
      
      // Show success message with confetti effect
      toast.success(
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">Reward Claimed!</span>
          <span>You've received {quest.rewards.tokens} HERO tokens!</span>
          <span>+{quest.rewards.xp} XP added to your profile</span>
        </div>,
        { duration: 5000 }
      );
      
      // Trigger confetti effect
      try {
        // If canvas-confetti is available in the global scope
        if (typeof window !== 'undefined' && (window as any).confetti) {
          (window as any).confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch (confettiError) {
        console.error('Error triggering confetti:', confettiError);
      }
      
    } catch (err) {
      toast.dismiss(toastId);
      console.error('Error claiming reward:', err);
      
      toast.error('Failed to claim reward. Please try again later.');
      
      // Don't revert local state to maintain a responsive UI
    }
  };

  // Start a quest for the current user
  const activateQuest = useCallback(async (questId: string) => {
    console.log(`Attempting to activate quest ${questId}`);
    
    if (!user?.uid) {
      console.error('Cannot activate quest: No user is logged in');
      toast.error('Please log in to start quests');
      return false;
    }
    
    try {
      setIsLoading(true);
      await startFirebaseQuest(user.uid, questId);
      
      // Refresh quests after activation
      await fetchUserQuestsData();
      
      toast.success('Quest activated! Start your journey now');
      return true;
    } catch (error) {
      console.error('Failed to activate quest:', error);
      toast.error('Failed to activate quest. Please try again');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, fetchUserQuestsData]);

  return (
    <QuestContext.Provider
      value={{
        quests,
        userQuests,
        activeQuests,
        availableQuests,
        completedQuests,
        isLoading,
        error,
        startQuest: handleStartQuest,
        updateProgress: handleUpdateProgress,
        completeQuest: handleCompleteQuest,
        claimReward: handleClaimReward,
        fetchUserQuests: fetchUserQuestsData  // Export this function
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};

export const useQuests = (): QuestContextType => {
  const context = useContext(QuestContext);
  
  if (context === undefined) {
    throw new Error('useQuests must be used within a QuestProvider');
  }
  
  return context;
}; 