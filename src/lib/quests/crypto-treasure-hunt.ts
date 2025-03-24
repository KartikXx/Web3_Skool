import { Quest } from '@/types/quest';

const cryptoTreasureHunt: Quest = {
  id: 'crypto-treasure-hunt',
  title: 'Crypto Treasure Hunt Adventure',
  description: "Join a digital treasure hunt where you'll discover Bitcoin, Ethereum, and learn how to keep your crypto treasures safe!",
  difficulty: 'beginner',
  estimatedTime: '25 min',
  reward: {
    tokens: 75,
    xp: 120
  },
  objectives: [
    'Understand what cryptocurrencies are and how they work',
    'Learn about different types of digital coins',
    'Solve crypto puzzles to find hidden treasures',
    'Create your first digital wallet to store your treasures'
  ],
  prerequisites: [],
  tags: ['cryptocurrency', 'treasure-hunt', 'puzzles', 'games'],
  coverImage: '/images/quests/crypto-treasure-hunt-cover.png',
  steps: [
    {
      title: 'The Legend of Digital Treasure',
      content: `
# The Crypto Treasure Hunt Begins!

Welcome, brave explorer! There's a legend about magical digital treasures called "cryptocurrencies" hidden all across the digital world. Only the smartest treasure hunters can find them!

## What Are Cryptocurrencies?

Cryptocurrencies are special digital money that:
- Exists only on computers (you can't hold them like regular coins)
- Doesn't need banks to work
- Can be sent to anyone around the world in minutes
- Uses secret codes to keep them safe

## Your Treasure Map

In this adventure, you'll follow a treasure map to find different crypto coins. Each coin has special powers and uses!

Are you ready to begin your quest? Let's prepare for the adventure ahead!
      `,
      interactive: {
        type: 'treasure-map-intro',
        config: {
          mapStyle: 'pirate',
          showIntroAnimation: true
        }
      }
    },
    {
      title: 'Finding Bitcoin Island',
      content: `
# Bitcoin Island

Your first destination is Bitcoin Island - home of the most famous cryptocurrency of all!

## The Bitcoin Story

Long ago (in 2009), a mysterious person named Satoshi Nakamoto created Bitcoin as the first cryptocurrency. It was like inventing a whole new kind of treasure that didn't need gold or silver to be valuable!

## How Bitcoin Works

Bitcoin works using a magical system:
- Special computers solve difficult puzzles
- When they solve the puzzle, new bitcoins are created (called "mining")
- All transactions are recorded in a special book called the "blockchain"
- Once something is written in this book, it can never be changed

## The Bitcoin Puzzle

To find the Bitcoin treasure, you need to solve this puzzle. Look at the clues and find the hidden bitcoin!
      `,
      interactive: {
        type: 'bitcoin-mining-game',
        config: {
          difficulty: 'easy',
          timeLimit: 120,
          showHints: true
        }
      },
      quiz: {
        question: "What makes Bitcoin special compared to regular money?",
        options: [
          {
            text: "It's very colorful and pretty",
            correct: false,
            explanation: "While Bitcoin might have cool logos, that's not what makes it special!"
          },
          {
            text: "It doesn't need banks or governments to work",
            correct: true,
            explanation: "That's right! Bitcoin works on its own using special computer code. No banks needed!"
          },
          {
            text: "It's made of digital gold",
            correct: false,
            explanation: "Bitcoin isn't made of any physical material - it's completely digital."
          },
          {
            text: "It can only be used by adults",
            correct: false,
            explanation: "Bitcoin can be used by anyone who understands how it works, no matter their age."
          }
        ]
      }
    },
    {
      title: 'Ethereum Kingdom',
      content: `
# The Magical Kingdom of Ethereum

Your treasure map next leads you to the Ethereum Kingdom, where magic spells called "smart contracts" can do amazing things!

## What is Ethereum?

Ethereum is like Bitcoin's clever cousin that can do more than just be money:
- It can run special programs called "smart contracts"
- These are like magical spells that automatically do things when certain conditions happen
- People can build games, art, and all sorts of cool stuff on Ethereum

## Smart Contract Magic

Imagine a vending machine that nobody owns:
- You put in a coin
- You press the button for what you want
- The machine gives you your treat

Smart contracts work just like this! They automatically run when the right conditions are met, without needing anyone to control them.

## The Ethereum Challenge

To find the Ethereum treasure, you need to help build a simple smart contract. Follow the instructions to create your first bit of blockchain magic!
      `,
      interactive: {
        type: 'smart-contract-builder',
        config: {
          contractType: 'simple-game',
          showTemplates: true,
          allowDragAndDrop: true
        }
      }
    },
    {
      title: 'Creating Your Treasure Chest',
      content: `
# Your Digital Treasure Chest (Wallet)

Now that you've found some crypto treasures, you need a safe place to keep them - a digital treasure chest called a "wallet"!

## What is a Crypto Wallet?

A crypto wallet is:
- NOT an actual wallet, but a special app or device
- The place where your cryptocurrencies are kept safe
- Protected by special keys only you should know
- Like having your own personal vault!

## Two Important Keys

Every wallet has two special keys:
1. **Public Key**: Like your address that people can send crypto to (share this!)
2. **Private Key**: Like the secret password to your treasure (NEVER share this!)

## Creating Your First Wallet

Let's create a simple practice wallet to store your digital treasures:
- Choose a cool wallet name
- Get your public address to receive treasures
- Secure your private key (secret password)
- Learn how to check your balance
      `,
      interactive: {
        type: 'wallet-creator',
        config: {
          walletType: 'beginner',
          showSecurityTips: true,
          includePracticeCoins: true
        }
      },
      quiz: {
        question: "Which key should you NEVER share with anyone?",
        options: [
          {
            text: "Your house key",
            correct: false,
            explanation: "While you shouldn't give your house key to strangers, we're talking about crypto wallets here!"
          },
          {
            text: "Your public key",
            correct: false,
            explanation: "Your public key is okay to share - it's how people send you crypto."
          },
          {
            text: "Your private key",
            correct: true,
            explanation: "That's right! Your private key is super secret - never share it with anyone or they could steal your crypto!"
          },
          {
            text: "Your car key",
            correct: false,
            explanation: "Car keys are important too, but not related to crypto wallets."
          }
        ]
      }
    },
    {
      title: 'The Final Treasure',
      content: `
# The Crypto Master's Challenge

Congratulations, treasure hunter! You've learned about Bitcoin, Ethereum, and how to keep your digital treasures safe in a wallet. Now it's time for the final challenge!

## Collecting Your Reward

To complete your treasure hunt and claim your final reward:
- Use your new wallet to receive some practice crypto
- Send a small amount to a friend (don't worry, it's just practice coins!)
- Solve the final crypto puzzle to unlock your treasure chest

## Your Crypto Knowledge

You now know the basics of:
- What cryptocurrencies are and how they work
- The difference between Bitcoin and Ethereum
- How to keep your digital treasures safe in a wallet
- How transactions work on the blockchain

## The Final Puzzle

Solve this final blockchain puzzle to complete your quest and claim your treasure hunter badge!
      `,
      interactive: {
        type: 'blockchain-puzzle',
        config: {
          puzzleType: 'transaction-maze',
          difficulty: 'beginner',
          timeLimit: 180
        }
      }
    },
    {
      title: 'Treasure Hunt Complete!',
      content: `
# Congratulations, Crypto Treasure Hunter!

You've completed the Crypto Treasure Hunt and discovered the exciting world of digital currencies!

## Your Achievements

During this quest, you have:
- Learned about Bitcoin and how mining works
- Discovered Ethereum and smart contracts
- Created your first practice crypto wallet
- Understood how to keep your digital treasures safe
- Sent and received practice cryptocurrencies

## Your Rewards

As a successful crypto treasure hunter, you receive:
- A special Crypto Explorer badge for your profile
- HERO tokens added to your account
- XP points to level up your hero status
- Knowledge that will help you on future blockchain adventures!

## Share Your Adventure

Tell your friends about your crypto treasure hunting adventure and show them your new badge! Maybe they'll want to become crypto explorers too!

What crypto quest will you embark on next?
      `
    }
  ],
  resources: [
    {
      title: 'Kid-Friendly Guide to Bitcoin',
      url: 'https://example.com/bitcoin-for-kids',
      type: 'article'
    },
    {
      title: 'How to Keep Your Digital Treasures Safe',
      url: 'https://example.com/wallet-safety-kids',
      type: 'video'
    },
    {
      title: 'Fun Crypto Games to Play',
      url: 'https://example.com/crypto-games',
      type: 'game'
    }
  ]
};

export default cryptoTreasureHunt; 