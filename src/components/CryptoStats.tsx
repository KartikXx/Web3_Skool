
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { BitcoinIcon, EthereumIcon, TrendingUpIcon, TrendingDownIcon } from '@/components/CryptoIcons';

interface CryptoStat {
  name: string;
  symbol: string;
  price: string;
  change: string;
  icon: React.ReactNode;
  trending: 'up' | 'down';
}

const cryptoStats: CryptoStat[] = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$42,384.21',
    change: '+2.4%',
    icon: <BitcoinIcon />,
    trending: 'up',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$2,321.09',
    change: '+1.8%',
    icon: <EthereumIcon />,
    trending: 'up',
  },
  {
    name: 'BNB Chain',
    symbol: 'BNB',
    price: '$381.50',
    change: '-0.5%',
    icon: <BitcoinIcon />,
    trending: 'down',
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    price: '$109.75',
    change: '+5.2%',
    icon: <EthereumIcon />,
    trending: 'up',
  },
];

const CryptoStats: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="py-3 overflow-hidden bg-blockchain-50 border-y border-blockchain-100"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative">
          <div className="flex space-x-8 animate-marquee">
            {[...cryptoStats, ...cryptoStats].map((crypto, index) => (
              <div key={index} className="flex items-center space-x-2 min-w-max">
                <div className="w-6 h-6">
                  {crypto.icon}
                </div>
                <span className="font-medium">{crypto.symbol}</span>
                <span>{crypto.price}</span>
                <Badge variant={crypto.trending === 'up' ? 'default' : 'destructive'} className="flex items-center space-x-1 py-1">
                  {crypto.trending === 'up' ? 
                    <TrendingUpIcon className="h-3 w-3" /> : 
                    <TrendingDownIcon className="h-3 w-3" />
                  }
                  <span>{crypto.change}</span>
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CryptoStats;
