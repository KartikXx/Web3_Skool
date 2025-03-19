export interface LeaderboardEntry {
  userId: string;
  userName: string;
  address?: string; 
  tokensEarned: number;
  questsCompleted: number;
  lastActive: string;
  avatarUrl?: string;
}

export const mockLeaderboardData: LeaderboardEntry[] = [
  {
    userId: "user1",
    userName: "CryptoMaster",
    address: "0x89a...b3f2",
    tokensEarned: 350,
    questsCompleted: 7,
    lastActive: "2023-04-01",
    avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=CryptoMaster"
  },
  {
    userId: "user2",
    userName: "BlockchainNinja",
    address: "0x45c...d7a1",
    tokensEarned: 275,
    questsCompleted: 5,
    lastActive: "2023-04-02",
    avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=BlockchainNinja"
  },
  {
    userId: "user3",
    userName: "TokenWhisperer",
    address: "0x12d...e9b4",
    tokensEarned: 410,
    questsCompleted: 8,
    lastActive: "2023-04-03",
    avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=TokenWhisperer"
  },
  {
    userId: "user4",
    userName: "SatoshiStudent",
    tokensEarned: 180,
    questsCompleted: 4,
    lastActive: "2023-04-01",
    avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=SatoshiStudent"
  },
  {
    userId: "user5",
    userName: "HashRateHunter",
    address: "0x78f...a2c5",
    tokensEarned: 520,
    questsCompleted: 10,
    lastActive: "2023-04-04",
    avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=HashRateHunter"
  },
  {
    userId: "user6",
    userName: "SmartContractSage",
    tokensEarned: 320,
    questsCompleted: 6,
    lastActive: "2023-04-02",
    avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=SmartContractSage"
  },
  {
    userId: "user7",
    userName: "DeFiDeveloper",
    address: "0x33a...c1e8",
    tokensEarned: 490,
    questsCompleted: 9,
    lastActive: "2023-04-03",
    avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=DeFiDeveloper"
  },
  {
    userId: "user8",
    userName: "Web3Wanderer",
    tokensEarned: 210,
    questsCompleted: 4,
    lastActive: "2023-04-01",
    avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=Web3Wanderer"
  },
  {
    userId: "user9",
    userName: "CoinCollector",
    address: "0x56e...f4d3",
    tokensEarned: 150,
    questsCompleted: 3,
    lastActive: "2023-04-02",
    avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=CoinCollector"
  },
  {
    userId: "user10",
    userName: "EthereumExplorer",
    tokensEarned: 380,
    questsCompleted: 7,
    lastActive: "2023-04-04",
    avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=EthereumExplorer"
  }
]; 