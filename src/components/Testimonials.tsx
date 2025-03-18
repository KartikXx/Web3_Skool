
import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from '@/assets/icons';

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  role: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex Chen",
    avatar: "/placeholder.svg",
    role: "Blockchain Developer",
    content: "This platform transformed how I understand blockchain technology. The interactive quests made complex concepts easy to grasp, and I now feel confident building dApps.",
    rating: 5
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    role: "Finance Professional",
    content: "As someone from traditional finance, I was intimidated by blockchain. The step-by-step approach here made it accessible and I'm now implementing DeFi concepts in my work.",
    rating: 5
  },
  {
    id: 3,
    name: "Miguel Patel",
    avatar: "/placeholder.svg",
    role: "Student",
    content: "The NFT badges I earned through quests actually helped me land my first blockchain internship! Employers were impressed by my verifiable on-chain credentials.",
    rating: 4
  },
  {
    id: 4,
    name: "Lena Park",
    avatar: "/placeholder.svg",
    role: "Digital Artist",
    content: "I joined to learn about NFTs for my digital art. Not only did I learn the technical aspects, but I made connections with collectors through the community features.",
    rating: 5
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 px-6 md:px-10 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Heroes Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of learners who transformed their understanding of blockchain technology through our interactive platform.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col gap-5 p-6">
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            size={16} 
                            className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{testimonial.content}</p>
                      <div className="flex items-center gap-4 mt-auto">
                        <Avatar>
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </motion.div>
    </section>
  );
};

export default Testimonials;
