"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronRight, ArrowLeft, Plus } from "lucide-react"

// ==================== TYPES ====================
interface ResearchType {
  id: string
  name: string
  description: string
  enabled: boolean
}

interface Indicator {
  id: string
  name: string
  description: string
  params: string
  category: string
  enabled: boolean
}

// ==================== INITIAL DATA ====================
const researchTypes: ResearchType[] = [
  { id: "technical", name: "Technical Analysis", description: "RSI, MACD, Bollinger Bands, Moving Averages, Support/Resistance", enabled: false },
  { id: "macro", name: "Macro Indicators", description: "S&P 500, DXY, Treasury yields, Fed policy, Global liquidity", enabled: false },
  { id: "onchain", name: "On-chain Signals", description: "Whale movements, Exchange flows, NUPL, SOPR, NVT", enabled: false },
  { id: "sentiment", name: "Sentiment Analysis", description: "Fear & Greed, Social media, News, Funding sentiment", enabled: false },
  { id: "micro", name: "Micro Structure", description: "Open Interest, Funding Rate, Orderbook, Liquidations", enabled: false },
]

const indicatorsByCategory: Record<string, Indicator[]> = {
  technical: [
    { id: "ma", name: "Moving Averages", description: "SMA/EMA trend and crossovers", params: "SMA: 20/50/200, EMA: 12/26", category: "technical", enabled: false },
    { id: "rsi", name: "RSI", description: "Overbought/oversold momentum", params: "Period: 14, OB: 70, OS: 30", category: "technical", enabled: false },
    { id: "macd", name: "MACD", description: "Trend momentum and crossovers", params: "Fast: 12, Slow: 26, Signal: 9", category: "technical", enabled: false },
    { id: "bollinger", name: "Bollinger Bands", description: "Volatility and mean reversion", params: "Period: 20, StdDev: 2", category: "technical", enabled: false },
    { id: "sr", name: "Support & Resistance", description: "Key price level identification", params: "Fib: 0.382/0.618, Historical H/L", category: "technical", enabled: false },
    { id: "volume", name: "Volume Analysis", description: "OBV/VWAP/Volume-price relationship", params: "20-day avg volume baseline", category: "technical", enabled: false },
    { id: "stochastic", name: "Stochastic", description: "Overbought/oversold oscillator", params: "%K: 14, %D: 3, OB: 80, OS: 20", category: "technical", enabled: false },
    { id: "atr", name: "ATR", description: "Volatility measurement", params: "Period: 14", category: "technical", enabled: false },
    { id: "ichimoku", name: "Ichimoku Cloud", description: "Trend/support/momentum system", params: "Conv: 9, Base: 26, Lead: 52", category: "technical", enabled: false },
    { id: "adx", name: "ADX", description: "Trend strength indicator", params: "Period: 14, Strong: >25", category: "technical", enabled: false },
  ],
  macro: [
    { id: "sp500", name: "S&P 500", description: "US equity risk sentiment", params: "Watch MA50/200", category: "macro", enabled: false },
    { id: "nasdaq", name: "NASDAQ", description: "Tech stock direction (high BTC correlation)", params: "vs SPX performance", category: "macro", enabled: false },
    { id: "treasury10y", name: "US Treasury 10Y", description: "Risk-free rate benchmark", params: "Alert: >4.5%", category: "macro", enabled: false },
    { id: "dxy", name: "USD Index (DXY)", description: "Dollar strength indicator", params: "Key levels: 100/105", category: "macro", enabled: false },
    { id: "gold", name: "Gold (XAU)", description: "Safe haven asset", params: "BTC/Gold ratio", category: "macro", enabled: false },
    { id: "oil", name: "Crude Oil", description: "Inflation/economic expectations", params: "WTI key levels", category: "macro", enabled: false },
    { id: "fedRate", name: "Fed Funds Rate", description: "Monetary policy direction", params: "Dot plot/CME FedWatch", category: "macro", enabled: false },
    { id: "m2", name: "M2 Money Supply", description: "Global liquidity indicator", params: "YoY change rate", category: "macro", enabled: false },
    { id: "realYield", name: "Real Yield", description: "Inflation-adjusted rates", params: "Nominal rate - Inflation", category: "macro", enabled: false },
    { id: "creditSpread", name: "Credit Spreads", description: "Credit risk indicator", params: "HY-IG spread", category: "macro", enabled: false },
  ],
  onchain: [
    { id: "whaleMovements", name: "Whale Movements", description: "Large wallet tracking", params: ">1000 BTC / >10000 ETH", category: "onchain", enabled: false },
    { id: "exchangeFlow", name: "Exchange Flows", description: "CEX inflow/outflow", params: "Net flow, Reserve changes", category: "onchain", enabled: false },
    { id: "smartMoney", name: "Smart Money", description: "High win-rate wallet tracking", params: "Historical ROI >50%", category: "onchain", enabled: false },
    { id: "stablecoinFlow", name: "Stablecoin Flows", description: "Stablecoin capital flow", params: "USDT/USDC exchange inflow", category: "onchain", enabled: false },
    { id: "minerFlow", name: "Miner Flows", description: "Miner behavior tracking", params: "Miner wallet outflows", category: "onchain", enabled: false },
    { id: "nupl", name: "NUPL", description: "Net Unrealized Profit/Loss", params: "0 = breakeven", category: "onchain", enabled: false },
    { id: "sopr", name: "SOPR", description: "Spent Output Profit Ratio", params: "1 = breakeven", category: "onchain", enabled: false },
    { id: "activeAddresses", name: "Active Addresses", description: "Network activity", params: "Daily active addresses", category: "onchain", enabled: false },
    { id: "nvt", name: "NVT Ratio", description: "Network Value to Transactions", params: "High = overvalued, Low = undervalued", category: "onchain", enabled: false },
    { id: "realizedCap", name: "Realized Cap", description: "Realized market capitalization", params: "UTXO cost basis", category: "onchain", enabled: false },
  ],
  sentiment: [
    { id: "fearGreed", name: "Fear & Greed Index", description: "Composite sentiment index", params: "0-100, Extreme: <25/>75", category: "sentiment", enabled: false },
    { id: "twitter", name: "Twitter/X Sentiment", description: "Social media sentiment", params: "Score: -1 to +1", category: "sentiment", enabled: false },
    { id: "reddit", name: "Reddit Sentiment", description: "Community discussion sentiment", params: "r/bitcoin activity", category: "sentiment", enabled: false },
    { id: "news", name: "News Sentiment", description: "Financial news sentiment", params: "Positive/negative ratio", category: "sentiment", enabled: false },
    { id: "googleTrends", name: "Google Trends", description: "Search interest indicator", params: '"Bitcoin" search volume', category: "sentiment", enabled: false },
    { id: "youtube", name: "YouTube Views", description: "Video content activity", params: "Crypto video views", category: "sentiment", enabled: false },
    { id: "telegram", name: "Telegram Activity", description: "Telegram group activity", params: "Message volume/sentiment", category: "sentiment", enabled: false },
    { id: "fundingSentiment", name: "Funding Sentiment", description: "Funding rate sentiment", params: "8h rate distribution", category: "sentiment", enabled: false },
    { id: "putCall", name: "Put/Call Ratio", description: "Options sentiment", params: "PCR >1 bearish, <1 bullish", category: "sentiment", enabled: false },
    { id: "whaleAlert", name: "Whale Alert Sentiment", description: "Large transfer sentiment", params: "Transfer direction", category: "sentiment", enabled: false },
  ],
  micro: [
    { id: "openInterest", name: "Open Interest", description: "Open contract volume", params: "Total OI, OI/Market Cap", category: "micro", enabled: false },
    { id: "fundingRate", name: "Funding Rate", description: "Perpetual contract funding", params: "Normal: -0.01%~0.01%/8h", category: "micro", enabled: false },
    { id: "orderbookImbalance", name: "Orderbook Imbalance", description: "Order book buy/sell ratio", params: "Bid/Ask Ratio", category: "micro", enabled: false },
    { id: "longShortRatio", name: "Long/Short Ratio", description: "Position ratio", params: "Top trader positions", category: "micro", enabled: false },
    { id: "liquidationHeatmap", name: "Liquidation Heatmap", description: "Liquidation cluster zones", params: "Cumulative liquidation distribution", category: "micro", enabled: false },
    { id: "basisSpread", name: "Basis & Spread", description: "Futures-spot basis", params: "Annualized basis %", category: "micro", enabled: false },
    { id: "cvd", name: "CVD", description: "Cumulative Volume Delta", params: "Taker buy - Taker sell", category: "micro", enabled: false },
    { id: "spotPremium", name: "Spot Premium", description: "Spot price premium", params: "Coinbase vs Binance", category: "micro", enabled: false },
    { id: "optionsSkew", name: "Options Skew", description: "Options skew indicator", params: "25D Put-Call IV diff", category: "micro", enabled: false },
    { id: "takerRatio", name: "Taker Buy/Sell", description: "Taker order direction", params: "Taker Buy/Sell Ratio", category: "micro", enabled: false },
  ],
}

