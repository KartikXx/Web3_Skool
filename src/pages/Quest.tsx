
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { QuestIcon, TokenIcon, TargetIcon, BlockchainIcon, CodeIcon, NetworkIcon } from '@/assets/icons';
import { ArrowLeft, Clock, Award } from 'lucide-react';

// Mock quest data
const quests = {
  'blockchain-basics': {
    title: 'Blockchain Basics',
    description: 'Learn the fundamentals of blockchain technology and how it works.',
    level: 'beginner',
    reward: 50,
    estimatedTime: '15 min',
    objectives: [
      'Understand what a blockchain is',
      'Learn about decentralization',
      'Explore the concept of immutability',
      'Discover how consensus mechanisms work'
    ],
    content: `
      <h2>What is Blockchain Technology?</h2>
      <p>At its core, a blockchain is a distributed digital ledger that stores data of any kind. A blockchain can record information about cryptocurrency transactions, NFT ownership or DeFi smart contracts.</p>
      
      <h2>Key Blockchain Characteristics</h2>
      <p>Blockchain technology achieves decentralized security and trust in several ways:</p>
      <ul>
        <li>New blocks are always stored linearly and chronologically</li>
        <li>Once a block is added to the chain, it becomes immutable</li>
        <li>Blockchains operate using a consensus mechanism to confirm transactions</li>
      </ul>
      
      <h2>How Does a Blockchain Work?</h2>
      <p>The goal of blockchain is to allow digital information to be recorded and distributed, but not edited. In this way, a blockchain is the foundation for immutable ledgers, or records of transactions that cannot be altered, deleted, or destroyed.</p>
      
      <h2>Decentralization</h2>
      <p>No single entity controls the blockchain. Instead, it's maintained by a network of computers (nodes) around the world. This makes it resistant to control by any single entity and less vulnerable to attacks or failures.</p>
    `,
  },
  'crypto-wallets': {
    title: 'Create Your First Wallet',
    description: 'Set up a cryptocurrency wallet and learn about private keys and seed phrases.',
    level: 'beginner',
    reward: 75,
    estimatedTime: '20 min',
    objectives: [
      'Understand what a cryptocurrency wallet is',
      'Learn about private keys and seed phrases',
      'Set up your first wallet',
      'Secure your wallet properly'
    ],
    content: `
      <h2>What is a Cryptocurrency Wallet?</h2>
      <p>Cryptocurrency wallets are applications that allow users to interact with blockchain networks. Despite the name, crypto wallets don't actually store cryptocurrencies. Instead, they store the private keys that give you access to your crypto assets on the blockchain.</p>
      
      <h2>Types of Wallets</h2>
      <ul>
        <li><strong>Hot Wallets</strong>: Connected to the internet (mobile apps, browser extensions)</li>
        <li><strong>Cold Wallets</strong>: Offline storage devices (hardware wallets)</li>
        <li><strong>Custodial Wallets</strong>: A third party holds your private keys</li>
        <li><strong>Non-custodial Wallets</strong>: You control your private keys</li>
      </ul>
      
      <h2>Private Keys and Seed Phrases</h2>
      <p>A private key is like a password that gives you access to your cryptocurrencies. A seed phrase (or recovery phrase) is a human-readable backup of your private keys, typically a series of 12 or 24 words.</p>
      
      <h2>Setting Up Your First Wallet</h2>
      <p>For beginners, we recommend starting with MetaMask, a popular browser extension wallet:</p>
      <ol>
        <li>Install the MetaMask extension from the official website</li>
        <li>Follow the setup wizard to create a new wallet</li>
        <li>Securely back up your seed phrase</li>
        <li>Never share your private keys or seed phrase with anyone</li>
      </ol>
    `,
  }
};

const Quest: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  if (!questId || !quests[questId as keyof typeof quests]) {
    return <div>Quest not found</div>;
  }
  
  const quest = quests[questId as keyof typeof quests];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <AnimatedTransition className="flex-1 pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft size={16} className="mr-2" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          
          <Card className="p-8 mb-8 glass-card">
            <div className="flex flex-col md:flex-row md:items-center mb-6">
              <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-xl bg-blockchain-100 text-blockchain-500 mb-4 md:mb-0 md:mr-6">
                <QuestIcon size={28} />
              </div>
              
              <div>
                <div className="mb-1">
                  <span className={`text-xs font-medium py-1 px-2 rounded-full ${
                    quest.level === 'beginner' ? 'bg-green-100 text-green-700' :
                    quest.level === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {quest.level.charAt(0).toUpperCase() + quest.level.slice(1)}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">{quest.title}</h1>
                <p className="text-muted-foreground mt-1">{quest.description}</p>
              </div>
            </div>
            
            <Separator className="mb-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center">
                <Clock size={18} className="text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">{quest.estimatedTime}</span>
              </div>
              
              <div className="flex items-center">
                <TargetIcon size={18} className="mr-2" />
                <span className="text-sm text-muted-foreground">{quest.objectives.length} Objectives</span>
              </div>
              
              <div className="flex items-center">
                <TokenIcon size={18} className="mr-2" />
                <span className="text-sm text-muted-foreground">{quest.reward} Tokens Reward</span>
              </div>
            </div>
            
            <div className="bg-blockchain-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-3 flex items-center">
                <Award size={18} className="mr-2 text-blockchain-500" />
                Quest Objectives
              </h3>
              <ul className="space-y-2">
                {quest.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-6 h-6 flex-shrink-0 rounded-full border-2 border-blockchain-200 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-medium text-blockchain-500">{index + 1}</span>
                    </div>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-muted-foreground"
              >
                Save for Later
              </Button>
              
              <Button 
                size="lg" 
                className="bg-blockchain-500 hover:bg-blockchain-600"
              >
                Start Quest
              </Button>
            </div>
          </Card>
          
          <div className="prose prose-blockchain max-w-none">
            <div dangerouslySetInnerHTML={{ __html: quest.content }} />
          </div>
          
          <div className="mt-12 flex justify-between items-center">
            <Button 
              variant="outline" 
              className="flex items-center text-muted-foreground"
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous Quest
            </Button>
            
            <Button 
              size="lg" 
              className="bg-blockchain-500 hover:bg-blockchain-600"
            >
              Complete & Continue
            </Button>
          </div>
          
          <div className="mt-16 bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Related Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResourceCard 
                title="Blockchain Explorer"
                description="See real blockchain transactions in action"
                icon={<BlockchainIcon size={20} />}
                href="#"
              />
              <ResourceCard 
                title="Smart Contract Basics"
                description="Introduction to automated blockchain programs"
                icon={<CodeIcon size={20} />}
                href="#"
              />
              <ResourceCard 
                title="Consensus Mechanisms"
                description="How blockchains reach agreement"
                icon={<NetworkIcon size={20} />}
                href="#"
              />
            </div>
          </div>
        </div>
      </AnimatedTransition>
      
      <Footer />
    </div>
  );
};

const ResourceCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}> = ({ title, description, icon, href }) => {
  return (
    <a 
      href={href}
      className="bg-white rounded-lg p-4 border hover:border-blockchain-200 transition-colors"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-blockchain-100 text-blockchain-500 mr-4">
          {icon}
        </div>
        <div>
          <h4 className="font-medium mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </a>
  );
};

export default Quest;
