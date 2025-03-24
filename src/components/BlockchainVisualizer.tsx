import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, ChevronRight, Shield, Key, CheckCircle, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
// @ts-ignore
import confetti from 'canvas-confetti';
import { Badge } from '@/components/ui/badge';

interface Block {
  id: number;
  hash: string;
  prevHash: string;
  data: string;
  nonce: number;
  timestamp: number;
  valid: boolean;
}

interface BlockchainVisualizerProps {
  className?: string;
  onBlockMined?: (blockCount: number) => void;
  interactive?: boolean;
  initialBlocks?: number;
  maxBlocks?: number;
}

export const BlockchainVisualizer: React.FC<BlockchainVisualizerProps> = ({
  className,
  onBlockMined,
  interactive = true,
  initialBlocks = 1,
  maxBlocks = 5
}) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [pendingData, setPendingData] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(2);
  const [mining, setMining] = useState<boolean>(false);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate a simple hash (for demo purposes)
  const calculateHash = (index: number, prevHash: string, timestamp: number, data: string, nonce: number): string => {
    const input = `${index}${prevHash}${timestamp}${data}${nonce}`;
    let hash = '';
    
    // Simple hash function for visualization purposes
    for (let i = 0; i < input.length; i++) {
      hash += (input.charCodeAt(i) + nonce).toString(16);
    }
    
    return hash.substring(0, 64);
  };

  // Check if hash meets difficulty (starts with n zeros)
  const hashMeetsDifficulty = (hash: string, difficulty: number): boolean => {
    const prefix = '0'.repeat(difficulty);
    return hash.substring(0, difficulty) === prefix;
  };

  // Create the genesis block
  useEffect(() => {
    const genesisBlock: Block = {
      id: 0,
      hash: '',
      prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      data: 'Genesis Block',
      nonce: 0,
      timestamp: Date.now(),
      valid: true
    };
    
    genesisBlock.hash = calculateHash(
      genesisBlock.id,
      genesisBlock.prevHash,
      genesisBlock.timestamp,
      genesisBlock.data,
      genesisBlock.nonce
    );
    
    setBlocks([genesisBlock]);
    
    // Add initial blocks if specified
    if (initialBlocks > 1) {
      for (let i = 1; i < initialBlocks; i++) {
        addBlock(`Block ${i} Data`);
      }
    }
  }, []);

  // Validate the entire blockchain
  const validateChain = () => {
    let newBlocks = [...blocks];
    let isValid = true;
    
    for (let i = 1; i < newBlocks.length; i++) {
      const currentBlock = newBlocks[i];
      const previousBlock = newBlocks[i - 1];
      
      // Check hash connection
      if (currentBlock.prevHash !== previousBlock.hash) {
        newBlocks[i] = { ...currentBlock, valid: false };
        isValid = false;
      } else {
        // Verify the block's hash
        const hash = calculateHash(
          currentBlock.id,
          currentBlock.prevHash,
          currentBlock.timestamp,
          currentBlock.data,
          currentBlock.nonce
        );
        
        if (hash !== currentBlock.hash || !hashMeetsDifficulty(hash, difficulty)) {
          newBlocks[i] = { ...currentBlock, valid: false };
          isValid = false;
        } else {
          newBlocks[i] = { ...currentBlock, valid: true };
        }
      }
    }
    
    setBlocks(newBlocks);
    return isValid;
  };

  // Add a new block to the chain
  const addBlock = (data: string) => {
    const lastBlock = blocks[blocks.length - 1];
    const newBlock: Block = {
      id: lastBlock.id + 1,
      hash: '',
      prevHash: lastBlock.hash,
      data: data,
      nonce: 0,
      timestamp: Date.now(),
      valid: false
    };
    
    const hash = calculateHash(
      newBlock.id,
      newBlock.prevHash,
      newBlock.timestamp,
      newBlock.data,
      newBlock.nonce
    );
    
    newBlock.hash = hash;
    newBlock.valid = hashMeetsDifficulty(hash, difficulty);
    
    setBlocks([...blocks, newBlock]);
    setPendingData('');
  };

  // Mine a block
  const mineBlock = async (blockIndex: number) => {
    if (mining) return;
    
    setMining(true);
    const block = blocks[blockIndex];
    let nonce = 0;
    let hash = '';
    let found = false;
    
    // Create a copy of blocks to update during mining
    const newBlocks = [...blocks];
    
    // Simulate mining with visual feedback
    while (!found && nonce < 100) { // Limit for demo purposes
      hash = calculateHash(
        block.id,
        block.prevHash,
        block.timestamp,
        block.data,
        nonce
      );
      
      // Update the block being mined
      newBlocks[blockIndex] = {
        ...block,
        nonce,
        hash
      };
      setBlocks(newBlocks);
      
      // Check if hash meets difficulty
      found = hashMeetsDifficulty(hash, difficulty);
      
      if (!found) {
        nonce++;
        // Add delay for visual effect
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Update the final state
    const finalBlocks = [...blocks];
    finalBlocks[blockIndex] = {
      ...block,
      nonce,
      hash,
      valid: found
    };
    
    setBlocks(finalBlocks);
    setMining(false);
    
    if (found) {
      // Create confetti effect on successful mining
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { 
            x: (rect.left + rect.width/2) / window.innerWidth,
            y: (rect.top + rect.height/2) / window.innerHeight
          }
        });
      }
      
      toast.success(`Block ${blockIndex} successfully mined!`);
      
      // Validate the entire chain
      validateChain();
      
      // Call the callback if provided
      if (onBlockMined) {
        onBlockMined(blocks.length);
      }
    } else {
      toast.error('Mining failed. Try increasing the nonce limit or decreasing difficulty.');
    }
  };

  // Tamper with a block's data
  const tamperWithBlock = (blockIndex: number, newData: string) => {
    if (blockIndex === 0) {
      toast.error("Cannot tamper with the Genesis Block!");
      return;
    }
    
    const newBlocks = [...blocks];
    newBlocks[blockIndex] = {
      ...newBlocks[blockIndex],
      data: newData
    };
    
    // Recalculate the hash for the tampered block
    const hash = calculateHash(
      newBlocks[blockIndex].id,
      newBlocks[blockIndex].prevHash,
      newBlocks[blockIndex].timestamp,
      newData,
      newBlocks[blockIndex].nonce
    );
    
    newBlocks[blockIndex].hash = hash;
    newBlocks[blockIndex].valid = hashMeetsDifficulty(hash, difficulty);
    
    setBlocks(newBlocks);
    validateChain();
  };

  // Generate a new block with user data
  const handleAddBlock = () => {
    if (!pendingData.trim()) {
      toast.error('Please enter some data for the new block');
      return;
    }
    
    if (blocks.length >= maxBlocks) {
      toast.error(`Maximum of ${maxBlocks} blocks reached for this demo`);
      return;
    }
    
    addBlock(pendingData);
    toast.success('New block added! Mine it to validate.');
    setSelectedBlock(blocks.length);
  };

  return (
    <div className={cn("w-full space-y-6", className)} ref={containerRef}>
      {/* Controls */}
      {interactive && (
        <Card className="p-4 bg-muted/50">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="blockData">Block Data</Label>
                <div className="flex gap-2">
                  <Input
                    id="blockData"
                    placeholder="Enter data for the new block"
                    value={pendingData}
                    onChange={(e) => setPendingData(e.target.value)}
                    disabled={blocks.length >= maxBlocks}
                  />
                  <Button onClick={handleAddBlock} disabled={blocks.length >= maxBlocks || mining}>
                    Add Block
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Mining Difficulty: {difficulty}</Label>
                  <span className="text-sm text-muted-foreground">
                    (Higher = harder to mine)
                  </span>
                </div>
                <Slider
                  value={[difficulty]}
                  min={1}
                  max={4}
                  step={1}
                  onValueChange={(value) => setDifficulty(value[0])}
                  disabled={mining}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Blockchain Visualization */}
      <div className="space-y-4">
        <AnimatePresence>
          {blocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                "border rounded-lg p-4 transition-all",
                selectedBlock === index ? "ring-2 ring-blockchain-500" : "",
                block.valid 
                  ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" 
                  : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
              )}
              onClick={() => setSelectedBlock(index)}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Shield className={cn(
                      "w-5 h-5",
                      block.valid ? "text-green-500" : "text-red-500"
                    )} />
                    <span className="font-bold">Block #{block.id}</span>
                    {block.valid ? (
                      <Badge className="bg-green-500 text-xs">Valid</Badge>
                    ) : (
                      <Badge className="bg-red-500 text-xs">Invalid</Badge>
                    )}
                  </div>
                  
                  {index > 0 && interactive && selectedBlock === index && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => mineBlock(index)}
                      disabled={mining || block.valid}
                      className={block.valid ? "bg-green-100" : ""}
                    >
                      {mining && selectedBlock === index ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Key className="w-4 h-4 mr-2" />
                      )}
                      {block.valid ? "Mined" : "Mine Block"}
                    </Button>
                  )}
                </div>
                
                {/* Block connection visualization */}
                {index > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <div className="flex-1 border-t border-dashed border-muted"></div>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <div className="flex-1 border-t border-dashed border-muted"></div>
                  </div>
                )}
                
                {/* Block content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1 flex items-center">
                      <Hash className="w-3 h-3 mr-1" /> Previous Hash:
                    </p>
                    <div className="font-mono text-xs bg-muted p-2 rounded overflow-hidden truncate">
                      {block.prevHash}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground mb-1 flex items-center">
                      <Hash className="w-3 h-3 mr-1" /> Current Hash:
                    </p>
                    <div className={cn(
                      "font-mono text-xs p-2 rounded overflow-hidden truncate",
                      block.valid 
                        ? "bg-green-100 dark:bg-green-900/40" 
                        : "bg-red-100 dark:bg-red-900/40"
                    )}>
                      {block.hash}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground mb-1">Data:</p>
                    <div className="relative">
                      {interactive && selectedBlock === index && index > 0 ? (
                        <Input
                          value={block.data}
                          onChange={(e) => tamperWithBlock(index, e.target.value)}
                          className="font-mono text-sm"
                        />
                      ) : (
                        <div className="font-mono text-sm bg-muted p-2 rounded">
                          {block.data}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground mb-1">Nonce: {block.nonce}</p>
                    <p className="text-muted-foreground text-xs">
                      Timestamp: {new Date(block.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground mb-1">Status:</p>
                    <div className="flex items-center gap-2">
                      {block.valid ? (
                        <div className="text-green-500 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Validated
                        </div>
                      ) : (
                        <div className="text-red-500 flex items-center gap-1">
                          <X className="w-4 h-4" /> Needs Mining
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Legend */}
      <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">How It Works:</h3>
        <ul className="space-y-1">
          <li>• Each block contains data and links to the previous block via its hash</li>
          <li>• Mining finds a nonce value that makes the block's hash start with zeros</li>
          <li>• Changing data in a block invalidates its hash and all subsequent blocks</li>
          <li>• The more leading zeros required (higher difficulty), the harder mining becomes</li>
        </ul>
      </div>
    </div>
  );
}; 