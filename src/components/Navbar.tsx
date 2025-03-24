import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, Wallet, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import WalletConnect from '@/components/WalletConnect';
import { useAuthentication } from '@/hooks/use-authentication';
import { toast } from 'sonner';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, hasCredentials } = useAuthentication();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/', protected: false },
    { name: 'Quests', path: '/quests', protected: true },
    { name: 'Dashboard', path: '/dashboard', protected: true },
    { name: 'Leaderboard', path: '/leaderboard', protected: false },
    { name: 'About', path: '/about', protected: false },
  ];

  // Handle navigation for both authenticated and unauthenticated users
  const handleNavigation = (path: string, isProtected: boolean) => (e: React.MouseEvent) => {
    if (isProtected && !isAuthenticated) {
      e.preventDefault();
      toast.error('Please sign in to access this page', {
        description: 'This feature requires authentication',
        action: {
          label: 'Sign In',
          onClick: () => navigate('/sign-in', { state: { from: path } })
        }
      });
    }
  };

  const handleSignOut = () => {
    logout();
    toast.success('Successfully signed out');
    navigate('/');
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      }
    }
  };

  return (
    <>
      <nav 
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-10 py-4 backdrop-blur-sm',
          isScrolled ? 'bg-white/80 dark:bg-gray-900/80 shadow-sm' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 font-medium text-lg"
          >
            <div className="relative w-8 h-8 rounded-full bg-blockchain-500 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-full animate-glow"></div>
            </div>
            <span className="font-semibold">Blockchain Heroes</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={isAuthenticated || !link.protected ? link.path : '#'}
                onClick={handleNavigation(link.path, link.protected)}
                className={cn(
                  'relative font-medium text-sm transition-colors',
                  'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blockchain-500 after:transition-all hover:after:w-full',
                  link.path === location.pathname ? 'text-blockchain-600 dark:text-blockchain-400 after:w-full' : 'text-foreground/80 hover:text-foreground',
                  link.protected && !isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <WalletConnect />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/sign-in"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "rounded-full px-4"
                  )}
                >
                  Sign In
                </Link>
                <Link 
                  to="/sign-up"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "rounded-full px-4 bg-blockchain-500 hover:bg-blockchain-600"
                  )}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated && <WalletConnect />}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            <div className="flex flex-col h-full p-8 pt-24">
              <div className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={isAuthenticated || !link.protected ? link.path : '#'}
                    onClick={handleNavigation(link.path, link.protected)}
                    className={cn(
                      'text-xl font-medium',
                      link.path === location.pathname ? 'text-blockchain-500' : 'text-foreground',
                      link.protected && !isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              
              <div className="mt-auto">
                {isAuthenticated ? (
                  <Button 
                    className="w-full mt-8 flex items-center gap-2 bg-red-500 hover:bg-red-600"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-4 mt-8">
                    <Link 
                      to="/sign-in"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "w-full"
                      )}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/sign-up"
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "w-full bg-blockchain-500 hover:bg-blockchain-600"
                      )}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const BlockchainLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
    <line x1="16" y1="21" x2="16" y2="7"></line>
    <line x1="8" y1="21" x2="8" y2="7"></line>
    <line x1="12" y1="21" x2="12" y2="7"></line>
    <line x1="4" y1="7" x2="4" y2="21"></line>
    <line x1="20" y1="7" x2="20" y2="21"></line>
  </svg>
);

export default Navbar;
