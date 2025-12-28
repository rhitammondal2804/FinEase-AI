import React from 'react';
import { TransactionPoint } from '../types';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend 
} from 'recharts';

interface SpendingChartProps {
  transactions: TransactionPoint[];
  isDarkMode: boolean;
}

const SpendingChart: React.FC<SpendingChartProps> = ({ transactions, isDarkMode }) => {
  // Aggregate data by date
  const aggregatedData = transactions.reduce((acc, curr) => {
    const existing = acc.find(item => item.date === curr.date);
    if (existing) {
      existing.total += curr.amount;
      if (curr.type === 'discretionary') existing.discretionary += curr.amount;
      else existing.essential += curr.amount;
    } else {
      acc.push({
        date: curr.date,
        total: curr.amount,
        discretionary: curr.type === 'discretionary' ? curr.amount : 0,
        essential: curr.type === 'essential' ? curr.amount : 0,
      });
    }
    return acc;
  }, [] as { date: string; total: number; discretionary: number; essential: number }[]);

  // Sort by date
  aggregatedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Take last 14 entries if too many, to keep chart clean
  const displayData = aggregatedData.length > 20 ? aggregatedData.slice(-20) : aggregatedData;

  // Chart Colors
  const axisColor = isDarkMode ? '#94a3b8' : '#64748B'; // slate-400 vs slate-500
  const gridColor = isDarkMode ? '#334155' : '#E2E8F0'; // slate-700 vs slate-200
  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff';
  const tooltipText = isDarkMode ? '#f1f5f9' : '#0f172a';

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-full transition-colors duration-300">
      <h3 className="text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-4">Spending Breakdown & Trend</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={displayData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            barSize={12}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10, fill: axisColor }} 
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => {
                const d = new Date(val);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: axisColor }} 
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip 
              cursor={{ fill: isDarkMode ? '#334155' : '#F8FAFC' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: isDarkMode ? '1px solid #334155' : 'none', 
                backgroundColor: tooltipBg,
                color: tooltipText,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: axisColor }} />
            
            <Bar dataKey="essential" name="Essential" stackId="a" fill="#94A3B8" radius={[0, 0, 0, 0]} />
            <Bar dataKey="discretionary" name="Discretionary" stackId="a" fill="#818CF8" radius={[4, 4, 0, 0]} />
            
            {/* Trend Line */}
            <Line 
              type="monotone" 
              dataKey="total" 
              name="Total Trend" 
              stroke="#F59E0B" 
              strokeWidth={2} 
              dot={{ r: 3, fill: '#F59E0B', strokeWidth: 0 }} 
              activeDot={{ r: 5 }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingChart;