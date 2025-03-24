import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useAuthentication } from '@/hooks/use-authentication';

export const AuthForms: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const initialTab = location.pathname === '/sign-up' ? 'sign-up' : 'sign-in';
  
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useAuthentication();

  const [signInFormData, setSignInFormData] = useState({
    email: '',
    password: '',
  });

  const [signUpFormData, setSignUpFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(value === 'sign-in' ? '/sign-in' : '/sign-up', { replace: true });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signInFormData.email || !signInFormData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await login(signInFormData.email, signInFormData.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in', {
        description: error instanceof Error ? error.message : 'Please check your credentials and try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signUpFormData.email || !signUpFormData.password || !signUpFormData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (signUpFormData.password !== signUpFormData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signUpFormData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsLoading(true);
      await signup(signUpFormData.email, signUpFormData.password);
      toast.success('Account created successfully!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to create account', {
        description: error instanceof Error ? error.message : 'Please try again with a different email'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="sign-in">Sign In</TabsTrigger>
          <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sign-in">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={signInFormData.email}
                onChange={handleSignInChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-blockchain-500 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={signInFormData.password}
                onChange={handleSignInChange}
                disabled={isLoading}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blockchain-500 hover:bg-blockchain-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="sign-up">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={signUpFormData.email}
                onChange={handleSignUpChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={signUpFormData.password}
                onChange={handleSignUpChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={signUpFormData.confirmPassword}
                onChange={handleSignUpChange}
                disabled={isLoading}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blockchain-500 hover:bg-blockchain-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : 'Sign Up'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        {activeTab === 'sign-in' ? (
          <p>
            Don't have an account?{' '}
            <button 
              type="button"
              onClick={() => handleTabChange('sign-up')}
              className="text-blockchain-500 hover:underline"
            >
              Sign up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button 
              type="button"
              onClick={() => handleTabChange('sign-in')}
              className="text-blockchain-500 hover:underline"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}; 