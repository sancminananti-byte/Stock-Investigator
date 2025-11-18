
import { GoogleGenAI } from "@google/genai";
import type { StockAnalysis, GroundingSource } from '../types';

export const analyzeStock = async (ticker: string): Promise<{ analysisData: StockAnalysis, sourcesData: GroundingSource[] }> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY environment variable not set.");
    throw new Error("Gemini API 키가 설정되지 않았습니다. Vercel과 같은 호스팅 환경에 배포하는 경우, 클라이언트 측에서 접근 가능하도록 환경 변수를 올바르게 설정해야 합니다. 보안상의 이유로 API 키를 클라이언트 코드에 노출하는 것은 권장되지 않습니다.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    당신은 전문 금융 분석가입니다. 티커 심볼 '${ticker}'의 주식을 분석해주세요.
    웹에서 사용할 수 있는 최신 데이터를 기반으로 포괄적인 분석을 제공해주세요.
    응답은 다른 텍스트나 마크다운 백틱으로 감싸지 않은, 유효한 단일 JSON 객체여야 합니다.
    모든 텍스트 값은 한국어로 작성해주세요.
    JSON 객체는 다음 구조를 가져야 합니다:
    {
      "companyName": "전체 회사 이름",
      "ticker": "티커_심볼",
      "stockExchange": "예: NASDAQ, NYSE",
      "currentPrice": 150.25,
      "priceChange": {
        "value": -1.50,
        "percentage": -0.99
      },
      "summary": "회사의 비즈니스, 산업 및 시장 위치에 대한 상세하지만 간결한 요약.",
      "financialHighlights": [
        { "metric": "시가총액", "value": "예: $2.5T" },
        { "metric": "주가수익비율(P/E)", "value": "예: 28.5" },
        { "metric": "주당순이익(EPS)", "value": "예: $5.20" },
        { "metric": "52주 변동폭", "value": "예: $120.00 - $180.00" },
        { "metric": "배당수익률", "value": "예: 0.8%" }
      ],
      "newsAnalysis": "가장 중요한 최신 뉴스 요약 및 주가에 미칠 잠재적 영향 분석.",
      "analystRating": {
        "rating": "예: '강력 매수', '매수', '보유', '매도', '강력 매도', '정보 없음'",
        "targetPrice": 195.50
      },
      "pros": [
        "주식에 대해 낙관적인 이유가 되는 주요 강점, 기회 목록.",
        "또 다른 긍정적 요인..."
      ],
      "cons": [
        "주식에 대해 신중해야 하는 이유가 되는 주요 약점, 위험 목록.",
        "또 다른 부정적 요인..."
      ]
    }

    티커 정보를 찾을 수 없는 경우, { "error": "'${ticker}' 티커에 대한 정보를 찾을 수 없습니다." }와 같이 "error" 키가 있는 JSON 객체를 반환해주세요.
    시가총액이나 52주 변동폭과 같이 미리 서식이 지정된 문자열을 제외하고, JSON의 모든 숫자 값은 문자열이 아닌 숫자인지 확인해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sourcesData = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const rawText = response.text;
    
    // The model sometimes wraps the JSON response in markdown code fences.
    // This regex extracts the JSON object from the raw text.
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Could not find a valid JSON object in the model's response.");
    }
    
    const analysisData = JSON.parse(jsonMatch[0]) as StockAnalysis;
    
    return { analysisData, sourcesData };

  } catch (error) {
    console.error("Error analyzing stock:", error);
    if (error instanceof Error && (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID"))) {
         throw new Error("제공된 Gemini API 키가 유효하지 않습니다. 키를 확인하고 다시 시도해주세요.");
    }
    throw new Error("AI 분석 데이터를 가져오는 데 실패했습니다. 종목 코드가 유효하지 않거나 서비스가 일시적으로 사용 불가능할 수 있습니다.");
  }
};