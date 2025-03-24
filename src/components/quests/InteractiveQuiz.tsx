import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, ArrowRight, HelpCircle, Award } from 'lucide-react';
import { useQuests } from '@/contexts/QuestContext';
import { toast } from 'sonner';

interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation?: string;
}

interface InteractiveQuizProps {
  questId: string;
  onComplete?: () => void;
}

// Sample blockchain quiz questions
const QUIZ_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'What is the main feature of blockchain technology?',
    options: [
      { id: 'a', text: 'Central control by a single entity', isCorrect: false },
      { id: 'b', text: 'Distributed ledger with decentralized verification', isCorrect: true },
      { id: 'c', text: 'High-speed transactions without verification', isCorrect: false },
      { id: 'd', text: 'Free transactions for all users', isCorrect: false },
    ],
    explanation: 'Blockchain uses a distributed ledger where transactions are verified by multiple nodes in the network, making it decentralized and resistant to manipulation.'
  },
  {
    id: 'q2',
    text: 'What secures transactions on a blockchain?',
    options: [
      { id: 'a', text: 'Government regulations', isCorrect: false },
      { id: 'b', text: 'Traditional banking systems', isCorrect: false },
      { id: 'c', text: 'Cryptographic algorithms', isCorrect: true },
      { id: 'd', text: 'Manual verification by employees', isCorrect: false },
    ],
    explanation: 'Cryptographic algorithms secure blockchain transactions, making them tamper-proof and verifiable by all network participants.'
  },
  {
    id: 'q3',
    text: 'Which of these is NOT typically a feature of Web3?',
    options: [
      { id: 'a', text: 'Decentralization', isCorrect: false },
      { id: 'b', text: 'User ownership of data', isCorrect: false },
      { id: 'c', text: 'Centralized control of user accounts', isCorrect: true },
      { id: 'd', text: 'Token-based economics', isCorrect: false },
    ],
    explanation: 'Web3 emphasizes decentralization and user ownership rather than centralized control of accounts and data, which is characteristic of Web2.'
  },
  {
    id: 'q4',
    text: 'What is a smart contract?',
    options: [
      { id: 'a', text: 'A legal document signed by blockchain users', isCorrect: false },
      { id: 'b', text: 'Self-executing code that runs when conditions are met', isCorrect: true },
      { id: 'c', text: 'A contract between miners and validators', isCorrect: false },
      { id: 'd', text: 'A type of cryptocurrency token', isCorrect: false },
    ],
    explanation: 'Smart contracts are self-executing pieces of code stored on a blockchain that automatically run when predetermined conditions are met.'
  },
  {
    id: 'q5',
    text: 'Which consensus mechanism is more energy-efficient?',
    options: [
      { id: 'a', text: 'Proof of Work (PoW)', isCorrect: false },
      { id: 'b', text: 'Proof of Stake (PoS)', isCorrect: true },
      { id: 'c', text: 'Proof of Authority (PoA)', isCorrect: false },
      { id: 'd', text: 'All use the same amount of energy', isCorrect: false },
    ],
    explanation: 'Proof of Stake (PoS) is significantly more energy-efficient than Proof of Work (PoW) as it doesn\'t require intensive computational work to validate transactions.'
  },
  {
    id: 'q6',
    text: 'What problem does Web3 aim to solve?',
    options: [
      { id: 'a', text: 'Internet speed', isCorrect: false },
      { id: 'b', text: 'Content recommendation quality', isCorrect: false },
      { id: 'c', text: 'Centralization of data and control', isCorrect: true },
      { id: 'd', text: 'Device compatibility', isCorrect: false },
    ],
    explanation: 'Web3 aims to address the centralization of data and control that exists in Web2, where large corporations control user data and online experiences.'
  },
  {
    id: 'q7',
    text: 'What makes NFTs unique compared to cryptocurrencies like Bitcoin?',
    options: [
      { id: 'a', text: 'NFTs are much cheaper to create', isCorrect: false },
      { id: 'b', text: 'NFTs represent unique non-fungible assets', isCorrect: true },
      { id: 'c', text: 'NFTs can only be used for digital art', isCorrect: false },
      { id: 'd', text: 'NFTs are not stored on blockchains', isCorrect: false },
    ],
    explanation: 'Unlike cryptocurrencies which are fungible (one Bitcoin equals any other Bitcoin), NFTs represent unique, non-fungible digital assets with distinct values and properties.'
  },
  {
    id: 'q8',
    text: 'What is the primary purpose of a cryptocurrency wallet?',
    options: [
      { id: 'a', text: 'To store your actual coins and tokens', isCorrect: false },
      { id: 'b', text: 'To store your private keys that prove ownership', isCorrect: true },
      { id: 'c', text: 'To mine new cryptocurrencies', isCorrect: false },
      { id: 'd', text: 'To convert between different cryptocurrencies', isCorrect: false },
    ],
    explanation: 'Cryptocurrency wallets don\'t actually store your coins—they store your private keys that prove you own the assets recorded on the blockchain.'
  },
];

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ questId, onComplete }) => {
  const { updateProgress, completeQuest } = useQuests();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const progress = (currentQuestionIndex / QUIZ_QUESTIONS.length) * 100;

  useEffect(() => {
    // Update progress in the quest context
    updateProgress(questId, progress);
  }, [progress, questId, updateProgress]);

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;
    
    setSelectedOption(optionId);
    setIsAnswered(true);
    
    const isCorrect = currentQuestion.options.find(opt => opt.id === optionId)?.isCorrect;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      toast.success('Correct answer!');
    } else {
      toast.error('Incorrect answer.');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
      const finalScore = (correctAnswers / QUIZ_QUESTIONS.length) * 100;
      
      // Consider the quest complete if the user scores at least 70%
      if (finalScore >= 70) {
        completeQuest(questId);
        toast.success('Quest completed! You can now claim your reward.');
        if (onComplete) onComplete();
      } else {
        toast.info('You need to score at least 70% to complete this quest. Try again!');
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectAnswers(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const score = (correctAnswers / QUIZ_QUESTIONS.length) * 100;
    const passed = score >= 70;

    return (
      <Card className="p-6 flex flex-col items-center text-center">
        <div className="mb-4">
          {passed ? 
            <CheckCircle className="h-16 w-16 text-green-500 mb-2" /> : 
            <AlertCircle className="h-16 w-16 text-red-500 mb-2" />
          }
        </div>
        
        <h2 className="text-2xl font-bold mb-2">
          {passed ? 'Congratulations!' : 'Almost There!'}
        </h2>
        
        <p className="text-muted-foreground mb-4">
          {passed 
            ? `You scored ${score.toFixed(0)}% and completed the blockchain quiz!` 
            : `You scored ${score.toFixed(0)}%. You need 70% to pass. Try again!`
          }
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={resetQuiz}
          >
            Try Again
          </Button>
          
          {passed && (
            <Button 
              className="flex-1 gap-2"
              onClick={() => {
                if (onComplete) onComplete();
              }}
            >
              <Award className="h-4 w-4" />
              Claim Reward
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Progress bar */}
      <div className="w-full bg-muted">
        <div 
          className="h-1.5 bg-blockchain-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="p-6">
        {/* Question count */}
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
          </Badge>
          <Badge variant="outline" className="bg-blockchain-50 dark:bg-blockchain-900/20">
            Score: {correctAnswers}/{currentQuestionIndex + (isAnswered ? 1 : 0)}
          </Badge>
        </div>
        
        {/* Question */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-start gap-3">
            <HelpCircle className="h-6 w-6 text-blockchain-500 flex-shrink-0 mt-0.5" />
            <span>{currentQuestion.text}</span>
          </h3>
          
          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option.id;
              const showCorrect = isAnswered && option.isCorrect;
              const showIncorrect = isAnswered && isSelected && !option.isCorrect;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-lg border transition-all flex items-center gap-3
                    ${isSelected ? 'border-blockchain-500' : 'border-border'} 
                    ${showCorrect ? 'bg-green-50 border-green-500 dark:bg-green-900/20' : ''}
                    ${showIncorrect ? 'bg-red-50 border-red-500 dark:bg-red-900/20' : ''}
                    ${!isAnswered ? 'hover:border-blockchain-500 hover:bg-blockchain-50/50 dark:hover:bg-blockchain-900/10' : ''}
                  `}
                >
                  <span className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0">
                    {option.id.toUpperCase()}
                  </span>
                  <span className="flex-1">{option.text}</span>
                  {showCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {showIncorrect && <AlertCircle className="h-5 w-5 text-red-500" />}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Explanation when answered */}
        {isAnswered && currentQuestion.explanation && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/50">
            <p className="text-sm">{currentQuestion.explanation}</p>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="flex justify-end">
          <Button 
            onClick={handleNextQuestion}
            disabled={!isAnswered}
            className="gap-2"
          >
            {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}; 