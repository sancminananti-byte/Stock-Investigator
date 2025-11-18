
import React, { useState, useCallback } from 'react';
import { analyzeStock } from './services/geminiService';
import type { StockAnalysis, GroundingSource } from './types';
import { StockInput } from './components/StockInput';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { WelcomeScreen } from './components/WelcomeScreen';

const App: React.FC = () => {
  const [ticker, setTicker] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!ticker.trim()) {
      setError('종목 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setAnalysis(null);
    setError(null);
    setSources([]);

    try {
      const { analysisData, sourcesData } = await analyzeStock(ticker.toUpperCase());
      if (analysisData.error) {
        setError(analysisData.error);
      } else {
        setAnalysis(analysisData);
        setSources(sourcesData);
      }
    } catch (err) {
      console.error(err);
      setError('분석 데이터를 가져오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [ticker]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorMessage message={error} />;
    }
    if (analysis) {
      return <AnalysisDisplay analysis={analysis} sources={sources} />;
    }
    return <WelcomeScreen />;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-4xl flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            AI 종목분석기
          </h1>
          <p className="mt-2 text-gray-400">Gemini AI와 Google 검색을 활용한 최신 주식 정보 분석</p>
        </header>

        <StockInput
          ticker={ticker}
          setTicker={setTicker}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />
        
        <div className="mt-4 w-full">
          {renderContent()}
        </div>
      </main>
       <footer className="w-full max-w-4xl mt-8 text-center text-gray-500 text-sm">
        <p>This information is for informational purposes only and does not constitute financial advice. Please conduct your own research.</p>
      </footer>
    </div>
  );
};

export default App;
   