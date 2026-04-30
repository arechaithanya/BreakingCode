import React from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  initials: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    initials: 'AR',
    name: 'Aditya Rao',
    role: 'Senior SWE',
    company: 'Google',
    quote: 'The data structure visualizer is a game changer. I use it during every interview prep session — seeing a BST animate in real time makes it click instantly.',
    color: 'bg-devmind-cyan/20 text-devmind-cyan',
  },
  {
    initials: 'SK',
    name: 'Sara Kim',
    role: 'CS Student',
    company: 'MIT',
    quote: "I've tried every online IDE. Breaking Code is the only one where I don't feel like I'm fighting the environment. It just works, fast and clean.",
    color: 'bg-devmind-purple/20 text-devmind-purple',
  },
  {
    initials: 'MP',
    name: 'Marcus Patel',
    role: 'Tech Lead',
    company: 'Stripe',
    quote: 'We onboard new engineers with Breaking Code walkthroughs. The AI assistant catches off-by-one errors I would have missed in a ten-minute code review.',
    color: 'bg-devmind-cyan/20 text-devmind-cyan',
  },
  {
    initials: 'LN',
    name: 'Linh Nguyen',
    role: 'Competitive Programmer',
    company: 'ICPC Finalist',
    quote: 'Sub-100ms compile times aren\'t marketing fluff — I measured it. When every second counts in a contest, this is the edge.',
    color: 'bg-devmind-purple/20 text-devmind-purple',
  },
  {
    initials: 'JM',
    name: 'Jordan Miles',
    role: 'Fullstack Dev',
    company: 'YC Startup',
    quote: 'Switching from Replit saved us $200/mo and gave us better AI suggestions. The team collaboration mode is surprisingly polished.',
    color: 'bg-devmind-cyan/20 text-devmind-cyan',
  },
  {
    initials: 'PT',
    name: 'Priya Tiwari',
    role: 'DSA Instructor',
    company: 'Coding Bootcamp',
    quote: "I project Breaking Code live in class. Students understand linked lists three times faster when they can watch pointers update in real time.",
    color: 'bg-devmind-purple/20 text-devmind-purple',
  },
];

const TestimonialCard: React.FC<{ t: Testimonial; delay: number }> = ({ t, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="react-bits-card p-6 flex flex-col gap-4 h-full"
  >
    <p className="text-gray-300 text-sm leading-relaxed flex-1">
      <span className="text-2xl leading-none text-devmind-cyan mr-1 font-serif">"</span>
      {t.quote}
      <span className="text-2xl leading-none text-devmind-cyan ml-1 font-serif">"</span>
    </p>
    <div className="flex items-center gap-3 pt-2 border-t border-white/5">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${t.color}`}>
        {t.initials}
      </div>
      <div>
        <p className="text-white font-semibold text-sm">{t.name}</p>
        <p className="text-gray-500 text-xs">{t.role} · {t.company}</p>
      </div>
    </div>
  </motion.div>
);

const TestimonialsSection: React.FC = () => {
  return (
    <section className="snap-section flex flex-col items-center justify-center bg-devmind-dark px-6 py-20 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,255,255,0.04)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-devmind-cyan text-sm tracking-[0.3em] uppercase mb-3 font-medium">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Trusted by <span className="text-devmind-cyan">developers</span> worldwide.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => (
            <TestimonialCard key={idx} t={t} delay={idx * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
