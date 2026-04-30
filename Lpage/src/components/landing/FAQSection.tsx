import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What programming languages does Breaking Code support?',
    answer:
      'Breaking Code supports 50+ languages including Python, C, C++, Java, JavaScript, TypeScript, Rust, Go, Zig, Ruby, Kotlin, and many more. We add new language support regularly — check the changelog for the latest additions.',
  },
  {
    question: 'How fast is the cloud compiler?',
    answer:
      'Our distributed edge grid delivers average compile and execution times under 100ms for most workloads. Heavy tasks (large C++ binaries, memory-intensive algorithms) typically complete within 2–5 seconds thanks to isolated container scheduling.',
  },
  {
    question: 'Is my code stored securely?',
    answer:
      'Yes. All code and user data is encrypted at rest (AES-256) and in transit (TLS 1.3). Sandboxed execution containers are isolated per-run and destroyed immediately after execution, so no data persists between runs unless you save it explicitly.',
  },
  {
    question: 'Can I use Breaking Code offline?',
    answer:
      'Breaking Code is a cloud-first platform, so compilation and execution require an internet connection. However, you can write code in the editor offline — it syncs when you reconnect. A local execution mode is on our roadmap.',
  },
  {
    question: 'How does the Data Structure Visualizer work?',
    answer:
      'The visualizer intercepts standard data structure operations (insert, delete, traverse) and renders animated spatial views in real time. It currently supports arrays, linked lists, stacks, queues, binary trees, and graphs. More structures are being added every sprint.',
  },
  {
    question: 'What is the AI code assistant powered by?',
    answer:
      'Our AI assistant is built on a fine-tuned code model optimized for bug detection, auto-completion, and algorithmic suggestions. It understands context across your entire file — not just the current line — for accurate multi-line completions.',
  },
  {
    question: 'Do you offer a student or educational discount?',
    answer:
      'Yes! Students with a valid .edu email get 50% off the Pro plan. We also have a free Classroom tier for educators who want to run guided coding sessions. Reach out to edu@breakingcode.dev to apply.',
  },
  {
    question: 'How does billing work for the Team plan?',
    answer:
      'Team plans are billed per seat, per month. You can add or remove seats at any time — your bill is prorated automatically. Annual billing is available at a 20% discount. All major cards and PayPal are accepted.',
  },
];

const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="snap-section-auto flex flex-col items-center justify-center bg-devmind-dark px-6 py-20 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(160,32,240,0.05)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-devmind-purple text-sm tracking-[0.3em] uppercase mb-3 font-medium">
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Common <span className="text-devmind-purple">questions</span>.
          </h2>
          <p className="text-gray-400">
            Can't find what you're looking for?{' '}
            <a href="mailto:support@breakingcode.dev" className="text-devmind-cyan hover:underline">
              Contact support.
            </a>
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="react-bits-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-4 text-left group"
                aria-expanded={openIdx === idx}
              >
                <span className={`font-medium text-sm md:text-base transition-colors ${openIdx === idx ? 'text-devmind-cyan' : 'text-white group-hover:text-devmind-cyan'}`}>
                  {faq.question}
                </span>
                <span className={`ml-4 shrink-0 transition-colors ${openIdx === idx ? 'text-devmind-cyan' : 'text-gray-500 group-hover:text-devmind-cyan'}`}>
                  {openIdx === idx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openIdx === idx && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-3">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
