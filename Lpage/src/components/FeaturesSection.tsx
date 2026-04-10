import React from 'react';
import { motion } from 'framer-motion';
import { Code, Bot, Eye, Globe, Cpu, Layout } from 'lucide-react';
import breakingCodeLogo from '../assets/breaking-code-logo.jpeg';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Code className="w-6 h-6 text-devmind-cyan" />,
      title: "Code Snippets",
      description: "Save and share your favorite code blocks with our cloud-synced snippet vault."
    },
    {
      icon: <Bot className="w-6 h-6 text-devmind-purple" />,
      title: "AI Assistance",
      description: "Get real-time suggestions and bug fixes from our advanced neural code completion."
    },
    {
      icon: <Eye className="w-6 h-6 text-devmind-cyan" />,
      title: "Data Visualization",
      description: "Deep dive into memory and structures with automated real-time visualizations."
    },
    {
      icon: <Globe className="w-6 h-6 text-devmind-purple" />,
      title: "Multi-Language",
      description: "Native support for over 50 languages including C++, Rust, Zig, and Python."
    },
    {
      icon: <Cpu className="w-6 h-6 text-devmind-cyan" />,
      title: "Fast Execution",
      description: "Compile and run heavy workloads with our distributed edge computing grid."
    },
    {
      icon: <Layout className="w-6 h-6 text-devmind-purple" />,
      title: "Clean UI",
      description: "Focus purely on logic with our award-winning minimal and distraction-free IDE."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="features" className="snap-section flex flex-col items-center justify-center bg-black px-6 py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0%,transparent_70%)] -z-10" />

      <div className="max-w-7xl w-full">
        <div className="text-center mb-16">
          <div className="mb-6 flex justify-center">
            <img
              src={breakingCodeLogo}
              alt="Breaking Code logo"
              className="h-16 w-auto rounded-2xl border border-white/10 object-contain shadow-[0_0_32px_rgba(90,255,188,0.12)]"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Engineered for <span className="text-devmind-purple">Next-Gen</span> Developers.
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We've reimagined the coding environment from the ground up, focusing on speed, clarity, and intelligence.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="react-bits-card p-8 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-devmind-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-devmind-cyan/10 transition-all duration-500 relative z-10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-devmind-cyan transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <footer className="absolute bottom-8 w-full px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 text-center text-gray-600">
          <img
            src={breakingCodeLogo}
            alt="Breaking Code logo"
            className="h-10 w-auto rounded-lg object-contain opacity-80"
          />
          <span className="text-[10px] tracking-widest uppercase">© 2026 Breaking Code Technologies. All logic reserved.</span>
        </div>
      </footer>
    </section>
  );
};

export default FeaturesSection;
