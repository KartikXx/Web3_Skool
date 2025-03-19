import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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
export const signInWithEmail = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);

export const createUserWithEmail = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password);

export const signOutUser = () => signOut(auth);

// User management
export const createUserProfile = async (userId: string, data: any) => {
  await setDoc(doc(db, 'users', userId), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const getUserProfile = async (userId: string) => {
  const docSnap = await getDoc(doc(db, 'users', userId));
  return docSnap.exists() ? docSnap.data() : null;
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

// Quests
export const getQuests = async () => {
  const querySnapshot = await getDocs(collection(db, 'quests'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const startQuest = async (userId: string, questId: string) => {
  await setDoc(doc(db, 'userQuests', `${userId}_${questId}`), {
    userId,
    questId,
    startedAt: new Date(),
    completed: false
  });
};

export const completeQuest = async (userId: string, questId: string, rewardAmount: number) => {
  // Mark quest as completed
  await updateDoc(doc(db, 'userQuests', `${userId}_${questId}`), {
    completed: true,
    completedAt: new Date()
  });
  
  // Get current user data
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    const userData = userDoc.data();
    
    // Update user tokens and completed quests
    await updateDoc(doc(db, 'users', userId), {
      tokens: (userData.tokens || 0) + rewardAmount,
      questsCompleted: (userData.questsCompleted || 0) + 1,
      updatedAt: new Date()
    });
  }
};

// Leaderboard
export const getLeaderboard = async (sortBy = 'tokens', limitCount = 10) => {
  const fieldToSort = sortBy === 'tokens' ? 'tokens' : 'questsCompleted';
  
  const q = query(
    collection(db, 'users'),
    orderBy(fieldToSort, 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Achievements
export const unlockAchievement = async (userId: string, achievementId: string) => {
  const achievementDoc = await getDoc(doc(db, 'achievements', achievementId));
  
  if (achievementDoc.exists()) {
    // Add to user's achievements
    await setDoc(doc(db, 'userAchievements', `${userId}_${achievementId}`), {
      userId,
      achievementId,
      unlockedAt: new Date()
    });
    
    // Get the achievement data
    const achievementData = achievementDoc.data();
    
    // If achievement has token rewards, update user's tokens
    if (achievementData.tokenReward) {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        await updateDoc(doc(db, 'users', userId), {
          tokens: (userData.tokens || 0) + achievementData.tokenReward,
          updatedAt: new Date()
        });
      }
    }
  }
};

export const getUserAchievements = async (userId: string) => {
  const q = query(
    collection(db, 'userAchievements'),
    where('userId', '==', userId)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

export { auth, db, storage };
export default app; 