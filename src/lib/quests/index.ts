import { Quest } from '@/types/quest';
import blockchainBasics from './blockchain-basics';
import blockchain101 from './blockchain-101';
import petNFT from './pet-nft';
import cryptoTreasureHunt from './crypto-treasure-hunt';
import web3SuperheroTraining from './web3-superhero-training';

// Export the basic-level quests first
const quests: Quest[] = [
  blockchainBasics,
  blockchain101,
  cryptoTreasureHunt,
  petNFT,
  web3SuperheroTraining
];

export default quests; 