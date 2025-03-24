export interface Quest {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'basics' | 'defi' | 'nft' | 'web3' | 'wallet' | 'security';
  rewards: {
    xp: number;
    tokens: number;
  };
  estimatedTime: string;
  prerequisites?: string[];
  steps: {
    id: string;
    title: string;
    description: string;
    completed?: boolean;
  }[];
  resources?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'tutorial';
  }[];
  status?: 'available' | 'in-progress' | 'completed';
  completedAt?: Date;
}

export const beginnerQuests: Quest[] = [
  {
    id: 'blockchain-101',
    title: 'Blockchain 101',
    description: 'Learn the fundamentals of blockchain technology and how it works',
    longDescription: 'Blockchain technology is the foundation of cryptocurrencies and decentralized applications. In this quest, you\'ll learn about the basic concepts of blockchain, including distributed ledgers, consensus mechanisms, and how blocks are linked together to create a secure and transparent system.',
    difficulty: 'beginner',
    category: 'basics',
    rewards: {
      xp: 50,
      tokens: 5
    },
    estimatedTime: '15 min',
    steps: [
      {
        id: 'step-1',
        title: 'What is a Blockchain?',
        description: 'Understand the concept of a distributed ledger and how data is stored across a network.'
      },
      {
        id: 'step-2',
        title: 'Blocks and Chains',
        description: 'Learn how blocks are created, validated, and linked together using cryptographic hashes.'
      },
      {
        id: 'step-3',
        title: 'Consensus Mechanisms',
        description: 'Explore how blockchain networks achieve agreement on the state of the ledger.'
      },
      {
        id: 'step-4',
        title: 'Blockchain Quiz',
        description: 'Test your knowledge with a quick quiz about blockchain fundamentals.'
      }
    ],
    resources: [
      {
        title: 'Blockchain Explained',
        url: 'https://www.investopedia.com/terms/b/blockchain.asp',
        type: 'article'
      },
      {
        title: 'How Does a Blockchain Work',
        url: 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
        type: 'video'
      }
    ]
  },
  {
    id: 'crypto-wallets',
    title: 'Create Your First Wallet',
    description: 'Learn how to set up and secure a cryptocurrency wallet',
    longDescription: 'A cryptocurrency wallet is essential for interacting with blockchain networks. This quest will guide you through creating your first wallet, understanding private and public keys, and best practices for keeping your assets secure.',
    difficulty: 'beginner',
    category: 'wallet',
    rewards: {
      xp: 75,
      tokens: 10
    },
    estimatedTime: '20 min',
    steps: [
      {
        id: 'step-1',
        title: 'Wallet Basics',
        description: 'Understand what cryptocurrency wallets are and the different types available.'
      },
      {
        id: 'step-2',
        title: 'Public and Private Keys',
        description: 'Learn about the cryptographic keys that secure your wallet and assets.'
      },
      {
        id: 'step-3',
        title: 'Set Up a Test Wallet',
        description: 'Follow a step-by-step guide to create a test wallet on a supported network.'
      },
      {
        id: 'step-4',
        title: 'Wallet Security Best Practices',
        description: 'Discover essential tips for keeping your wallet and funds safe.'
      }
    ],
    resources: [
      {
        title: 'Crypto Wallet Guide',
        url: 'https://www.coinbase.com/learn/crypto-basics/what-is-a-crypto-wallet',
        type: 'article'
      },
      {
        title: 'How to Create a MetaMask Wallet',
        url: 'https://metamask.io/download/',
        type: 'tutorial'
      }
    ]
  },
  {
    id: 'web3-introduction',
    title: 'Intro to Web3',
    description: 'Understand how Web3 is changing the internet and digital ownership',
    longDescription: 'Web3 represents the next evolution of the internet, focusing on decentralization, user ownership, and permissionless systems. This quest introduces you to Web3 concepts and explains how it differs from previous versions of the web.',
    difficulty: 'beginner',
    category: 'web3',
    rewards: {
      xp: 60,
      tokens: 7
    },
    estimatedTime: '25 min',
    steps: [
      {
        id: 'step-1',
        title: 'Web1, Web2, and Web3',
        description: 'Understand the evolution of the internet and what makes Web3 different.'
      },
      {
        id: 'step-2',
        title: 'Decentralization Benefits',
        description: 'Learn about the advantages of decentralized systems and applications.'
      },
      {
        id: 'step-3',
        title: 'Digital Ownership',
        description: 'Explore how Web3 enables true digital ownership through blockchain technology.'
      },
      {
        id: 'step-4',
        title: 'Web3 Applications',
        description: 'Discover real-world examples of Web3 applications and use cases.'
      }
    ],
    resources: [
      {
        title: 'What is Web3?',
        url: 'https://ethereum.org/en/web3/',
        type: 'article'
      },
      {
        title: 'The Web3 Revolution',
        url: 'https://www.youtube.com/watch?v=nHhAEkG1y2U',
        type: 'video'
      }
    ]
  },
  {
    id: 'nft-basics',
    title: 'NFT Fundamentals',
    description: 'Discover the world of Non-Fungible Tokens and digital collectibles',
    longDescription: 'Non-Fungible Tokens (NFTs) have revolutionized digital ownership and created new opportunities for creators and collectors. This quest explains what NFTs are, how they work, and their various applications in the digital world.',
    difficulty: 'beginner',
    category: 'nft',
    rewards: {
      xp: 65,
      tokens: 8
    },
    estimatedTime: '20 min',
    steps: [
      {
        id: 'step-1',
        title: 'What are NFTs?',
        description: 'Understand what makes NFTs unique and different from other crypto assets.'
      },
      {
        id: 'step-2',
        title: 'NFT Standards',
        description: 'Learn about ERC-721, ERC-1155, and other standards that define NFTs.'
      },
      {
        id: 'step-3',
        title: 'Creating and Collecting',
        description: 'Explore how NFTs are created, bought, sold, and collected in marketplaces.'
      },
      {
        id: 'step-4',
        title: 'NFT Use Cases',
        description: 'Discover various applications of NFTs beyond digital art and collectibles.'
      }
    ],
    resources: [
      {
        title: 'NFTs Explained',
        url: 'https://ethereum.org/en/nft/',
        type: 'article'
      },
      {
        title: 'How to Create Your First NFT',
        url: 'https://www.youtube.com/watch?v=tBYVUmV7Qh4',
        type: 'tutorial'
      }
    ]
  },
  {
    id: 'crypto-security',
    title: 'Cryptocurrency Security',
    description: 'Learn essential security practices to protect your digital assets',
    longDescription: 'Security is paramount in the world of cryptocurrencies. This quest covers the fundamental security practices and common threats you should be aware of to keep your digital assets safe.',
    difficulty: 'beginner',
    category: 'security',
    rewards: {
      xp: 80,
      tokens: 12
    },
    estimatedTime: '30 min',
    steps: [
      {
        id: 'step-1',
        title: 'Security Fundamentals',
        description: 'Understand the basic principles of cryptocurrency security.'
      },
      {
        id: 'step-2',
        title: 'Common Threats',
        description: 'Learn about phishing, scams, and other security risks in the crypto space.'
      },
      {
        id: 'step-3',
        title: 'Secure Storage',
        description: 'Explore different options for securely storing your cryptocurrency.'
      },
      {
        id: 'step-4',
        title: 'Best Practices',
        description: 'Implement essential security measures to protect your digital assets.'
      }
    ],
    resources: [
      {
        title: 'Crypto Security Guide',
        url: 'https://www.ledger.com/academy/basic-basics/choosing-the-right-crypto-wallet/crypto-security-basics',
        type: 'article'
      },
      {
        title: 'How to Avoid Crypto Scams',
        url: 'https://www.youtube.com/watch?v=2BJFh6ynlF4',
        type: 'video'
      }
    ]
  },
  {
    id: 'interactive-blockchain-quiz',
    title: 'Blockchain Interactive Quiz',
    description: 'Test your blockchain knowledge with this interactive quiz challenge',
    longDescription: 'Put your blockchain knowledge to the test with this interactive quiz! Answer questions about blockchain fundamentals, cryptocurrency basics, and Web3 concepts. This hands-on challenge will help solidify your understanding of key blockchain principles through engaging multiple-choice questions and scenario-based problems.',
    difficulty: 'beginner',
    category: 'basics',
    rewards: {
      xp: 100,
      tokens: 15
    },
    estimatedTime: '25 min',
    steps: [
      {
        id: 'step-1',
        title: 'Blockchain Terminology',
        description: 'Test your knowledge of essential blockchain terms and concepts.'
      },
      {
        id: 'step-2',
        title: 'Cryptocurrency Basics',
        description: 'Answer questions about cryptocurrency fundamentals and how they work.'
      },
      {
        id: 'step-3',
        title: 'Web3 Concepts',
        description: 'Challenge yourself with questions about Web3 applications and use cases.'
      },
      {
        id: 'step-4',
        title: 'Problem Solving',
        description: 'Tackle scenario-based questions that test your practical blockchain knowledge.'
      }
    ],
    resources: [
      {
        title: 'Blockchain Fundamentals',
        url: 'https://academy.binance.com/en/articles/what-is-blockchain-and-how-does-it-work',
        type: 'article'
      },
      {
        title: 'Interactive Blockchain Demo',
        url: 'https://andersbrownworth.com/blockchain/',
        type: 'tutorial'
      },
      {
        title: 'Web3 Explained Simply',
        url: 'https://www.youtube.com/watch?v=wHTcrmhskto',
        type: 'video'
      }
    ]
  },
  {
    id: 'defi-exploration',
    title: 'DeFi Exploration',
    description: 'Discover the world of Decentralized Finance and its key components',
    longDescription: 'Decentralized Finance (DeFi) is revolutionizing traditional financial systems by creating open, permissionless alternatives on blockchain networks. This quest introduces you to the core concepts of DeFi, including lending protocols, decentralized exchanges, and yield farming strategies, giving you a solid foundation to navigate this exciting new financial ecosystem.',
    difficulty: 'beginner',
    category: 'defi',
    rewards: {
      xp: 85,
      tokens: 15
    },
    estimatedTime: '35 min',
    steps: [
      {
        id: 'step-1',
        title: 'DeFi Fundamentals',
        description: 'Understand what DeFi is and how it differs from traditional finance systems.'
      },
      {
        id: 'step-2',
        title: 'Key DeFi Protocols',
        description: 'Learn about major DeFi protocols and their functions in the ecosystem.'
      },
      {
        id: 'step-3',
        title: 'DeFi Use Cases',
        description: 'Explore practical applications of DeFi including lending, borrowing, and trading.'
      },
      {
        id: 'step-4',
        title: 'DeFi Risks & Security',
        description: 'Understand the risks involved in DeFi and how to protect yourself.'
      }
    ],
    resources: [
      {
        title: 'DeFi Explained',
        url: 'https://ethereum.org/en/defi/',
        type: 'article'
      },
      {
        title: 'How to Use DeFi Safely',
        url: 'https://academy.binance.com/en/articles/the-complete-beginners-guide-to-decentralized-finance-defi',
        type: 'tutorial'
      },
      {
        title: 'DeFi in 5 Minutes',
        url: 'https://www.youtube.com/watch?v=k9HYC0EJU6E',
        type: 'video'
      }
    ]
  },
  {
    id: 'transaction-simulation',
    title: 'Blockchain Transaction Simulation',
    description: 'Practice sending and receiving tokens in a safe test environment',
    longDescription: 'Gain hands-on experience with blockchain transactions without risking real assets. This interactive simulation guides you through the process of sending and receiving tokens on a testnet, helping you understand transaction processes, gas fees, confirmation times, and blockchain explorers. Perfect for beginners who want practical experience in a risk-free environment.',
    difficulty: 'beginner',
    category: 'basics',
    rewards: {
      xp: 120,
      tokens: 20
    },
    estimatedTime: '40 min',
    steps: [
      {
        id: 'step-1',
        title: 'Set Up a Testnet Wallet',
        description: 'Create a wallet configured for a test network (Goerli, Sepolia, or Mumbai PoS).'
      },
      {
        id: 'step-2',
        title: 'Get Test Tokens',
        description: 'Learn how to request free test tokens from a faucet for your practice transactions.'
      },
      {
        id: 'step-3',
        title: 'Send Your First Transaction',
        description: 'Practice sending a test transaction and understand the confirmation process.'
      },
      {
        id: 'step-4',
        title: 'Track and Verify',
        description: 'Use a blockchain explorer to track your transaction and understand the data it contains.'
      }
    ],
    resources: [
      {
        title: 'Understanding Ethereum Transactions',
        url: 'https://ethereum.org/en/developers/docs/transactions/',
        type: 'article'
      },
      {
        title: 'Goerli Testnet Faucet',
        url: 'https://goerlifaucet.com/',
        type: 'tutorial'
      },
      {
        title: 'How to Use Etherscan',
        url: 'https://www.youtube.com/watch?v=NsU-9ylzaL8',
        type: 'video'
      }
    ]
  },
  {
    id: 'blockchain-interactive',
    title: 'Understanding Blockchain: Interactive',
    description: 'Learn about blockchain with interactive lessons and quizzes',
    longDescription: 'This interactive quest will guide you through key blockchain concepts with bite-sized learning modules and interactive quizzes. Understand how blockchain works, its key features, and why it matters for the future of digital transactions.',
    difficulty: 'beginner',
    category: 'basics',
    rewards: {
      xp: 100,
      tokens: 15
    },
    estimatedTime: '30 min',
    steps: [
      {
        id: 'step-1',
        title: 'What is Blockchain?',
        description: 'Learn the fundamental concepts of blockchain technology.'
      },
      {
        id: 'step-2',
        title: 'Key Features of Blockchain',
        description: 'Understand what makes blockchain unique and powerful.'
      },
      {
        id: 'step-3',
        title: 'Blockchain Use Cases',
        description: 'Explore real-world applications of blockchain technology.'
      },
      {
        id: 'step-4',
        title: 'Knowledge Assessment',
        description: 'Test your understanding with interactive quizzes.'
      }
    ],
    resources: [
      {
        title: 'Blockchain Explained',
        url: 'https://www.investopedia.com/terms/b/blockchain.asp',
        type: 'article'
      },
      {
        title: 'How Blockchain Works',
        url: 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
        type: 'video'
      },
      {
        title: 'Blockchain Beyond Cryptocurrency',
        url: 'https://hbr.org/2017/03/the-blockchain-will-do-to-banks-and-law-firms-what-the-internet-did-to-media',
        type: 'article'
      }
    ]
  }
]; 