// Learning modules for interactive quests
import { LearningModule } from '@/types/learning';

export const blockchainBasicsModules: LearningModule[] = [
  {
    id: 'module-1',
    title: 'What is Blockchain?',
    content: {
      id: 'content-1',
      title: 'Understanding Blockchain Technology',
      content: `
        <p>A blockchain is a distributed database or ledger that is shared among nodes in a computer network. It stores information in digital format and is best known for its crucial role in cryptocurrency systems like Bitcoin.</p>
        
        <p>The innovation with blockchain is that it guarantees the fidelity and security of data records and generates trust without the need for a trusted third party.</p>
        
        <h4>Key aspects of blockchain:</h4>
        <ul>
          <li><strong>Distributed Nature:</strong> A blockchain is a type of distributed ledger technology (DLT) with transactions recorded with an immutable cryptographic signature called a hash.</li>
          <li><strong>Blocks of Data:</strong> The data is stored in blocks that are then linked together in a chain.</li>
          <li><strong>Decentralization:</strong> No single entity has control over the entire blockchain, making it resistant to censorship and single points of failure.</li>
        </ul>
      `,
      imageUrl: 'https://www.investopedia.com/thmb/O3Qy1pP8OQKvO3j-Xh9cpGOiQAQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/dotdash_Final_Blockchain_Sep_2020-01-60f31a638c4944abbcfde92e1a408a30.jpg'
    },
    questions: [
      {
        id: 'q1-m1',
        text: 'What is the main characteristic of blockchain technology?',
        options: [
          { id: 'a', text: 'It requires a central authority to verify transactions', isCorrect: false },
          { id: 'b', text: 'It is a distributed ledger shared among network nodes', isCorrect: true },
          { id: 'c', text: 'It can only be used for cryptocurrency transactions', isCorrect: false },
          { id: 'd', text: 'It stores data primarily in cloud servers', isCorrect: false }
        ],
        explanation: 'Blockchain is fundamentally a distributed ledger technology that maintains a continuously growing list of records (blocks) that are linked and secured using cryptography, without requiring a central authority.'
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Key Features of Blockchain',
    content: {
      id: 'content-2',
      title: 'What Makes Blockchain Unique',
      content: `
        <p>Blockchain technology has several unique features that differentiate it from traditional databases and systems:</p>
        
        <h4>1. Immutability</h4>
        <p>Once data is recorded on a blockchain, it becomes extremely difficult to change or tamper with. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data, creating a secure and permanent record.</p>
        
        <h4>2. Transparency</h4>
        <p>All participants in the network can see the transactions and data stored on the blockchain. This transparency builds trust as actions are visible to all participants.</p>
        
        <h4>3. Security</h4>
        <p>Blockchain uses advanced cryptographic techniques to secure data. The decentralized nature means there's no single point of failure for attackers to target.</p>
        
        <h4>4. Consensus Mechanisms</h4>
        <p>Blockchains employ various methods (like Proof of Work or Proof of Stake) to ensure all participants agree on the validity of transactions without needing a central authority.</p>
      `,
      imageUrl: 'https://www.simplilearn.com/ice9/free_resources_article_thumb/Blockchain_Comparative_Chart.jpg'
    },
    questions: [
      {
        id: 'q1-m2',
        text: 'Which feature of blockchain makes it difficult to alter past records?',
        options: [
          { id: 'a', text: 'Transparency', isCorrect: false },
          { id: 'b', text: 'Consensus mechanisms', isCorrect: false },
          { id: 'c', text: 'Immutability', isCorrect: true },
          { id: 'd', text: 'Decentralization', isCorrect: false }
        ],
        explanation: 'Immutability is the characteristic of blockchain that makes past records extremely difficult to alter. This is achieved through cryptographic hashing and the chain structure that links blocks together.'
      }
    ]
  },
  {
    id: 'module-3',
    title: 'Blockchain Use Cases',
    content: {
      id: 'content-3',
      title: 'Real-World Applications of Blockchain',
      content: `
        <p>While blockchain technology is most commonly associated with cryptocurrencies like Bitcoin, its potential applications extend far beyond digital currencies:</p>
        
        <h4>Finance and Banking</h4>
        <p>Blockchain enables faster and cheaper cross-border payments, automated compliance through smart contracts, and more efficient clearing and settlement processes.</p>
        
        <h4>Supply Chain Management</h4>
        <p>Companies use blockchain to track products from origin to consumer, ensuring authenticity, reducing fraud, and providing transparency in the supply chain.</p>
        
        <h4>Healthcare</h4>
        <p>Blockchain can securely store and share patient records across healthcare providers while maintaining privacy and providing an immutable audit trail.</p>
        
        <h4>Digital Identity</h4>
        <p>Blockchain-based identity systems give individuals control over their personal data and reduce the risk of identity theft.</p>
        
        <h4>Voting Systems</h4>
        <p>Blockchain can create transparent and tamper-proof voting records, potentially increasing election security and public trust.</p>
      `,
      imageUrl: 'https://builtin.com/sites/www.builtin.com/files/styles/ckeditor_optimize/public/inline-images/blockchain-applications-examples.jpg'
    },
    questions: [
      {
        id: 'q1-m3',
        text: 'Which of the following is NOT a common use case for blockchain technology?',
        options: [
          { id: 'a', text: 'Supply chain tracking', isCorrect: false },
          { id: 'b', text: 'Secure voting systems', isCorrect: false },
          { id: 'c', text: 'Centralized banking', isCorrect: true },
          { id: 'd', text: 'Healthcare record management', isCorrect: false }
        ],
        explanation: 'Centralized banking goes against the decentralized nature of blockchain technology. While blockchain is used in finance, it\'s typically for creating more decentralized or efficient systems, not reinforcing centralization.'
      }
    ]
  },
  {
    id: 'module-4',
    title: 'Blockchain vs. Traditional Databases',
    content: {
      id: 'content-4',
      title: 'How Blockchain Differs from Traditional Systems',
      content: `
        <p>To truly understand blockchain's value, it's helpful to compare it with traditional database systems:</p>
        
        <h4>Control Structure</h4>
        <p><strong>Traditional Database:</strong> Typically controlled by a single entity or organization.<br>
        <strong>Blockchain:</strong> Distributed across multiple nodes with no single point of control.</p>
        
        <h4>Data Modification</h4>
        <p><strong>Traditional Database:</strong> Records can be modified, updated, or deleted by authorized users.<br>
        <strong>Blockchain:</strong> Once data is recorded, it's extremely difficult to alter without consensus.</p>
        
        <h4>Trust Model</h4>
        <p><strong>Traditional Database:</strong> Requires trust in the central authority managing the database.<br>
        <strong>Blockchain:</strong> Trust is established through cryptographic verification and consensus.</p>
        
        <h4>Performance</h4>
        <p><strong>Traditional Database:</strong> Generally faster with higher transaction throughput.<br>
        <strong>Blockchain:</strong> Usually slower due to consensus mechanisms and decentralization.</p>
        
        <h4>Use Cases</h4>
        <p><strong>Traditional Database:</strong> Better for high-volume, private data that requires frequent updates.<br>
        <strong>Blockchain:</strong> Better for scenarios requiring transparency, immutability, and decentralized control.</p>
      `,
      imageUrl: 'https://101blockchains.com/wp-content/uploads/2020/01/Blockchain_vs_database-1.png'
    },
    questions: [
      {
        id: 'q1-m4',
        text: 'What is a key advantage of traditional databases over blockchain systems?',
        options: [
          { id: 'a', text: 'Better security', isCorrect: false },
          { id: 'b', text: 'Higher performance and transaction throughput', isCorrect: true },
          { id: 'c', text: 'No single point of failure', isCorrect: false },
          { id: 'd', text: 'Immutable records', isCorrect: false }
        ],
        explanation: 'Traditional databases typically offer higher performance and transaction throughput compared to blockchain systems, which require time-consuming consensus mechanisms to validate transactions across the network.'
      }
    ]
  }
];

// Define other module sets for different quests
export const cryptoWalletModules: LearningModule[] = [
  // To be implemented later
];

export const web3Modules: LearningModule[] = [
  // To be implemented later
]; 