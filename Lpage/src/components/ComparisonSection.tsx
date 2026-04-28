import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

type CellValue = true | false | string;

interface Row {
  feature: string;
  breakingCode: CellValue;
  replit: CellValue;
  vsCodeOnline: CellValue;
  codeSandbox: CellValue;
}

const rows: Row[] = [
  {
    feature: 'AI Code Assistant',
    breakingCode: true,
    replit: true,
    vsCodeOnline: false,
    codeSandbox: true,
  },
  {
    feature: 'Data Structure Visualizer',
    breakingCode: true,
    replit: false,
    vsCodeOnline: false,
    codeSandbox: false,
  },
  {
    feature: 'Languages Supported',
    breakingCode: '50+',
    replit: '50+',
    vsCodeOnline: '30+',
    codeSandbox: '10+',
  },
  {
    feature: 'Offline / Local Mode',
    breakingCode: false,
    replit: false,
    vsCodeOnline: true,
    codeSandbox: false,
  },
  {
    feature: 'Free Tier',
    breakingCode: true,
    replit: true,
    vsCodeOnline: true,
    codeSandbox: true,
  },
  {
    feature: 'Real-time Collaboration',
    breakingCode: true,
    replit: true,
    vsCodeOnline: true,
    codeSandbox: true,
  },
  {
    feature: 'Starting Price (Pro)',
    breakingCode: '$12/mo',
    replit: '$25/mo',
    vsCodeOnline: '$9/mo',
    codeSandbox: '$15/mo',
  },
];

const Cell: React.FC<{ value: CellValue; highlight?: boolean }> = ({ value, highlight }) => {
  const base = `flex items-center justify-center py-3 px-2 text-sm ${highlight ? 'font-semibold' : ''}`;
  if (value === true)
    return (
      <div className={base}>
        <CheckCircle className={`w-5 h-5 ${highlight ? 'text-devmind-cyan' : 'text-green-500/70'}`} />
      </div>
    );
  if (value === false)
    return (
      <div className={base}>
        <XCircle className="w-5 h-5 text-red-500/50" />
      </div>
    );
  return (
    <div className={`${base} ${highlight ? 'text-devmind-cyan' : 'text-gray-400'}`}>{value}</div>
  );
};

const ComparisonSection: React.FC = () => {
  const columns = [
    { key: 'breakingCode', label: 'Breaking Code', highlight: true },
    { key: 'replit', label: 'Replit', highlight: false },
    { key: 'vsCodeOnline', label: 'VS Code Online', highlight: false },
    { key: 'codeSandbox', label: 'CodeSandbox', highlight: false },
  ] as const;

  return (
    <section className="snap-section flex flex-col items-center justify-center bg-black px-6 overflow-hidden relative py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(160,32,240,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-devmind-purple text-sm tracking-[0.3em] uppercase mb-3 font-medium">
            Why Breaking Code
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            How we <span className="text-devmind-purple">stack up</span>.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            We've built the features developers actually need — not just another cloud notebook.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="text-left py-4 px-4 text-gray-500 font-medium text-sm w-1/3">Feature</th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`text-center py-4 px-2 text-sm font-semibold ${
                      col.highlight
                        ? 'text-devmind-cyan bg-devmind-cyan/5 rounded-t-xl border-t border-l border-r border-devmind-cyan/20'
                        : 'text-gray-400'
                    }`}
                  >
                    {col.label}
                    {col.highlight && (
                      <span className="ml-2 text-[10px] bg-devmind-cyan/20 text-devmind-cyan px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Us
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-t border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-1 px-4 text-gray-300 text-sm">{row.feature}</td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={
                        col.highlight
                          ? 'bg-devmind-cyan/5 border-l border-r border-devmind-cyan/20'
                          : ''
                      }
                    >
                      <Cell value={row[col.key]} highlight={col.highlight} />
                    </td>
                  ))}
                </tr>
              ))}
              {/* Bottom border for highlighted column */}
              <tr>
                <td />
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={col.highlight ? 'border-b border-l border-r border-devmind-cyan/20 rounded-b-xl h-2 bg-devmind-cyan/5' : ''}
                  />
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;
