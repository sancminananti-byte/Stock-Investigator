
import type { StockAnalysis, GroundingSource } from '../types';

export const analyzeStock = async (ticker: string): Promise<{ analysisData: StockAnalysis, sourcesData: GroundingSource[] }> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ticker }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '분석 중 알 수 없는 오류가 발생했습니다.' }));
      throw new Error(errorData.error || `서버가 ${response.status} 상태로 응답했습니다.`);
    }

    const data = await response.json();
    if (!data.analysisData || !data.sourcesData) {
        throw new Error("서버로부터 받은 데이터 형식이 올바르지 않습니다.");
    }
    
    return data;

  } catch (error) {
    console.error("Error analyzing stock:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("AI 분석 데이터를 가져오는 데 실패했습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.");
  }
};
