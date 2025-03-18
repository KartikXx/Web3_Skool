
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import QuestGrid from '@/components/QuestGrid';
import ProgressPath from '@/components/ProgressPath';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TokenIcon, AchievementIcon, GlobalIcon, EducationIcon } from '@/assets/icons';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}> = ({ icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-lg bg-blockchain-100">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

const Index: React.FC = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <EducationIcon size={24} />,
      title: 'Interactive Learning',
      description: 'Learn blockchain concepts through engaging quests and practical tasks.'
    },
    {
      icon: <TokenIcon size={24} />,
      title: 'Token Rewards',
      description: 'Earn tokens as you complete missions and demonstrate your knowledge.'
    },
    {
      icon: <AchievementIcon size={24} />,
      title: 'NFT Achievements',
      description: 'Collect digital badges on-chain to showcase your blockchain journey.'
    },
    {
      icon: <GlobalIcon size={24} />,
      title: 'Global Community',
      description: 'Connect with other learners and compare your progress on leaderboards.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        {/* Feature section */}
        <section className="py-20 px-6 md:px-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How Blockchain Heroes Works</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our platform combines education with gamification to make learning blockchain technology engaging and rewarding.
                </p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
        
        <QuestGrid />
        
        <ProgressPath />
        
        {/* CTA Section */}
        <section className="py-20 px-6 md:px-10 bg-gradient-to-br from-blockchain-500 to-blockchain-700 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-10 md:mb-0 md:max-w-xl">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Blockchain Journey?</h2>
                  <p className="text-white/80">
                    Join thousands of learners mastering blockchain technology and becoming WEB3 experts one quest at a time.
                  </p>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-blockchain-600 hover:bg-white/90 rounded-full px-8 shadow-lg"
                >
                  Start Learning Now
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
