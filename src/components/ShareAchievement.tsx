import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Share, Copy, Twitter, Facebook, Linkedin, Check } from 'lucide-react';

interface ShareAchievementProps {
  title: string;
  description?: string;
  imageUrl?: string;
  type: 'quest' | 'achievement';
  trigger?: React.ReactNode;
}

const ShareAchievement: React.FC<ShareAchievementProps> = ({
  title,
  description,
  imageUrl,
  type,
  trigger
}) => {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = window.location.href;
  const shareTitle = `I just ${type === 'quest' ? 'completed' : 'earned'} "${title}" at Blockchain Heroes!`;
  const shareText = description || `Join me in learning about blockchain and Web3 technologies.`;
  
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);
  
  // Share links
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}%0A${encodedText}&url=${encodedUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  const shareOptions = [
    {
      name: 'Twitter',
      icon: <Twitter size={20} className="text-[#1DA1F2]" />,
      url: twitterShareUrl,
      color: 'bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20',
    },
    {
      name: 'Facebook',
      icon: <Facebook size={20} className="text-[#4267B2]" />,
      url: facebookShareUrl,
      color: 'bg-[#4267B2]/10 hover:bg-[#4267B2]/20',
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={20} className="text-[#0077B5]" />,
      url: linkedinShareUrl,
      color: 'bg-[#0077B5]/10 hover:bg-[#0077B5]/20',
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Share size={16} />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your {type === 'quest' ? 'Completion' : 'Achievement'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {imageUrl && (
            <div className="flex justify-center mb-4">
              <img 
                src={imageUrl} 
                alt={title} 
                className="max-h-48 rounded-lg border shadow-sm"
              />
            </div>
          )}
          
          <div className="bg-blockchain-50 dark:bg-blockchain-950 p-4 rounded-lg">
            <p className="font-medium mb-1">{shareTitle}</p>
            <p className="text-sm text-muted-foreground">{shareText}</p>
          </div>
          
          <div className="flex gap-2">
            {shareOptions.map((option) => (
              <TooltipProvider key={option.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={option.color}
                      onClick={() => window.open(option.url, '_blank')}
                    >
                      {option.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share on {option.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          
          <div className="relative">
            <Input
              value={shareUrl}
              readOnly
              className="pr-16"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7"
              onClick={handleCopyLink}
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareAchievement; 