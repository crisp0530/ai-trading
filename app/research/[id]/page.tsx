"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Play,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Heart,
  ChevronDown,
  ChevronUp,
  FileText,
  Cpu,
  History,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { useSearchParams } from "next/navigation"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const HARDCODED_AGENTS: Record<string, any> = {
  "ra-001": {
    id: "ra-001",
    name: "Technical Analyzer Pro",
    description:
      "Advanced technical analysis using multiple indicators and market sentiment for real-time signal generation",
    creator: "0x742d...35c9",
    price: "$0.5 USDC",
    calls: 1247,
    type: "Technical Analysis",
    reputation: 94,
    llmProvider: "OpenAI",
    timeframe: "5m",
    dataSources: ["MACD", "RSI", "Moving Average", "Bollinger Bands"],
    created: "Jan 15, 2025",
    isPublic: true,
  },
  "ra-002": {
    id: "ra-002",
    name: "MACD Master",
    description: "Expertise in MACD for identifying trend reversals and momentum shifts",
    creator: "0x8f3a...2bc4",
    price: "$0.4 USDC",
    calls: 892,
    type: "Technical Analysis",
    reputation: 89,
    llmProvider: "Gemini",
    timeframe: "15m",
    dataSources: ["MACD", "EMA", "Signal Line"],
    created: "Jan 10, 2025",
    isPublic: true,
  },
  "ra-003": {
    id: "ra-003",
    name: "RSI Specialist",
    description: "Utilizes RSI to determine overbought and oversold conditions",
    creator: "0x5e9c...7a1d",
    price: "$0.6 USDC",
    calls: 2341,
    type: "Technical Analysis",
    reputation: 96,
    llmProvider: "0G",
    timeframe: "1h",
    dataSources: ["RSI", "Stochastic RSI", "Volume"],
    created: "Dec 28, 2024",
    isPublic: true,
  },
  "ra-004": {
    id: "ra-004",
    name: "Sentiment Analyzer",
    description: "Analyzes social media and news sentiment for market trends",
    creator: "0x3d8f...9e2a",
    price: "$0.75 USDC",
    calls: 1856,
    token: "BTC, ETH",
    type: "Sentiment Analysis",
    reputation: 91,
    llmProvider: "OpenAI",
    timeframe: "1d",
    dataSources: ["Twitter", "Reddit", "News API"],
    created: "Jan 8, 2025",
    isPublic: true,
  },
  "ra-005": {
    id: "ra-005",
    name: "Volume Profile Expert",
    description: "Profiles trading volume to identify key levels of support and resistance",
    creator: "0x7a2c...4f1b",
    price: "$0.45 USDC",
    calls: 1523,
    token: "Multi-Token",
    type: "Technical Analysis",
    reputation: 88,
    llmProvider: "Gemini",
    timeframe: "6h",
    dataSources: ["Volume Profile", "VWAP", "OBV"],
    created: "Jan 12, 2025",
    isPublic: true,
  },
  "ra-006": {
    id: "ra-006",
    name: "Whale Watcher",
    description: "Monitors large-scale transactions for market insights",
    creator: "0x9b5e...6d3c",
    price: "$1.0 USDC",
    calls: 3127,
    token: "Multi-Token",
    type: "On-Chain Analysis",
    reputation: 97,
    llmProvider: "0G",
    timeframe: "1m",
    dataSources: ["Whale Alerts", "Exchange Flows", "Large Transactions"],
    created: "Dec 20, 2024",
    isPublic: true,
  },
}

interface Signal {
  timestamp: string
  price: number
  signal: "BUY" | "SELL" | "NEUTRAL"
  reasoning: string
  verified?: boolean
  actualMove?: "UP" | "DOWN" | "FLAT"
  accurate?: boolean
}

interface AccuracyByPeriod {
  period: string
  accuracy: number
  totalSignals: number
  correctSignals: number
}

