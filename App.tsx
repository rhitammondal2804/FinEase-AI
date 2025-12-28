import React, { useState, useEffect } from 'react';
import { AnalysisState, FinancialInput } from './types';
import { analyzeFinancialData } from './services/geminiService';
import InputView from './components/InputView';
import AnalysisView from './components/AnalysisView';
import LoginView from './components/LoginView';
import { 
  auth, 
  onAuthStateChanged, 
  signOut, 
  User 
} from './services/firebase'; 
import { Wallet, Moon, Sun, LogOut, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    data: null,
  });

  // Check system preference initially
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Reset analysis state on logout
      setState({ status: 'idle', data: null });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAnalyze = async (data: FinancialInput) => {
    setState({ status: 'analyzing', data: null });
    try {
      const result = await analyzeFinancialData(data);
      setState({ status: 'complete', data: result });
    } catch (error) {
      setState({ 
        status: 'error', 
        data: null, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  };

  const resetAnalysis = () => {
    setState({ status: 'idle', data: null });
  };

  // Auth Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-500">
        <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not Logged In -> Show Login
  if (!user) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
         <LoginView />
         <button 
            onClick={toggleTheme}
            className="fixed top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all z-50"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
      </div>
    );
  }

  // Logged In -> Show App
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500 ease-in-out">
      {/* Navbar */}
      <nav className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 cursor-pointer hover:opacity-80 transition-opacity" onClick={resetAnalysis}>
            <Wallet className="h-6 w-6" />
            <span className="font-bold text-lg tracking-tight">FinEase AI</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 py-1.5 px-3 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <UserIcon size={14} className="mr-2" />
              {user.displayName || user.email}
            </div>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        
        {state.status === 'error' && (
          <div className="mb-8 p-4 bg-red-50/80 dark:bg-red-900/20 backdrop-blur text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800 rounded-xl flex items-center justify-between animate-fade-in shadow-sm">
            <span>{state.error || "Something went wrong. Please try again."}</span>
            <button 
              onClick={resetAnalysis}
              className="text-sm font-bold underline hover:text-red-800 dark:hover:text-red-200"
            >
              Try Again
            </button>
          </div>
        )}

        {state.status === 'idle' && (
          <InputView onAnalyze={handleAnalyze} isAnalyzing={false} />
        )}

        {state.status === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-lg mx-auto px-4 animate-fade-in">
             <div className="relative">
               <div className="w-20 h-20 border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mb-8"></div>
               <div className="absolute inset-0 flex items-center justify-center -mt-8">
                 <Wallet size={24} className="text-indigo-600 dark:text-indigo-400 opacity-50 animate-pulse" />
               </div>
             </div>
             <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-2">Analyzing Spending Patterns</h2>
             <p className="text-slate-500 dark:text-slate-400">
               We're reviewing transaction history to identify behavioral shifts, anomalies, and potential stress indicators. 
               This usually takes a few seconds.
             </p>
          </div>
        )}

        {state.status === 'complete' && state.data && (
          <AnalysisView data={state.data} onReset={resetAnalysis} isDarkMode={isDarkMode} />
        )}
      </main>
    </div>
  );
};

export default App;