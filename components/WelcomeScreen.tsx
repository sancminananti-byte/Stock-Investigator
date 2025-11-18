
import React from 'react';

const CardIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-gray-700 p-3 rounded-full mb-4">
        {children}
    </div>
);

const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
const BulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

export const WelcomeScreen: React.FC = () => {
  return (
    <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">시작하는 방법</h2>
      <p className="text-gray-400 mb-8">
        위 검색창에 관심 있는 주식의 종목 코드(Ticker)를 입력하고 '분석' 버튼을 누르세요.
      </p>
      <div className="grid md:grid-cols-3 gap-6 text-left">
        <div className="bg-gray-700/50 p-6 rounded-lg">
          <CardIcon><SearchIcon /></CardIcon>
          <h3 className="font-semibold text-lg text-white mb-2">실시간 정보 검색</h3>
          <p className="text-gray-400 text-sm">Google 검색을 통해 가장 최신 시장 데이터와 뉴스를 가져와 분석합니다.</p>
        </div>
        <div className="bg-gray-700/50 p-6 rounded-lg">
          <CardIcon><ChartIcon /></CardIcon>
          <h3 className="font-semibold text-lg text-white mb-2">종합적인 분석</h3>
          <p className="text-gray-400 text-sm">기업 개요, 재무 상태, 뉴스, 애널리스트 평가 등 다각적인 분석을 제공합니다.</p>
        </div>
        <div className="bg-gray-700/50 p-6 rounded-lg">
          <CardIcon><BulbIcon /></CardIcon>
          <h3 className="font-semibold text-lg text-white mb-2">AI 기반 인사이트</h3>
          <p className="text-gray-400 text-sm">Gemini AI가 데이터를 해석하여 긍정적 및 부정적 요인을 정리해 드립니다.</p>
        </div>
      </div>
    </div>
  );
};
   