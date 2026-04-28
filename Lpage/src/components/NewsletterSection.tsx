import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Globe, MessageCircle, ExternalLink } from 'lucide-react';
import breakingCodeLogo from '../assets/breaking-code-logo.jpeg';

const socialLinks = [
  { icon: <ExternalLink className="w-5 h-5" />, label: 'GitHub', href: 'https://github.com' },
  { icon: <Globe className="w-5 h-5" />, label: 'Twitter / X', href: 'https://twitter.com' },
  { icon: <MessageCircle className="w-5 h-5" />, label: 'Discord', href: 'https://discord.com' },
];

const footerLinks = [
  { section: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
  { section: 'Resources', links: ['Documentation', 'Blog', 'Tutorials', 'Status'] },
  { section: 'Company', links: ['About', 'Careers', 'Privacy', 'Terms'] },
];

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="snap-section-auto flex flex-col bg-black px-6 pt-20 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,255,0.04)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
        {/* Newsletter card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="react-bits-card p-10 md:p-14 text-center mb-16 border-devmind-cyan/10"
        >
          <p className="text-devmind-cyan text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            Join the waitlist
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Be first when we <span className="text-transparent bg-clip-text bg-gradient-to-r from-devmind-cyan to-devmind-purple">ship</span>.
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-10">
            Get early access, feature announcements, and exclusive launch-day discounts straight to your inbox. No spam, ever.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-devmind-cyan/10 border border-devmind-cyan/30 text-devmind-cyan font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-devmind-cyan animate-pulse" />
              You're on the list — we'll be in touch!
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-devmind-cyan/50 transition-colors"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-devmind-cyan text-black font-bold rounded-xl text-sm hover:bg-white transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
                Join Waitlist
              </button>
            </form>
          )}
        </motion.div>

        {/* Footer links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <img
              src={breakingCodeLogo}
              alt="Breaking Code logo"
              className="h-12 w-auto rounded-xl mb-4 object-contain"
            />
            <p className="text-gray-500 text-sm leading-relaxed">
              Intelligence in every byte. Next-generation cloud IDE for serious developers.
            </p>
            <div className="flex gap-4 mt-5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-gray-600 hover:text-devmind-cyan transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((col) => (
            <div key={col.section}>
              <h4 className="text-white text-sm font-semibold mb-4">{col.section}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-600 uppercase tracking-widest">
          <span>© 2026 Breaking Code Technologies. All logic reserved.</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            All systems operational
          </span>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
