
import React from 'react';

interface StockInputProps {
  ticker: string;
  setTicker: (ticker: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const SearchIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
  </svg>
);


export const StockInput: React.FC<StockInputProps> = ({ ticker, setTicker, onAnalyze, isLoading }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onAnalyze();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sticky top-4 z-10 bg-gray-900/80 backdrop-blur-sm p-2 rounded-lg">
      <input
        type="text"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="예: GOOGL, AAPL"
        className="flex-grow bg-gray-800 border border-gray-600 rounded-md px-4 py-3 text-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        disabled={isLoading}
      />
      <button
        onClick={onAnalyze}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold py-3 px-6 rounded-md hover:from-blue-600 hover:to-teal-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>분석 중...</span>
          </>
        ) : (
          <>
            <SearchIcon className="w-5 h-5" />
            <span>분석</span>
          </>
        )}
      </button>
    </div>
  );
};
   