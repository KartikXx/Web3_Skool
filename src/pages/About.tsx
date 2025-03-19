
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { TokenIcon, BlockchainIcon, CodeIcon, NetworkIcon, WalletIcon, EducationIcon } from '@/assets/icons';

const About: React.FC = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <EducationIcon size={24} />,
      title: 'Interactive Learning',
      description: 'Our platform breaks down complex blockchain concepts into easy-to-understand, interactive quests.'
    },
    {
      icon: <TokenIcon size={24} />,
      title: 'Token Rewards',
      description: 'Earn tokens for completing quests that can be used within our ecosystem or as proof of knowledge.'
    },
    {
      icon: <BlockchainIcon size={24} />,
      title: 'NFT Achievements',
      description: 'Collect NFT badges that verify your blockchain expertise and showcase your progress.'
    },
    {
      icon: <CodeIcon size={24} />,
      title: 'Smart Contract Integration',
      description: 'Experience real blockchain interactions through our integrated smart contract system.'
    },
    {
      icon: <NetworkIcon size={24} />,
      title: 'Community Learning',
      description: 'Join a global community of blockchain enthusiasts learning and growing together.'
    },
    {
      icon: <WalletIcon size={24} />,
      title: 'Real Wallet Experience',
      description: 'Get hands-on experience managing a cryptocurrency wallet in a safe environment.'
    },
  ];

  const team = [
    {
      name: 'Kartik Rajput',
      role: 'Founder & UnderGrad Student',
      bio: 'Blockchain enthusiast and a student of Computer Science and Engineering at SRMIST, Chennai',
      avatar: '/placeholder.svg'
    },
    {
      name: 'Arpita Singh',
      role: 'Co-Founder & UnderGrad Student',
      bio: 'Specializing in Computer Science and Engineering at SRMIST, Chennai',
      avatar: '/placeholder.svg'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <AnimatedTransition className="flex-1">
        {/* Hero Section */}
        <section className="pt-28 pb-16 px-6 md:px-10 hero-gradient">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                About Blockchain Heroes
              </motion.h1>
              <motion.p 
                className="text-lg text-muted-foreground mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                We're on a mission to make blockchain education accessible, engaging, and rewarding for everyone.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Button 
                  size="lg" 
                  className="rounded-full px-8 bg-blockchain-500 hover:bg-blockchain-600 text-white"
                >
                  Join Our Community
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-muted-foreground mb-6">
                  Blockchain technology represents one of the most significant innovations of our time, yet it remains inaccessible to many due to its complexity and technical nature.
                </p>
                <p className="text-muted-foreground mb-6">
                  At Blockchain Heroes, we believe that education shouldn't just be informative—it should be engaging and rewarding. Our platform transforms learning into an adventure, where each lesson is a quest that not only teaches you about blockchain but also demonstrates its real-world applications.
                </p>
                <p className="font-medium">
                  Our goal is to create 10 million blockchain-literate individuals by 2025, empowering them to participate in the decentralized future.
                </p>
              </motion.div>
              
              <motion.div
                className="relative h-[400px] rounded-xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blockchain-100 to-blockchain-200 rounded-xl">
                  <div className="absolute w-full h-full bg-grid-pattern opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BlockchainIcon size={120} className="text-blockchain-500 opacity-40" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        <Separator />
        
        {/* Features Section */}
        <section className="py-16 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How Our Platform Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Blockchain Heroes combines education with gamification to create an immersive learning experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="glass-card rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-lg bg-blockchain-100">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <Separator />
        
        {/* Team Section */}
        <section className="py-16 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Meet the educators, developers, and blockchain enthusiasts behind Blockchain Heroes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-blockchain-500 mb-2">{member.role}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-6 md:px-10 bg-gradient-to-br from-blockchain-500 to-blockchain-700 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="mb-8 lg:mb-0 lg:mr-8 lg:max-w-xl">
                <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Blockchain Journey?</h2>
                <p className="text-white/80 mb-0">
                  Join thousands of learners mastering blockchain technology through our interactive quest-based platform.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blockchain-600 hover:bg-white/90 px-6"
                >
                  Start Learning
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-white border-white hover:bg-white/10 px-6"
                >
                  Browse Quests
                </Button>
              </div>
            </div>
          </div>
        </section>
      </AnimatedTransition>
      
      <Footer />
    </div>
  );
};

export default About;
