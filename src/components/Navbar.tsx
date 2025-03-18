
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletIcon } from '@/assets/icons';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
    { name: 'Home', path: '/' },
    { name: 'Quests', path: '/quests' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About', path: '/about' },
  ];

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
          isScrolled ? 'bg-white/80 shadow-sm' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 font-medium text-lg"
          >
            <div className="relative w-8 h-8 rounded-full bg-blockchain-500 flex items-center justify-center">
              <BlockchainLogo className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-full animate-glow"></div>
            </div>
            <span className="font-semibold">Blockchain Heroes</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'relative font-medium text-sm transition-colors',
                  'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blockchain-500 after:transition-all hover:after:w-full',
                  link.path === location.pathname ? 'text-blockchain-600 after:w-full' : 'text-foreground/80 hover:text-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full px-4"
            >
              Sign In
            </Button>
            <Button 
              size="sm" 
              className="flex items-center space-x-1.5 rounded-full px-4 bg-blockchain-500 hover:bg-blockchain-600 transition-colors"
            >
              <WalletIcon size={16} className="stroke-white" />
              <span>Connect Wallet</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed top-0 right-0 bottom-0 z-40 w-[300px] bg-white shadow-2xl pt-20 px-6"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'py-2 text-lg font-medium border-b border-gray-100',
                    link.path === location.pathname ? 'text-blockchain-500' : 'text-foreground'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-center"
                >
                  Sign In
                </Button>
                <Button 
                  className="w-full justify-center bg-blockchain-500 hover:bg-blockchain-600"
                >
                  Connect Wallet
                </Button>
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
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M12 3L17.5 6V12M12 3L6.5 6V12M12 3V9M17.5 12L12 15M17.5 12V18L12 21M12 15L6.5 12M12 15V21M6.5 12V18L12 21" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default Navbar;
