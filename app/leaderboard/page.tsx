"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, TrendingUp, Phone, DollarSign, Target, ArrowUpRight, ExternalLink, Copy, Eye, ChevronDown, ChevronUp, X, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/lib/language-context"

// Copy Trade Modal Component
const CopyTradeModal = ({ agent, onClose, onConfirm }: { agent: typeof tradingAgentsData[0], onClose: () => void, onConfirm: (config: CopyConfig) => void }) => {
  const [config, setConfig] = useState<CopyConfig>({
    maxAllocation: 1000,
    maxPerPosition: 200,
    executionMode: 'auto',
    leverageMode: 'follow',
    fixedLeverage: 5,
  })

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-terminal-darker rounded-2xl border border-terminal-border w-[500px] max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="p-5 border-b border-terminal-border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Copy className="size-5 text-terminal-green" />
            <div>
              <div className="font-semibold text-base">Copy Trade</div>
              <div className="text-sm text-terminal-muted">{agent.name}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-terminal-muted hover:text-terminal-foreground text-xl">
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Fund Allocation */}
          <div className="bg-terminal-dark/50 rounded-xl p-4">
            <div className="text-xs text-terminal-muted mb-3 flex items-center gap-2">
              <DollarSign className="size-4" /> Fund Allocation
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-terminal-muted block mb-1.5">Max Copy Amount</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={config.maxAllocation}
                    onChange={(e) => setConfig({ ...config, maxAllocation: Number(e.target.value) })}
                    className="flex-1 px-3 py-2.5 rounded-lg bg-terminal-darker border border-terminal-border text-terminal-foreground font-mono text-sm"
                  />
                  <span className="text-terminal-muted text-sm">USDC</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-terminal-muted block mb-1.5">Max Per Position</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={config.maxPerPosition}
                    onChange={(e) => setConfig({ ...config, maxPerPosition: Number(e.target.value) })}
                    className="flex-1 px-3 py-2.5 rounded-lg bg-terminal-darker border border-terminal-border text-terminal-foreground font-mono text-sm"
                  />
                  <span className="text-terminal-muted text-sm">USDC ({Math.round(config.maxPerPosition / config.maxAllocation * 100)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Execution Mode */}
          <div className="bg-terminal-dark/50 rounded-xl p-4">
            <div className="text-xs text-terminal-muted mb-3 flex items-center gap-2">
              <Target className="size-4" /> Execution Mode
            </div>
            <div className="space-y-2">
              <label className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                config.executionMode === 'auto' ? 'bg-terminal-green/10 border border-terminal-green/30' : 'bg-terminal-darker border border-transparent'
              }`}>
                <input
                  type="radio"
                  checked={config.executionMode === 'auto'}
                  onChange={() => setConfig({ ...config, executionMode: 'auto' })}
                  className="mt-0.5"
                />
                <div>
                  <div className="text-sm font-medium">Auto Copy</div>
                  <div className="text-xs text-terminal-muted">Automatically execute when agent opens position</div>
                </div>
              </label>
              <label className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                config.executionMode === 'manual' ? 'bg-terminal-green/10 border border-terminal-green/30' : 'bg-terminal-darker border border-transparent'
              }`}>
                <input
                  type="radio"
                  checked={config.executionMode === 'manual'}
                  onChange={() => setConfig({ ...config, executionMode: 'manual' })}
                  className="mt-0.5"
                />
                <div>
                  <div className="text-sm font-medium">Manual Confirm</div>
                  <div className="text-xs text-terminal-muted">Receive notification and decide manually</div>
                </div>
              </label>
            </div>
          </div>

          {/* Leverage Settings */}
          <div className="bg-terminal-dark/50 rounded-xl p-4">
            <div className="text-xs text-terminal-muted mb-3 flex items-center gap-2">
              <TrendingUp className="size-4" /> Leverage Settings
            </div>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                config.leverageMode === 'follow' ? 'bg-terminal-green/10 border border-terminal-green/30' : 'bg-terminal-darker border border-transparent'
              }`}>
                <input
                  type="radio"
                  checked={config.leverageMode === 'follow'}
                  onChange={() => setConfig({ ...config, leverageMode: 'follow' })}
                />
                <span className="text-sm">Follow Agent Leverage</span>
              </label>
              <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                config.leverageMode === 'fixed' ? 'bg-terminal-green/10 border border-terminal-green/30' : 'bg-terminal-darker border border-transparent'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={config.leverageMode === 'fixed'}
                    onChange={() => setConfig({ ...config, leverageMode: 'fixed' })}
                  />
                  <span className="text-sm">Fixed Leverage</span>
                </div>
                {config.leverageMode === 'fixed' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={config.fixedLeverage}
                      onChange={(e) => setConfig({ ...config, fixedLeverage: Number(e.target.value) })}
                      className="w-16 px-2 py-1 rounded bg-terminal-darker border border-terminal-border text-terminal-foreground text-sm text-center"
                    />
                    <span className="text-terminal-muted text-sm">x</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Risk Warning */}
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-xs text-yellow-500 flex items-start gap-2">
            <span>Warning:</span>
            <span>Copy trading involves risk. Past performance does not guarantee future results.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-terminal-border flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 border-terminal-border text-terminal-muted bg-transparent">
            Cancel
          </Button>
          <Button 
            onClick={() => { onConfirm(config); onClose(); }} 
            className="flex-1 bg-terminal-green text-terminal-darker hover:bg-terminal-green/90"
          >
            <Check className="size-4 mr-2" /> Start Copying
          </Button>
        </div>
      </div>
    </div>
  )
}

// Toast Component
const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 px-5 py-3.5 bg-terminal-green/20 border border-terminal-green/30 rounded-xl flex items-center gap-3 z-50 shadow-lg">
      <Check className="size-5 text-terminal-green" />
      <span className="text-sm font-mono">{message}</span>
    </div>
  )
}

interface CopyConfig {
  maxAllocation: number
  maxPerPosition: number
  executionMode: 'auto' | 'manual'
  leverageMode: 'follow' | 'fixed'
  fixedLeverage: number
}

const tradingAgentsData = [
  {
    id: "alpha-trader-001",
    name: "Alpha Trader 001",
    owner: "0xcc9d...50d15",
    pnl: 45230.5,
    return: 312.4,
    trades: 1842,
    winRate: 68.5,
    rank: 1,
    isPublic: true,
    currentPos: { side: 'LONG' as const, token: 'BTC', size: '0.5 BTC', entry: 43200, pnl: 920, pnlPercent: 2.1 },
    recentTrades: [{ token: 'BTC', pnl: 450, side: 'LONG' }, { token: 'ETH', pnl: 280, side: 'LONG' }, { token: 'SOL', pnl: -85, side: 'SHORT' }],
  },
  {
    id: "momentum-bot-v2",
    name: "Momentum Bot V2",
    owner: "0x3f8a...2c9e",
    pnl: 38940.2,
    return: 289.7,
    trades: 1523,
    winRate: 65.2,
    rank: 2,
    isPublic: true,
    currentPos: { side: 'SHORT' as const, token: 'ETH', size: '2 ETH', entry: 3380, pnl: 156, pnlPercent: 1.4 },
    recentTrades: [{ token: 'ETH', pnl: 320, side: 'SHORT' }, { token: 'BTC', pnl: 180, side: 'LONG' }],
  },
  {
    id: "grid-master-pro",
    name: "Whale Hunter Pro",
    owner: "0x8e2b...7f41",
    pnl: 28450.8,
    return: 198.3,
    trades: 892,
    winRate: 71.2,
    rank: 3,
    isPublic: true,
    currentPos: null,
    recentTrades: [{ token: 'SOL', pnl: 145, side: 'LONG' }, { token: 'XRP', pnl: 92, side: 'LONG' }],
  },
  {
    id: "swing-trader-ai",
    name: "Scalp Master AI",
    owner: "0x1d4c...9a23",
    pnl: 21890.3,
    return: 156.8,
    trades: 3241,
    winRate: 62.8,
    rank: 4,
    isPublic: true,
    currentPos: { side: 'LONG' as const, token: 'SOL', size: '50 SOL', entry: 98.5, pnl: 78, pnlPercent: 1.6 },
    recentTrades: [{ token: 'SOL', pnl: 65, side: 'LONG' }, { token: 'BTC', pnl: 120, side: 'SHORT' }, { token: 'ETH', pnl: -45, side: 'LONG' }],
  },
  {
    id: "scalper-elite",
    name: "Trend Follower X",
    owner: "0x5f9e...3b82",
    pnl: 18650.1,
    return: 134.2,
    trades: 456,
    winRate: 69.5,
    rank: 5,
    isPublic: true,
    currentPos: { side: 'LONG' as const, token: 'BTC', size: '0.25 BTC', entry: 44100, pnl: 210, pnlPercent: 1.9 },
    recentTrades: [{ token: 'BTC', pnl: 380, side: 'LONG' }],
  },
]

export default function LeaderboardPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get("tab") || "research"
  
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null)
  const [showCopyModal, setShowCopyModal] = useState(false)
  const [copyModalAgent, setCopyModalAgent] = useState<typeof tradingAgentsData[0] | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [following, setFollowing] = useState<string[]>([])

  const researchAgents = [
    {
      id: "technical-analyst-pro",
      name: "Technical Analyst Pro",
      owner: "0x742d...0bEb",
      accuracy: 87.5,
      calls: 1247,
      revenue: 12450,
      rank: 1,
    },
    {
      id: "momentum-tracker",
      name: "Momentum Tracker",
      owner: "0x8f3a...9c2d",
      accuracy: 84.2,
      calls: 892,
      revenue: 8920,
      rank: 2,
    },
    {
      id: "pattern-master",
      name: "Pattern Master",
      owner: "0x5d1e...7a4b",
      accuracy: 82.8,
      calls: 1089,
      revenue: 10890,
      rank: 3,
    },
    {
      id: "sentiment-analyzer",
      name: "Sentiment Analyzer",
      owner: "0x2c9f...4e8a",
      accuracy: 79.3,
      calls: 654,
      revenue: 6540,
      rank: 4,
    },
    {
      id: "macd-specialist",
      name: "MACD Specialist",
      owner: "0x9a7b...3f1c",
      accuracy: 76.9,
      calls: 523,
      revenue: 5230,
      rank: 5,
    },
  ]

  const tradingAgents = tradingAgentsData
  
  const handleCopyTrade = (agent: typeof tradingAgentsData[0]) => {
    setCopyModalAgent(agent)
    setShowCopyModal(true)
  }

  const handleConfirmCopy = (config: CopyConfig) => {
    if (copyModalAgent) {
      setToast(`Started copying ${copyModalAgent.name}`)
    }
  }

  const handleFollow = (agent: typeof tradingAgentsData[0]) => {
    if (!following.includes(agent.id)) {
      setFollowing([...following, agent.id])
      setToast(`Now following ${agent.name}`)
    }
  }

  return (
    <div className="min-h-screen bg-terminal-dark">
      {/* Header */}
      <header className="border-b border-terminal-border bg-terminal-darker">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <Link href="/" className="flex items-center gap-2 justify-self-start">
              <Image
                src="/images/image.png"
                alt="Hubble Terminal"
                width={120}
                height={28}
                className="h-6 md:h-8 w-auto"
              />
            </Link>
            <nav className="hidden md:flex items-center gap-6 justify-self-center">
              <Link
                href="/marketplace"
                className="text-sm font-mono text-terminal-muted hover:text-terminal-green transition-colors"
              >
                {t("nav.marketplace")}
              </Link>
              <Link
                href="/my-agents"
                className="text-sm font-mono text-terminal-muted hover:text-terminal-green transition-colors"
              >
                {t("nav.myAgents")}
              </Link>
              <Link
                href="/leaderboard"
                className="text-sm font-mono text-terminal-accent hover:text-terminal-green transition-colors"
              >
                {t("nav.leaderboard")}
              </Link>
            </nav>
            <div className="justify-self-end" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <Trophy className="size-6 md:size-8 text-terminal-accent" />
            <h1 className="text-2xl md:text-4xl font-bold font-mono text-terminal-foreground">
              {t("leaderboard.title")}
            </h1>
          </div>
          <p className="text-sm md:text-base text-terminal-muted font-mono">{t("leaderboard.subtitle")}</p>
        </div>

        <Tabs defaultValue={tabFromUrl} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6 bg-terminal-darker border border-terminal-border h-9 md:h-10">
            <TabsTrigger
              value="research"
              className="font-mono text-xs md:text-sm data-[state=active]:bg-terminal-green data-[state=active]:text-terminal-darker"
            >
              {t("leaderboard.researchAgents")}
            </TabsTrigger>
            <TabsTrigger
              value="trading"
              className="font-mono text-xs md:text-sm data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-darker"
            >
              {t("leaderboard.tradingAgents")}
            </TabsTrigger>
          </TabsList>

          {/* Research Agents Tab */}
          <TabsContent value="research">
            <div className="space-y-3 md:space-y-4">
              {researchAgents.map((agent) => (
                <Card
                  key={agent.id}
                  className="bg-terminal-darker border-terminal-border hover:border-terminal-green/50 transition-all p-4 md:p-6 cursor-pointer"
                  onClick={() => router.push(`/research/${agent.id}?from=leaderboard`)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start md:items-center gap-3 md:gap-6 flex-1">
                      <div
                        className={`flex items-center justify-center size-10 md:size-12 rounded-lg font-bold font-mono text-lg md:text-xl shrink-0 ${
                          agent.rank === 1
                            ? "bg-yellow-500/20 text-yellow-500"
                            : agent.rank === 2
                              ? "bg-gray-400/20 text-gray-400"
                              : agent.rank === 3
                                ? "bg-orange-500/20 text-orange-500"
                                : "bg-terminal-dark text-terminal-muted"
                        }`}
                      >
                        #{agent.rank}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                          <h3 className="text-base md:text-lg font-mono font-bold text-terminal-foreground truncate">
                            {agent.name}
                          </h3>
                          {agent.rank <= 3 && <Trophy className="size-3 md:size-4 text-terminal-accent shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-terminal-muted font-mono">
                          <span className="hidden sm:inline">{t("leaderboard.owner")}:</span>
                          <a
                            href={`https://etherscan.io/address/${agent.owner}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-terminal-accent hover:text-terminal-accent/80 flex items-center gap-1"
                          >
                            {agent.owner}
                            <ExternalLink className="size-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 md:gap-4 w-full md:w-auto md:min-w-[400px]">
                      <div className="flex flex-col items-center justify-center min-w-[80px]">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Target className="size-3 text-terminal-green" />
                          <div className="text-base md:text-xl font-bold font-mono text-terminal-green">
                            {agent.accuracy}%
                          </div>
                        </div>
                        <div className="text-[10px] md:text-xs text-terminal-muted font-mono">
                          {t("agent.accuracy")}
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center min-w-[80px]">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Phone className="size-3 text-terminal-accent" />
                          <div className="text-base md:text-xl font-bold font-mono text-terminal-foreground">
                            {agent.calls.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-[10px] md:text-xs text-terminal-muted font-mono">{t("agent.calls")}</div>
                      </div>

                      <div className="flex flex-col items-center justify-center min-w-[80px]">
                        <div className="flex items-center gap-1 mb-0.5">
                          <DollarSign className="size-3 text-terminal-accent" />
                          <div className="text-base md:text-xl font-bold font-mono text-terminal-foreground">
                            ${agent.revenue.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-[10px] md:text-xs text-terminal-muted font-mono">{t("agent.revenue")}</div>
                      </div>
                    </div>

                    <ArrowUpRight className="hidden md:block size-6 text-terminal-muted md:ml-6 shrink-0" />
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trading Agents Tab */}
          <TabsContent value="trading">
            <div className="mb-3 md:mb-4 p-3 md:p-4 bg-terminal-accent/10 border border-terminal-accent/30 rounded-lg">
              <p className="text-xs md:text-sm font-mono text-terminal-foreground">
                <span className="text-terminal-accent font-bold">{t("leaderboard.note")}</span>{" "}
                {t("leaderboard.noteText")}
              </p>
            </div>

            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[80px_1fr_140px_140px_100px_100px_50px] px-5 py-3 bg-terminal-dark rounded-t-lg border-b border-terminal-border text-[11px] text-terminal-muted uppercase tracking-wide font-mono">
              <div>Rank</div>
              <div>Agent</div>
              <div className="text-right">P&L</div>
              <div className="text-right">Return</div>
              <div className="text-right">Trades</div>
              <div className="text-right">Win Rate</div>
              <div></div>
            </div>

            <div className="bg-terminal-darker rounded-b-lg border border-terminal-border border-t-0">
              {tradingAgents.map((agent) => {
                const isExpanded = expandedAgent === agent.id
                
                return (
                  <div key={agent.id} className="border-b border-terminal-border last:border-b-0">
                    {/* Main Row */}
                    <div
                      onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                      className={`grid grid-cols-[80px_1fr_140px_140px_100px_100px_50px] p-5 cursor-pointer hover:bg-terminal-dark/50 transition-colors ${isExpanded ? 'bg-terminal-dark/30' : ''}`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`flex items-center justify-center size-10 rounded-lg font-bold font-mono text-sm ${
                            agent.rank === 1
                              ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50"
                              : agent.rank === 2
                                ? "bg-gray-400/20 text-gray-400 border border-gray-400/50"
                                : agent.rank === 3
                                  ? "bg-orange-500/20 text-orange-500 border border-orange-500/50"
                                  : "bg-terminal-dark text-terminal-muted border border-terminal-border"
                          }`}
                        >
                          #{agent.rank}
                        </div>
                      </div>

                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[15px] font-mono">{agent.name}</span>
                          {agent.rank <= 3 && <Trophy className="size-4 text-terminal-accent" />}
                          <Badge className="bg-terminal-border/50 text-terminal-muted border-terminal-border font-mono text-[10px] uppercase">
                            Public
                          </Badge>
                        </div>
                        <div className="text-xs text-terminal-green font-mono">Owner: {agent.owner}</div>
                      </div>

                      <div className="flex items-center justify-end">
                        <span className="text-terminal-green font-semibold text-[15px] font-mono">
                          <span className="text-terminal-muted font-normal text-xs mr-0.5">$</span>
                          {agent.pnl.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                        </span>
                      </div>

                      <div className="flex items-center justify-end">
                        <span className="text-terminal-green font-semibold text-[15px] font-mono">~{agent.return}%</span>
                      </div>

                      <div className="flex items-center justify-end">
                        <span className="font-medium text-[15px] font-mono">{agent.trades.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-end">
                        <span className="font-medium text-[15px] font-mono">{agent.winRate}%</span>
                      </div>

                      <div className="flex items-center justify-end">
                        {isExpanded ? (
                          <ChevronUp className="size-5 text-terminal-muted" />
                        ) : (
                          <ChevronDown className="size-5 text-terminal-muted" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-5 pb-5 bg-terminal-dark/20 border-t border-terminal-border">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5">
                          {/* Current Position */}
                          <div>
                            <div className="text-[11px] text-terminal-muted uppercase tracking-wide mb-3 font-mono">Current Position</div>
                            {agent.currentPos ? (
                              <div className="p-4 bg-terminal-dark rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={`font-mono text-[10px] ${
                                    agent.currentPos.side === 'LONG' 
                                      ? 'bg-terminal-green/20 text-terminal-green border-terminal-green/30' 
                                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                                  }`}>
                                    {agent.currentPos.side === 'LONG' ? '↗' : '↘'} {agent.currentPos.side}
                                  </Badge>
                                  <span className="font-semibold font-mono">{agent.currentPos.size}</span>
                                </div>
                                <div className="flex justify-between text-sm font-mono">
                                  <span className="text-terminal-muted">Entry: ${agent.currentPos.entry.toLocaleString()}</span>
                                  <span className="text-terminal-green font-semibold">+${agent.currentPos.pnl} (+{agent.currentPos.pnlPercent}%)</span>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 bg-terminal-dark rounded-lg text-terminal-muted text-sm font-mono">No active position</div>
                            )}
                          </div>

                          {/* Recent Trades */}
                          <div>
                            <div className="text-[11px] text-terminal-muted uppercase tracking-wide mb-3 font-mono">Recent Trades</div>
                            <div className="space-y-1.5">
                              {agent.recentTrades.map((trade, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-terminal-dark rounded-lg text-sm font-mono">
                                  <div className="flex items-center gap-2">
                                    <span className={trade.pnl >= 0 ? 'text-terminal-green' : 'text-red-400'}>
                                      {trade.pnl >= 0 ? '✓' : '✗'}
                                    </span>
                                    <span>{trade.token}</span>
                                    <span className="text-terminal-muted text-[11px]">{trade.side}</span>
                                  </div>
                                  <span className={`font-medium ${trade.pnl >= 0 ? 'text-terminal-green' : 'text-red-400'}`}>
                                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div>
                            <div className="text-[11px] text-terminal-muted uppercase tracking-wide mb-3 font-mono">Actions</div>
                            <div className="space-y-2">
                              <Button 
                                onClick={(e) => { e.stopPropagation(); handleCopyTrade(agent); }}
                                className="w-full bg-terminal-green text-terminal-darker hover:bg-terminal-green/90 font-mono text-sm"
                              >
                                <Copy className="size-4 mr-2" /> Copy Trade
                              </Button>
                              <Button 
                                onClick={(e) => { e.stopPropagation(); handleFollow(agent); }}
                                variant="outline"
                                className={`w-full font-mono text-sm ${
                                  following.includes(agent.id) 
                                    ? 'bg-terminal-green/10 border-terminal-green/30 text-terminal-green' 
                                    : 'border-terminal-border text-terminal-foreground'
                                }`}
                              >
                                <Eye className="size-4 mr-2" /> {following.includes(agent.id) ? 'Following' : 'Follow Agent'}
                              </Button>
                              <Button 
                                onClick={(e) => { e.stopPropagation(); router.push(`/trading-terminal/${agent.id}?from=leaderboard`); }}
                                variant="outline"
                                className="w-full border-terminal-border text-terminal-muted font-mono text-sm"
                              >
                                View Full Details <ArrowUpRight className="size-4 ml-2" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Copy Trade Modal */}
      {showCopyModal && copyModalAgent && (
        <CopyTradeModal 
          agent={copyModalAgent} 
          onClose={() => setShowCopyModal(false)} 
          onConfirm={handleConfirmCopy} 
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
