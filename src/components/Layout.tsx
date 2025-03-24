import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedTransition from './AnimatedTransition';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AnimatedTransition className="flex-1 pt-24 pb-20 px-6 md:px-10">
        {children}
      </AnimatedTransition>
      <Footer />
    </div>
  );
}; 