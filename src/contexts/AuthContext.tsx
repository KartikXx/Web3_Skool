import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmail, 
  signOutUser as firebaseSignOut,
  createUserWithEmail,
  createUserProfile,
  auth
} from '@/lib/firebase';
import { User } from 'firebase/auth';

type SignInData = {
  email: string;
  password: string;
};

type SignUpData = {
  name: string;
  email: string;
  password: string;
};

type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signInUser: (data: SignInData) => Promise<boolean>;
  signUpUser: (data: SignUpData) => Promise<boolean>;
  signOutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for stored auth on mount and listen for auth changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || undefined,
        });
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const signInUser = async (data: SignInData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userCredential = await signInWithEmail(data.email, data.password);
      const firebaseUser = userCredential.user;
      
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || undefined,
      });
      
      return true;
    } catch (err: any) {
      const errorCode = err.code;
      let errorMessage = 'An error occurred during sign in';
      
      if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
        errorMessage = 'Invalid email or password';
      } else if (errorCode === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      } else if (errorCode === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later';
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpUser = async (data: SignUpData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmail(data.email, data.password);
      const firebaseUser = userCredential.user;
      
      // Create a user profile in Firestore
      await createUserProfile(firebaseUser.uid, {
        displayName: data.name,
        email: data.email,
        tokens: 0,
        questsCompleted: 0,
      });
      
      // Update local state
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: data.name,
      });
      
      return true;
    } catch (err: any) {
      const errorCode = err.code;
      let errorMessage = 'An error occurred during sign up';
      
      if (errorCode === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use';
      } else if (errorCode === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      } else if (errorCode === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOutUser = () => {
    firebaseSignOut();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
        signInUser,
        signUpUser,
        signOutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Re-export these types for use elsewhere
export type { SignInData, SignUpData }; 