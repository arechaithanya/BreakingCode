import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

const ProblemProgressChart: React.FC = () => {
  const { profile } = useAuth();
  
  const solvedCount = profile?.solvedProblems?.length || 0;
  const totalCount = 100; // Hypothetical total platform challenges
  const solvedPercentage = Math.round((solvedCount / totalCount) * 100);
  const attemptedPercentage = Math.min(100 - solvedPercentage, 15); // Just a mock for now
  const remainingPercentage = 100 - solvedPercentage - attemptedPercentage;

  const data = [
    { name: 'Solved', value: solvedPercentage, color: '#00ff88' },
    { name: 'Attempted', value: attemptedPercentage, color: '#008855' },
    { name: 'Not Started', value: remainingPercentage, color: '#1f2937' },
  ];

  return (
    <div className="glass p-6 rounded-3xl border border-white/5 h-full flex flex-col">
      <h3 className="text-white font-bold mb-6">Problem Progress</h3>
      
      <div className="flex-1 relative min-h-[180px]">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-white font-mono">{solvedPercentage}%</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Solved</span>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationDuration={1500}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#0a0a0a', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {data.map((item, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-bold text-gray-400 truncate">{item.name}</span>
            </div>
            <span className="text-xs font-bold text-white ml-3.5">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemProgressChart;
