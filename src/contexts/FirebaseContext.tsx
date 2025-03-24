import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db, getUserProfile, createUserProfile, initializeDefaultUserProfile } from '@/lib/firebase';
import { doc, onSnapshot, collection, orderBy, query, limit, getDoc, setDoc, updateDoc, Timestamp, serverTimestamp, where } from 'firebase/firestore';

interface FirebaseContextType {
  currentUser: User | null;
  userProfile: any | null;
  isLoadingAuth: boolean;
  isLoadingProfile: boolean;
  refreshUserProfile: (forceRefresh?: boolean) => Promise<any>;
  leaderboardData: any[];
  isLoadingLeaderboard: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<number>(0);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

  // Function to manually refresh the user profile with force flag to bypass cache
  const refreshUserProfile = useCallback(async (forceRefresh = true) => {
    if (!currentUser) {
      console.warn('Cannot refresh profile: No user logged in');
      return null;
    }

    try {
      console.log(`Manually refreshing profile for ${currentUser.uid}, force=${forceRefresh}`);
      setIsLoadingProfile(true);
      
      // Get fresh profile data
      const profile = await getUserProfile(currentUser.uid);
      
      if (profile) {
        setUserProfile(profile);
        console.log('Profile refreshed successfully:', profile);
        setLastRefreshedAt(Date.now());
        setIsLoadingProfile(false);
        return profile;
      } else {
        // Handle case where profile doesn't exist
        console.log('No profile found during manual refresh, initializing default');
        const result = await initializeDefaultUserProfile(currentUser.uid);
        
        if (result.success) {
          setUserProfile(result.data);
          console.log('Default profile initialized during refresh:', result.data);
        } else {
          console.error('Failed to initialize default profile during refresh');
        }
        
        setLastRefreshedAt(Date.now());
        setIsLoadingProfile(false);
        return result.data || null;
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      setIsLoadingProfile(false);
      return null;
    }
  }, [currentUser]);

  // Listen for Firebase auth state changes
  useEffect(() => {
    console.log('Setting up auth state change listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User ${user.uid} logged in` : 'User logged out');
      setCurrentUser(user);
      setIsLoadingAuth(false);

      // If user logs out, clear the profile data
      if (!user) {
        setUserProfile(null);
        setIsLoadingProfile(false);
        return;
      }

      try {
        // Set up real-time listener for user profile
        const userDocRef = doc(db, 'users', user.uid);

        // Start a real-time listener for user profile updates
        const unsubscribeProfile = onSnapshot(userDocRef, (docSnapshot) => {
          console.log('User profile data updated:', docSnapshot.id);

          if (docSnapshot.exists()) {
            const userData = docSnapshot.data() as UserProfile;
            setUserProfile(userData);
            setIsLoadingProfile(false);
          } else {
            console.log('User profile does not exist, initializing default profile');
            // Initialize default profile if it doesn't exist
            initializeDefaultUserProfile(user.uid)
              .then((result) => {
                console.log('Default profile created successfully');
                if (result && result.data) {
                  setUserProfile(result.data);
                }
                setIsLoadingProfile(false);
              })
              .catch((error) => {
                console.error('Error creating default profile:', error);
                setIsLoadingProfile(false);
              });
          }
        }, (error) => {
          console.error('Error in profile snapshot listener:', error);
          setIsLoadingProfile(false);
        });

        // Clean up the profile listener when the component unmounts or user changes
        return () => {
          unsubscribeProfile();
        };
      } catch (error) {
        console.error('Error in auth state change handler:', error);
        setIsLoadingProfile(false);
      }
    });

    // Clean up the auth listener when the component unmounts
    return () => unsubscribe();
  }, []);
  
  // Set up real-time listener for leaderboard data
  useEffect(() => {
    if (!currentUser) return;
    
    console.log('Setting up leaderboard real-time listener');
    setIsLoadingLeaderboard(true);
    
    // Create a query for the top 20 users by tokens
    const leaderboardQuery = query(
      collection(db, 'users'),
      orderBy('tokens', 'desc'),
      limit(20)
    );
    
    // Start listening for real-time updates
    const unsubscribeLeaderboard = onSnapshot(leaderboardQuery, (querySnapshot) => {
      console.log('Leaderboard data updated, got', querySnapshot.size, 'users');
      
      const users: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserProfile;
        users.push({
          ...userData,
          id: doc.id, // Include the document ID
        });
      });
      
      setLeaderboardData(users);
      setIsLoadingLeaderboard(false);
    }, (error) => {
      console.error('Error in leaderboard listener:', error);
      setIsLoadingLeaderboard(false);
    });
    
    // Clean up the listener when the component unmounts
    return () => {
      unsubscribeLeaderboard();
    };
  }, [currentUser]);

  // Periodically refresh the user profile data to ensure it's up to date
  useEffect(() => {
    if (!currentUser) return;

    // Refresh every 15 seconds 
    const refreshInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefreshedAt;
      
      // Only refresh if it's been more than 15 seconds since the last refresh
      if (timeSinceLastRefresh > 15000) {
        console.log('Periodic profile refresh triggered');
        refreshUserProfile(true);
      }
    }, 15000);

    return () => clearInterval(refreshInterval);
  }, [currentUser, lastRefreshedAt, refreshUserProfile]);
  
  return (
    <FirebaseContext.Provider
      value={{
        currentUser,
        userProfile,
        isLoadingAuth,
        isLoadingProfile,
        refreshUserProfile,
        leaderboardData,
        isLoadingLeaderboard
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