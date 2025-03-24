import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Learn',
      links: [
        { label: 'Getting Started', href: '/learn' },
        { label: 'Quests', href: '/quests' },
        { label: 'Rewards', href: '/rewards' },
        { label: 'Achievements', href: '/achievements' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'API', href: '/api' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Community', href: '/community' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ]
    }
  ];
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-blockchain-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white">
                  <path 
                    d="M12 3L17.5 6V12M12 3L6.5 6V12M12 3V9M17.5 12L12 15M17.5 12V18L12 21M12 15L6.5 12M12 15V21M6.5 12V18L12 21" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-semibold text-lg">Blockchain Heroes</span>
            </Link>
            
            <p className="text-muted-foreground mb-6 max-w-md">
              Learn blockchain technology through interactive quests, earn tokens, and collect achievement NFTs on your journey to becoming a WEB3 expert.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-muted-foreground hover:text-blockchain-500 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:hover:text-blockchain-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-muted-foreground hover:text-blockchain-500 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:hover:text-blockchain-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-muted-foreground hover:text-blockchain-500 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:hover:text-blockchain-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-discord"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M7.5 7.2c.7-.5 1.2-.8 1.9-1.1 2.2-.8 4.2-.9 6.1-.7 2 .2 3.5.8 4.4 1.3a5 5 0 0 1 .8.5"/><path d="M7.2 16.8c.7.5 1.2.8 1.9 1.1 2.2.8 4.2.9 6.1.7 2-.2 3.5-.8 4.4-1.3a5 5 0 0 0 .8-.5"/><path d="M8.4 17c-.1-.9-.2-1.8-.2-2.7.1-2.2.9-4.1 1.6-5.4.7-1.3 1.8-3 3.2-4"/><path d="M15.6 17c.1-.9.2-1.8.2-2.7-.1-2.2-.9-4.1-1.6-5.4-.7-1.3-1.8-3-3.2-4"/><path d="M20 21v-2l-2-1v-5.5a8 8 0 0 0-1.6-5.3L16 6.8"/><path d="M4 21v-2l2-1v-5.5a8 8 0 0 1 1.6-5.3L8 6.8"/></svg>
              </a>
            </div>
          </div>
          
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link to={link.href} className="text-muted-foreground hover:text-blockchain-500 transition-colors dark:hover:text-blockchain-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center dark:border-gray-800">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} Blockchain Heroes. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-blockchain-500 transition-colors dark:hover:text-blockchain-400">Privacy</Link>
            <Link to="/terms" className="hover:text-blockchain-500 transition-colors dark:hover:text-blockchain-400">Terms</Link>
            <Link to="/cookies" className="hover:text-blockchain-500 transition-colors dark:hover:text-blockchain-400">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
