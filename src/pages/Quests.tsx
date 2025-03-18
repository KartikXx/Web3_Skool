
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import QuestGrid from '@/components/QuestGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Book, Trophy, Target, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Quests: React.FC = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <AnimatedTransition className="flex-1">
        {/* Hero Section */}
        <section className="pt-28 pb-16 px-6 md:px-10 hero-gradient">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Your Learning Journey
              </motion.h1>
              <motion.p 
                className="text-lg text-muted-foreground mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Master blockchain technology through our interactive quests and structured learning paths
              </motion.p>
            </div>
          </div>
        </section>
        
        {/* Learning Paths Section */}
        <section className="py-16 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Learning Paths</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Beginner Path */}
              <LearningPathCard 
                title="Blockchain Fundamentals"
                level="Beginner"
                description="Start your blockchain journey with the essential concepts and tools"
                icon={<Book className="h-6 w-6" />}
                questCount={2}
                estimatedTime="1-2 hours"
                color="green"
              />
              
              {/* Intermediate Path */}
              <LearningPathCard 
                title="Smart Contract Development"
                level="Intermediate"
                description="Learn to create and deploy smart contracts and decentralized applications"
                icon={<GraduationCap className="h-6 w-6" />}
                questCount={3}
                estimatedTime="4-6 hours"
                color="blue"
              />
              
              {/* Advanced Path */}
              <LearningPathCard 
                title="Advanced Blockchain Systems"
                level="Advanced"
                description="Master complex blockchain technologies like DeFi, NFTs, and DAO governance"
                icon={<Trophy className="h-6 w-6" />}
                questCount={1}
                estimatedTime="6-8 hours"
                color="purple"
              />
            </div>
            
            <Separator className="mb-16" />
            
            {/* Quests by Level */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center">Available Quests</h2>
              
              <Tabs defaultValue="all" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList className="grid w-full max-w-md grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="beginner">Beginner</TabsTrigger>
                    <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all">
                  <QuestGrid filterLevel={null} />
                </TabsContent>
                
                <TabsContent value="beginner">
                  <QuestGrid filterLevel="beginner" />
                </TabsContent>
                
                <TabsContent value="intermediate">
                  <QuestGrid filterLevel="intermediate" />
                </TabsContent>
                
                <TabsContent value="advanced">
                  <QuestGrid filterLevel="advanced" />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* Track Progression CTA */}
        <section className="py-16 px-6 md:px-10 bg-gradient-to-br from-blockchain-500 to-blockchain-700 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Track Your Progress</h2>
                <p className="text-white/80 mb-6">
                  Create an account to track your learning progress, earn tokens and NFT achievements, and join our community of blockchain learners.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white text-blockchain-600 hover:bg-white/90"
                  >
                    Sign Up
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-white border-white hover:bg-white/10"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              
              <div className="hidden md:block">
                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Your Progress</h3>
                      <p className="text-white/70">Start tracking your learning journey</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <ProgressItem label="Blockchain Basics" progress={0} />
                    <ProgressItem label="Smart Contracts" progress={0} />
                    <ProgressItem label="DeFi Knowledge" progress={0} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedTransition>
      
      <Footer />
    </div>
  );
};

interface LearningPathCardProps {
  title: string;
  level: string;
  description: string;
  icon: React.ReactNode;
  questCount: number;
  estimatedTime: string;
  color: 'green' | 'blue' | 'purple';
}

const LearningPathCard: React.FC<LearningPathCardProps> = ({
  title,
  level,
  description,
  icon,
  questCount,
  estimatedTime,
  color
}) => {
  const colorClasses = {
    green: "from-green-50 to-green-100 border-green-200 hover:border-green-300",
    blue: "from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300",
    purple: "from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300"
  };
  
  const badgeColorClasses = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700"
  };
  
  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color]} p-6 border-2 transition-all hover:shadow-xl`}>
      <div className="mb-4">
        <Badge className={badgeColorClasses[color]}>{level}</Badge>
      </div>
      
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-lg bg-white flex items-center justify-center mr-3 ${color === 'green' ? 'text-green-600' : color === 'blue' ? 'text-blue-600' : 'text-purple-600'}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      
      <p className="text-muted-foreground mb-6">{description}</p>
      
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center">
          <Book className="w-4 h-4 mr-1 text-muted-foreground" />
          <span>{questCount} Quests</span>
        </div>
        <div className="flex items-center">
          <Star className="w-4 h-4 mr-1 text-muted-foreground" />
          <span>{estimatedTime}</span>
        </div>
      </div>
    </Card>
  );
};

interface ProgressItemProps {
  label: string;
  progress: number;
}

const ProgressItem: React.FC<ProgressItemProps> = ({ label, progress }) => {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{progress}% Complete</span>
      </div>
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Quests;
