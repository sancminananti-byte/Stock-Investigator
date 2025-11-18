
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-gray-800 rounded-lg">
      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-300">AI가 최신 정보를 분석 중입니다...</p>
      <p className="text-sm text-gray-500">잠시만 기다려주세요.</p>
    </div>
  );
};
   