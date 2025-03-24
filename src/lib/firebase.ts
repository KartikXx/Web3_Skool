import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, query, where, orderBy, limit, increment, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Timestamp } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDlgOr9ktCLObXSOK1xl18VtzEP4l-z0g",
  authDomain: "blockchain-heroes.firebaseapp.com",
  projectId: "blockchain-heroes",
  storageBucket: "blockchain-heroes.firebasestorage.app",
  messagingSenderId: "794939647914",
  appId: "1:794939647914:web:b0f7b12787fa0e64ee2dd3",
  measurementId: "G-RR83CTYBJC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;

// Initialize analytics only in browser environment
if (typeof window !== 'undefined') {
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  }).catch(error => {
    console.error('Analytics failed to load:', error);
  });
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Auth functions
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`Attempting Firebase login with email: ${normalizedEmail}`);
    
    const result = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    console.log('Firebase login successful');
    return result;
  } catch (error: any) {
    console.error('Firebase login error:', error.code, error.message);
    
    // Add more detailed error messaging
    if (error.code === 'auth/user-not-found') {
      console.error('No user found with this email address');
    } else if (error.code === 'auth/wrong-password') {
      console.error('Incorrect password provided');
    } else if (error.code === 'auth/invalid-credential') {
      console.error('Invalid credentials');
    } else if (error.code === 'auth/invalid-email') {
      console.error('Invalid email format');
    }
    
    throw error;
  }
};

export const createUserWithEmail = async (email: string, password: string) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`Attempting to create Firebase user with email: ${normalizedEmail}`);
    
    const result = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    console.log('Firebase user creation successful');
    return result;
  } catch (error: any) {
    console.error('Firebase user creation error:', error.code, error.message);
    throw error;
  }
};

export const signOutUser = () => signOut(auth);

