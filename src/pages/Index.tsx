import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import QuestGrid from '@/components/QuestGrid';
import ProgressPath from '@/components/ProgressPath';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CryptoStats from '@/components/CryptoStats';
import FAQ from '@/components/FAQ';
import Testimonials from '@/components/Testimonials';
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-card rounded-xl p-6 hover:shadow-xl transition-all group"
    >
      <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-lg bg-blockchain-100 group-hover:bg-blockchain-500 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-blockchain-500 transition-colors">{title}</h3>
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
        
        <CryptoStats />
        
        {/* Feature section */}
        <section className="py-20 px-6 md:px-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
        
        <Testimonials />
        
        <ProgressPath />
        
        <FAQ />
        
        {/* CTA Section */}
        <section className="py-20 px-6 md:px-10 bg-gradient-to-br from-blockchain-500 to-blockchain-700 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-10 md:mb-0 md:max-w-xl">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Blockchain Journey?</h2>
                  <p className="text-white/80 mb-4">
                    Join thousands of learners mastering blockchain technology and becoming WEB3 experts one quest at a time.
                  </p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2 text-white">1</div>
                      <p className="text-white/90">Sign up for a free account</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2 text-white">2</div>
                      <p className="text-white/90">Connect your Web3 wallet</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2 text-white">3</div>
                      <p className="text-white/90">Complete quests and earn rewards</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col space-y-4"
              >
                <Button 
                  size="lg" 
                  className="bg-white text-blockchain-600 hover:bg-white/90 rounded-full px-8 shadow-lg"
                  asChild
                >
                  <a href="/sign-up">Sign Up Now</a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 rounded-full px-8"
                  asChild
                >
                  <a href="/sign-in">Already have an account? Sign In</a>
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
