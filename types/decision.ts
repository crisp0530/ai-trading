export interface ResearchSignal {
  agent: "Technical" | "Sentiment" | "Whale"
  direction: "BULLISH" | "BEARISH" | "NEUTRAL"
  confidence: number
  summary: string
}

export interface DecisionDetail {
  decisionId: number
  symbol: string
  action: string
  pnl: number
  signals: ResearchSignal[]
  managerFlow: {
    riskPre: "APPROVED" | "BLOCKED"
    portfolio: string
    riskPost: "APPROVED" | "REJECTED"
    trader: "EXECUTED" | "FAILED"
  }
}
