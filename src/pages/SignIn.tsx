import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { BlockchainIcon, WalletIcon } from '@/assets/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useWeb3 } from '@/contexts/Web3Context';
import { useAuthentication } from '@/hooks/use-authentication';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  remember: z.boolean().default(false),
});

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { signInUser, error: authError } = useAuth();
  const { isConnecting, hasProvider, providerInfo, error: walletError } = useWeb3();
  const { connectWallet, isAuthenticated } = useAuthentication();
  const [walletConnectionAttempted, setWalletConnectionAttempted] = useState(false);
  
  // Get the path the user was trying to access before being redirected to login
  const from = location.state?.from || '/dashboard';
  
  // Check if user is already authenticated and redirect if needed
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is already authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);
  
  // Log location state for debugging
  console.log('Current location state:', location.state);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const success = await signInUser({
        email: values.email,
        password: values.password,
      });
      
      if (success) {
        console.log('Authentication succeeded, redirecting to:', from);
        toast.success('Successfully signed in!');
        
        // Give more time for authentication state to fully update
        // and use window.location for a complete page refresh
        setTimeout(() => {
          console.log('Forcing page reload and redirect to:', from);
          // Force a full page reload which is more reliable for auth state changes
          window.location.href = from || '/dashboard';
        }, 800);
      } else {
        toast.error(authError || 'Invalid email or password');
      }
    } catch (error) {
      toast.error('Sign in failed. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    setWalletConnectionAttempted(true);
    
    if (!hasProvider) {
      toast.error('No wallet detected. Please install MetaMask.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }
    
    try {
      console.log('Initiating wallet connection from SignIn page...');
      const success = await connectWallet();
      
      if (success) {
        console.log('Wallet connection succeeded, redirecting to:', from);
        toast.success('Wallet connected successfully');
        
        // Give more time for authentication state to fully update
        // and use window.location for a complete page refresh
        setTimeout(() => {
          console.log('Forcing page reload and redirect to:', from);
          // Force a full page reload which is more reliable for auth state changes
          window.location.href = from || '/dashboard';
        }, 800);
      } else {
        console.error('Wallet connection failed:', walletError);
        toast.error(walletError || 'Failed to connect wallet');
      }
    } catch (err) {
      console.error('Error connecting wallet from SignIn page:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Wallet connection error: ${errorMessage}`);
    }
  };

  const getProviderInfo = () => {
    if (!providerInfo) return 'No provider information available';
    
    return [
      providerInfo.isMetaMask ? 'MetaMask detected' : 'MetaMask not detected',
      providerInfo.isCoinbaseWallet ? 'Coinbase Wallet detected' : '',
      providerInfo.hasProviders ? `Multiple providers: ${providerInfo.providerCount}` : '',
    ].filter(Boolean).join(', ');
  };

  return (
    <AnimatedTransition className="min-h-screen flex flex-col justify-center items-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center">
            <div className="relative w-16 h-16 rounded-2xl bg-blockchain-500 flex items-center justify-center mb-4 mx-auto">
              <BlockchainIcon size={32} className="stroke-white" />
              <div className="absolute inset-0 rounded-2xl animate-pulse-glow"></div>
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <motion.div 
          className="bg-card p-8 rounded-xl shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        {...field} 
                        autoComplete="email"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        autoComplete="current-password"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                  )}
                />
                
                <Link 
                  to="#" 
                  className="text-sm text-blockchain-600 hover:text-blockchain-500 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blockchain-500 hover:bg-blockchain-600"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleWalletConnect}
              disabled={isConnecting}
            >
              <WalletIcon size={16} />
              <span>
                {isConnecting 
                  ? "Connecting..." 
                  : hasProvider 
                    ? "Connect Wallet" 
                    : "Install Wallet"
                }
              </span>
            </Button>
            
            {walletError && walletConnectionAttempted && (
              <p className="text-xs text-destructive">
                Error: {walletError}
              </p>
            )}
            
            {hasProvider && (
              <p className="text-xs text-muted-foreground">
                {getProviderInfo()}
              </p>
            )}
            
            {!hasProvider && (
              <Card className="mt-4">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">No Wallet Detected</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-xs text-muted-foreground">
                    To use Web3 features, please install a wallet like MetaMask. This will enable you to connect your Ethereum wallet to the application.
                  </p>
                </CardContent>
                <CardFooter className="pt-2 pb-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={() => window.open('https://metamask.io/download/', '_blank')}
                  >
                    Install MetaMask
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {(walletError || walletConnectionAttempted) && (
              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs text-amber-500 border-t pt-3">
                  <AlertTriangle size={14} />
                  <span>Having trouble connecting?</span>
                  <Link to="/wallet-debug" className="font-medium underline ml-1">
                    Try the debug tool
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/sign-up" className="font-medium text-blockchain-600 hover:text-blockchain-500">
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatedTransition>
  );
};

export default SignIn;
