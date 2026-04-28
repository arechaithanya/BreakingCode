import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for learning and personal projects.',
    features: [
      '5 programming languages',
      '100 compile runs / day',
      'Basic data visualizer',
      'Community support',
      '512 MB sandbox memory',
    ],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    description: 'Everything you need for serious development.',
    features: [
      'All 50+ languages',
      'Unlimited compile runs',
      'Full data structure visualizer',
      'AI code assistant',
      '4 GB sandbox memory',
      'Priority support',
      'Custom snippets vault',
    ],
    cta: 'Start Pro Trial',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$29',
    period: 'per seat / month',
    description: 'For teams that ship together.',
    features: [
      'Everything in Pro',
      'Real-time collaboration',
      'Private team workspace',
      'Admin & role management',
      'Usage analytics dashboard',
      'Dedicated support SLA',
      'SSO / SAML login',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
];

const PricingSection: React.FC = () => {
  return (
    <section className="snap-section-auto flex flex-col items-center justify-center bg-black px-6 py-20 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,255,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-devmind-cyan text-sm tracking-[0.3em] uppercase mb-3 font-medium">
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, <span className="text-devmind-cyan">transparent</span> pricing.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            No hidden fees. No surprise bills. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative flex flex-col rounded-2xl p-8 ${
                plan.highlight
                  ? 'bg-gradient-to-b from-devmind-cyan/10 to-devmind-purple/10 border border-devmind-cyan/40 shadow-[0_0_40px_rgba(0,255,255,0.12)]'
                  : 'react-bits-card'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1.5 bg-devmind-cyan text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    <Zap className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-bold mb-1 ${plan.highlight ? 'text-devmind-cyan' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500 text-sm mb-1">/ {plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? 'text-devmind-cyan' : 'text-green-500/70'}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlight
                    ? 'bg-devmind-cyan text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]'
                    : 'glass hover:border-devmind-cyan/30 hover:text-devmind-cyan'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
