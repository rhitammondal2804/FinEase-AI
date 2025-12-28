import React from 'react';
import { FinancialAnalysis } from '../types';
import StressGauge from './StressGauge';
import SpendingChart from './SpendingChart';
import { CheckCircle2, AlertCircle, TrendingUp, HeartHandshake, ArrowLeft } from 'lucide-react';

interface AnalysisViewProps {
  data: FinancialAnalysis;
  onReset: () => void;
  isDarkMode: boolean;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ data, onReset, isDarkMode }) => {
  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-8 gap-4">
        <button 
          onClick={onReset}
          className="group flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors self-start font-medium"
        >
          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full mr-3 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          Analyze New Data
        </button>
        <span className="text-sm px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">
          Analysis Complete
        </span>
      </div>

      {/* Top Row: Gauge & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-full transform transition-transform duration-300 hover:-translate-y-1">
          <StressGauge score={data.score} level={data.level} isDarkMode={isDarkMode} />
        </div>
        <div className="lg:col-span-2 h-full transform transition-transform duration-300 hover:-translate-y-1">
          <SpendingChart transactions={data.analyzedTransactions} isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Observations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Key Observations */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-lg border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center mb-4 text-indigo-600 dark:text-indigo-400">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg mr-3">
              <TrendingUp size={24} />
            </div>
            <h3 className="font-semibold text-lg">Key Observations</h3>
          </div>
          <ul className="space-y-3">
            {data.observations.map((obs, idx) => (
              <li key={idx} className="flex items-start text-slate-700 dark:text-slate-300 text-sm group">
                <span className="w-1.5 h-1.5 bg-indigo-400 dark:bg-indigo-500 rounded-full mt-1.5 mr-3 flex-shrink-0 group-hover:scale-150 transition-transform"></span>
                {obs}
              </li>
            ))}
          </ul>
        </div>

        {/* Why This Matters */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-lg border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center mb-4 text-emerald-600 dark:text-emerald-400">
             <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg mr-3">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-semibold text-lg">Why This Matters</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-5">
            {data.importance}
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700/50">
             <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 flex items-center">
               Recent Changes
             </h4>
             <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{data.recentChanges}"</p>
          </div>
        </div>
      </div>

      {/* Recommendations - Full Width */}
      <div className="bg-gradient-to-br from-indigo-50/80 to-white/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-indigo-100 dark:border-slate-700 shadow-sm transition-all duration-300">
        <div className="flex items-center mb-6 text-indigo-700 dark:text-indigo-300">
          <HeartHandshake size={28} className="mr-3" />
          <h3 className="font-bold text-xl">Wellness Guidance</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.recommendations.map((rec, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-indigo-50 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-sm mb-3">
                {idx + 1}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center p-8 text-slate-400 dark:text-slate-600 text-xs opacity-70 hover:opacity-100 transition-opacity">
        <p className="flex items-center justify-center gap-2">
          <AlertCircle size={14} />
          This analysis is for educational purposes only and does not constitute financial or medical advice.
        </p>
      </div>
    </div>
  );
};

export default AnalysisView;