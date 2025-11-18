import React, { useRef } from 'react';
import type { StockAnalysis, GroundingSource } from '../types';
import { AnalystRating, PriceChange } from '../types';

// Add declarations for CDN-loaded libraries to satisfy TypeScript
declare const html2canvas: any;

const InfoCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-blue-400">{icon}</div>
      <h3 className="text-xl font-bold text-gray-100">{title}</h3>
    </div>
    <div className="text-gray-300 space-y-2">{children}</div>
  </div>
);

const SummaryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const FinancialsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
const NewsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-3-4h3" /></svg>;
const RatingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ProsConsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>;
const SourceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;


const PriceDisplay: React.FC<{ price: number, change: PriceChange }> = ({ price, change }) => {
  const isPositive = change.value >= 0;
  const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
  const sign = isPositive ? '+' : '';

  return (
    <div className="flex items-baseline gap-4">
      <p className="text-5xl font-bold text-white">{price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
      <p className={`text-2xl font-semibold ${colorClass}`}>
        {sign}{change.value.toFixed(2)} ({sign}{change.percentage.toFixed(2)}%)
      </p>
    </div>
  );
};

const RatingDisplay: React.FC<{ rating: AnalystRating }> = ({ rating }) => {
    const ratingColors: { [key: string]: string } = {
        'Strong Buy': 'bg-green-500 text-white',
        '강력 매수': 'bg-green-500 text-white',
        'Buy': 'bg-green-400 text-green-900',
        '매수': 'bg-green-400 text-green-900',
        'Hold': 'bg-yellow-400 text-yellow-900',
        '보유': 'bg-yellow-400 text-yellow-900',
        'Sell': 'bg-red-400 text-red-900',
        '매도': 'bg-red-400 text-red-900',
        'Strong Sell': 'bg-red-500 text-white',
        '강력 매도': 'bg-red-500 text-white',
        'N/A': 'bg-gray-500 text-white',
        '정보 없음': 'bg-gray-500 text-white',
    };
    const colorClass = ratingColors[rating.rating] || ratingColors['정보 없음'];

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className={`px-3 py-1 text-sm font-bold rounded-full ${colorClass}`}>
                {rating.rating}
            </span>
            {rating.targetPrice && (
                 <p>목표 주가: <span className="font-semibold text-white">{rating.targetPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></p>
            )}
        </div>
    );
};

export const AnalysisDisplay: React.FC<{ analysis: StockAnalysis, sources: GroundingSource[] }> = ({ analysis, sources }) => {
  const analysisRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    const element = analysisRef.current;
    if (!element) return;
    
    // Use a background color consistent with the app's theme for the capture
    const canvas = await html2canvas(element, {
        backgroundColor: '#121212', // Corresponds to Tailwind's gray-900
        scale: 2, // Increase resolution for better quality
        useCORS: true,
    });
    
    const image = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = image;
    link.download = `${analysis.ticker}_analysis.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 animate-fade-in">
        <div className="flex justify-center">
            <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
                aria-label="Export analysis as PNG"
            >
                <ImageIcon />
                PNG로 내보내기
            </button>
        </div>

        <div ref={analysisRef} className="space-y-6">
            <header className="pb-4 border-b border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2">
                    <div>
                        <h2 className="text-4xl font-extrabold text-white">{analysis.companyName}</h2>
                        <p className="text-xl text-gray-400">{analysis.stockExchange}: {analysis.ticker}</p>
                    </div>
                    <PriceDisplay price={analysis.currentPrice} change={analysis.priceChange} />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <InfoCard title="기업 개요" icon={<SummaryIcon />}>
                        <p className="leading-relaxed">{analysis.summary}</p>
                    </InfoCard>
                </div>

                <InfoCard title="핵심 재무 정보" icon={<FinancialsIcon />}>
                <ul className="space-y-2">
                    {analysis.financialHighlights.map((item) => (
                    <li key={item.metric} className="flex justify-between items-center border-b border-gray-700/50 py-2">
                        <span className="text-gray-400">{item.metric}</span>
                        <span className="font-bold text-white">{item.value}</span>
                    </li>
                    ))}
                </ul>
                </InfoCard>

                <InfoCard title="애널리스트 평가" icon={<RatingIcon />}>
                    <RatingDisplay rating={analysis.analystRating} />
                </InfoCard>

                <div className="md:col-span-2">
                    <InfoCard title="최신 뉴스 분석" icon={<NewsIcon />}>
                        <p className="leading-relaxed">{analysis.newsAnalysis}</p>
                    </InfoCard>
                </div>

                <InfoCard title="긍정적 요인 (Pros)" icon={<ProsConsIcon />}>
                    <ul className="list-disc list-inside space-y-2">
                    {analysis.pros.map((pro, index) => (
                        <li key={index} className="flex items-start">
                            <span className="text-green-400 mr-2 mt-1">✓</span>
                            <span>{pro}</span>
                        </li>
                    ))}
                    </ul>
                </InfoCard>
                
                <InfoCard title="부정적 요인 (Cons)" icon={<ProsConsIcon />}>
                    <ul className="list-disc list-inside space-y-2">
                        {analysis.cons.map((con, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-red-400 mr-2 mt-1">✗</span>
                                <span>{con}</span>
                            </li>
                        ))}
                    </ul>
                </InfoCard>
                
                {sources.length > 0 && (
                <div className="md:col-span-2">
                    <InfoCard title="정보 출처" icon={<SourceIcon />}>
                        <ul className="space-y-2">
                            {sources.filter(s => s.web).map((source, index) => (
                                <li key={index}>
                                    <a href={source.web?.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline break-all">
                                        {source.web?.title || source.web?.uri}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </InfoCard>
                </div>
                )}
            </div>
        </div>
    </div>
  );
};