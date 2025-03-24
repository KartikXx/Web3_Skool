import { Quest } from '@/types/quest';

const blockchain101: Quest = {
  id: 'blockchain-101',
  title: 'Blockchain 101: Your First Blocks',
  description: "Build your first blockchain! Learn by doing in this interactive quest where you'll create, validate, and understand blocks in a chain.",
  difficulty: 'beginner',
  estimatedTime: '25 min',
  reward: {
    tokens: 45,
    xp: 100
  },
  objectives: [
    'Build your own mini blockchain',
    'Understand hashing in blockchain',
    'Learn how transactions are verified',
    'Mine a block and see consensus in action'
  ],
  prerequisites: [],
  tags: ['basics', 'interactive', 'mining', 'hashing'],
  coverImage: '/images/quests/blockchain-101-cover.png',
  steps: [
    {
      title: 'Building Your First Block',
      content: `
# Let's Build a Blockchain!

In this quest, you won't just learn about blockchain - you'll build one yourself!

## What Makes a Block?

Every block in a blockchain has these important parts:

1. **Data**: Information stored in the block (like transactions)
2. **Previous Hash**: A link to the previous block
3. **Timestamp**: When the block was created
4. **Nonce**: A number used in mining
5. **Hash**: The block's unique digital fingerprint

## Creating Block #1: The Genesis Block

Let's create the very first block in our chain - called the "Genesis Block". 

In the interactive area below, you can fill in the details of your Genesis Block. Since it's the first block, it doesn't have a previous hash, so we'll use zeros.
      `,
      interactive: {
        type: 'block-creator',
        config: {
          isGenesisBlock: true,
          showBlockVisualization: true,
          difficulty: 'easy'
        }
      }
    },
    {
      title: 'Understanding Hashing',
      content: `
# The Magic of Hashing

Hashing is like a digital fingerprint machine. You put in data of any size, and it creates a fixed-size string of characters that uniquely represents that data.

## Key Features of Hashes:

- The same input always produces the same hash
- Even a tiny change in input creates a completely different hash
- You can't work backwards from a hash to the original data
- Each hash is practically unique

## Try It Yourself!

Use the interactive hash generator below. Type different messages and see how the hash changes. Notice what happens when you make even a small change!

Then try to create a hash that starts with "000" - this is similar to what miners do in Bitcoin!
      `,
      interactive: {
        type: 'hash-generator',
        config: {
          hashAlgorithm: 'SHA-256',
          showVisualization: true,
          challenge: 'find-zeros'
        }
      },
      quiz: {
        question: "What happens to a hash if you change just one character in the input data?",
        options: [
          {
            text: "The hash stays exactly the same",
            correct: false,
            explanation: "Hashes are designed to change completely even with tiny input changes."
          },
          {
            text: "Only one character in the hash changes",
            correct: false,
            explanation: "Hash algorithms create avalanche effects where small changes cause widespread differences."
          },
          {
            text: "The hash becomes completely different",
            correct: true,
            explanation: "Correct! Even a tiny change in input creates a completely different hash output - this is a key security feature of hash functions."
          },
          {
            text: "The hash becomes longer",
            correct: false,
            explanation: "Hash outputs have a fixed length regardless of the input."
          }
        ]
      }
    },
    {
      title: 'Adding Transactions to Blocks',
      content: `
# Packing Transactions into Blocks

Now that you understand blocks and hashing, let's see how transactions work in a blockchain.

## What is a Blockchain Transaction?

A transaction is simply a record of data being transferred or changed. In Bitcoin, it's a record of coins moving between wallets. In other blockchains, it could be:
- Updating a piece of information
- Transferring ownership of a digital item
- Running a small program (smart contract)
- Recording a vote

## Creating Transactions

Create some example transactions below. These will go into your next block:

1. Send 5 tokens from Alice to Bob
2. Record that Charlie completed a task
3. Add your own transaction!

Once you've created your transactions, they'll be added to the "mempool" - the waiting area for transactions before they're added to a block.
      `,
      interactive: {
        type: 'transaction-creator',
        config: {
          showMempool: true,
          transactionTypes: ['payment', 'data', 'custom'],
          predefinedUsers: ['Alice', 'Bob', 'Charlie', 'Dave']
        }
      }
    },
    {
      title: 'Mining Your First Block',
      content: `
# Mining: Securing the Blockchain

Mining is how new blocks are added to the blockchain. Miners:

1. Collect transactions from the mempool
2. Group them into a potential block
3. Try to find a special "nonce" value that gives the block a hash starting with zeros
4. The first miner to find a valid hash gets to add their block to the chain

The process of finding this special nonce is intentionally difficult - this is called "Proof of Work" and it's what secures the blockchain against attackers.

## Let's Mine a Block!

Now you'll mine your own block by finding the right nonce value. The mining simulator below will help you understand how this works.

Click "Start Mining" to begin the process and watch as your computer searches for a valid hash!
      `,
      interactive: {
        type: 'mining-simulator',
        config: {
          difficulty: 'beginner',
          showHashrate: true,
          showBlockCreation: true,
          autoAddToChain: true
        }
      }
    },
    {
      title: 'Viewing Your Blockchain',
      content: `
# Your Blockchain is Growing!

Congratulations! You've now:
1. Created a Genesis Block
2. Learned how hashing secures the blockchain
3. Added transactions to the mempool
4. Mined a new block and added it to the chain

## Visualizing Your Blockchain

Take a look at your blockchain visualization below. You can click on each block to see:
- The transactions inside
- The hash values
- How each block links to the previous one

## Why This Matters

This chain structure is what makes blockchain so secure and reliable:
- Each block contains a hash of the previous block
- If anyone tries to change a past block, all the subsequent blocks would also need to change
- The longer the chain gets, the more secure it becomes

This is why blockchain is considered "immutable" (unchangeable) once data is added and confirmed by several blocks.
      `,
      interactive: {
        type: 'blockchain-visualizer',
        config: {
          blocks: 3,
          showDetails: true,
          allowInteraction: true,
          animateLinks: true
        }
      },
      quiz: {
        question: "Why is it difficult to change data in a block that's already in the blockchain?",
        options: [
          {
            text: "Because blockchains are stored in a secret location",
            correct: false,
            explanation: "Blockchains are actually distributed across many computers, not hidden."
          },
          {
            text: "Because you'd need to change that block and all blocks that came after it",
            correct: true,
            explanation: "Correct! Each block contains the previous block's hash, creating a chain where changing one block requires changing all subsequent blocks - which becomes practically impossible as the chain grows."
          },
          {
            text: "Because you need a password to change blocks",
            correct: false,
            explanation: "Blockchain security doesn't rely on passwords but on cryptographic linking and consensus."
          },
          {
            text: "Because only the original creator can modify blocks",
            correct: false,
            explanation: "Blockchain's security comes from its structure, not from creator privileges."
          }
        ]
      }
    },
    {
      title: 'Blockchain 101 Complete!',
      content: `
# You Did It! You're a Blockchain Builder!

Congratulations on completing Blockchain 101! You've successfully:

- Built your own mini blockchain from scratch
- Created and understood the Genesis Block
- Learned how cryptographic hashing secures the chain
- Created transactions and added them to blocks
- Mined blocks using Proof of Work
- Visualized how blocks link together for security

## Your Blockchain Journey

This is just the beginning of your blockchain journey! With these fundamentals, you now understand the core technology behind cryptocurrencies, NFTs, smart contracts, and other blockchain applications.

## Your Rewards

For completing this quest, you've earned:
- 45 HERO tokens added to your wallet
- 100 XP points to level up your profile
- The "Blockchain Builder" badge for your collection

## What's Next?

Ready to continue your blockchain adventure? Try these quests next:
- Crypto Treasure Hunt
- Web3 Superhero Training
- Create Your Digital Pet NFT

Keep building, and you'll be a blockchain expert in no time!
      `
    }
  ],
  resources: [
    {
      title: 'How Mining Works - Deep Dive',
      url: 'https://example.com/mining-explained',
      type: 'video'
    },
    {
      title: 'Cryptographic Hashing Explained',
      url: 'https://example.com/hashing-guide',
      type: 'article'
    },
    {
      title: 'Build Your Own Blockchain Project',
      url: 'https://example.com/diy-blockchain',
      type: 'tutorial'
    }
  ]
};

export default blockchain101; 