// ==================== MAIN COMPONENT ====================
export default function CreateResearchAgent() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0) // 0 = start, 1 = research types, 2 = indicators, 3 = review
  const [agentName, setAgentName] = useState("")
  const [agentDescription, setAgentDescription] = useState("")
  const [selectedResearchTypes, setSelectedResearchTypes] = useState<string[]>([])
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([])
  const [selectedLLMProvider, setSelectedLLMProvider] = useState<string | null>(null)
  const [selectedResearchType, setSelectedResearchType] = useState<string | null>(null) // Declare the variable
  const [userInstruction, setUserInstruction] = useState("")
  const [isResearchTypeOpen, setIsResearchTypeOpen] = useState(false)

  const exampleInstructions = [
    "Focus on momentum continuation.\nTreat KOL sentiment as leading.\nIgnore technical divergences unless confirmed on higher timeframe.",
    "This agent is risk-sensitive.\nIf sentiment and technical signals conflict, downgrade confidence.\nPrefer neutral output over forced directional bias.",
    "Treat Fear & Greed as contrarian only when extreme (<20 or >80).\nOtherwise follow dominant sentiment trend."
  ]

  const systemPrompt = `You are a market research agent.

You do NOT place trades.
You do NOT manage positions.
You analyze market data strictly based on the configured indicators.

Your output must include:
- Signal direction (Bullish / Bearish / Neutral)
- Confidence level (0-100%)
- Key supporting evidence from each indicator
- Risk factors and caveats`

  const stepTitles = ["Configuration", "Preview & Instruction"]

  const toggleResearchType = (id: string) => {
    setSelectedResearchTypes(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleIndicator = (id: string) => {
    setSelectedIndicators(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const selectLLMProvider = (provider: string) => {
    setSelectedLLMProvider(provider)
  }

  const selectResearchType = (id: string) => {
    setSelectedResearchType(id)
    // Clear previously selected indicators when changing research type
    setSelectedIndicators([])
  }

  const canProceed = () => {
    if (currentStep === 0) return agentName.trim().length > 0 && selectedLLMProvider !== null && selectedResearchType !== null && selectedIndicators.length > 0
    return true
  }

  const handleNext = () => {
    if (currentStep < 1 && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCreate = () => {
    // Create the agent and redirect to research agent detail page
    router.push("/research/ra-001")
  }

  // Get indicators for selected research type
  const getAvailableIndicators = () => {
    if (!selectedResearchType) return []
    return indicatorsByCategory[selectedResearchType] || []
  }

  const getResearchTypeName = (id: string) => {
    return researchTypes.find(r => r.id === id)?.name || id
  }

  const getIndicatorName = (id: string) => {
    for (const category of Object.values(indicatorsByCategory)) {
      const indicator = category.find(i => i.id === id)
      if (indicator) return indicator.name
    }
    return id
  }

  const getIndicatorDetails = (id: string) => {
    for (const category of Object.values(indicatorsByCategory)) {
      const indicator = category.find(i => i.id === id)
      if (indicator) return { name: indicator.name, params: indicator.params }
    }
    return { name: id, params: "" }
  }

  return (
    <div className="min-h-screen bg-[#07070a] text-[#e4e4e7] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#18181f] px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-[#121218] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#5a5a65]" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">Create Research Agent</h1>
            <p className="text-sm text-[#5a5a65]">Configure your agent's research capabilities</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b border-[#18181f] px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          {[0, 1].map((step) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  currentStep >= step 
                    ? "bg-[#00d4aa] text-[#07070a]" 
                    : "bg-[#18181f] text-[#5a5a65]"
                }`}>
                  {currentStep > step ? <Check className="w-4 h-4" /> : step + 1}
                </div>
                <span className={`text-sm ${currentStep >= step ? "text-[#e4e4e7]" : "text-[#5a5a65]"}`}>
                  {stepTitles[step]}
                </span>
              </div>
              {step < 1 && (
                <div className={`w-16 h-[2px] mx-2 ${currentStep > step ? "bg-[#00d4aa]" : "bg-[#22222a]"}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl">
          
          {/* Step 0: Research Type + Basic Parameters */}
          {currentStep === 0 && (
            <div className="flex gap-6">
              {/* Left: Main Configuration */}
              <div className="flex-1 bg-[#0a0a0e] rounded-xl border border-[#18181f] p-8">
                {/* Research Type Section - Primary Focus */}
                <div>
                  <h2 className="text-xl font-semibold mb-2">Select Research Type <span className="text-red-500">*</span></h2>
                  <p className="text-sm text-[#5a5a65] mb-4">Choose one type of market research your agent will specialize in</p>
                
                  {/* Custom Dropdown with Descriptions */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsResearchTypeOpen(!isResearchTypeOpen)}
                      className={`w-full px-4 py-3 bg-[#07070a] border rounded-lg text-left flex items-center justify-between transition-colors ${
                        isResearchTypeOpen ? "border-[#00d4aa]" : "border-[#22222a] hover:border-[#3a3a48]"
                      }`}
                    >
                      <span className={selectedResearchType ? "text-[#e4e4e7]" : "text-[#5a5a65]"}>
                        {selectedResearchType ? getResearchTypeName(selectedResearchType) : "Select a research type..."}
                      </span>
                      <ChevronRight className={`w-5 h-5 text-[#5a5a65] transition-transform ${isResearchTypeOpen ? "rotate-90" : ""}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isResearchTypeOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-[#0a0a0e] border border-[#22222a] rounded-xl shadow-xl overflow-hidden">
                        {researchTypes.map((type) => {
                          const isSelected = selectedResearchType === type.id
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => {
                                selectResearchType(type.id)
                                setIsResearchTypeOpen(false)
                              }}
                              className={`w-full px-4 py-3 text-left transition-colors border-b border-[#18181f] last:border-b-0 ${
                                isSelected 
                                  ? "bg-[rgba(0,212,170,0.08)]" 
                                  : "hover:bg-[#121218]"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                                  isSelected
                                    ? "border-[#00d4aa]"
                                    : "border-[#3a3a48]"
                                }`}>
                                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#00d4aa]" />}
                                </div>
                                <div className="flex-1">
                                  <div className={`font-medium ${isSelected ? "text-[#00d4aa]" : "text-[#e4e4e7]"}`}>
                                    {type.name}
                                  </div>
                                  <div className="text-xs text-[#5a5a65] mt-1">
                                    {type.description}
                                  </div>
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Configure Indicators - Primary Section with Green Theme */}
                  {selectedResearchType && (
                    <div className="mt-6 bg-[#0d1a14] rounded-xl border-2 border-[#1a3d2e] p-6">
                      {/* Header with Research Type Badge */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-[#e8e8e8]">Configure Indicators</h3>
                            <span className="text-red-500">*</span>
                          </div>
                          <p className="text-sm text-[#6b8f7a]">
                            Select the indicators for <span className="text-[#22c55e] font-medium">{getResearchTypeName(selectedResearchType)}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[#22c55e]">{selectedIndicators.length}</div>
                            <div className="text-xs text-[#6b8f7a]">selected</div>
                          </div>
                          <button
                            onClick={() => {
                              const allIds = getAvailableIndicators().map(i => i.id)
                              if (selectedIndicators.length === allIds.length) {
                                setSelectedIndicators([])
                              } else {
                                setSelectedIndicators(allIds)
                              }
                            }}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1a3d2e] text-[#22c55e] hover:bg-[#234d3a] transition-colors"
                          >
                            {selectedIndicators.length === getAvailableIndicators().length ? "Deselect All" : "Select All"}
                          </button>
                        </div>
                      </div>

                      {/* Indicator Type Description */}
                      <div className="mb-6 p-4 bg-[#0a1410] rounded-lg border border-[#1a3d2e]">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#1a3d2e] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#22c55e] mb-1">{getResearchTypeName(selectedResearchType)}</div>
                            <p className="text-sm text-[#6b8f7a]">
                              {researchTypes.find(r => r.id === selectedResearchType)?.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Indicators Grid - Larger Cards */}
                      <div className="grid grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-2">
                        {getAvailableIndicators().map((indicator) => {
                          const isSelected = selectedIndicators.includes(indicator.id)
                          return (
                            <button
                              key={indicator.id}
                              onClick={() => toggleIndicator(indicator.id)}
                              className={`p-5 rounded-xl border-2 text-left transition-all ${
                                isSelected
                                  ? "border-[#22c55e] bg-[#0d2818]"
                                  : "border-[#1a3d2e] bg-[#0a1410] hover:border-[#2d5a42] hover:bg-[#0d1a14]"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-semibold text-base text-[#e8e8e8]">{indicator.name}</span>
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                  isSelected
                                    ? "border-[#22c55e] bg-[#22c55e]"
                                    : "border-[#3d5a4a]"
                                }`}>
                                  {isSelected && <Check className="w-4 h-4 text-[#0d1210]" />}
                                </div>
                              </div>
                              <div className="text-sm text-[#6b8f7a] mb-3">{indicator.description}</div>
                              <div className="text-xs text-[#22c55e] bg-[#1a3d2e] px-3 py-1.5 rounded-lg inline-block font-medium">
                                {indicator.params}
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {/* Indicator Count Footer */}
                      {selectedIndicators.length === 0 && (
                        <div className="mt-4 p-4 bg-[#1a1a10] border border-[#3d3d1a] rounded-lg text-center">
                          <p className="text-sm text-[#a0a060]">Please select at least one indicator to continue</p>
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {/* Agent Basic Parameters Section */}
              <div className="mt-8 pt-8 border-t border-[#18181f]">
                <h3 className="text-lg font-semibold mb-2">Agent Configuration</h3>
                <p className="text-sm text-[#5a5a65] mb-6">Configure your Research Agent's identity and core settings</p>
                
                <div className="grid grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm mb-2">
                        Agent Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        placeholder="e.g., Alpha Hunter, Sentiment Scout"
                        className="w-full px-4 py-3 bg-[#07070a] border border-[#22222a] rounded-lg text-[#e4e4e7] placeholder-[#5a5a65] focus:outline-none focus:border-[#00d4aa] transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2">Agent Description</label>
                      <textarea
                        value={agentDescription}
                        onChange={(e) => setAgentDescription(e.target.value)}
                        placeholder="Describe your research strategy, goals, and approach..."
                        rows={4}
                        className="w-full px-4 py-3 bg-[#07070a] border border-[#22222a] rounded-lg text-[#e4e4e7] placeholder-[#5a5a65] focus:outline-none focus:border-[#00d4aa] transition-colors resize-none"
                      />
                    </div>
                  </div>
                  
                  {/* Right Column - LLM Provider */}
                  <div>
                    <label className="block text-sm mb-2">
                      LLM Provider <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      <button
                        onClick={() => selectLLMProvider("deepseek / deepseek-chat")}
                        className={`w-full px-4 py-3 bg-[#07070a] rounded-lg text-left transition-colors ${
                          selectedLLMProvider === "deepseek / deepseek-chat" 
                            ? "border-2 border-[#00d4aa] bg-[rgba(0,212,170,0.05)]" 
                            : "border border-[#22222a] hover:border-[#3a3a48]"
                        }`}
                      >
                        <span className="text-[#e4e4e7]">deepseek / deepseek-chat</span>
                      </button>
                      <button
                        onClick={() => selectLLMProvider("google / gemini-3-flash-preview")}
                        className={`w-full px-4 py-3 bg-[#07070a] rounded-lg text-left transition-colors ${
                          selectedLLMProvider === "google / gemini-3-flash-preview" 
                            ? "border-2 border-[#00d4aa] bg-[rgba(0,212,170,0.05)]" 
                            : "border border-[#22222a] hover:border-[#3a3a48]"
                        }`}
                      >
                        <span className="text-[#e4e4e7]">google / gemini-3-flash-preview</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Continue Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
                      canProceed()
                        ? "bg-[#00d4aa] text-[#07070a] hover:bg-[#00b894]"
                        : "bg-[#22222a] text-[#5a5a65] cursor-not-allowed"
                    }`}
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right: Configuration Preview */}
              <div className="w-80 bg-[#0a0a0e] rounded-xl border border-[#18181f] p-6 h-fit sticky top-8">
                <h3 className="text-lg font-semibold mb-4">Configuration Preview</h3>
                
                {/* Research Type */}
                <div className="mb-5 pb-5 border-b border-[#18181f]">
                  <div className="text-xs font-semibold text-[#5a5a65] uppercase tracking-wider mb-3">Research Type</div>
                  {selectedResearchType ? (
                    <span className="px-2.5 py-1 bg-[rgba(0,212,170,0.1)] border border-[rgba(0,212,170,0.2)] rounded-lg text-xs text-[#00d4aa] font-medium">
                      {getResearchTypeName(selectedResearchType)}
                    </span>
                  ) : (
                    <span className="text-sm text-[#5a5a65] italic">Not selected</span>
                  )}
                </div>

{/* Selected Indicators */}
  <div className="mb-5 pb-5 border-b border-[#18181f]">
  <div className="text-xs font-semibold text-[#5a5a65] uppercase tracking-wider mb-3">
  Indicators ({selectedIndicators.length})
  </div>
  {selectedIndicators.length === 0 ? (
  <span className="text-sm text-[#5a5a65] italic">No indicators selected</span>
  ) : (
  <div className="space-y-2 max-h-[200px] overflow-y-auto">
  {selectedIndicators.map((indicatorId) => {
  const details = getIndicatorDetails(indicatorId)
  return (
  <div
  key={indicatorId}
  className="px-3 py-2 bg-[#07070a] border border-[#22222a] rounded-lg"
  >
  <div className="flex items-center justify-between mb-1">
  <span className="text-sm font-medium">{details.name}</span>
  <Check className="w-4 h-4 text-[#22c55e]" />
  </div>
  <div className="text-[10px] text-[#00d4aa] bg-[rgba(0,212,170,0.1)] px-2 py-1 rounded inline-block">
  {details.params}
  </div>
  </div>
  )
  })}
  </div>
  )}
  </div>
                
                {/* Agent Info */}
                <div className="mb-5 pb-5 border-b border-[#18181f]">
                  <div className="text-xs font-semibold text-[#5a5a65] uppercase tracking-wider mb-3">Agent Details</div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-[#5a5a65]">Name</div>
                      <div className="text-sm font-medium">{agentName || <span className="text-[#5a5a65] italic">Not set</span>}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#5a5a65]">LLM Provider</div>
                      <div className="text-sm font-medium">{selectedLLMProvider || <span className="text-[#5a5a65] italic">Not selected</span>}</div>
                    </div>
                    {agentDescription && (
                      <div>
                        <div className="text-xs text-[#5a5a65]">Description</div>
                        <div className="text-sm text-[#a0a0ab] line-clamp-2">{agentDescription}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Completion Status */}
                <div>
                  <div className="text-xs font-semibold text-[#5a5a65] uppercase tracking-wider mb-3">Status</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selectedResearchType ? "bg-[#22c55e]" : "bg-[#22222a]"}`}>
                        {selectedResearchType && <Check className="w-2.5 h-2.5 text-[#0d1210]" />}
                      </div>
                      <span className="text-sm text-[#a0a0ab]">Research Type</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selectedIndicators.length > 0 ? "bg-[#22c55e]" : "bg-[#22222a]"}`}>
                        {selectedIndicators.length > 0 && <Check className="w-2.5 h-2.5 text-[#0d1210]" />}
                      </div>
                      <span className="text-sm text-[#a0a0ab]">Indicators</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${agentName.trim() ? "bg-[#22c55e]" : "bg-[#22222a]"}`}>
                        {agentName.trim() && <Check className="w-2.5 h-2.5 text-[#0d1210]" />}
                      </div>
                      <span className="text-sm text-[#a0a0ab]">Agent Name</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selectedLLMProvider ? "bg-[#22c55e]" : "bg-[#22222a]"}`}>
                        {selectedLLMProvider && <Check className="w-2.5 h-2.5 text-[#0d1210]" />}
                      </div>
                      <span className="text-sm text-[#a0a0ab]">LLM Provider</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Preview & Research Instruction */}
          {currentStep === 1 && (
            <div className="flex gap-6">
              {/* Left: Research Instruction */}
              <div className="flex-1 bg-[#0a0a0e] rounded-xl border border-[#18181f] p-8">
                <h2 className="text-xl font-semibold mb-2">Research Instruction</h2>
                <p className="text-sm text-[#5a5a65] mb-6">
                  Define <span className="font-medium text-[#e4e4e7]">how this Research Agent should reason</span> based on the configured indicators.
                </p>

{/* System Prompt - Fixed */}
  <div className="bg-[#07070a] rounded-xl border border-[#22222a] p-6 mb-6">
  <div className="flex items-center justify-between mb-4">
  <div className="inline-block px-3 py-1 bg-[#3b1c1c] text-[#ef4444] text-xs font-semibold rounded-full">
  System Prompt - Fixed
  </div>
  <span className="text-xs text-[#5a5a65] italic">Internal View Only</span>
  </div>
  <h3 className="text-base font-semibold mb-2">System Instruction</h3>
                  <p className="text-sm text-[#5a5a65] mb-4">This instruction is enforced by Hubble AI and cannot be modified.</p>
                  <div className="bg-[#0a0a0e] rounded-lg p-4 font-mono text-sm text-[#9ca3af] whitespace-pre-wrap border border-[#22222a] max-h-[160px] overflow-y-auto">
                    {systemPrompt}
                  </div>
                </div>

                {/* User Instruction - Editable */}
                <div className="bg-[#07070a] rounded-xl border border-[#22222a] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="inline-block px-3 py-1 bg-[rgba(0,212,170,0.15)] text-[#00d4aa] text-xs font-semibold rounded-full">
                      User Instruction - Editable
                    </div>
                    <div className="inline-block px-2 py-0.5 bg-[#22222a] text-[#5a5a65] text-[10px] font-medium rounded">
                      v1
                    </div>
                  </div>
                  <h3 className="text-base font-semibold mb-2">Research Method Instruction</h3>
                  <p className="text-sm text-[#5a5a65] mb-4">Describe how you want the agent to interpret signals and form conclusions.</p>
                  
{/* Structural Hints - Warning style reminder */}
  <div className="mb-4 p-4 bg-[#1a1210] rounded-lg border border-[#3d2a1a]">
  <div className="text-xs font-medium text-[#f59e0b] mb-2">Consider addressing:</div>
  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-[#c9a066]">
  <div className="flex items-center gap-2">
  <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
  <span>Indicator priority (which indicators dominate)</span>
  </div>
  <div className="flex items-center gap-2">
  <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
  <span>Risk handling (when to downgrade confidence)</span>
  </div>
  <div className="flex items-center gap-2">
  <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
  <span>Regime awareness (trending vs ranging)</span>
  </div>
  <div className="flex items-center gap-2">
  <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
  <span>Neutral conditions (when NOT to take a stance)</span>
  </div>
  </div>
  </div>

                  <textarea
                    value={userInstruction}
                    onChange={(e) => setUserInstruction(e.target.value.slice(0, 1000))}
                    placeholder={`Example:\nPrioritize sentiment continuation over short-term technical pullbacks.\nIf sentiment is strong but RSI is overbought, mark the signal as high-risk instead of bearish.\nAvoid strong conclusions during macro-driven volatility spikes.`}
                    rows={6}
                    className="w-full px-4 py-3 bg-[#0a0a0e] border border-[#22222a] rounded-lg text-[#e4e4e7] placeholder-[#5a5a65] focus:outline-none focus:border-[#00d4aa] transition-colors resize-none font-mono text-sm"
                  />
                  <div className="text-right mt-2 text-sm text-[#5a5a65]">
                    {userInstruction.length} / 1000 characters
                  </div>

{/* Example Instructions */}
  <div className="mt-6">
  <p className="text-sm text-[#5a5a65] mb-3">Example Instructions (click + to append)</p>
  <div className="space-y-3">
  {exampleInstructions.map((example, index) => (
  <div
  key={index}
  className="flex items-start gap-3 p-4 bg-[#0a0a0e] border border-[#22222a] rounded-lg hover:border-[#3a3a48] hover:bg-[#121218] transition-all"
  >
  <div className="flex-1 text-sm text-[#9ca3af] whitespace-pre-wrap">{example}</div>
  <button
  type="button"
  onClick={() => {
  if (userInstruction.trim()) {
  setUserInstruction(prev => prev + "\n\n" + example)
  } else {
  setUserInstruction(example)
  }
  }}
  className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1a3d2e] hover:bg-[#234d3a] flex items-center justify-center transition-colors"
  title="Add to instruction"
  >
  <Plus className="w-4 h-4 text-[#22c55e]" />
  </button>
  </div>
  ))}
  </div>
  </div>
                </div>
                
                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 rounded-lg font-medium border border-[#22222a] hover:border-[#3a3a48] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreate}
                    className="px-8 py-3 rounded-lg font-medium bg-[#00d4aa] text-[#07070a] hover:bg-[#00b894] transition-all"
                  >
                    Create Research Agent
                  </button>
                </div>
              </div>
              
              {/* Right: Configuration Preview */}
              <div className="w-80 bg-[#0a0a0e] rounded-xl border border-[#18181f] p-6 h-fit sticky top-8">
                <h3 className="text-lg font-semibold mb-4">Configuration Preview</h3>
                
                {/* Agent Info */}
                <div className="mb-5 pb-5 border-b border-[#18181f]">
                  <div className="text-xs font-semibold text-[#5a5a65] uppercase tracking-wider mb-3">Agent Details</div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-[#5a5a65]">Name</div>
                      <div className="text-sm font-medium">{agentName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#5a5a65]">LLM Provider</div>
                      <div className="text-sm font-medium">{selectedLLMProvider}</div>
                    </div>
                    {agentDescription && (
                      <div>
                        <div className="text-xs text-[#5a5a65]">Description</div>
                        <div className="text-sm text-[#a0a0ab] line-clamp-2">{agentDescription}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Research Type */}
                <div className="mb-5 pb-5 border-b border-[#18181f]">
                  <div className="text-xs font-semibold text-[#5a5a65] uppercase tracking-wider mb-3">Research Type</div>
                  {selectedResearchType && (
                    <span className="px-2.5 py-1 bg-[rgba(0,212,170,0.1)] border border-[rgba(0,212,170,0.2)] rounded-lg text-xs text-[#00d4aa] font-medium">
                      {getResearchTypeName(selectedResearchType)}
                    </span>
                  )}
                </div>
                
                {/* Selected Indicators */}
                <div className="mb-5 pb-5 border-b border-[#18181f]">
                  <div className="text-xs font-semibold text-[#5a5a65] uppercase tracking-wider mb-3">
                    Indicators ({selectedIndicators.length})
                  </div>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {selectedIndicators.map((indicatorId) => {
                      const details = getIndicatorDetails(indicatorId)
                      return (
                        <div
                          key={indicatorId}
                          className="flex items-center justify-between px-3 py-2 bg-[#07070a] border border-[#22222a] rounded-lg"
                        >
                          <span className="text-sm font-medium">{details.name}</span>
                          <span className="text-[10px] text-[#00d4aa] bg-[rgba(0,212,170,0.1)] px-2 py-1 rounded">
                            {details.params}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* User Instruction Preview */}
                <div className="mb-5 pb-5 border-b border-[#18181f]">
                  <div className="text-xs font-semibold text-[#5a5a65] uppercase tracking-wider mb-3">
                    Custom Instruction
                  </div>
                  {userInstruction ? (
                    <div className="text-sm text-[#9ca3af] whitespace-pre-wrap line-clamp-4 bg-[#07070a] border border-[#22222a] rounded-lg p-3">
                      {userInstruction}
                    </div>
                  ) : (
                    <div className="text-sm text-[#5a5a65] italic">No custom instruction set</div>
                  )}
                </div>

</div>
  </div>
  )}
          
        </div>
      </div>
    </div>
  )
}
