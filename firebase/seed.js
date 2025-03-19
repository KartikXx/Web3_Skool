// This script is used to seed the Firebase Firestore database with initial data
// To run: node firebase/seed.js

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load service account from local file (not committed to git)
let serviceAccount;
try {
  const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');
  const serviceAccountData = await readFile(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(serviceAccountData);
} catch (error) {
  console.error('Service account key file not found. Please place it in firebase/serviceAccountKey.json');
  process.exit(1);
}

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

// Sample Quests Data
const quests = [
  {
    id: 'blockchain-basics',
    title: 'Blockchain Basics',
    description: 'Learn the fundamentals of blockchain technology and how it works.',
    difficulty: 'beginner',
    rewards: 50,
    estimatedTime: '15 min',
    steps: [
      'Understand what a blockchain is',
      'Learn about decentralization',
      'Explore consensus mechanisms',
      'Complete the quiz'
    ]
  },
  {
    id: 'create-first-wallet',
    title: 'Create Your First Wallet',
    description: 'Set up a cryptocurrency wallet and learn about private keys and seed phrases.',
    difficulty: 'beginner',
    rewards: 75,
    estimatedTime: '20 min',
    steps: [
      'Choose a wallet type',
      'Install the wallet',
      'Secure your seed phrase',
      'Receive your first transaction'
    ]
  },
  {
    id: 'what-is-web3',
    title: 'What is WEB3?',
    description: 'An introduction to Web3 and how it differs from previous versions of the web.',
    difficulty: 'beginner',
    rewards: 25,
    estimatedTime: '10 min',
    steps: [
      'Compare Web1, Web2, and Web3',
      'Understand decentralized applications',
      'Learn about digital ownership',
      'Complete the quiz'
    ]
  },
  {
    id: 'smart-contracts-101',
    title: 'Smart Contracts 101',
    description: 'Learn about smart contracts and their applications in blockchain.',
    difficulty: 'intermediate',
    rewards: 100,
    estimatedTime: '30 min',
    steps: [
      'Define smart contracts',
      'Explore use cases',
      'Learn about Solidity basics',
      'Read a simple smart contract'
    ]
  },
  {
    id: 'defi-basics',
    title: 'DeFi Basics',
    description: 'Understand the fundamentals of decentralized finance and its ecosystem.',
    difficulty: 'intermediate',
    rewards: 125,
    estimatedTime: '40 min',
    steps: [
      'Compare DeFi to traditional finance',
      'Learn about lending and borrowing',
      'Understand yield farming',
      'Explore liquidity pools'
    ]
  },
];

// Sample Achievements Data
const achievements = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first quest',
    image: '/achievements/first-steps.png',
    tokenReward: 10
  },
  {
    id: 'crypto-beginner',
    name: 'Crypto Beginner',
    description: 'Complete 5 beginner quests',
    image: '/achievements/crypto-beginner.png',
    tokenReward: 25
  },
  {
    id: 'wallet-master',
    name: 'Wallet Master',
    description: 'Set up your first crypto wallet',
    image: '/achievements/wallet-master.png',
    tokenReward: 15
  },
  {
    id: 'knowledge-explorer',
    name: 'Knowledge Explorer',
    description: 'Complete quests in 3 different categories',
    image: '/achievements/knowledge-explorer.png',
    tokenReward: 30
  },
  {
    id: 'defi-voyager',
    name: 'DeFi Voyager',
    description: 'Complete all DeFi quests',
    image: '/achievements/defi-voyager.png',
    tokenReward: 50
  },
];

// Sample Users Data (generate some fake users)
const users = [
  {
    id: 'user1',
    displayName: 'CryptoMaster',
    email: 'crypto.master@example.com',
    walletAddress: '0x89a3af7b2344a06b7a5bd31b32c5e7a1e21b3f2',
    tokens: 350,
    questsCompleted: 7,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'user2',
    displayName: 'BlockchainNinja',
    email: 'blockchain.ninja@example.com',
    walletAddress: '0x45c7e8a9d15f3b687cb9a2e4d7a1',
    tokens: 275,
    questsCompleted: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'user3',
    displayName: 'TokenWhisperer',
    email: 'token.whisperer@example.com',
    walletAddress: '0x12d8b49c3e7a9b56c8a2d1e9b4',
    tokens: 410,
    questsCompleted: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'user4',
    displayName: 'SatoshiStudent',
    email: 'satoshi.student@example.com',
    tokens: 180,
    questsCompleted: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'user5',
    displayName: 'HashRateHunter',
    email: 'hashrate.hunter@example.com',
    walletAddress: '0x78f1a4c5e6b7d8a9b0c2d3e2c5',
    tokens: 520,
    questsCompleted: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

// UserQuests Data (which users have completed which quests)
const userQuests = [
  {
    id: 'user1_blockchain-basics',
    userId: 'user1',
    questId: 'blockchain-basics',
    completed: true,
    startedAt: new Date(),
    completedAt: new Date()
  },
  {
    id: 'user1_create-first-wallet',
    userId: 'user1',
    questId: 'create-first-wallet',
    completed: true,
    startedAt: new Date(),
    completedAt: new Date()
  },
  {
    id: 'user2_blockchain-basics',
    userId: 'user2',
    questId: 'blockchain-basics',
    completed: true,
    startedAt: new Date(),
    completedAt: new Date()
  }
];

// UserAchievements Data
const userAchievements = [
  {
    id: 'user1_first-steps',
    userId: 'user1',
    achievementId: 'first-steps',
    unlockedAt: new Date()
  },
  {
    id: 'user2_first-steps',
    userId: 'user2',
    achievementId: 'first-steps',
    unlockedAt: new Date()
  }
];

// Seed the database
async function seedDatabase() {
  try {
    // Seed quests
    console.log('Seeding quests...');
    for (const quest of quests) {
      const { id, ...questData } = quest;
      await db.collection('quests').doc(id).set(questData);
    }
    
    // Seed achievements
    console.log('Seeding achievements...');
    for (const achievement of achievements) {
      const { id, ...achievementData } = achievement;
      await db.collection('achievements').doc(id).set(achievementData);
    }
    
    // Seed users
    console.log('Seeding users...');
    for (const user of users) {
      const { id, ...userData } = user;
      await db.collection('users').doc(id).set(userData);
    }
    
    // Seed userQuests
    console.log('Seeding user quests...');
    for (const userQuest of userQuests) {
      const { id, ...userQuestData } = userQuest;
      await db.collection('userQuests').doc(id).set(userQuestData);
    }
    
    // Seed userAchievements
    console.log('Seeding user achievements...');
    for (const userAchievement of userAchievements) {
      const { id, ...userAchievementData } = userAchievement;
      await db.collection('userAchievements').doc(id).set(userAchievementData);
    }
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase(); 