
import React from 'react';
import { 
  Trophy, 
  Target, 
  ListChecks, 
  Coins, 
  Star, 
  Code, 
  Link, 
  Network, 
  Database, 
  Wallet,
  BookOpen,
  Globe,
  Sparkles,
  Lightbulb,
  ArrowRight as ArrowRightIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const QuestIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <ListChecks size={size} className={cn("stroke-blockchain-500", className)} {...props} />
);

export const AchievementIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <Trophy size={size} className={cn("stroke-blockchain-500", className)} {...props} />
);

export const TargetIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <Target size={size} className={cn("stroke-blockchain-500", className)} {...props} />
);

export const TokenIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <Coins size={size} className={cn("stroke-blockchain-500", className)} {...props} />
);

export const StarIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <Star size={size} className={cn("stroke-blockchain-500", className)} {...props} />
);

export const CodeIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <Code size={size} className={cn("stroke-blockchain-500", className)} {...props} />
);

export const BlockchainIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <Link size={size} className={cn("stroke-blockchain-500", className)} {...props} />
);

export const NetworkIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <Network size={size} className={cn("stroke-blockchain-500", className)} {...props} />
);

export const DatabaseIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <Database size={size} className={cn("stroke-blockchain-500", className)} {...props} />
);

export const WalletIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <Wallet size={size} className={cn("stroke-blockchain-500", className)} {...props} />
);

export const EducationIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <BookOpen size={size} className={cn("stroke-blockchain-500", className)} {...props} />
);

export const GlobalIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <Globe size={size} className={cn("stroke-blockchain-500", className)} {...props} />
);

export const SparklesIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <Sparkles size={size} className={cn("stroke-blockchain-500", className)} {...props} />
);

export const IdeaIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <Lightbulb size={size} className={cn("stroke-blockchain-500", className)} {...props} />
);

export const ArrowRightIcon: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
  <ArrowRightIcon size={size} className={cn("stroke-blockchain-500", className)} {...props} />
);
