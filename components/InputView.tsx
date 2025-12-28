import React, { useState, useRef } from 'react';
import { Upload, FileText, ArrowRight, Loader2, X, FileType, Check } from 'lucide-react';
import { FinancialInput } from '../types';

interface InputViewProps {
  onAnalyze: (data: FinancialInput) => void;
  isAnalyzing: boolean;
}

const InputView: React.FC<InputViewProps> = ({ onAnalyze, isAnalyzing }) => {
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; data: string; mimeType: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    const isText = file.type === 'text/csv' || file.type === 'text/plain' || file.type === 'application/json';
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (isText) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setTextInput(content);
        setSelectedFile(null);
      };
      reader.readAsText(file);
    } else if (isImage || isPdf) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const base64Data = result.split(',')[1];
        setSelectedFile({
          name: file.name,
          data: base64Data,
          mimeType: file.type
        });
        setTextInput('');
      };
      reader.readAsDataURL(file);
    } else {
      alert("Unsupported file type. Please use CSV, TXT, JSON, PDF, or JPG/PNG.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onAnalyze({ type: 'file', data: selectedFile.data, mimeType: selectedFile.mimeType });
    } else if (textInput.trim()) {
      onAnalyze({ type: 'text', content: textInput });
    }
  };

  const exampleData = `Date,Description,Amount,Category
2023-10-01,Rent,1500,Housing
2023-10-02,Grocery Store,120,Food
2023-10-03,Coffee Shop,15,Dining
2023-10-04,Online Retailer,250,Shopping
2023-10-05,Utility Bill,80,Utilities
2023-10-06,Bar & Grill,65,Dining
2023-10-07,Movie Theater,40,Entertainment
2023-10-08,Ride Share,35,Transport
2023-10-09,Online Subscription,15,Entertainment
2023-10-10,Coffee Shop,12,Dining`;

  const hasContent = selectedFile !== null || textInput.trim().length > 0;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden transition-all duration-300">
        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white mb-2">Analyze Your Spending</h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Upload a Bank Statement (PDF, JPG, CSV) or paste your transaction history below. 
          </p>
        </div>
        
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* File Upload Area */}
          {!selectedFile ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 group
                ${isDragging 
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 scale-[1.02]' 
                  : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20'
                }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".csv,.txt,.json,.pdf,.jpg,.jpeg,.png,.webp" 
                onChange={handleFileUpload}
              />
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 ${isDragging ? 'scale-110 bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-110'}`}>
                <Upload size={28} />
              </div>
              <p className="font-medium text-slate-700 dark:text-slate-200 text-lg">
                {isDragging ? "Drop file here" : "Click to upload file"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Supports PDF, JPG, PNG, CSV, JSON
              </p>
            </div>
          ) : (
             // File Selected View
             <div className="border border-indigo-200 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl p-6 flex items-center justify-between animate-fade-in">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                    <FileType size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-slate-800 dark:text-slate-100 truncate max-w-[150px] sm:max-w-xs">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium tracking-wide">{selectedFile.mimeType.split('/')[1]} file ready</p>
                  </div>
                </div>
                <button 
                  onClick={clearFile}
                  className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <X size={20} />
                </button>
             </div>
          )}

          {/* Divider only if no file selected */}
          {!selectedFile && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full border border-slate-100 dark:border-slate-700">Or paste text directly</span>
                </div>
              </div>

              {/* Text Area */}
              <div>
                <textarea
                  className="w-full h-48 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono text-sm text-slate-700 dark:text-slate-300 resize-none transition-all shadow-inner"
                  placeholder="Paste transaction data here... (Date, Description, Amount, Category)"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
                <div className="mt-2 flex justify-between items-center flex-wrap gap-2">
                  <button 
                    onClick={() => setTextInput(exampleData)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                  >
                    Load example data
                  </button>
                  <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center">
                    <Check size={12} className="mr-1" />
                    Data processed securely
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Button */}
          <button
            onClick={handleAnalyze}
            disabled={!hasContent || isAnalyzing}
            className={`w-full py-4 px-6 rounded-xl flex items-center justify-center text-white font-medium text-lg transition-all duration-300 transform ${
              !hasContent || isAnalyzing 
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-70' 
                : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-md hover:shadow-xl hover:-translate-y-0.5'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin mr-2" size={24} />
                Analyzing Patterns...
              </>
            ) : (
              <>
                Analyze Financial Health
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={24} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputView;