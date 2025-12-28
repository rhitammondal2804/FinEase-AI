import React from 'react';
import { StressLevel } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface StressGaugeProps {
  score: number;
  level: StressLevel;
  isDarkMode: boolean;
}

const StressGauge: React.FC<StressGaugeProps> = ({ score, level, isDarkMode }) => {
  // Map score to color
  const getColor = (s: number) => {
    if (s <= 30) return '#10B981'; // Emerald-500
    if (s <= 60) return '#EAB308'; // Yellow-500
    if (s <= 80) return '#F97316'; // Orange-500
    return '#EF4444'; // Red-500
  };

  const color = getColor(score);
  
  // Background gauge color based on mode
  const emptyColor = isDarkMode ? '#334155' : '#F1F5F9'; // slate-700 vs slate-100
  
  // Create data for a semi-circle gauge
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score }
  ];

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-full transition-colors duration-300">
      <h3 className="text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-2">Financial Stress Score</h3>
      
      <div className="relative w-full max-w-[256px] h-32 overflow-hidden">
        {/* We use a Pie chart masquerading as a gauge by setting start/end angles */}
        <ResponsiveContainer width="100%" height={256}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={80}
              outerRadius={120}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell key="cell-0" fill={color} />
              <Cell key="cell-1" fill={emptyColor} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end pb-2">
            <span className="text-4xl font-bold text-slate-800 dark:text-white">{score}<span className="text-xl text-slate-400 dark:text-slate-500">/100</span></span>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <span 
          className="px-4 py-1.5 rounded-full text-sm font-medium border"
          style={{ 
            borderColor: color, 
            color: color, 
            backgroundColor: isDarkMode ? `${color}20` : `${color}10` 
          }}
        >
          {level}
        </span>
      </div>
    </div>
  );
};

export default StressGauge;