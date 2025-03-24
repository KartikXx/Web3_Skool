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
    console.log("Setting up Firebase auth state listener");
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      console.log("Firebase auth state changed:", firebaseUser ? "Logged in" : "Logged out");
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
      console.log("Attempting to sign in user with email:", data.email);
      
      // Normalize email by trimming and converting to lowercase
      const normalizedEmail = data.email.trim().toLowerCase();
      
      const userCredential = await signInWithEmail(normalizedEmail, data.password);
      const firebaseUser = userCredential.user;
      
      console.log("Sign in successful for user:", firebaseUser.uid);
      
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || undefined,
      });
      
      return true;
    } catch (err: any) {
      const errorCode = err.code;
      let errorMessage = 'An error occurred during sign in';
      
      console.error("Sign in error:", errorCode, err.message);
      
      if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
        errorMessage = 'Invalid email or password';
      } else if (errorCode === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      } else if (errorCode === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later';
      } else if (errorCode === 'auth/invalid-credential') {
        errorMessage = 'Invalid credentials. Please check your email and password.';
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
      console.log("Attempting to create new user with email:", data.email);
      
      // Normalize email by trimming and converting to lowercase
      const normalizedEmail = data.email.trim().toLowerCase();
      
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmail(normalizedEmail, data.password);
      const firebaseUser = userCredential.user;
      
      console.log("User created successfully:", firebaseUser.uid);
      
      // Create a user profile in Firestore
      await createUserProfile(firebaseUser.uid, {
        displayName: data.name,
        email: normalizedEmail,
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
      
      console.error("Sign up error:", errorCode, err.message);
      
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
    console.log("Signing out user");
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