// User management
export const createUserProfile = async (userId: string, data: any) => {
  await setDoc(doc(db, 'users', userId), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

// Get user profile from Firebase
export const getUserProfile = async (userId: string) => {
  try {
    console.log(`Getting user profile for ${userId} from Firebase...`);
    
    // Get the document
    const docSnap = await getDoc(doc(db, 'users', userId));
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(`Profile found for ${userId}:`, data);
      return data;
    } else {
      console.log(`No profile found for ${userId}, will need to initialize`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, data: any) => {
  await updateDoc(doc(db, 'users', userId), {
    ...data,
    updatedAt: new Date(),
  });
};

// Connect wallet address to user
export const connectWalletToUser = async (userId: string, walletAddress: string) => {
  await updateDoc(doc(db, 'users', userId), {
    walletAddress,
    updatedAt: new Date(),
  });
};

// Quest Types
export interface Quest {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  requirements?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reward: {
    tokens: number;
    xp: number;
    badges?: string[];
  };
  rewards?: {
    tokens: number;
    xp: number;
  };
  imageUrl?: string;
  category: string;
  estimatedTime: string; // e.g., "10 minutes", "1 hour"
  isActive?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  steps?: {
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
}

export interface UserQuest {
  userId: string;
  questId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'rewarded';
  progress?: number; // 0-100 percentage
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  rewardedAt?: Timestamp;
  transactionHash?: string; // Blockchain transaction hash for the reward
}

// Quest Collections References
export const questsCollection = collection(db, 'quests');
export const userQuestsCollection = collection(db, 'userQuests');

// Quest Functions
export const fetchQuests = async (): Promise<Quest[]> => {
  try {
    const q = query(
      questsCollection,
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Quest));
  } catch (error) {
    console.error('Error fetching quests:', error);
    throw error;
  }
};

export const fetchQuestById = async (questId: string): Promise<Quest | null> => {
  try {
    const docRef = doc(db, 'quests', questId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Quest;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching quest ${questId}:`, error);
    throw error;
  }
};

export const fetchUserQuests = async (userId: string): Promise<UserQuest[]> => {
  try {
    // Check if userId is undefined or null and handle gracefully
    if (!userId) {
      console.warn('fetchUserQuests called with undefined userId');
      return [];
    }

    const q = query(
      userQuestsCollection,
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<UserQuest, 'id'>;
      return {
        id: doc.id,
        ...data
      } as UserQuest & { id: string };
    });
  } catch (error) {
    console.error(`Error fetching quests for user ${userId}:`, error);
    throw error;
  }
};

export const startQuest = async (userId: string, questId: string): Promise<void> => {
  try {
    // Enhanced validation
    if (!userId || typeof userId !== 'string') {
      throw new Error(`Invalid userId: ${userId}`);
    }
    
    if (!questId || typeof questId !== 'string') {
      throw new Error(`Invalid questId: ${questId}`);
    }
    
    console.log(`Firebase: Starting quest ${questId} for user ${userId}`);
    
    // Check if user already has this quest
    try {
      const existingQuestQuery = query(
        userQuestsCollection,
        where('userId', '==', userId),
        where('questId', '==', questId)
      );
      
      const existingQuestSnapshot = await getDocs(existingQuestQuery);
      
      // If user already has this quest, update it instead of creating a new one
      if (!existingQuestSnapshot.empty) {
        const existingQuest = existingQuestSnapshot.docs[0];
        const existingQuestData = existingQuest.data() as UserQuest;
        
        console.log(`Found existing quest with status: ${existingQuestData.status}`);
        
        // Only update if not already completed
        if (existingQuestData.status === 'not_started') {
          console.log(`Updating existing quest to in_progress`);
          try {
            await updateDoc(doc(db, 'userQuests', existingQuest.id), {
              status: 'in_progress',
              startedAt: Timestamp.now(),
              progress: 0
            });
            console.log('Quest status updated successfully');
            return;
          } catch (updateError: any) {
            console.error('Error updating existing quest:', updateError);
            
            // Provide more details about the error
            let errorMessage = 'Error updating quest status';
            if (updateError.code) {
              errorMessage += ` [${updateError.code}]`;
            }
            
            if (updateError.message) {
              // If it's a permission error, we can potentially continue for development
              if (updateError.message.includes('permission') || 
                  updateError.code === 'permission-denied') {
                console.warn('Firebase permission error - development environment may still work locally');
                // Return without throwing to allow local-only operation
                return;
              }
            }
            
            throw new Error(errorMessage);
          }
        } else {
          // Quest already exists with a valid status, no need to update
          console.log(`Quest already exists with status ${existingQuestData.status} - no update needed`);
          return;
        }
      }
    } catch (queryError: any) {
      console.error('Error querying existing quests:', queryError);
      
      // Provide more details about the error
      let errorMessage = 'Error checking existing quests';
      if (queryError.code) {
        errorMessage += ` [${queryError.code}]`;
      }
      
      if (queryError.message) {
        // If it's a permission error, we can potentially continue for development
        if (queryError.message.includes('permission') || 
            queryError.code === 'permission-denied') {
          console.warn('Firebase permission error - development environment may still work locally');
          // Return without throwing to allow local-only operation
          return;
        }
      }
      
      throw new Error(errorMessage);
    }
    
    // Create a new quest entry
    console.log(`Creating new quest entry for ${questId}`);
    
    try {
      const userQuestRef = doc(userQuestsCollection);
      
      // Create a valid document with required fields
      const questData = {
    userId,
    questId,
        status: 'in_progress',
        progress: 0,
        startedAt: Timestamp.now(),
      };
      
      await setDoc(userQuestRef, questData);
      
      console.log(`Quest successfully started with ID: ${userQuestRef.id}`);
    } catch (docError: any) {
      console.error('Error creating quest document:', docError);
      
      // Provide more details about the error
      let errorMessage = 'Error creating quest document';
      if (docError.code) {
        errorMessage += ` [${docError.code}]`;
      }
      
      if (docError.message) {
        // If it's a permission error, we can potentially continue for development
        if (docError.message.includes('permission') || 
            docError.code === 'permission-denied') {
          console.warn('Firebase permission error - development environment may still work locally');
          // Return without throwing to allow local-only operation
          return;
        }
        
        errorMessage += `: ${docError.message}`;
      }
      
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(`Error starting quest ${questId} for user ${userId}:`, error);
    // Rethrow with better message for debugging
    if (error instanceof Error) {
      throw new Error(`Start quest failed: ${error.message}`);
    } else {
      throw new Error(`Start quest failed with unknown error`);
    }
  }
};

export const updateQuestProgress = async (
  userQuestId: string, 
  progress: number
): Promise<void> => {
  try {
    const userQuestRef = doc(db, 'userQuests', userQuestId);
    
    await updateDoc(userQuestRef, {
      progress,
      status: progress >= 100 ? 'completed' : 'in_progress',
      ...(progress >= 100 ? { completedAt: Timestamp.now() } : {}),
    });
  } catch (error) {
    console.error(`Error updating progress for quest ${userQuestId}:`, error);
    throw error;
  }
};

export const completeQuest = async (
  userId: string, 
  questId: string
): Promise<string> => {
  try {
    // Find the user quest document
    const q = query(
      userQuestsCollection,
      where('userId', '==', userId),
      where('questId', '==', questId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Create a new completed quest record
      const userQuestRef = doc(userQuestsCollection);
      
      await setDoc(userQuestRef, {
        userId,
        questId,
        status: 'completed',
        progress: 100,
        startedAt: Timestamp.now(),
        completedAt: Timestamp.now(),
      });
      
      return userQuestRef.id;
    } else {
      // Update existing quest record
      const userQuestDoc = querySnapshot.docs[0];
      const userQuestRef = doc(db, 'userQuests', userQuestDoc.id);
      
      await updateDoc(userQuestRef, {
        status: 'completed',
        progress: 100,
        completedAt: Timestamp.now(),
      });
      
      return userQuestDoc.id;
    }
  } catch (error) {
    console.error(`Error completing quest ${questId} for user ${userId}:`, error);
    throw error;
  }
};

export const updateQuestReward = async (
  userQuestId: string,
  transactionHash: string
): Promise<void> => {
  console.log(`Updating quest reward for userQuestId: ${userQuestId}, tx: ${transactionHash}`);
  
  try {
    const userQuestRef = doc(db, 'userQuests', userQuestId);
    
    // First, get the current status to ensure we're not double-rewarding
    const userQuestSnapshot = await getDoc(userQuestRef);
    if (!userQuestSnapshot.exists()) {
      throw new Error(`User quest ${userQuestId} not found`);
    }
    
    const userQuestData = userQuestSnapshot.data() as UserQuest;
    
    // Skip if already rewarded
    if (userQuestData.status === 'rewarded') {
      console.log(`Quest ${userQuestId} already rewarded, skipping update`);
      return;
    }
    
    console.log(`Updating quest status to 'rewarded'`);
    // Update quest status to rewarded
    await updateDoc(userQuestRef, {
      status: 'rewarded',
      transactionHash,
      rewardedAt: Timestamp.now(),
    });

    // Get the quest details to update user profile
    const questDoc = await getDoc(doc(db, 'quests', userQuestData.questId));
    if (!questDoc.exists()) {
      console.warn(`Quest ${userQuestData.questId} not found, using default rewards`);
      // Use default rewards if quest not found (fallback)
      await updateUserProfileStats(
        userQuestData.userId, 
        { 
          tokens: 50, 
          xp: 100 
        }
      );
      return;
    }
    
    const questData = questDoc.data() as Quest;
    console.log(`Found quest data for ${questData.title}, awarding:`, questData.reward);
    
    // Update user profile with rewards
    await updateUserProfileStats(
      userQuestData.userId, 
      questData.reward
    );
    
    // Update leaderboard stats
    await updateLeaderboardStats(userQuestData.userId, questData.reward);
    
    console.log(`Successfully updated user stats and leaderboard for ${userQuestData.userId}`);
  } catch (error) {
    console.error(`Error recording reward for quest ${userQuestId}:`, error);
    
    // Only throw for critical errors that should stop execution
    // For database errors, we prefer to continue with local state
    if (error instanceof Error) {
      if (error.message.includes('permission-denied') || 
          error.message.includes('not found')) {
        console.warn(`Firebase permission error - continuing with local state`);
        return; // Allow the app to continue with local state
      }
    }
    
    throw error;
  }
};

// Helper function to update user profile stats
const updateUserProfileStats = async (
  userId: string,
  reward: { tokens: number; xp: number }
): Promise<void> => {
  try {
    console.log(`Updating profile stats for user ${userId}: +${reward.tokens} tokens, +${reward.xp} XP`);
    
    const userRef = doc(db, 'users', userId);
    
    // Get current user data first to determine level up
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      console.error(`User ${userId} not found`);
      return;
    }
    
    const userData = userDoc.data();
    const currentXP = userData.xp || 0;
    const newXP = currentXP + reward.xp;
    
    // Calculate current and new levels (example level formula)
    const currentLevel = Math.floor(currentXP / 100) + 1;
    const newLevel = Math.floor(newXP / 100) + 1;
    
    // Update user profile
    await updateDoc(userRef, {
      tokens: increment(reward.tokens),
      xp: increment(reward.xp),
      questsCompleted: increment(1),
      level: newLevel,
      updatedAt: Timestamp.now()
    });
    
    // Check if user leveled up
    if (newLevel > currentLevel) {
      console.log(`User ${userId} leveled up to ${newLevel}!`);
      
      // Could trigger notifications or additional rewards here
      // For now, just log the event
    }
  } catch (error) {
    console.error(`Error updating user stats for ${userId}:`, error);
    // Don't throw to avoid breaking the reward flow
  }
};

// Helper function to update leaderboard stats if needed
const updateLeaderboardStats = async (
  userId: string,
  reward: { tokens: number; xp: number }
): Promise<void> => {
  try {
    // If you have a separate leaderboard collection, update it here
    // For now, we'll just log that we would update it
    console.log(`Would update leaderboard stats for user ${userId}`);
    
    // If you have any weekly or monthly leaderboards, you could update them here
  } catch (error) {
    console.error(`Error updating leaderboard for ${userId}:`, error);
    // Don't throw to avoid breaking the reward flow
  }
};

// Add this new function below the createUserProfile function
export const initializeDefaultUserProfile = async (userId: string) => {
  try {
    if (!userId) {
      console.error('Cannot initialize user profile: User ID is undefined');
      return { success: false, error: 'User ID is undefined' };
    }

    // Check if user profile already exists to avoid overwriting
    const existingProfile = await getUserProfile(userId);
    
    if (existingProfile) {
      console.log(`User profile for ${userId} already exists, not reinitializing`);
      return { success: true, data: existingProfile };
    }
    
    console.log(`Initializing default profile for user ${userId}`);
    
    // Create a new user profile with default values
    const userDocRef = doc(db, 'users', userId);
    
    const defaultProfile = {
      displayName: 'Blockchain Explorer',
      email: '',
      photoURL: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      xp: 50,  // Default XP
      level: 1,
      tokens: 10, // Default HERO tokens
      completedQuests: 0,
      achievements: []
    };
    
    await setDoc(userDocRef, defaultProfile);
    
    // Return the created profile with correct typing
    return { 
      success: true, 
      data: {
        ...defaultProfile,
        createdAt: new Date(),
        updatedAt: new Date()
      } 
    };
  } catch (error) {
    console.error('Error initializing default user profile:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Make sure we export the Firebase services
export { auth, db, storage };
export default app;