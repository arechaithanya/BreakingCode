import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import breakingCodeLogo from '../assets/breaking-code-logo.jpeg';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e: any) => {
      if (e.target.scrollTop > 50) setScrolled(true);
      else setScrolled(false);
    };
    
    const container = document.querySelector('.snap-container');
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Account', href: '#account' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="flex items-center">
          <img
            src={breakingCodeLogo}
            alt="Breaking Code logo"
            className="h-14 w-auto object-contain md:h-16"
          />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-devmind-cyan transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button className="px-5 py-2 glass rounded-full text-sm font-semibold hover:border-devmind-cyan/50 hover:text-devmind-cyan transition-all">
            Get Started
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
