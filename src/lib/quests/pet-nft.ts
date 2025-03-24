import { Quest } from '@/types/quest';

const petNFTQuest: Quest = {
  id: 'pet-nft',
  title: 'Create Your Digital Pet NFT',
  description: "Design and create your very own digital pet that you'll own as an NFT! Learn about digital ownership while having fun customizing your unique virtual companion.",
  difficulty: 'beginner',
  estimatedTime: '20 min',
  reward: {
    tokens: 50,
    xp: 100
  },
  objectives: [
    'Understand what NFTs are in simple terms',
    'Design and customize your own digital pet',
    'Learn how digital items can be owned on a blockchain',
    'Create your first NFT'
  ],
  prerequisites: [],
  tags: ['nft', 'digital-pets', 'ownership', 'creativity'],
  coverImage: '/images/quests/pet-nft-cover.png',
  steps: [
    {
      title: 'Introduction to NFTs',
      content: `
# What is an NFT?

NFT stands for "Non-Fungible Token." That's a fancy way of saying "a one-of-a-kind digital item that you can own!"

Imagine you have a special toy that no one else has. An NFT is like that, but digital - it exists on computers. 

## Why are NFTs special?

- Each NFT is unique (like your fingerprint!)
- You can truly own digital things (like art, music, or virtual pets)
- No one can copy your NFT and claim it's theirs
- You can trade or sell your NFTs to others

Today, we're going to create a special digital pet that you'll own as an NFT!
      `
    },
    {
      title: 'Design Your Pet',
      content: `
# Create Your Digital Pet

Now it's time to design your own virtual pet! This pet will be unique to you and become your very own NFT.

## Choose Your Pet Type

- What kind of pet do you want? 
- A dog, cat, dragon, or something totally made up?
- Think about what makes your pet special

## Pet Customization

Use the pet creator below to:
- Choose colors, patterns, and accessories
- Give your pet special powers or abilities
- Name your pet something unique!

Remember, this pet will be yours forever on the blockchain!
      `,
      interactive: {
        type: 'pet-creator',
        config: {
          petTypes: ['dog', 'cat', 'dragon', 'robot', 'alien'],
          customizationOptions: ['color', 'pattern', 'accessories', 'powers']
        }
      }
    },
    {
      title: 'Understanding Digital Ownership',
      content: `
# How You Own Digital Things

When you create an NFT, you're using a special computer system called a "blockchain" to prove you own something digital.

## How does it work?

Imagine if there was a magical book where everyone could see who owned what, and the book couldn't be changed by anyone being sneaky:

1. Your pet gets added to this magical book (the blockchain)
2. The book says "This pet belongs to YOU"
3. Everyone can see that you own it
4. No one can change the book without your permission

This is how the blockchain helps you truly own digital things like your pet!

## Digital Pet Ownership

When your pet is an NFT:
- You control it, not a company or game
- Even if a website disappears, your pet still belongs to you
- You can take your pet to different games or virtual worlds
- You could sell or trade your pet if you wanted to
      `,
      quiz: {
        question: "Why is your digital pet NFT really yours?",
        options: [
          {
            text: "Because it's saved on my computer",
            correct: false,
            explanation: "If it's just saved on your computer, anyone could copy it, and you wouldn't truly own it."
          },
          {
            text: "Because the magical blockchain book says it's mine",
            correct: true,
            explanation: "Yes! The blockchain is like a magical book that records that you are the true owner, and everyone can see this proof."
          },
          {
            text: "Because I drew it myself",
            correct: false,
            explanation: "Drawing something yourself is great, but doesn't prove ownership to others in the digital world."
          },
          {
            text: "Because I have the password",
            correct: false,
            explanation: "Passwords help protect your accounts, but they don't prove ownership of digital items."
          }
        ]
      }
    },
    {
      title: 'Minting Your Pet NFT',
      content: `
# Creating (Minting) Your Pet NFT

Now it's time to turn your digital pet design into a real NFT that you own! This process is called "minting."

## Minting Steps

1. Finalize your pet's design
2. Give it a special name and description
3. Click the "Mint My Pet" button
4. Watch as your pet becomes an NFT on the blockchain!

## What Happens When You Mint

- Your pet gets a special code (like a birth certificate)
- The blockchain records that YOU are the owner
- Your pet appears in your digital wallet
- You can now take care of your pet and watch it grow!

## Taking Care of Your Pet

After minting, you'll need to take good care of your digital pet:
- Feed it regularly
- Play games with it
- Teach it new tricks
- Watch it grow and develop new abilities!
      `,
      interactive: {
        type: 'nft-minting-simulator',
        config: {
          animationSpeed: 'medium',
          showBlockchainVisualization: true
        }
      }
    },
    {
      title: "Your Pet's Digital Home",
      content: `
# Your Pet's New Home

Congratulations! You now have your very own digital pet NFT. Here's what you can do with it:

## Your Pet Collection

- Your pet lives in your digital collection
- You can visit and play with it anytime
- As you complete more quests, you can collect more pets!

## Showing Off Your Pet

- Share your pet with friends
- Display it on your profile
- Take screenshots of your unique creation

## The Future of Your Pet

In the future, you might be able to:
- Bring your pet into games
- Have it play with other people's NFT pets
- Add new accessories as you earn them
- Even breed your pets to create baby NFT pets!

You've learned the basics of NFTs by creating your very own digital pet. Now you understand how blockchain technology lets you truly own digital things!
      `
    }
  ],
  resources: [
    {
      title: 'What are NFTs? (Kid-Friendly)',
      url: 'https://example.com/kids-nft-guide',
      type: 'video'
    },
    {
      title: 'The Story of Digital Pets',
      url: 'https://example.com/digital-pets-history',
      type: 'article'
    },
    {
      title: 'How to Keep Your Digital Things Safe',
      url: 'https://example.com/digital-safety-kids',
      type: 'guide'
    }
  ]
};

export default petNFTQuest; 