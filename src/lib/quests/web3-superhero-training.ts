import { Quest } from '@/types/quest';

const web3SuperheroTraining: Quest = {
  id: 'web3-superhero-training',
  title: 'Web3 Superhero Training Academy',
  description: "Become a Web3 superhero by mastering decentralized powers! You'll create your identity, build applications, and join forces with other heroes.",
  difficulty: 'beginner',
  estimatedTime: '30 min',
  reward: {
    tokens: 60,
    xp: 150
  },
  objectives: [
    'Understand what Web3 is and how it differs from the regular internet',
    'Learn about decentralization and why it matters',
    'Discover what dApps are and how they work',
    'Develop your Web3 superpowers'
  ],
  prerequisites: [],
  tags: ['web3', 'dapps', 'decentralization', 'superheroes'],
  coverImage: '/images/quests/web3-superhero-cover.png',
  steps: [
    {
      title: 'The Origin Story: Web1, Web2, and Web3',
      content: `
# The Internet's Evolution: A Superhero Origin Story

![Web Evolution Comic Panel](/images/quests/web-evolution-comic.jpg)

## Episode 1: The Three Ages of the Internet

Long ago, in the early days of the internet (Web1), websites were simple pages that you could only read. People couldn't interact much or create their own content easily.

Then came Web2 - the internet most people use today! Suddenly, everyone could create content on social media, upload videos, and comment on things. But there was a catch - giant companies like MetaCorp and Googolplex controlled everything and kept all your data!

Now, a new age is dawning - **Web3**! This is the decentralized internet where:
- YOU control your own data
- No single company has all the power
- Applications run on blockchains instead of company servers
- Digital ownership is possible through tokens and NFTs

## Your Superhero Training Begins!

As a new recruit at the Web3 Superhero Academy, you'll train to master the powers of this new internet and help build a better digital world!

Are you ready to begin your transformation from regular internet user to Web3 Superhero?
      `,
      interactive: {
        type: 'comic-book-reader',
        config: {
          comicPages: 3,
          allowZoom: true,
          soundEffects: true
        }
      }
    },
    {
      title: 'Decentralization: Your First Superpower',
      content: `
# Superpower #1: Decentralization Vision

![Decentralization Comic Panel](/images/quests/decentralization-comic.jpg)

## Understanding Decentralization

Imagine if one day your favorite game shut down because the company that made it decided to close - all your progress, gone forever! That's what can happen in the centralized world of Web2.

Web3 Superheroes have the power of **Decentralization Vision** - they can see how to build systems that don't rely on just one company or person to run them!

## Decentralization in Action

Think of it like this:
- **Centralized**: One big castle where all decisions are made
- **Decentralized**: Many connected treehouses where everyone helps make decisions

In a decentralized system:
- No single point can shut everything down
- Everyone can help run the network
- Rules are clear and can't be changed by just one person
- Your stuff stays yours, even if one part of the system fails

## Training Exercise: Spot the Difference

Look at these two networks and use your Decentralization Vision to spot which one is more resilient to attacks!
      `,
      interactive: {
        type: 'network-comparison-game',
        config: {
          networkTypes: ['centralized', 'decentralized'],
          showAttackSimulation: true,
          difficulty: 'easy'
        }
      },
      quiz: {
        question: "Why is a decentralized network more secure?",
        options: [
          {
            text: "Because it has a powerful leader",
            correct: false,
            explanation: "Actually, decentralized networks don't have a single leader - that's what makes them special!"
          },
          {
            text: "Because it's too complicated for anyone to understand",
            correct: false,
            explanation: "Decentralized networks can be understood, but their security comes from their design, not from being confusing."
          },
          {
            text: "Because if one part breaks, the whole network keeps working",
            correct: true,
            explanation: "That's right! In a decentralized network, there's no single point of failure, so the network stays up even if some parts go down."
          },
          {
            text: "Because only superheroes can access them",
            correct: false,
            explanation: "Decentralized networks are for everyone, not just superheroes!"
          }
        ]
      }
    },
    {
      title: 'dApps: Applications with Superpowers',
      content: `
# Superpower #2: dApp Development

![dApp Comic Panel](/images/quests/dapp-comic.jpg)

## What are dApps?

Regular apps (like games on your phone) live on company servers. But **dApps** (Decentralized Applications) are special - they live on the blockchain!

dApps have superhero abilities:
- They can't be shut down by any one company
- They run the same for everyone, everywhere
- They can handle money and valuable things without banks
- They keep your information safer

## Popular dApp Categories

Web3 Superheroes build many types of dApps:
- **DeFi** (Decentralized Finance): Like super-powered banks without the bankers
- **NFT Marketplaces**: Places to collect and trade digital items
- **DAOs** (Decentralized Autonomous Organizations): Groups that make decisions together
- **Games**: Where you truly own your in-game items

## Training Exercise: Build Your First Mini-dApp

It's time to use your new powers! Let's create a simple super-pet feeding dApp that lives on the blockchain.
      `,
      interactive: {
        type: 'mini-dapp-builder',
        config: {
          dappTemplate: 'super-pet',
          stepByStep: true,
          showBlockchainConnection: true
        }
      }
    },
    {
      title: 'Digital Identity: Your Secret Identity',
      content: `
# Superpower #3: Digital Identity Mastery

![Secret Identity Comic Panel](/images/quests/identity-comic.jpg)

## Your Web3 Secret Identity

Every superhero needs a secret identity, and in Web3, yours is protected by special technology!

In the old internet (Web2):
- Companies know everything about you
- Your identity is controlled by big tech companies
- If you get banned, you lose access to everything
- Your data is sold to advertisers

With your Web3 Secret Identity:
- YOU control your data
- You can choose what to share and with whom
- Your digital items stay with you across different websites
- No company can take away your identity

## Your Digital Backpack

In Web3, you have a special backpack (wallet) that holds:
- Your identity credentials
- Digital items you own (NFTs)
- Your digital money (tokens)
- Access passes to different dApps

This backpack goes with you everywhere in the digital world!

## Training Exercise: Create Your Superhero Identity

Design your Web3 Superhero persona and create a secure digital identity to protect it!
      `,
      interactive: {
        type: 'superhero-creator',
        config: {
          identityElements: ['mask', 'costume', 'powers', 'backstory'],
          walletIntegration: true
        }
      },
      quiz: {
        question: "What makes your Web3 identity different from regular internet accounts?",
        options: [
          {
            text: "It works on only one website",
            correct: false,
            explanation: "Actually, your Web3 identity works across many different websites and dApps!"
          },
          {
            text: "You need to be 18 or older to have one",
            correct: false,
            explanation: "Web3 identities can be created by people of all ages (with proper supervision for kids)."
          },
          {
            text: "You control it, not a big company",
            correct: true,
            explanation: "Exactly! Your Web3 identity belongs to you, not to any company. You control your data and digital items."
          },
          {
            text: "It automatically makes you famous",
            correct: false,
            explanation: "While Web3 identities are cool, they don't automatically make you famous!"
          }
        ]
      }
    },
    {
      title: 'Joining Forces: Web3 Communities',
      content: `
# Superpower #4: Community Collaboration

![Superhero Team Comic Panel](/images/quests/team-comic.jpg)

## Superhero Teams in Web3

Even the strongest superheroes work together in teams! In Web3, communities come together in special groups called DAOs (Decentralized Autonomous Organizations).

DAOs are like superhero teams where:
- Members vote on decisions
- Everyone can propose ideas
- The group's treasury is managed together
- Special tokens show your membership

## How Communities Work in Web3

In Web3, you can:
- Join communities you care about
- Help make decisions through voting
- Earn rewards for contributing
- Own a piece of the projects you support

## Training Exercise: Join a Superhero Squad

It's time to team up! Choose a Web3 community to join and complete a group mission together.
      `,
      interactive: {
        type: 'dao-simulator',
        config: {
          communityTypes: ['artists', 'gamers', 'collectors', 'builders'],
          simplifiedVoting: true
        }
      }
    },
    {
      title: 'Graduation Day: A Web3 Superhero Rises',
      content: `
# Congratulations, Web3 Superhero!

![Graduation Comic Panel](/images/quests/graduation-comic.jpg)

## Your Transformation is Complete!

You've completed your training at the Web3 Superhero Academy! Let's review the superpowers you've mastered:

1. **Decentralization Vision**: You understand how networks without central control work
2. **dApp Development**: You can use and create decentralized applications
3. **Digital Identity Mastery**: You control your own data and digital items
4. **Community Collaboration**: You know how to work with others in Web3

## Your Superhero Certificate

As an official Web3 Superhero, you receive:
- A special digital certificate (as an NFT!)
- HERO tokens for your digital wallet
- XP to level up your profile
- Access to more advanced training missions

## The Web3 Superhero Oath

Repeat after me:
"I promise to use my Web3 superpowers responsibly, to help build a better internet where everyone has control of their digital lives, and to always remember: with great blockchain power comes great digital responsibility!"

What mission will you take on first with your new Web3 superpowers?
      `,
      interactive: {
        type: 'certificate-creator',
        config: {
          certificateType: 'superhero',
          allowCustomization: true,
          mintAsNFT: true
        }
      }
    }
  ],
  resources: [
    {
      title: 'Web3 Superheroes Comic Book Series',
      url: 'https://example.com/web3-comics',
      type: 'comic'
    },
    {
      title: 'Kid-Friendly Guide to Decentralization',
      url: 'https://example.com/decentralization-for-kids',
      type: 'video'
    },
    {
      title: 'Build Your First dApp (For Young Creators)',
      url: 'https://example.com/first-dapp-kids',
      type: 'tutorial'
    }
  ]
};

export default web3SuperheroTraining; 