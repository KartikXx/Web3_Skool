import { Quest } from '@/types/quest';

const blockchainBasics: Quest = {
  id: 'blockchain-basics',
  title: 'Blockchain Basics',
  description: 'Learn the fundamental concepts of blockchain technology in this beginner-friendly quest.',
  difficulty: 'beginner',
  estimatedTime: '15 min',
  reward: {
    tokens: 30,
    xp: 80
  },
  objectives: [
    'Understand what a blockchain is',
    'Learn about blocks and transactions',
    'Discover how consensus works',
    'Explore blockchain security features'
  ],
  prerequisites: [],
  tags: ['basics', 'blockchain', 'beginner', 'fundamentals'],
  coverImage: '/images/quests/blockchain-basics-cover.png',
  steps: [
    {
      title: 'What is Blockchain?',
      content: `
# Introduction to Blockchain

Blockchain is a special type of database that stores information in "blocks" that are linked together like a chain.

## Key Features

- **Distributed**: Copies of the blockchain exist across many computers
- **Immutable**: Once information is added, it's very difficult to change
- **Transparent**: Everyone can see what's on the blockchain
- **Secure**: Advanced cryptography keeps the data safe

Imagine a digital ledger that everyone can see, but no one person controls. That's blockchain!
      `
    },
    {
      title: 'Blocks and Transactions',
      content: `
# Blocks: The Building Blocks of Blockchain

A blockchain consists of many blocks linked together. Each block contains:

- A list of transactions (records of data)
- A timestamp showing when it was created
- A special code linking to the previous block
- A unique identifier called a "hash"

## What Are Transactions?

Transactions are records of information being shared. On a blockchain like Bitcoin, transactions show who sent cryptocurrency to whom. But blockchains can record many types of information:

- Financial transactions
- Property records
- Health data
- Voting results
- And much more!

When you make a transaction, it gets grouped with others into a "block" before being added to the chain.
      `,
      quiz: {
        question: "What is contained in a block on the blockchain?",
        options: [
          {
            text: "Only financial data",
            correct: false,
            explanation: "Blocks can contain many types of data, not just financial transactions."
          },
          {
            text: "A list of transactions, timestamp, previous block link, and hash",
            correct: true,
            explanation: "Correct! Blocks contain these essential elements that help maintain the chain structure."
          },
          {
            text: "The name of the person who created it",
            correct: false,
            explanation: "Blocks don't necessarily contain personal identification information."
          },
          {
            text: "The blockchain password",
            correct: false,
            explanation: "Blockchains don't have a single password. They use cryptographic methods for security."
          }
        ]
      }
    },
    {
      title: 'Consensus: Agreeing on Truth',
      content: `
# How Does Everyone Agree?

With thousands of computers in the network, how does everyone agree on what's true? This is where "consensus mechanisms" come in.

## Popular Consensus Methods

- **Proof of Work**: Computers solve difficult puzzles to validate transactions (used by Bitcoin)
- **Proof of Stake**: Validators put up their own cryptocurrency as collateral (used by Ethereum)
- **Delegated Proof of Stake**: Token holders vote for a small number of validators

These systems ensure that everyone agrees on the state of the blockchain without needing to trust each other.

## Why It Matters

Consensus mechanisms prevent cheating and ensure the blockchain remains secure and reliable, even when some participants try to break the rules.
      `,
      interactive: {
        type: 'consensus-demo',
        config: {
          demonstratePoW: true,
          networkSize: 'small',
          showValidation: true
        }
      }
    },
    {
      title: 'Blockchain Security',
      content: `
# Keeping the Blockchain Safe

Blockchain uses several techniques to stay secure:

## Cryptographic Hashing

Each block gets a unique "fingerprint" called a hash. If anyone tries to change even one tiny piece of data, the fingerprint completely changes - making tampering obvious.

## Distributed Network

The blockchain is stored on many computers worldwide. To hack it, someone would need to control more than half of all the computers in the network at once!

## Public and Private Keys

Users have two keys:
- A public key (like your address that everyone can see)
- A private key (like a password that only you know)

This combination allows for secure digital signatures that prove you authorized a transaction.
      `,
      quiz: {
        question: "Why is blockchain considered secure?",
        options: [
          {
            text: "Because it requires a password to access",
            correct: false,
            explanation: "Blockchain security doesn't rely on a single password."
          },
          {
            text: "Because it uses cryptographic hashing and is stored across many computers",
            correct: true,
            explanation: "Correct! These features make blockchain very difficult to hack or tamper with."
          },
          {
            text: "Because only experts can use it",
            correct: false,
            explanation: "Blockchain can be used by anyone, not just experts."
          },
          {
            text: "Because it's a new technology",
            correct: false,
            explanation: "Being new doesn't automatically make something secure."
          }
        ]
      }
    },
    {
      title: 'Real-World Applications',
      content: `
# Blockchain Beyond Cryptocurrency

While blockchain is famous for powering Bitcoin and other cryptocurrencies, it has many other uses:

## Supply Chain Tracking
- Following products from factory to store
- Verifying authenticity of luxury goods
- Ensuring ethical sourcing

## Digital Identity
- Giving people control over their personal data
- Reducing identity theft
- Creating universal ID systems

## Voting Systems
- Creating tamper-proof election records
- Increasing transparency
- Enabling verification of results

## Healthcare
- Securing patient records
- Tracking medication supply chains
- Sharing data between providers while maintaining privacy

The potential applications of blockchain technology are still being discovered!
      `
    }
  ],
  resources: [
    {
      title: 'Blockchain Explained Simply',
      url: 'https://example.com/blockchain-simple',
      type: 'video'
    },
    {
      title: 'The History of Blockchain',
      url: 'https://example.com/blockchain-history',
      type: 'article'
    },
    {
      title: 'How to Create Your First Transaction',
      url: 'https://example.com/first-transaction',
      type: 'tutorial'
    }
  ]
};

export default blockchainBasics; 