export default function ResearchAgentDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const fromPage = searchParams.get("from") || "leaderboard"

  const getBackLink = () => {
    switch (fromPage) {
      case "marketplace":
        return { url: "/marketplace", text: "Back to Marketplace" }
      case "my-agents":
        return { url: "/my-agents", text: "Back to My Agents" }
      case "leaderboard":
      default:
        return { url: "/leaderboard?tab=research", text: "Back to Leaderboard" }
    }
  }

  const backLink = getBackLink()

  const [connectedWallet, setConnectedWallet] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<{ conclusion: string; reasoning: string } | null>(null)
  const [showReasoningDialog, setShowReasoningDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [historicalSignals, setHistoricalSignals] = useState<Signal[]>([])
  const [callHistory, setCallHistory] = useState<
    Array<{ time: string; output: "BUY" | "SELL" | "NEUTRAL"; user: string; verified?: boolean; accurate?: boolean }>
  >([])
  const [signalFilter, setSignalFilter] = useState<"ALL" | "BUY" | "SELL" | "NEUTRAL">("ALL")
  const [chartTimeframe, setChartTimeframe] = useState<"1m" | "5m" | "15m" | "1h" | "6h" | "1d">("1h")
  const [timeRange, setTimeRange] = useState<"1H" | "4H" | "1D" | "1W" | "1M" | "ALL">("1D")

  const [accuracyByPeriod, setAccuracyByPeriod] = useState<AccuracyByPeriod[]>([
    { period: "Last 1H", accuracy: 92, totalSignals: 12, correctSignals: 11 },
    { period: "Last 24H", accuracy: 87, totalSignals: 45, correctSignals: 39 },
    { period: "Last 7D", accuracy: 85, totalSignals: 334, correctSignals: 285 },
    { period: "Last 30D", accuracy: 83, totalSignals: 1247, correctSignals: 1035 },
  ])

  const [expandedReport, setExpandedReport] = useState<number | null>(0)

  // Recent reports data
  const recentReports = [
    { id: 1, signal: 'SELL' as const, token: 'BTC', confidence: 78, priceAtSignal: 43520, priceAfter: 42890, changePercent: -1.45, correct: true, time: '2 hours ago', txHash: '0xdf5...4256', reasoning: 'Bearish divergence on 1H RSI. Price rejected at $43,800 resistance 3x. MACD histogram turning negative. Funding rate shifting negative at -0.01%.' },
    { id: 2, signal: 'BUY' as const, token: 'BTC', confidence: 82, priceAtSignal: 42680, priceAfter: 43520, changePercent: 1.97, correct: true, time: '5 hours ago', txHash: '0x716...f746', reasoning: 'Strong support at $42,500 held. RSI oversold bounce confirmed. Volume spike on reversal candle.' },
    { id: 3, signal: 'NEUTRAL' as const, token: 'ETH', confidence: 55, priceAtSignal: 3280, priceAfter: 3295, changePercent: 0.46, correct: null, time: '8 hours ago', txHash: '0xe89...61ba', reasoning: 'Consolidation pattern forming. No clear directional bias. Waiting for breakout confirmation.' },
    { id: 4, signal: 'BUY' as const, token: 'SOL', confidence: 75, priceAtSignal: 97.5, priceAfter: 99.8, changePercent: 2.36, correct: true, time: '12 hours ago', txHash: '0xf3e...cfde', reasoning: 'Breaking out of descending wedge. Volume confirmation on breakout. RSI showing bullish momentum.' },
    { id: 5, signal: 'SELL' as const, token: 'BTC', confidence: 80, priceAtSignal: 44200, priceAfter: 43520, changePercent: -1.54, correct: true, time: '18 hours ago', txHash: '0x82a...9ec4', reasoning: 'Double top formation completed. Bearish engulfing candle on 4H. OBV showing distribution.' },
  ]

  // Agent capabilities data
  const agentCapabilities = {
    analysisType: 'Technical Analysis',
    indicators: ['RSI', 'MACD', 'Bollinger Bands', 'Volume Profile', 'OBV', 'Fibonacci'],
    timeframes: ['15m', '1H', '4H'],
    dataSources: ['Binance Futures', 'Funding Rate', 'Open Interest', 'Liquidation Data'],
    llmModel: 'GPT-4',
    supportedTokens: ['BTC', 'ETH', 'SOL', 'XRP', 'BNB'],
  }

  const [agent] = useState(() => {
    // First try localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("researchAgents")
      if (stored) {
        const agents = JSON.parse(stored)
        const found = agents.find((a: any) => a.id === params.id)
        if (found) {
          return {
            id: found.id,
            name: found.name,
            description: found.description,
            creator: found.owner,
            price: `$${found.price} USDC`,
            calls: found.calls,
            token: found.token,
            type: found.type,
            reputation: found.accuracy,
            llmProvider: found.llm,
            timeframe: found.timeframe,
            dataSources: found.dataSources || ["MACD", "RSI", "Moving Average"],
            created: found.created,
            isPublic: found.isPublic,
            prompts: found.prompts || {},
            otherPrompt: found.otherPrompt || "",
          }
        }
      }
    }

    // Then check hardcoded database
    if (HARDCODED_AGENTS[params.id]) {
      return HARDCODED_AGENTS[params.id]
    }

    // Fallback default - use realistic demo data
    return {
      id: params.id,
      name: "Futures TA Pro",
      description: "Advanced technical analysis combining multiple indicators for futures trading signals.",
      creator: "@signals_master",
      price: "$0.1 USDC",
      calls: 1247,
      token: "BTC",
      type: "Technical Analysis",
      reputation: 85,
      llmProvider: "GPT-4",
      timeframe: "15m / 1H / 4H",
      dataSources: ["Binance Futures", "Funding Rate", "Open Interest", "Liquidation Data"],
      created: "Jan 10, 2026",
      isPublic: true,
      prompts: {},
      otherPrompt: "",
    }
  })

  useEffect(() => {
    const generateMockData = () => {
      const signals: Signal[] = []
      const calls: Array<{
        time: string
        output: "BUY" | "SELL" | "NEUTRAL"
        user: string
        verified?: boolean
        accurate?: boolean
      }> = []
      const now = Date.now()

      const getDataPoints = () => {
        const ranges: Record<typeof timeRange, number> = {
          "1H": 60,
          "4H": 80,
          "1D": 90,
          "1W": 168,
          "1M": 180,
          ALL: 200,
        }
        return ranges[timeRange] || 90
      }

      const getTimeInterval = () => {
        const intervals: Record<typeof chartTimeframe, number> = {
          "1m": 60000,
          "5m": 300000,
          "15m": 900000,
          "1h": 3600000,
          "6h": 21600000,
          "1d": 86400000,
        }
        return intervals[chartTimeframe] || 3600000
      }

      const dataPoints = getDataPoints()
      const timeInterval = getTimeInterval()

      let currentPrice = 45000

      for (let i = dataPoints - 1; i >= 0; i--) {
        const timestamp = new Date(now - i * timeInterval).toISOString()

        const drift = (Math.random() - 0.48) * 200
        const volatility = (Math.random() - 0.5) * 800
        const momentum = (Math.random() - 0.5) * 150

        currentPrice = currentPrice + drift + volatility + momentum

        if (currentPrice < 40000) currentPrice = 40000 + Math.random() * 1000
        if (currentPrice > 55000) currentPrice = 55000 - Math.random() * 1000

        const priceChange = i < dataPoints - 1 ? currentPrice - signals[signals.length - 1].price : 0
        const rand = Math.random()
        let signal: "BUY" | "SELL" | "NEUTRAL"

        if (priceChange > 300) {
          signal = rand > 0.3 ? "BUY" : "NEUTRAL"
        } else if (priceChange < -300) {
          signal = rand > 0.3 ? "SELL" : "NEUTRAL"
        } else {
          signal = rand > 0.7 ? "BUY" : rand > 0.4 ? "SELL" : "NEUTRAL"
        }

        const verified = i > 10
        let actualMove: "UP" | "DOWN" | "FLAT" = "FLAT"
        let accurate = false

        if (verified && i > 10) {
          const futurePrice = currentPrice + (Math.random() - 0.5) * 1000
          if (futurePrice > currentPrice * 1.005) actualMove = "UP"
          else if (futurePrice < currentPrice * 0.995) actualMove = "DOWN"
          else actualMove = "FLAT"

          if (signal !== "NEUTRAL") {
            accurate = (signal === "BUY" && actualMove === "UP") || (signal === "SELL" && actualMove === "DOWN")
          }
        }

        signals.push({
          timestamp,
          price: Math.round(currentPrice * 100) / 100,
          signal,
          reasoning: `Based on ${signal === "BUY" ? "bullish" : signal === "SELL" ? "bearish" : "neutral"} indicators`,
          verified,
          actualMove,
          accurate,
        })

        if (i < 20) {
          calls.push({
            time: new Date(timestamp).toLocaleString(),
            output: signal,
            user: `0x${Math.random().toString(16).substr(2, 6)}...${Math.random().toString(16).substr(2, 4)}`,
            verified,
            accurate,
          })
        }
      }
      setHistoricalSignals(signals)
      setCallHistory(calls.reverse())
    }
    generateMockData()
  }, [chartTimeframe, timeRange])

  const handleRun = () => {
    if (!connectedWallet) return
    setShowPaymentDialog(true)
  }

  const handlePaymentConfirm = () => {
    setShowPaymentDialog(false)
    setIsRunning(true)
    setTimeout(() => {
      setOutput({
        conclusion: "BUY",
        reasoning:
          "Strong bullish momentum detected. MACD shows positive divergence with price breaking above 20-period moving average. RSI at 62 indicates room for upward movement without being overbought. Bollinger Bands showing expansion suggesting increased volatility and potential breakout. Volume profile confirms accumulation at current levels.",
      })
      setIsRunning(false)
      setShowReasoningDialog(true)
    }, 2000)
  }

  const filteredSignals =
    signalFilter === "ALL" ? historicalSignals : historicalSignals.filter((s) => s.signal === signalFilter)

  const chartData = {
    labels: filteredSignals.map((s) => new Date(s.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: `${agent.token} Price`,
        data: filteredSignals.map((s) => s.price),
        borderColor: "rgb(255, 215, 0)",
        backgroundColor: "rgba(255, 215, 0, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: filteredSignals.map((s) =>
          s.signal === "BUY" ? "rgb(0, 255, 159)" : s.signal === "SELL" ? "rgb(255, 82, 82)" : "rgb(120, 120, 120)",
        ),
        pointBorderColor: filteredSignals.map((s) =>
          s.signal === "BUY" ? "rgb(0, 255, 159)" : s.signal === "SELL" ? "rgb(255, 82, 82)" : "rgb(120, 120, 120)",
        ),
        pointBorderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(13, 13, 13, 0.95)",
        titleColor: "rgb(0, 255, 159)",
        bodyColor: "rgb(229, 229, 229)",
        borderColor: "rgb(41, 41, 41)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          afterBody: (context: any) => {
            const index = context[0].dataIndex
            const signal = historicalSignals[index]
            return `Signal: ${signal.signal}\n${signal.reasoning}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(41, 41, 41, 0.5)",
        },
        ticks: {
          color: "rgb(163, 163, 163)",
          font: {
            family: "monospace",
            size: 10,
          },
          maxTicksLimit: typeof window !== "undefined" && window.innerWidth < 768 ? 8 : 15,
        },
      },
      y: {
        grid: {
          color: "rgba(41, 41, 41, 0.5)",
        },
        ticks: {
          color: "rgb(163, 163, 163)",
          font: {
            family: "monospace",
            size: 10,
          },
        },
      },
    },
  }

  const buySignals = historicalSignals.filter((s) => s.signal === "BUY").length
  const sellSignals = historicalSignals.filter((s) => s.signal === "SELL").length
  const neutralSignals = historicalSignals.filter((s) => s.signal === "NEUTRAL").length
  const accuracy = agent.reputation

  return (
    <div className="min-h-screen bg-terminal-dark">
      <header className="border-b border-terminal-border bg-terminal-darker">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/images/image.png" alt="Hubble Terminal" width={140} height={32} className="h-8 w-auto" />
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/marketplace"
                  className="text-sm font-mono text-terminal-muted hover:text-terminal-green transition-colors"
                >
                  Marketplace
                </Link>
                <Link
                  href="/my-agents"
                  className="text-sm font-mono text-terminal-muted hover:text-terminal-green transition-colors"
                >
                  My Agents
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              {connectedWallet ? (
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-terminal-green animate-pulse" />
                  <span className="text-xs font-mono text-terminal-green">0x742d...35c9</span>
                </div>
              ) : (
                <Button
                  onClick={() => setConnectedWallet(true)}
                  className="bg-terminal-accent text-terminal-darker font-mono text-sm hover:bg-terminal-accent/90"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-6 md:px-4 py-8 md:py-12">
        <Link
          href={backLink.url}
          className="inline-flex items-center gap-2 text-xs md:text-sm font-mono text-terminal-muted hover:text-terminal-accent mb-4 md:mb-6 transition-colors"
        >
          <ArrowLeft className="size-3 md:size-4" />
          {backLink.text}
        </Link>

<Card className="bg-terminal-darker border-terminal-border p-4 md:p-6 mb-4 md:mb-6">
  <div className="flex flex-col lg:flex-row gap-8">
  <div className="flex-1 lg:flex-[2]">
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className="flex-1">
                  <h1 className="text-xl md:text-2xl font-bold font-mono text-terminal-foreground mb-2">
                    {agent.name}
                  </h1>
                  <a
                    href={`https://bscscan.com/address/${agent.creator}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] md:text-xs text-terminal-muted hover:text-terminal-accent font-mono transition-colors"
                  >
                    by {agent.creator}
                  </a>
                </div>
                <Badge className="bg-terminal-green/20 text-terminal-green border-terminal-green font-mono text-xs shrink-0">
                  {agent.reputation}%
                </Badge>
              </div>

              <p className="text-xs md:text-sm text-terminal-muted font-mono mb-4 md:mb-6">{agent.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5">
                <div>
                  <p className="text-[10px] text-terminal-accent font-mono font-bold mb-1">TYPE</p>
                  <p className="text-xs md:text-sm font-mono text-terminal-foreground">{agent.type}</p>
                </div>
                <div>
                  <p className="text-[10px] text-terminal-accent font-mono font-bold mb-1">TIMEFRAME</p>
                  <p className="text-xs md:text-sm font-mono text-terminal-foreground">{agent.timeframe}</p>
                </div>
                <div>
                  <p className="text-[10px] text-terminal-accent font-mono font-bold mb-1">LLM</p>
                  <p className="text-xs md:text-sm font-mono text-terminal-foreground">{agent.llmProvider}</p>
                </div>
                <div>
                  <p className="text-[10px] text-terminal-accent font-mono font-bold mb-1">CREATED</p>
                  <p className="text-xs md:text-sm font-mono text-terminal-foreground">{agent.created}</p>
                </div>
              </div>

              {/* Indicators Used */}
              <div className="mb-4">
                <p className="text-[10px] text-terminal-accent font-mono font-bold mb-2">INDICATORS USED</p>
                <div className="flex flex-wrap gap-1.5">
                  {agentCapabilities.indicators.map((indicator) => (
                    <Badge
                      key={indicator}
                      variant="outline"
                      className="border-terminal-border text-terminal-foreground font-mono text-[10px] px-2 py-0.5"
                    >
                      {indicator}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Data Sources */}
              <div>
                <p className="text-[10px] text-terminal-accent font-mono font-bold mb-2">DATA SOURCES</p>
                <div className="flex flex-wrap gap-1.5">
                  {agentCapabilities.dataSources.map((source) => (
                    <Badge
                      key={source}
                      variant="outline"
                      className="border-terminal-border text-terminal-foreground font-mono text-[10px] px-2 py-0.5"
                    >
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>

              </div>

            <div className="lg:w-72 shrink-0 space-y-4">
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                <div className="text-center lg:text-left">
                  <p className="text-[10px] text-terminal-muted font-mono mb-1">Price per Call</p>
                  <p className="text-base md:text-lg font-bold font-mono text-terminal-accent">{agent.price}</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-[10px] text-terminal-muted font-mono mb-1">Total Calls</p>
                  <p className="text-base md:text-lg font-bold font-mono text-terminal-foreground">{agent.calls}</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-[10px] text-terminal-muted font-mono mb-1">Accuracy</p>
                  <p className="text-base md:text-2xl font-bold font-mono text-terminal-green">{agent.reputation}%</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleRun}
                  disabled={isRunning || !connectedWallet}
                  className="flex-1 bg-terminal-green text-terminal-darker font-mono text-sm hover:bg-terminal-green/90 disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <div className="size-4 border-2 border-terminal-darker border-t-transparent rounded-full animate-spin mr-2" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 size-4" />
                      Run Agent
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="border-terminal-border text-terminal-muted hover:bg-terminal-dark hover:text-terminal-foreground font-mono bg-transparent"
                >
                  <Heart className="mr-2 size-4" />
                  Save
                </Button>
              </div>

              {!connectedWallet && (
                <p className="text-[10px] text-terminal-muted font-mono text-center">Connect wallet to run</p>
              )}


            </div>

          </div>
        </Card>

        {/* Signal Accuracy Verification */}
        <Card className="bg-terminal-darker border-terminal-border p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold font-mono text-terminal-foreground">
              Signal Accuracy Verification
            </h2>
            <Badge className="bg-terminal-accent/20 text-terminal-accent border-terminal-accent text-[10px]">
              <Clock className="size-3 mr-1" />
              Verified after 10 bars
            </Badge>
          </div>

          <p className="text-xs text-terminal-muted font-mono mb-4">
            Accuracy is calculated by checking if price moved in the predicted direction within 10 bars after the
            signal. Neutral signals are not counted as they indicate no strong directional view.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {accuracyByPeriod.map((period) => (
              <div
                key={period.period}
                className="bg-terminal-dark/50 border border-terminal-green/20 rounded-lg p-3 text-center"
              >
                <p className="text-[10px] text-terminal-muted font-mono mb-1">{period.period}</p>
                <p
                  className={`text-xl md:text-2xl font-bold font-mono ${
                    period.accuracy >= 85
                      ? "text-terminal-green"
                      : period.accuracy >= 70
                        ? "text-terminal-accent"
                        : "text-red-500"
                  }`}
                >
                  {period.accuracy}%
                </p>
                <p className="text-[9px] text-terminal-muted font-mono mt-1">
                  {period.correctSignals}/{period.totalSignals} signals
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Reports */}
        <Card className="bg-terminal-darker border-terminal-border p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-terminal-muted" />
              <h2 className="text-lg md:text-xl font-bold font-mono text-terminal-foreground">
                Recent Reports (Last 5)
              </h2>
            </div>
            <span className="text-[10px] text-terminal-muted font-mono">Summary only - Run to get full report</span>
          </div>

          <div className="space-y-3">
            {recentReports.map((report, index) => (
              <div
                key={report.id}
                className="bg-terminal-dark/50 border border-terminal-border rounded-lg overflow-hidden hover:border-terminal-accent/30 transition-colors"
              >
                <button
                  onClick={() => setExpandedReport(expandedReport === index ? null : index)}
                  className="w-full p-3 md:p-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Signal Badge */}
                      <Badge
                        className={`font-mono text-[10px] px-2 py-1 ${
                          report.signal === 'BUY'
                            ? 'bg-terminal-green/20 text-terminal-green border-terminal-green/30'
                            : report.signal === 'SELL'
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-terminal-muted/20 text-terminal-muted border-terminal-muted/30'
                        }`}
                      >
                        {report.signal === 'BUY' ? '↗' : report.signal === 'SELL' ? '↘' : '−'} {report.signal}
                      </Badge>
                      {/* Confidence */}
                      <span className="text-sm font-bold font-mono text-terminal-foreground">{report.confidence}% confidence</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-terminal-muted font-mono hidden sm:block">{report.time}</span>
                      <span className="text-[10px] text-terminal-accent font-mono hidden md:block">{report.txHash}</span>
                      {expandedReport === index ? (
                        <ChevronUp className="size-4 text-terminal-muted" />
                      ) : (
                        <ChevronDown className="size-4 text-terminal-muted" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-xs font-mono">
                    <span className="text-terminal-muted">
                      Price at signal: <span className="text-terminal-foreground">${report.priceAtSignal.toLocaleString()}</span>
                    </span>
                    <span className="text-terminal-muted">
                      Price {report.signal === 'NEUTRAL' ? 'now' : 'after'}: <span className="text-terminal-foreground">${report.priceAfter.toLocaleString()}</span>
                    </span>
                    <span className={report.changePercent >= 0 ? 'text-terminal-green' : 'text-red-400'}>
                      ({report.changePercent >= 0 ? '+' : ''}{report.changePercent}%)
                    </span>
                    {report.correct !== null && (
                      <span className={`flex items-center gap-1 ${report.correct ? 'text-terminal-green' : 'text-red-400'}`}>
                        <CheckCircle className="size-3" />
                        {report.correct ? 'Correct' : 'Incorrect'}
                      </span>
                    )}
                  </div>
                </button>

                {/* Expanded Reasoning */}
                {expandedReport === index && (
                  <div className="px-3 md:px-4 pb-3 md:pb-4 border-t border-terminal-border">
                    <div className="bg-terminal-dark/80 rounded p-3 mt-3 border-l-2 border-terminal-accent">
                      <p className="text-xs md:text-sm text-terminal-foreground font-mono leading-relaxed">
                        {report.reasoning}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Historical Track Record */}
        <Card className="bg-terminal-darker border-terminal-border p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col gap-3 mb-3 md:mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-5 text-terminal-muted" />
                <h2 className="text-lg md:text-xl font-bold font-mono text-terminal-foreground">
                  Historical Track Record
                </h2>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-terminal-muted font-mono mr-1">Signals:</span>
                <Button
                  size="sm"
                  variant={signalFilter === "ALL" ? "default" : "outline"}
                  onClick={() => setSignalFilter("ALL")}
                  className={`h-7 px-3 text-[10px] font-mono ${
                    signalFilter === "ALL"
                      ? "bg-terminal-accent text-terminal-darker"
                      : "bg-terminal-dark border-terminal-border text-terminal-muted hover:text-terminal-foreground"
                  }`}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={signalFilter === "BUY" ? "default" : "outline"}
                  onClick={() => setSignalFilter("BUY")}
                  className={`h-7 px-3 text-[10px] font-mono ${
                    signalFilter === "BUY"
                      ? "bg-terminal-green text-terminal-darker"
                      : "bg-terminal-dark border-terminal-border text-terminal-muted hover:text-terminal-foreground"
                  }`}
                >
                  <TrendingUp className="size-3 mr-1" />
                  Buy
                </Button>
                <Button
                  size="sm"
                  variant={signalFilter === "SELL" ? "default" : "outline"}
                  onClick={() => setSignalFilter("SELL")}
                  className={`h-7 px-3 text-[10px] font-mono ${
                    signalFilter === "SELL"
                      ? "bg-red-500 text-white"
                      : "bg-terminal-dark border-terminal-border text-terminal-muted hover:text-terminal-foreground"
                  }`}
                >
                  <TrendingDown className="size-3 mr-1" />
                  Sell
                </Button>
                <Button
                  size="sm"
                  variant={signalFilter === "NEUTRAL" ? "default" : "outline"}
                  onClick={() => setSignalFilter("NEUTRAL")}
                  className={`h-7 px-3 text-[10px] font-mono ${
                    signalFilter === "NEUTRAL"
                      ? "bg-terminal-accent text-terminal-darker"
                      : "bg-terminal-dark border-terminal-border text-terminal-muted hover:text-terminal-foreground"
                  }`}
                >
                  <Minus className="size-3 mr-1" />
                  Neutral
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-t border-terminal-border pt-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-terminal-muted font-mono mr-1">Timeframe:</span>
                {(["1m", "5m", "15m", "1h", "6h", "1d"] as const).map((tf) => (
                  <Button
                    key={tf}
                    size="sm"
                    variant={chartTimeframe === tf ? "default" : "outline"}
                    onClick={() => setChartTimeframe(tf)}
                    className={`h-7 px-3 text-[10px] font-mono ${
                      chartTimeframe === tf
                        ? "bg-terminal-green text-terminal-darker"
                        : "bg-terminal-dark border-terminal-border text-terminal-muted hover:text-terminal-foreground"
                    }`}
                  >
                    {tf}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-terminal-muted font-mono mr-1">Range:</span>
                {(["1H", "4H", "1D", "1W", "1M", "ALL"] as const).map((range) => (
                  <Button
                    key={range}
                    size="sm"
                    variant={timeRange === range ? "default" : "outline"}
                    onClick={() => setTimeRange(range)}
                    className={`h-7 px-3 text-[10px] font-mono ${
                      timeRange === range
                        ? "bg-terminal-accent text-terminal-darker"
                        : "bg-terminal-dark border-terminal-border text-terminal-muted hover:text-terminal-foreground"
                    }`}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="text-center">
              <p className="text-[10px] text-terminal-muted font-mono mb-1">Accuracy</p>
              <p className="text-lg md:text-2xl font-bold font-mono text-terminal-green">{accuracy}%</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="size-3 text-terminal-green" />
                <p className="text-[10px] text-terminal-muted font-mono">Buy</p>
              </div>
              <p className="text-lg md:text-2xl font-bold font-mono text-terminal-green">{buySignals}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingDown className="size-3 text-red-500" />
                <p className="text-[10px] text-terminal-muted font-mono">Sell</p>
              </div>
              <p className="text-lg md:text-2xl font-bold font-mono text-red-500">{sellSignals}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Minus className="size-3 text-terminal-accent" />
                <p className="text-[10px] text-terminal-muted font-mono">Neutral</p>
              </div>
              <p className="text-lg md:text-2xl font-bold font-mono text-terminal-accent">{neutralSignals}</p>
            </div>
          </div>

          <div className="h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px]">
            <Line data={chartData} options={chartOptions} />
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 md:gap-6 text-[10px] md:text-xs font-mono flex-wrap">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-terminal-green" />
              <span className="text-terminal-muted">Buy Signal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-red-500" />
              <span className="text-terminal-muted">Sell Signal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-terminal-accent" />
              <span className="text-terminal-muted">Neutral Signal</span>
            </div>
          </div>
        </Card>

        <Card className="bg-terminal-darker border-terminal-border p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="size-5 text-terminal-muted" />
            <h2 className="text-lg md:text-xl font-bold font-mono text-terminal-foreground">Full Call History</h2>
          </div>
          
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-7 gap-4 px-4 py-2 text-[10px] text-terminal-muted font-mono uppercase tracking-wide border-b border-terminal-border mb-2">
            <span>Time</span>
            <span>Tx Hash</span>
            <span>Token</span>
            <span className="text-right">Price At</span>
            <span className="text-right">Price After</span>
            <span className="text-right">Change</span>
            <span className="text-right">Signal</span>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {callHistory.map((call, index) => {
              const mockPriceAt = 43000 + Math.random() * 2000
              const mockPriceAfter = mockPriceAt * (1 + (Math.random() - 0.5) * 0.04)
              const mockChange = ((mockPriceAfter - mockPriceAt) / mockPriceAt) * 100
              const tokens = ['BTC', 'ETH', 'SOL']
              const mockToken = tokens[index % 3]
              
              return (
                <div
                  key={index}
                  className="grid grid-cols-2 md:grid-cols-7 gap-2 md:gap-4 p-3 md:p-4 bg-terminal-dark/50 rounded border border-terminal-border hover:border-terminal-accent/30 transition-colors items-center"
                >
                  {/* Time */}
                  <span className="text-[10px] md:text-xs text-terminal-muted font-mono">{call.time}</span>
                  
                  {/* Tx Hash */}
                  <a
                    href={`https://bscscan.com/address/${call.user}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] md:text-xs text-terminal-accent hover:text-terminal-green font-mono transition-colors hidden md:block"
                  >
                    {call.user}
                  </a>
                  
                  {/* Token */}
                  <Badge variant="outline" className="border-terminal-border text-terminal-foreground font-mono text-[10px] px-2 py-0.5 w-fit hidden md:flex">
                    {mockToken}
                  </Badge>
                  
                  {/* Price At */}
                  <span className="text-xs font-mono text-terminal-muted text-right hidden md:block">
                    ${mockPriceAt.toFixed(0).toLocaleString()}
                  </span>
                  
                  {/* Arrow + Price After */}
                  <div className="hidden md:flex items-center justify-end gap-2">
                    <span className="text-terminal-muted">→</span>
                    <span className="text-xs font-mono text-terminal-foreground">
                      ${mockPriceAfter.toFixed(0).toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Change % */}
                  <span className={`text-xs font-mono text-right hidden md:block ${mockChange >= 0 ? 'text-terminal-green' : 'text-red-400'}`}>
                    {mockChange >= 0 ? '+' : ''}{mockChange.toFixed(2)}%
                  </span>
                  
                  {/* Signal + Verified */}
                  <div className="flex items-center justify-end gap-2">
                    <Badge
                      className={`font-mono text-[10px] px-2 py-1 ${
                        call.output === 'BUY'
                          ? 'bg-terminal-green/20 text-terminal-green border-terminal-green/30'
                          : call.output === 'SELL'
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-terminal-muted/20 text-terminal-muted border-terminal-muted/30'
                      }`}
                    >
                      {call.output === 'BUY' ? '↗' : call.output === 'SELL' ? '↘' : '−'} {call.output}
                    </Badge>
                    {call.output !== "NEUTRAL" && call.verified && call.accurate && (
                      <CheckCircle className="size-4 text-terminal-green" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </section>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="bg-terminal-darker border-terminal-accent max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-mono text-terminal-foreground">Confirm Payment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-terminal-dark/50 border border-terminal-border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-terminal-muted font-mono">Agent Call Fee</span>
                <span className="text-lg font-bold font-mono text-terminal-accent">{agent.price} USDC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-terminal-muted font-mono">Payment Method</span>
                <span className="text-sm font-mono text-terminal-green">X402 Protocol</span>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="size-4 text-yellow-500 mt-0.5 shrink-0" />
                <p className="text-xs text-yellow-200 font-mono">
                  You will be prompted to sign a transaction to authorize payment via X402 micropayment protocol.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handlePaymentConfirm}
                className="w-full bg-terminal-accent text-terminal-darker font-mono hover:bg-terminal-accent/90"
              >
                <CheckCircle className="mr-2 size-4" />
                Sign & Pay {agent.price} USDC
              </Button>
              <Button
                onClick={() => setShowPaymentDialog(false)}
                variant="outline"
                className="w-full border-terminal-border text-terminal-muted hover:bg-terminal-dark font-mono"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReasoningDialog} onOpenChange={setShowReasoningDialog}>
        <DialogContent className="bg-terminal-darker border-terminal-accent max-w-6xl">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold font-mono text-terminal-foreground">
              Analysis Result
            </DialogTitle>
          </DialogHeader>

          {output && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <p className="text-xs text-terminal-muted font-mono mb-2">Conclusion</p>
                <div className="flex items-center gap-3">
                  {output.conclusion === "BUY" ? (
                    <>
                      <TrendingUp className="size-6 md:size-8 text-terminal-green" />
                      <span className="text-2xl md:text-3xl font-bold font-mono text-terminal-green">BUY</span>
                    </>
                  ) : output.conclusion === "SELL" ? (
                    <>
                      <TrendingDown className="size-6 md:size-8 text-red-500" />
                      <span className="text-2xl md:text-3xl font-bold font-mono text-red-500">SELL</span>
                    </>
                  ) : (
                    <>
                      <Minus className="size-6 md:size-8 text-terminal-accent" />
                      <span className="text-2xl md:text-3xl font-bold font-mono text-terminal-accent">NEUTRAL</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-terminal-muted font-mono mb-2">Reasoning</p>
                <div className="bg-terminal-dark/50 border border-terminal-border rounded p-3 md:p-4">
                  <p className="text-xs md:text-sm text-terminal-foreground font-mono leading-relaxed">
                    {output.reasoning}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
