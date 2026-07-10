import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import breakingCodeLogo from '../../assets/breaking-code-logo.jpeg';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'FAQ', href: '#faq' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as Element;
      if (target.scrollTop > 50) setScrolled(true);
      else setScrolled(false);
    };

    const container = document.querySelector('.snap-container');
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <>
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

          {/* Desktop nav */}
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

            {/* Changelog link with pulsing badge */}
            <Link
              to="/changelog"
              className="relative flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-devmind-cyan transition-colors"
            >
              Changelog
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-devmind-cyan opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-devmind-cyan" />
              </span>
            </Link>

            {/* Open IDE CTA */}
            <Link to="/ide">
              <button className="flex items-center gap-2 px-5 py-2 bg-[#00ff88] text-black rounded-full text-sm font-bold hover:bg-[#00dd77] transition-all shadow-[0_0_20px_rgba(0,255,136,0.2)] hover:shadow-[0_0_30px_rgba(0,255,136,0.4)]">
                <Code2 size={15} />
                Open IDE
              </button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-300 hover:text-devmind-cyan transition-colors p-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile slide-out drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-72 bg-[#080808] border-l border-white/5 z-50 flex flex-col pt-24 pb-10 px-8 md:hidden"
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-5 right-6 text-gray-400 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>

              <nav className="flex flex-col gap-2 flex-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={handleLinkClick}
                    className="text-lg font-medium text-gray-300 hover:text-devmind-cyan transition-colors py-3 border-b border-white/5"
                  >
                    {link.name}
                  </a>
                ))}
                <Link
                  to="/changelog"
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 text-lg font-medium text-gray-300 hover:text-devmind-cyan transition-colors py-3 border-b border-white/5"
                >
                  Changelog
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-devmind-cyan opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-devmind-cyan" />
                  </span>
                </Link>
              </nav>

              <Link to="/ide" onClick={handleLinkClick} className="w-full">
                <button className="w-full py-3 bg-[#00ff88] text-black rounded-full text-sm font-bold hover:bg-[#00dd77] transition-all flex items-center justify-center gap-2">
                  <Code2 size={15} />
                  Open IDE
                </button>
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
