"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Menu, MoreVertical, Play, Pause, Edit, Trash2, ArrowLeft, ArrowRight, Copy, Eye, Settings, Square, X, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/language-context"

export default function MyAgentsPage() {
  const { t } = useLanguage()
  const [connectedWallet, setConnectedWallet] = useState(false)
  const [tradingAgents, setTradingAgents] = useState([
    {
      id: "ia-001",
      name: "Alpha Hunter",
      market: "Perp DEX",
      exchange: "Aster",
      token: "BTCUSDT",
      pnl: "+12.4%",
      totalValue: "$112,430",
      status: "LIVE",
      cycle: "5m",
      createdAt: "2025-01-15",
      isRunning: true,
      researchAgent: "ra-001",
      style: "balanced",
      portfolioPrompt:
        "Balance risk and reward. Diversify across multiple positions while maintaining reasonable exposure.",
      riskPrompt: "Use 5% stop losses. Allow positions room to breathe while protecting capital.",
      traderPrompt: "Execute trades based on clear signals. Use moderate position sizes and mix of order types.",
    },
    {
      id: "ia-002",
      name: "Risk Conservative",
      market: "Perp DEX",
      exchange: "Aster",
      token: "ETHUSDT",
      pnl: "+8.2%",
      totalValue: "$85,600",
      status: "LIVE",
      cycle: "10m",
      createdAt: "2025-01-12",
      isRunning: true,
      researchAgent: "ra-002",
      style: "cautious",
      portfolioPrompt: "Focus on capital preservation and gradual growth. Limit exposure to volatile assets.",
      riskPrompt: "Implement strict stop losses at 2%. Monitor positions closely and exit at first signs of trouble.",
      traderPrompt: "Execute trades conservatively. Use smaller position sizes and favor limit orders.",
    },
  ])

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [infoDialogOpen, setInfoDialogOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<any>(null)
  const [editStep, setEditStep] = useState(1)
  const [editFormData, setEditFormData] = useState<{
    cycle: string
    token: string
    researchAgent: string
    style: string
    portfolioPrompt: string
    riskPrompt: string
    traderPrompt: string
    llm: string // Added LLM field
  }>({
    cycle: "",
    token: "",
    researchAgent: "",
    style: "",
    portfolioPrompt: "",
    riskPrompt: "",
    traderPrompt: "",
    llm: "", // Added LLM field
  })
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("trading") // State to manage active tab
  const [tradingSubTab, setTradingSubTab] = useState("my-agents") // Sub-tab for trading agents
  const [toast, setToast] = useState<string | null>(null)
  
  // Copy Trades State
  const [copyTrades, setCopyTrades] = useState([
    {
      id: "ct-001",
      agentName: "Whale Hunter Pro",
      agentId: "grid-master-pro",
      status: "active" as const,
      copySince: "Jan 15, 2026",
      mode: "auto" as const,
      allocated: 1000,
      currentPnl: 128.5,
      copiedTrades: 12,
      winRate: 75,
      agentRank: 3,
    },
  ])

  // Following State
  const [followingAgents, setFollowingAgents] = useState([
    {
      id: "fa-001",
      agentName: "Alpha Trader 001",
      agentId: "alpha-trader-001",
      followedSince: "Jan 10, 2026",
      return: 312.4,
      winRate: 68.5,
      agentRank: 1,
    },
  ])

  const [filterAccuracy, setFilterAccuracy] = useState("all")
  const [filterLLM, setFilterLLM] = useState("all")
  const [filterType, setFilterType] = useState("all")

  const researchAgentOptions = [
    {
      id: "ra-001",
      name: "Technical Analyzer Pro",
      description:
        "Advanced technical analysis using multiple indicators and chart patterns to identify trade opportunities.",
      price: "0.6",
      accuracy: 94,
      token: "BTC",
      timeframe: "15m",
      llm: "OpenAI",
      type: "Technical",
      totalCalls: 156,
      revenue: "93.6",
      createdTime: "2024-01-15",
      owner: "0x742d35c9Ab123",
    },
    {
      id: "ra-002",
      name: "MACD Master",
      description: "Specialized MACD-based momentum analysis for trend identification and trade timing.",
      price: "0.5",
      accuracy: 89,
      token: "ETH",
      timeframe: "5m",
      llm: "Gemini",
      type: "Technical",
      totalCalls: 203,
      revenue: "101.5",
      createdTime: "2024-02-01",
      owner: "0x8a3f21b5Cd456",
    },
    {
      id: "ra-003",
      name: "RSI Specialist",
      description: "Expert RSI analysis with overbought/oversold detection and divergence patterns.",
      price: "0.7",
      accuracy: 96,
      token: "BTC",
      timeframe: "15m",
      llm: "0G",
      type: "Technical",
      totalCalls: 189,
      revenue: "132.3",
      createdTime: "2023-12-20",
      owner: "0x1f2e3d4c5b789",
    },
    {
      id: "ra-004",
      name: "Volume Profile Expert",
      description: "Advanced volume analysis and profile trading for institutional-grade insights.",
      price: "0.8",
      accuracy: 91,
      token: "BNB",
      timeframe: "1h",
      llm: "OpenAI",
      type: "Whale Monitoring",
      totalCalls: 134,
      revenue: "107.2",
      createdTime: "2024-01-10",
      owner: "0x9e8d7c6b5a432",
    },
    {
      id: "ra-005",
      name: "Order Book Analyzer",
      description: "Real-time order book analysis detecting large orders and market depth changes.",
      price: "0.9",
      accuracy: 88,
      token: "ETH",
      timeframe: "5m",
      llm: "Gemini",
      type: "Whale Monitoring",
      totalCalls: 178,
      revenue: "160.2",
      createdTime: "2024-02-15",
      owner: "0x6a7b8c9d0e123",
    },
  ]

  const filteredResearchAgents = researchAgentOptions.filter((agent) => {
    if (filterAccuracy !== "all" && agent.accuracy < Number.parseInt(filterAccuracy)) return false
    if (filterLLM !== "all" && agent.llm !== filterLLM) return false
    if (filterType !== "all" && agent.type !== filterType) return false
    return true
  })

  const [myResearchAgents, setMyResearchAgents] = useState([
    {
      id: "ra-my-001",
      name: "My Custom Analyzer",
      creator: "0x742d35c9Ab123",
      creatorShort: "You",
      price: "0.6",
      calls: 156,
      revenue: "93.6",
      token: "BTC, ETH",
      timeframe: "5m",
      type: "Technical Analysis",
      accuracy: 87,
      status: "Public",
      createdAt: "2025-01-18",
      llm: "OpenAI",
    },
    {
      id: "ra-my-002",
      name: "Trend Predictor",
      creator: "0x742d35c9Ab123",
      creatorShort: "You",
      price: "0.75",
      calls: 243,
      revenue: "182.25",
      token: "Multi-Token",
      timeframe: "15m",
      type: "Predictive Analysis",
      accuracy: 92,
      status: "Public",
      createdAt: "2025-01-16",
      llm: "Gemini",
    },
  ])

  useEffect(() => {
    const storedTradingAgents = JSON.parse(localStorage.getItem("tradingAgents") || "[]")
    if (storedTradingAgents.length > 0) {
      setTradingAgents((prev) => [...prev, ...storedTradingAgents])
    }

    const storedResearchAgents = JSON.parse(localStorage.getItem("researchAgents") || "[]")
    if (storedResearchAgents.length > 0) {
      const formattedAgents = storedResearchAgents.map((agent: any) => ({
        id: agent.id,
        name: agent.name,
        creator: agent.creator || "0x742d35c9Ab123",
        creatorShort: "You",
        price: agent.price,
        calls: agent.calls || 0,
        revenue: "0",
        token: agent.token,
        timeframe: agent.timeframe || "5m",
        type: agent.type,
        accuracy: agent.reputation || 0,
        status: agent.visibility === "public" ? "Public" : "Private",
        llm: agent.llm || "OpenAI",
        createdAt: agent.createdAt || new Date().toISOString().split("T")[0],
      }))
      setMyResearchAgents((prev) => [...prev, ...formattedAgents])
    }
  }, [])

  const handleToggleStatus = (agentId: string) => {
    setTradingAgents((prev) =>
      prev.map((agent) => (agent.id === agentId ? { ...agent, isRunning: !agent.isRunning } : agent)),
    )
    const stored = JSON.parse(localStorage.getItem("tradingAgents") || "[]")
    const updated = stored.map((agent: any) =>
      agent.id === agentId ? { ...agent, isRunning: !agent.isRunning } : agent,
    )
    localStorage.setItem("tradingAgents", JSON.stringify(updated))
  }

  const handleOpenDeleteDialog = (agent: any) => {
    setSelectedAgent(agent)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedAgent) {
      setTradingAgents((prev) => prev.filter((agent) => agent.id !== selectedAgent.id))
      const stored = JSON.parse(localStorage.getItem("tradingAgents") || "[]")
      const filtered = stored.filter((agent: any) => agent.id !== selectedAgent.id)
      localStorage.setItem("tradingAgents", JSON.stringify(filtered))
    }
    setDeleteDialogOpen(false)
    setSelectedAgent(null)
  }

  const handleOpenEditDialog = (agent: any) => {
    setSelectedAgent(agent)
    setEditStep(1)
    setEditFormData({
      cycle: agent.cycle,
      token: agent.token,
      researchAgent: agent.researchAgent || "",
      style: agent.style || "balanced",
      portfolioPrompt: agent.portfolioPrompt || getDefaultPrompt("portfolio", agent.style || "balanced"),
      riskPrompt: agent.riskPrompt || getDefaultPrompt("risk", agent.style || "balanced"),
      traderPrompt: agent.traderPrompt || getDefaultPrompt("trader", agent.style || "balanced"),
      llm: agent.llm || "0G", // Added LLM initialization
    })
    setEditDialogOpen(true)
  }

  const handleOpenInfoDialog = (agent: any) => {
    setSelectedAgent(agent)
    setInfoDialogOpen(true)
  }

  const getDefaultPrompt = (type: string, style: string) => {
    const prompts: any = {
      portfolio: {
        cautious: "Focus on capital preservation and gradual growth. Limit exposure to volatile assets.",
        balanced: "Balance risk and reward. Diversify across multiple positions while maintaining reasonable exposure.",
        aggressive:
          "Maximize returns through higher leverage and concentrated positions. Accept higher risk for growth.",
      },
      risk: {
        cautious: "Implement strict stop losses at 2%. Monitor positions closely and exit at first signs of trouble.",
        balanced: "Use 5% stop losses. Allow positions room to breathe while protecting capital.",
        aggressive: "Set wider 10% stop losses. Let winners run and accept larger drawdowns for maximum upside.",
      },
      trader: {
        cautious: "Execute trades conservatively. Use smaller position sizes and favor limit orders.",
        balanced: "Execute trades based on clear signals. Use moderate position sizes and mix of order types.",
        aggressive: "Act decisively on signals. Use larger position sizes and market orders when needed.",
      },
    }
    return prompts[type]?.[style] || ""
  }

  const handleSaveEdit = () => {
    if (selectedAgent) {
      setTradingAgents((prev) =>
        prev.map((agent) =>
          agent.id === selectedAgent.id
            ? {
                ...agent,
                cycle: editFormData.cycle,
                token: editFormData.token,
                researchAgent: editFormData.researchAgent,
                style: editFormData.style,
                portfolioPrompt: editFormData.portfolioPrompt,
                riskPrompt: editFormData.riskPrompt,
                traderPrompt: editFormData.traderPrompt,
                llm: editFormData.llm, // Include LLM in updated agent data
              }
            : agent,
        ),
      )
      const stored = JSON.parse(localStorage.getItem("tradingAgents") || "[]")
      const updated = stored.map((agent: any) =>
        agent.id === selectedAgent.id
          ? {
              ...agent,
              cycle: editFormData.cycle,
              token: editFormData.token,
              researchAgent: editFormData.researchAgent,
              style: editFormData.style,
              portfolioPrompt: editFormData.portfolioPrompt,
              riskPrompt: editFormData.riskPrompt,
              traderPrompt: editFormData.traderPrompt,
              llm: editFormData.llm, // Include LLM in updated agent data
            }
          : agent,
      )
      localStorage.setItem("tradingAgents", JSON.stringify(updated))
    }
    setEditDialogOpen(false)
    setEditStep(1)
    setSelectedAgent(null)
  }

  const canProceedEditStep = () => {
    switch (editStep) {
      case 1:
        return editFormData.token.trim() !== "" && editFormData.cycle !== "" && editFormData.llm !== "" // Added LLM check
      case 2:
        return editFormData.style !== "" && editFormData.researchAgent !== ""
      default:
        return false
    }
  }

  // Copy Trade handlers
  const handlePauseCopyTrade = (id: string) => {
    setCopyTrades(prev => prev.map(ct => 
      ct.id === id ? { ...ct, status: ct.status === 'active' ? 'paused' as const : 'active' as const } : ct
    ))
    setToast("Copy trade status updated")
  }

  const handleStopCopyTrade = (id: string) => {
    setCopyTrades(prev => prev.filter(ct => ct.id !== id))
    setToast("Copy trade stopped")
  }

  const handleUnfollow = (id: string) => {
    setFollowingAgents(prev => prev.filter(fa => fa.id !== id))
    setToast("Unfollowed agent")
  }

  const handleCopyFromFollowing = (agent: typeof followingAgents[0]) => {
    const newCopyTrade = {
      id: `ct-${Date.now()}`,
      agentName: agent.agentName,
      agentId: agent.agentId,
      status: "active" as const,
      copySince: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      mode: "auto" as const,
      allocated: 1000,
      currentPnl: 0,
      copiedTrades: 0,
      winRate: 0,
      agentRank: agent.agentRank,
    }
    setCopyTrades(prev => [...prev, newCopyTrade])
    setToast(`Started copying ${agent.agentName}`)
  }

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  return (
    <div className="min-h-screen bg-terminal-dark">
      <header className="border-b border-terminal-border bg-terminal-darker">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
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
                className="text-sm font-mono text-terminal-accent hover:text-terminal-green transition-colors"
              >
                {t("nav.myAgents")}
              </Link>
              <Link
                href="/leaderboard"
                className="text-sm font-mono text-terminal-muted hover:text-terminal-green transition-colors"
              >
                {t("nav.leaderboard")}
              </Link>
            </nav>

            <div className="flex items-center gap-2 md:gap-3 justify-self-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="text-terminal-foreground">
                    <Menu className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-terminal-darker border-terminal-border h-9 md:h-10">
                  <DropdownMenuItem asChild>
                    <Link href="/marketplace" className="text-terminal-foreground font-mono text-xs">
                      {t("nav.marketplace")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-agents" className="text-terminal-accent font-mono text-xs">
                      {t("nav.myAgents")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/leaderboard" className="text-terminal-foreground font-mono text-xs">
                      {t("nav.leaderboard")}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {connectedWallet ? (
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-terminal-green animate-pulse" />
                  <span className="text-xs font-mono text-terminal-green hidden sm:inline">0x742d...35c9</span>
                </div>
              ) : (
                <Button
                  onClick={() => setConnectedWallet(true)}
                  className="bg-terminal-accent text-terminal-darker font-mono text-xs md:text-sm hover:bg-terminal-accent/90 px-3 md:px-4 py-1.5 md:py-2"
                >
                  {t("common.connect")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold font-mono text-terminal-foreground mb-1 md:mb-2">
            {t("myAgents.title")}
          </h1>
          <p className="text-xs md:text-sm text-terminal-muted font-mono">{t("myAgents.subtitle")}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 md:mb-8 bg-terminal-darker border border-terminal-border h-9 md:h-10">
            <TabsTrigger
              value="trading"
              className="font-mono text-xs md:text-sm data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-darker"
            >
              {t("myAgents.trading")}
            </TabsTrigger>
            <TabsTrigger
              value="research"
              className="font-mono text-xs md:text-sm data-[state=active]:bg-terminal-green data-[state=active]:text-terminal-darker"
            >
              {t("myAgents.research")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trading" className="space-y-6">
            {/* Sub-tabs for Trading Agents */}
            <div className="flex items-center gap-1 border-b border-terminal-border pb-1 mb-6">
              <button
                onClick={() => setTradingSubTab("my-agents")}
                className={`px-4 py-2 text-sm font-mono transition-colors ${
                  tradingSubTab === "my-agents"
                    ? "text-terminal-foreground border-b-2 border-terminal-green -mb-[5px]"
                    : "text-terminal-muted hover:text-terminal-foreground"
                }`}
              >
                My Trading Agents <span className="text-terminal-green ml-1">({tradingAgents.length})</span>
              </button>
              <button
                onClick={() => setTradingSubTab("copy-trades")}
                className={`px-4 py-2 text-sm font-mono transition-colors ${
                  tradingSubTab === "copy-trades"
                    ? "text-terminal-foreground border-b-2 border-terminal-green -mb-[5px]"
                    : "text-terminal-muted hover:text-terminal-foreground"
                }`}
              >
                Copy Trades <span className="text-terminal-green ml-1">({copyTrades.length})</span>
              </button>
              <button
                onClick={() => setTradingSubTab("following")}
                className={`px-4 py-2 text-sm font-mono transition-colors ${
                  tradingSubTab === "following"
                    ? "text-terminal-foreground border-b-2 border-terminal-green -mb-[5px]"
                    : "text-terminal-muted hover:text-terminal-foreground"
                }`}
              >
                Following <span className="text-terminal-green ml-1">({followingAgents.length})</span>
              </button>
            </div>

            {/* My Trading Agents Sub-tab */}
            {tradingSubTab === "my-agents" && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
                <div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-mono text-terminal-foreground">
                    {t("myAgents.tradingAgents")}
                  </h2>
                  <p className="text-xs md:text-sm text-terminal-muted font-mono mt-1">{t("myAgents.tradingSubtitle")}</p>
                </div>
                <Link href="/create-trading-agent" className="w-full sm:w-auto">
                  <Button className="bg-terminal-green text-terminal-darker font-mono hover:bg-terminal-green/90 text-xs md:text-sm w-full sm:w-auto">
                    <Zap className="mr-2 size-3 md:size-4" />
                    {t("myAgents.newAgent")}
                  </Button>
                </Link>
              </div>
            )}

            {/* Copy Trades Sub-tab */}
            {tradingSubTab === "copy-trades" && (
              <div className="space-y-4">
                {copyTrades.length === 0 ? (
                  <Card className="bg-terminal-darker border-terminal-border p-8 text-center">
                    <Copy className="size-10 text-terminal-muted mx-auto mb-4" />
                    <p className="text-terminal-muted font-mono mb-4">No active copy trades</p>
                    <Link href="/leaderboard?tab=trading">
                      <Button className="bg-terminal-green text-terminal-darker font-mono hover:bg-terminal-green/90">
                        Browse Leaderboard
                      </Button>
                    </Link>
                  </Card>
                ) : (
                  copyTrades.map((trade) => (
                    <Card key={trade.id} className="bg-terminal-darker border-terminal-border p-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Left: Agent Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold font-mono text-terminal-foreground">{trade.agentName}</h3>
                            <Badge className={`${trade.status === 'active' ? "bg-terminal-green/20 text-terminal-green border-terminal-green" : "bg-yellow-500/20 text-yellow-500 border-yellow-500"} text-[10px] font-mono px-2 py-0.5`}>
                              {trade.status === 'active' ? '● ACTIVE' : '● PAUSED'}
                            </Badge>
                          </div>
                          <p className="text-xs text-terminal-muted font-mono">
                            Copying since {trade.copySince} · {trade.mode === 'auto' ? '🤖 Auto mode' : '👤 Manual mode'}
                          </p>
                        </div>

                        {/* Middle: Stats */}
                        <div className="flex items-center gap-6 md:gap-8">
                          <div>
                            <p className="text-[10px] text-terminal-muted font-mono mb-1">Allocated</p>
                            <p className="text-sm font-bold font-mono text-terminal-foreground">${trade.allocated.toLocaleString()} USDC</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-terminal-muted font-mono mb-1">Current PnL</p>
                            <p className={`text-sm font-bold font-mono ${trade.currentPnl >= 0 ? 'text-terminal-green' : 'text-red-400'}`}>
                              {trade.currentPnl >= 0 ? '+' : ''}${trade.currentPnl.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-terminal-muted font-mono mb-1">Copied Trades</p>
                            <p className="text-sm font-bold font-mono text-terminal-foreground">{trade.copiedTrades}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-terminal-muted font-mono mb-1">Win Rate</p>
                            <p className="text-sm font-bold font-mono text-terminal-foreground">{trade.winRate}%</p>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handlePauseCopyTrade(trade.id)}
                            variant="outline"
                            className={`font-mono text-xs ${trade.status === 'active' ? 'border-terminal-border text-terminal-foreground' : 'border-terminal-green text-terminal-green'}`}
                          >
                            {trade.status === 'active' ? <><Pause className="mr-1.5 size-3" /> Pause</> : <><Play className="mr-1.5 size-3" /> Resume</>}
                          </Button>
                          <Button
                            variant="outline"
                            className="font-mono text-xs border-terminal-border text-terminal-muted bg-transparent"
                          >
                            <Settings className="mr-1.5 size-3" /> Settings
                          </Button>
                          <Button
                            onClick={() => handleStopCopyTrade(trade.id)}
                            variant="outline"
                            className="font-mono text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Square className="mr-1.5 size-3" /> Stop
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Following Sub-tab */}
            {tradingSubTab === "following" && (
              <div className="space-y-4">
                {followingAgents.length === 0 ? (
                  <Card className="bg-terminal-darker border-terminal-border p-8 text-center">
                    <Eye className="size-10 text-terminal-muted mx-auto mb-4" />
                    <p className="text-terminal-muted font-mono mb-4">Not following any agents</p>
                    <Link href="/leaderboard?tab=trading">
                      <Button className="bg-terminal-green text-terminal-darker font-mono hover:bg-terminal-green/90">
                        Browse Leaderboard
                      </Button>
                    </Link>
                  </Card>
                ) : (
                  followingAgents.map((agent) => (
                    <Card key={agent.id} className="bg-terminal-darker border-terminal-border p-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Left: Rank + Agent Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`flex items-center justify-center size-12 rounded-lg font-bold font-mono text-sm border ${
                            agent.agentRank === 1
                              ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                              : agent.agentRank === 2
                                ? "bg-gray-400/20 text-gray-400 border-gray-400/50"
                                : agent.agentRank === 3
                                  ? "bg-orange-500/20 text-orange-500 border-orange-500/50"
                                  : "bg-terminal-dark text-terminal-muted border-terminal-border"
                          }`}>
                            #{agent.agentRank}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold font-mono text-terminal-foreground">{agent.agentName}</h3>
                            <p className="text-xs text-terminal-muted font-mono">
                              Followed {agent.followedSince}
                            </p>
                          </div>
                        </div>

                        {/* Middle: Stats */}
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-sm font-bold font-mono text-terminal-green">+{agent.return}%</p>
                            <p className="text-[10px] text-terminal-muted font-mono">Return</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold font-mono text-terminal-foreground">{agent.winRate}%</p>
                            <p className="text-[10px] text-terminal-muted font-mono">Win Rate</p>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleCopyFromFollowing(agent)}
                            className="bg-terminal-green text-terminal-darker font-mono text-xs hover:bg-terminal-green/90"
                          >
                            <Copy className="mr-1.5 size-3" /> Copy
                          </Button>
                          <Button
                            onClick={() => handleUnfollow(agent.id)}
                            variant="outline"
                            className="font-mono text-xs border-terminal-border text-terminal-muted"
                          >
                            Unfollow
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}

            {tradingSubTab === "my-agents" && (
            <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {tradingAgents.map((agent) => (
                <Link key={agent.id} href={`/trading-terminal/${agent.id}?from=my-agents`}>
                  <Card className="bg-terminal-darker border-terminal-border hover:border-terminal-accent transition-all group cursor-pointer">
                    <div className="p-4 md:p-6 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-3">
                        <Badge
                          className={`${agent.isRunning ? "bg-terminal-green/20 text-terminal-green border-terminal-green" : "bg-terminal-muted/20 text-terminal-muted border-terminal-muted"} text-[10px] md:text-xs font-mono px-1.5 py-0.5`}
                        >
                          {agent.isRunning ? t("common.live") : "PAUSED"}
                        </Badge>
                        <DropdownMenu
                          open={dropdownOpen === agent.id}
                          onOpenChange={(open) => setDropdownOpen(open ? agent.id : null)}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-terminal-foreground hover:text-terminal-accent"
                              onClick={(e) => e.preventDefault()}
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-terminal-darker border-terminal-border">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault()
                                handleToggleStatus(agent.id)
                                setDropdownOpen(null) // Close dropdown after action
                              }}
                              className="text-terminal-foreground font-mono text-xs cursor-pointer"
                            >
                              {agent.isRunning ? (
                                <>
                                  <Pause className="mr-2 size-3" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 size-3" />
                                  Start
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleOpenInfoDialog(agent)
                                setDropdownOpen(null)
                              }}
                              className="text-terminal-foreground font-mono text-xs cursor-pointer"
                            >
                              <Brain className="mr-2 size-3" />
                              Info
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation() // Added stopPropagation for consistency
                                handleOpenEditDialog(agent)
                                setDropdownOpen(null)
                              }}
                              className="text-terminal-foreground font-mono text-xs cursor-pointer"
                            >
                              <Edit className="mr-2 size-3" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation() // Added stopPropagation for consistency
                                handleOpenDeleteDialog(agent)
                                setDropdownOpen(null)
                              }}
                              className="text-red-500 font-mono text-xs cursor-pointer"
                            >
                              <Trash2 className="mr-2 size-3" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <h3 className="text-base md:text-lg font-bold font-mono text-terminal-foreground group-hover:text-terminal-accent transition-colors cursor-pointer mb-1">
                        {agent.name}
                      </h3>
                      <p className="text-[10px] md:text-xs text-terminal-muted font-mono mb-3">
                        {agent.market} • {agent.exchange}
                      </p>

                      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3">
                        <div className="h-20 flex flex-col justify-center">
                          <div className="mb-2">
                            <p className="text-[10px] md:text-xs text-terminal-muted font-mono mb-1">
                              {t("myAgents.pnl")}
                            </p>
                            <p className="text-lg md:text-xl font-bold font-mono text-terminal-green">{agent.pnl}</p>
                          </div>
                          <div>
                            <p className="text-[10px] md:text-xs text-terminal-muted font-mono">
                              {t("myAgents.cycle")}: <span className="text-terminal-accent">{agent.cycle}</span>
                            </p>
                          </div>
                        </div>
                        <div className="h-20 flex flex-col justify-center">
                          <p className="text-[10px] md:text-xs text-terminal-muted font-mono">
                            {t("myAgents.totalValue")}
                          </p>
                          <p className="text-lg md:text-xl font-bold font-mono text-terminal-foreground">
                            {agent.totalValue}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-[10px] md:text-xs font-mono mb-3 h-8">
                        <span className="text-terminal-muted">
                          {t("myAgents.token")}: <span className="text-terminal-foreground">{agent.token}</span>
                        </span>
                      </div>

                      <div className="mt-auto pt-2 border-t border-terminal-border/30">
                        <p className="text-[10px] text-terminal-muted font-mono">Created: {agent.createdAt}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            )}
          </TabsContent>

          <TabsContent value="research" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
              <div>
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-mono text-terminal-foreground">
                  {t("myAgents.researchAgents")}
                </h2>
                <p className="text-xs md:text-sm text-terminal-muted font-mono mt-1">
                  {t("myAgents.researchSubtitle")}
                </p>
              </div>
              <Link href="/create-research-agent" className="w-full sm:w-auto">
                <Button className="bg-terminal-accent text-terminal-darker font-mono hover:bg-terminal-accent/90 text-xs md:text-sm w-full sm:w-auto">
                  <Brain className="mr-2 size-3 md:size-4" />
                  {t("marketplace.createAgent")}
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {myResearchAgents.map((agent) => (
                <Card
                  key={agent.id}
                  className="bg-terminal-darker border-terminal-border hover:border-terminal-green transition-all cursor-pointer group"
                >
                  <div
                    className="p-4 md:p-5 flex flex-col relative"
                    onClick={() => (window.location.href = `/research/${agent.id}?from=my-agents`)}
                  >
                    <div className="mb-3">
                      <h3 className="text-base md:text-lg font-bold font-mono text-terminal-foreground group-hover:text-terminal-green transition-colors mb-2">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-terminal-muted font-mono leading-relaxed line-clamp-2 mb-2">
                        Advanced technical analysis using multiple indicators and market sentiment for real-time signal
                        generation
                      </p>
                      <a
                        href={`https://bscscan.com/address/${agent.creator}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-terminal-muted hover:text-terminal-accent font-mono transition-colors inline-block"
                      >
                        by {agent.creatorShort}
                      </a>
                    </div>

                    <div className="space-y-2 mb-4 pb-4 border-b border-terminal-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-terminal-muted font-mono">{t("agent.type")}</span>
                        <span className="text-xs text-terminal-accent font-mono font-medium">{agent.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-terminal-muted font-mono">{t("agent.token")}</span>
                        <span className="text-xs text-terminal-foreground font-mono font-medium">{agent.token}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-terminal-muted font-mono">{t("agent.timeframe")}</span>
                        <span className="text-xs text-terminal-green font-mono font-bold">{agent.timeframe}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-terminal-muted font-mono">{t("agent.llm")}</span>
                        <span className="text-xs text-terminal-accent font-mono font-bold">{agent.llm}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-terminal-muted font-mono">{t("agent.created")}</span>
                        <span className="text-xs text-terminal-muted font-mono">{agent.createdAt}</span>
                      </div>
                    </div>

                    <div className="mb-4 pb-4 border-b border-terminal-border">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-[10px] text-terminal-muted font-mono mb-1">{t("agent.accuracy")}</p>
                          <p className="text-base md:text-lg font-bold font-mono text-terminal-green">
                            {agent.accuracy}%
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-terminal-muted font-mono mb-1">{t("agent.calls")}</p>
                          <p className="text-base md:text-lg font-bold font-mono text-terminal-foreground">
                            {agent.calls}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-terminal-muted font-mono mb-1">{t("agent.revenue")}</p>
                          <p className="text-sm md:text-base font-bold font-mono text-terminal-accent">
                            ${agent.revenue}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto bg-terminal-dark/50 rounded-lg p-3 border border-terminal-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-terminal-muted font-mono">{t("agent.pricePerCall")}</p>
                          <Badge
                            className={`text-[10px] font-mono px-2 py-0.5 ${
                              agent.status === "Public"
                                ? "bg-terminal-green/20 text-terminal-green border-terminal-green"
                                : "bg-terminal-muted/20 text-terminal-muted border-terminal-muted"
                            }`}
                          >
                            {agent.status === "Public" ? t("agent.public") : t("agent.private")}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-xl md:text-2xl font-bold font-mono text-terminal-accent">
                          ${Number(agent.price).toFixed(3)} <span className="text-sm text-terminal-muted">USDC</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-terminal-darker border-terminal-accent">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-mono text-terminal-foreground">Confirm Delete</DialogTitle>
            <DialogDescription className="text-sm text-terminal-muted font-mono">
              Are you sure you want to delete "{selectedAgent?.name}"? This will close all open positions and cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="bg-transparent border-terminal-border text-terminal-foreground font-mono hover:bg-terminal-dark"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} className="bg-red-500 text-white font-mono hover:bg-red-600">
              Delete & Close Positions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
        <DialogContent className="bg-terminal-darker border-terminal-accent max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-mono text-terminal-foreground">
              Trading Agent Information
            </DialogTitle>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <h3 className="text-sm font-bold font-mono text-terminal-muted mb-1">Name</h3>
                <p className="text-base font-mono text-terminal-foreground">{selectedAgent.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold font-mono text-terminal-muted mb-1">Description</h3>
                <p className="text-sm font-mono text-terminal-foreground">
                  Autonomous trading agent for {selectedAgent.token} on {selectedAgent.exchange}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-bold font-mono text-terminal-muted mb-1">Trading Platform</h3>
                  <p className="text-sm font-mono text-terminal-foreground">{selectedAgent.exchange}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-terminal-muted mb-1">Token</h3>
                  <p className="text-sm font-mono text-terminal-foreground">{selectedAgent.token}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-bold font-mono text-terminal-muted mb-1">Trading Cycle</h3>
                  <p className="text-sm font-mono text-terminal-accent">{selectedAgent.cycle}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-terminal-muted mb-1">LLM Model</h3>
                  <p className="text-sm font-mono text-terminal-foreground">{selectedAgent.llm || "0G Network"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-bold font-mono text-terminal-muted mb-1">Status</h3>
                  <Badge
                    className={`${selectedAgent.isRunning ? "bg-terminal-green/20 text-terminal-green border-terminal-green" : "bg-terminal-muted/20 text-terminal-muted border-terminal-muted"} text-xs font-mono`}
                  >
                    {selectedAgent.isRunning ? "LIVE" : "PAUSED"}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-terminal-muted mb-1">Created</h3>
                  <p className="text-sm font-mono text-terminal-foreground">{selectedAgent.createdAt}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold font-mono text-terminal-muted mb-1">Trading Style</h3>
                <p className="text-sm font-mono text-terminal-foreground capitalize">
                  {selectedAgent.style || "Balanced"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold font-mono text-terminal-muted mb-1">Research Agent</h3>
                {selectedAgent.researchAgent ? (
                  <Link
                    href={`/research/${selectedAgent.researchAgent}?from=my-agents`}
                    onClick={() => setInfoDialogOpen(false)}
                  >
                    <Badge className="bg-terminal-accent/20 text-terminal-accent border-terminal-accent hover:bg-terminal-accent/30 transition-colors cursor-pointer text-xs font-mono px-2 py-1">
                      {researchAgentOptions.find((ra) => ra.id === selectedAgent.researchAgent)?.name ||
                        selectedAgent.researchAgent}
                    </Badge>
                  </Link>
                ) : (
                  <p className="text-sm font-mono text-terminal-muted">Not selected</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-bold font-mono text-terminal-muted mb-1">Total Value</h3>
                  <p className="text-lg font-bold font-mono text-terminal-foreground">{selectedAgent.totalValue}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-terminal-muted mb-1">P&L</h3>
                  <p className="text-lg font-bold font-mono text-terminal-green">{selectedAgent.pnl}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setInfoDialogOpen(false)}
              className="bg-terminal-accent text-terminal-darker font-mono hover:bg-terminal-accent/90"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) setEditStep(1)
        }}
      >
        <DialogContent className="bg-terminal-darker border-terminal-accent max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-mono text-terminal-foreground">
              Edit Trading Agent - Step {editStep} of 2
            </DialogTitle>
            <DialogDescription className="text-sm text-terminal-muted font-mono">
              {editStep === 1 ? "Update basic trading parameters" : "Modify trading style and research agent selection"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* Step 1: Token, Cycle & LLM */}
            {editStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-mono text-terminal-foreground mb-3 block">Select Token</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["BTC", "ETH", "BNB", "SOL", "ARB", "OP"].map((token) => (
                      <button
                        key={token}
                        onClick={() => setEditFormData({ ...editFormData, token })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          editFormData.token === token
                            ? "border-terminal-green bg-terminal-green/10"
                            : "border-terminal-border hover:border-terminal-accent"
                        }`}
                      >
                        <span className="text-sm font-bold font-mono text-terminal-foreground">{token}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-mono text-terminal-foreground mb-3 block">Trading Cycle</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {["3m", "5m", "10m", "30m"].map((cycle) => (
                      <button
                        key={cycle}
                        onClick={() => setEditFormData({ ...editFormData, cycle })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          editFormData.cycle === cycle
                            ? "border-terminal-green bg-terminal-green/10"
                            : "border-terminal-border hover:border-terminal-accent"
                        }`}
                      >
                        <span className="text-sm font-bold font-mono text-terminal-foreground">{cycle}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-terminal-muted font-mono mt-2">
                    How often your agent evaluates and executes trades
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-mono text-terminal-foreground mb-3 block">LLM Provider</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "0G", label: "0G Network" },
                      { value: "OpenAI", label: "OpenAI GPT-4" },
                      { value: "Gemini", label: "Google Gemini" },
                    ].map((llm) => (
                      <button
                        key={llm.value}
                        onClick={() => setEditFormData({ ...editFormData, llm: llm.value })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          editFormData.llm === llm.value
                            ? "border-terminal-green bg-terminal-green/10"
                            : "border-terminal-border hover:border-terminal-accent"
                        }`}
                      >
                        <span className="text-sm font-bold font-mono text-terminal-foreground">{llm.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-terminal-dark/50 border border-terminal-border/50 rounded p-3">
                  <p className="text-xs text-terminal-muted font-mono">
                    <span className="text-terminal-accent">Note:</span> Trading venue ({selectedAgent?.exchange}) cannot
                    be changed.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Style & Research Agent */}
            {editStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-mono text-terminal-foreground mb-3 block">Trading Style</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "cautious", label: "Cautious", desc: "Low risk" },
                      { value: "balanced", label: "Balanced", desc: "Moderate" },
                      { value: "aggressive", label: "Aggressive", desc: "High risk" },
                    ].map((style) => (
                      <button
                        key={style.value}
                        onClick={() => {
                          setEditFormData({
                            ...editFormData,
                            style: style.value,
                            portfolioPrompt: getDefaultPrompt("portfolio", style.value),
                            riskPrompt: getDefaultPrompt("risk", style.value),
                            traderPrompt: getDefaultPrompt("trader", style.value),
                          })
                        }}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          editFormData.style === style.value
                            ? "border-terminal-green bg-terminal-green/10"
                            : "border-terminal-border hover:border-terminal-accent"
                        }`}
                      >
                        <h4 className="text-xs font-bold font-mono text-terminal-foreground mb-1">{style.label}</h4>
                        <p className="text-xs text-terminal-muted font-mono">{style.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {editFormData.style && (
                  <div className="space-y-3 p-4 bg-terminal-dark/50 border border-terminal-border rounded-lg">
                    <h3 className="text-sm font-bold font-mono text-terminal-foreground">
                      Sub-Agent prompts (subject to fine-tuning)
                    </h3>
                    <div>
                      <Label className="text-xs font-mono text-terminal-foreground mb-2 block">Portfolio Manager</Label>
                      <Textarea
                        value={editFormData.portfolioPrompt}
                        onChange={(e) => setEditFormData({ ...editFormData, portfolioPrompt: e.target.value })}
                        rows={2}
                        className="bg-terminal-dark border-terminal-border text-terminal-foreground font-mono text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-mono text-terminal-foreground mb-2 block">Risk Manager</Label>
                      <Textarea
                        value={editFormData.riskPrompt}
                        onChange={(e) => setEditFormData({ ...editFormData, riskPrompt: e.target.value })}
                        rows={2}
                        className="bg-terminal-dark border-terminal-border text-terminal-foreground font-mono text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-mono text-terminal-foreground mb-2 block">Trader</Label>
                      <Textarea
                        value={editFormData.traderPrompt}
                        onChange={(e) => setEditFormData({ ...editFormData, traderPrompt: e.target.value })}
                        rows={2}
                        className="bg-terminal-dark border-terminal-border text-terminal-foreground font-mono text-xs"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                    <Label className="text-sm font-mono text-terminal-foreground">Select Research Agent</Label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Select value={filterAccuracy} onValueChange={setFilterAccuracy}>
                        <SelectTrigger className="w-[110px] h-8 text-xs border-terminal-border bg-terminal-dark">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Accuracy</SelectItem>
                          <SelectItem value="50">50%+</SelectItem>
                          <SelectItem value="60">60%+</SelectItem>
                          <SelectItem value="70">70%+</SelectItem>
                          <SelectItem value="80">80%+</SelectItem>
                          <SelectItem value="90">90%+</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[140px] h-8 text-xs border-terminal-border bg-terminal-dark">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Technical">Technical</SelectItem>
                          <SelectItem value="Whale Monitoring">Whale Monitoring</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterLLM} onValueChange={setFilterLLM}>
                        <SelectTrigger className="w-[100px] h-8 text-xs border-terminal-border bg-terminal-dark">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All LLM</SelectItem>
                          <SelectItem value="OpenAI">OpenAI</SelectItem>
                          <SelectItem value="Gemini">Gemini</SelectItem>
                          <SelectItem value="0G">0G</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-3 max-h-[300px] overflow-y-auto">
                    {filteredResearchAgents.map((agent) => {
                      const isSelected = editFormData.researchAgent === agent.id
                      const isMatching = agent.token === editFormData.token

                      return (
                        <button
                          key={agent.id}
                          onClick={() => setEditFormData({ ...editFormData, researchAgent: agent.id })}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            isSelected
                              ? "border-terminal-green bg-terminal-green/5"
                              : "border-terminal-border hover:border-terminal-accent"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h4 className="text-sm font-bold font-mono text-terminal-foreground">{agent.name}</h4>
                            <Badge className="bg-terminal-foreground/10 text-terminal-foreground border-terminal-foreground text-xs">
                              {agent.type}
                            </Badge>
                            {isMatching && (
                              <Badge className="bg-terminal-accent/20 text-terminal-accent border-terminal-accent text-xs">
                                SUGGESTED
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-terminal-muted font-mono flex-wrap">
                            <span>{agent.token}</span>
                            <span>{agent.timeframe}</span>
                            <span>{agent.accuracy}% accuracy</span>
                            <span>${agent.price} USDC</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {editStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setEditStep(editStep - 1)}
                className="bg-transparent border-terminal-border text-terminal-foreground font-mono hover:bg-terminal-dark"
              >
                <ArrowLeft className="size-3 mr-1" />
                Back
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false)
                setEditStep(1)
              }}
              className="bg-transparent border-terminal-border text-terminal-foreground font-mono hover:bg-terminal-dark"
            >
              Cancel
            </Button>
            {editStep < 2 ? (
              <Button
                onClick={() => setEditStep(2)}
                disabled={!canProceedEditStep()}
                className="bg-terminal-green text-terminal-darker font-mono hover:bg-terminal-green/90 disabled:opacity-50"
              >
                Next
                <ArrowRight className="size-3 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSaveEdit}
                disabled={!canProceedEditStep()}
                className="bg-terminal-green text-terminal-darker font-mono hover:bg-terminal-green/90 disabled:opacity-50"
              >
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 px-5 py-3.5 bg-terminal-green/20 border border-terminal-green/30 rounded-xl flex items-center gap-3 z-50 shadow-lg">
          <Check className="size-5 text-terminal-green" />
          <span className="text-sm font-mono">{toast}</span>
        </div>
      )}
    </div>
  )
}
