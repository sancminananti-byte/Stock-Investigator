export interface PriceChange {
  value: number;
  percentage: number;
}

export interface FinancialHighlight {
  metric: string;
  value: string;
}

export interface AnalystRating {
  rating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell' | 'N/A' | '강력 매수' | '매수' | '보유' | '매도' | '강력 매도' | '정보 없음';
  targetPrice: number | null;
}

export interface StockAnalysis {
  companyName: string;
  ticker: string;
  stockExchange: string;
  currentPrice: number;
  priceChange: PriceChange;
  summary: string;
  financialHighlights: FinancialHighlight[];
  newsAnalysis: string;
  analystRating: AnalystRating;
  pros: string[];
  cons: string[];
  error?: string;
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}