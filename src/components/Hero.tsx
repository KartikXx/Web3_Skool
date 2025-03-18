
import React from 'react';
import { Button } from '@/components/ui/button';
import { SparklesIcon, BlockchainIcon } from '@/assets/icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden hero-gradient">
      <div className="absolute top-0 inset-0 z-10 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="relative z-20 flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-16 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 bg-blockchain-100 rounded-full pl-2 pr-4 py-1.5 text-blockchain-600 text-sm font-medium">
                <SparklesIcon size={16} />
                <span>Learn blockchain while having fun</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Become a <span className="text-blockchain-500 text-glow">Blockchain Hero</span> through missions
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
                Complete interactive quests, earn tokens, and collect NFT badges while mastering blockchain technology and WEB3 concepts.
              </p>
              
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg" 
                  className="rounded-full px-8 bg-blockchain-500 hover:bg-blockchain-600 text-white shadow-lg shadow-blockchain-500/20"
                >
                  Start Your Journey
                </Button>
                <Link 
                  to="/about"
                  className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors"
                >
                  <span>Learn More</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative w-[360px] h-[360px] md:w-[460px] md:h-[460px]">
                <BlockAnimation />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BlockAnimation: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div 
        className="absolute w-[80%] h-[80%] rounded-2xl bg-white bg-opacity-70 backdrop-blur-lg shadow-xl border border-white border-opacity-40"
        initial={{ rotate: -8 }}
        animate={{ rotate: -4 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute w-[70%] h-[70%] rounded-2xl bg-blockchain-50 bg-opacity-80 backdrop-blur-md shadow-xl border border-blockchain-100 border-opacity-50"
        initial={{ rotate: 8 }}
        animate={{ rotate: 4 }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
      />
      
      <motion.div
        className="relative z-10 w-[55%] h-[55%] rounded-xl flex items-center justify-center bg-blockchain-500 shadow-lg"
        initial={{ y: -10 }}
        animate={{ y: 10 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      >
        <BlockchainIcon size={80} className="text-white" />
      </motion.div>
      
      {/* Particles/nodes */}
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-6 h-6 rounded-full bg-blockchain-400 shadow-lg"
          style={{
            top: `${20 + (index * 15)}%`,
            left: `${65 + (index % 2) * 20}%`,
          }}
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{ 
            duration: 2 + (index * 0.5), 
            repeat: Infinity, 
            repeatType: "reverse", 
            ease: "easeInOut",
            delay: index * 0.3
          }}
        />
      ))}
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <motion.line 
          x1="50" y1="50" x2="75" y2="20" 
          stroke="#0F84FF" 
          strokeWidth="1" 
          strokeDasharray="5,5"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.line 
          x1="50" y1="50" x2="75" y2="35" 
          stroke="#0F84FF" 
          strokeWidth="1" 
          strokeDasharray="5,5"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
        />
        <motion.line 
          x1="50" y1="50" x2="75" y2="50" 
          stroke="#0F84FF" 
          strokeWidth="1" 
          strokeDasharray="5,5"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 1 }}
        />
        <motion.line 
          x1="50" y1="50" x2="75" y2="65" 
          stroke="#0F84FF" 
          strokeWidth="1" 
          strokeDasharray="5,5"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse", delay: 1.5 }}
        />
        <motion.line 
          x1="50" y1="50" x2="75" y2="80" 
          stroke="#0F84FF" 
          strokeWidth="1" 
          strokeDasharray="5,5"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 2 }}
        />
      </svg>
    </div>
  );
};

export default Hero;
