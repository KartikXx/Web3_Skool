
import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is blockchain technology?",
    answer: "Blockchain is a distributed, immutable ledger that records transactions across a network of computers. Each block contains a timestamp and is linked to a previous block, forming a chain that cannot be altered without consensus from the network."
  },
  {
    question: "How do I earn tokens on this platform?",
    answer: "You earn tokens by completing educational quests, participating in challenges, and demonstrating your knowledge through tests and practical exercises. These tokens can be used to unlock advanced content or traded for NFT badges."
  },
  {
    question: "Do I need technical knowledge to start?",
    answer: "Not at all! Our platform is designed for beginners and experts alike. We start with the fundamentals and gradually introduce more complex concepts as you progress through the learning path."
  },
  {
    question: "What are NFT badges and how do I earn them?",
    answer: "NFT badges are digital certificates of achievement stored on the blockchain. You earn them by completing specific quests or reaching milestones in your learning journey. They prove your knowledge and skills in different blockchain domains."
  },
  {
    question: "Can I connect my existing Web3 wallet?",
    answer: "Yes! You can connect popular Web3 wallets like MetaMask, Coinbase Wallet, or WalletConnect to store your earned tokens and NFT badges. This feature will be available once you complete the initial onboarding quests."
  }
];

const FAQ: React.FC = () => {
  return (
    <section className="py-20 px-6 md:px-10 bg-blockchain-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Everything you need to know about blockchain learning and our platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
