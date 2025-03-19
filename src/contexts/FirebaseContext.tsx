import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db, getUserProfile, createUserProfile } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface FirebaseContextType {
  currentUser: User | null;
  userProfile: any | null;
  isLoadingAuth: boolean;
  isLoadingProfile: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
      
      if (user) {
        // Get user profile data
        try {
          const profile = await getUserProfile(user.uid);
          
          if (!profile) {
            // Create a new profile if it doesn't exist
            await createUserProfile(user.uid, {
              displayName: user.displayName || user.email?.split('@')[0],
              email: user.email,
              tokens: 0,
              questsCompleted: 0,
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Set up real-time listener for user profile
  useEffect(() => {
    if (!currentUser) {
      setIsLoadingProfile(false);
      return;
    }
    
    const unsubscribe = onSnapshot(
      doc(db, 'users', currentUser.uid),
      (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data());
        } else {
          setUserProfile(null);
        }
        setIsLoadingProfile(false);
      },
      (error) => {
        console.error('Error getting user profile:', error);
        setIsLoadingProfile(false);
      }
    );
    
    return () => unsubscribe();
  }, [currentUser]);
  
  return (
    <FirebaseContext.Provider
      value={{
        currentUser,
        userProfile,
        isLoadingAuth,
        isLoadingProfile
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  
  return context;
}; 