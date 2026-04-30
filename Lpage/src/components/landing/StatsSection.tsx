import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';

interface StatItem {
  prefix?: string;
  target: number;
  suffix: string;
  label: string;
  color: 'cyan' | 'purple';
}

const stats: StatItem[] = [
  { target: 50, suffix: '+', label: 'Languages Supported', color: 'cyan' },
  { target: 10000, suffix: '+', label: 'Developers Onboard', color: 'purple' },
  { prefix: '', target: 99, suffix: '.9% Uptime', label: 'Guaranteed Reliability', color: 'cyan' },
  { prefix: '<', target: 100, suffix: 'ms', label: 'Avg. Compile Time', color: 'purple' },
];

const Counter: React.FC<{ target: number; suffix: string; prefix?: string; color: 'cyan' | 'purple' }> = ({
  target,
  suffix,
  prefix = '',
  color,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);

  const colorClass = color === 'cyan' ? 'text-devmind-cyan' : 'text-devmind-purple';

  return (
    <span ref={ref} className={`text-5xl md:text-6xl font-bold tabular-nums ${colorClass}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const StatsSection: React.FC = () => {
  return (
    <section className="snap-section flex flex-col items-center justify-center bg-devmind-dark px-6 overflow-hidden relative">
      {/* Background grid */}
      <div className="react-bits-bg" />

      <div className="max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-devmind-cyan text-sm tracking-[0.3em] uppercase mb-3 font-medium">
            By the numbers
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-devmind-cyan to-devmind-purple">scale</span> from day one.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="react-bits-card p-8 flex flex-col items-center text-center group"
            >
              <Counter
                target={stat.target}
                suffix={stat.suffix}
                prefix={stat.prefix}
                color={stat.color}
              />
              <div className={`w-8 h-[2px] my-4 ${stat.color === 'cyan' ? 'bg-devmind-cyan' : 'bg-devmind-purple'} opacity-50 group-hover:opacity-100 transition-opacity`} />
              <span className="text-gray-400 text-sm font-medium">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
