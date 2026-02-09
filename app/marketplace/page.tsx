"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Menu, ChevronDown, ChevronUp, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

export default function MarketplacePage() {
  const { t } = useLanguage()
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const [filters, setFilters] = useState({
    type: "all",
    token: "all",
    timeframe: "all",
    llm: "all",
    minAccuracy: 50,
    minCalls: 0,
    sortBy: "newest",
  })

  const [researchAgents, setResearchAgents] = useState([
    {
      id: "ra-001",
      name: "Technical Analyzer Pro",
      creator: "0x742d35c9Ab123",
      creatorShort: "0x742d...35c9",
      price: "0.5",
      calls: 1247,
      revenue: "623.5",
      token: "BTC",
      timeframe: "5m",
      type: "Technical Analysis",
      accuracy: 94,
      createdAt: "2025-01-15",
      llm: "OpenAI",
      description:
        "Advanced technical analysis using multiple indicators and market sentiment for real-time signal generation",
      dataSources: ["Binance", "CoinMarketCap"],
    },
    {
      id: "ra-002",
      name: "MACD Master",
      creator: "0x8f3a2bc456Def",
      creatorShort: "0x8f3a...2bc4",
      price: "0.4",
      calls: 892,
      revenue: "356.8",
      token: "ETH",
      timeframe: "15m",
      type: "Technical Analysis",
      accuracy: 89,
      createdAt: "2025-01-10",
      llm: "Gemini",
      description: "Expertise in MACD for identifying trend reversals and momentum shifts",
      dataSources: ["CoinGecko"],
    },
    {
      id: "ra-003",
      name: "RSI Specialist",
      creator: "0x5e9c7a1dGhi789",
      creatorShort: "0x5e9c...7a1d",
      price: "0.6",
      calls: 2341,
      revenue: "1,404.6",
      token: "Multi-Token",
      timeframe: "1h",
      type: "Technical Analysis",
      accuracy: 96,
      createdAt: "2024-12-28",
      llm: "0G",
      description: "Utilizes RSI to determine overbought and oversold conditions",
      dataSources: ["Binance", "CoinMarketCap", "CoinGecko"],
    },
    {
      id: "ra-004",
      name: "Sentiment Analyzer",
      creator: "0x3d8f9e2aJkl012",
      creatorShort: "0x3d8f...9e2a",
      price: "0.75",
      calls: 1856,
      revenue: "1,392",
      token: "BTC, ETH",
      timeframe: "1d",
      type: "Sentiment Analysis",
      accuracy: 91,
      createdAt: "2025-01-08",
      llm: "OpenAI",
      description: "Analyzes social media and news sentiment for market trends",
      dataSources: ["Twitter", "Reddit"],
    },
    {
      id: "ra-005",
      name: "Volume Profile Expert",
      creator: "0x7a2c4f1bMno345",
      creatorShort: "0x7a2c...4f1b",
      price: "0.45",
      calls: 1523,
      revenue: "685.35",
      token: "Multi-Token",
      timeframe: "6h",
      type: "Technical Analysis",
      accuracy: 88,
      createdAt: "2025-01-12",
      llm: "Gemini",
      description: "Profiles trading volume to identify key levels of support and resistance",
      dataSources: ["Binance"],
    },
    {
      id: "ra-006",
      name: "Whale Watcher",
      creator: "0x9b5e6d3cPqr678",
      creatorShort: "0x9b5e...6d3c",
      price: "1.0",
      calls: 3127,
      revenue: "3,127",
      token: "Multi-Token",
      timeframe: "1m",
      type: "On-Chain Analysis",
      accuracy: 97,
      createdAt: "2024-12-20",
      llm: "0G",
      description: "Monitors large-scale transactions for market insights",
      dataSources: ["Etherscan"],
    },
  ])

  const [connectedWallet, setConnectedWallet] = useState(false)

  useEffect(() => {
    const storedAgents = JSON.parse(localStorage.getItem("researchAgents") || "[]")
    const publicAgents = storedAgents.filter((agent: any) => agent.isPublic === true)
    if (publicAgents.length > 0) {
      const formattedAgents = publicAgents.map((agent: any) => ({
        id: agent.id,
        name: agent.name,
        creator: agent.owner || "0x742d35c9Ab123",
        creatorShort: agent.owner ? `${agent.owner.slice(0, 6)}...${agent.owner.slice(-4)}` : "0x742d...35c9",
        price: String(agent.price),
        calls: agent.calls || 0,
        revenue: String(agent.revenue || 0),
        token: agent.token,
        timeframe: agent.timeframe,
        type: agent.type || agent.researchType || "Technical Analysis",
        accuracy: agent.accuracy || Math.floor(Math.random() * 15) + 85,
        createdAt: agent.created || new Date().toISOString().split("T")[0],
        llm: agent.llm,
        description: agent.description,
        dataSources: agent.dataSources,
      }))
      setResearchAgents((prev) => [...prev, ...formattedAgents])
    }
  }, [])

  const filteredAgents = researchAgents
    .filter((agent) => {
      if (filters.type !== "all" && agent.type !== filters.type) return false
      if (filters.token !== "all" && !agent.token.includes(filters.token)) return false
      if (filters.timeframe !== "all" && agent.timeframe !== filters.timeframe) return false
      if (filters.llm !== "all" && agent.llm !== filters.llm) return false
      if (agent.accuracy < filters.minAccuracy) return false
      if (agent.calls < filters.minCalls) return false
      return true
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "accuracy":
          return b.accuracy - a.accuracy
        case "calls":
          return b.calls - a.calls
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-terminal-dark">
      {/* Header */}
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
                className="text-sm font-mono text-terminal-accent hover:text-terminal-green transition-colors"
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
                <DropdownMenuContent align="end" className="bg-terminal-darker border-terminal-border">
                  <DropdownMenuItem asChild>
                    <Link href="/marketplace" className="text-terminal-accent font-mono text-xs">
                      {t("nav.marketplace")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-agents" className="text-terminal-foreground font-mono text-xs">
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
                  className="bg-terminal-accent text-terminal-darker font-mono hover:bg-terminal-accent/90 text-xs md:text-sm w-full sm:w-auto px-3 md:px-4 py-1.5 md:py-2"
                >
                  {t("common.connect")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold font-mono text-terminal-foreground mb-1 md:mb-2">
              {t("marketplace.title")}
            </h1>
            <p className="text-xs md:text-sm text-terminal-muted font-mono">{t("marketplace.subtitle")}</p>
          </div>
          <Link href="/create-research-agent" className="w-full sm:w-auto">
            <Button className="bg-terminal-accent text-terminal-darker font-mono hover:bg-terminal-accent/90 text-xs md:text-sm w-full sm:w-auto">
              <Brain className="mr-2 size-3 md:size-4" />
              {t("marketplace.createAgent")}
            </Button>
          </Link>
        </div>

        <Card className="bg-terminal-darker border-terminal-border p-4 md:p-6 mb-6 md:mb-8">
          <div
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          >
            <h2 className="text-sm md:text-base font-bold font-mono text-terminal-foreground">
              Filter Research Agents
            </h2>
            <Button variant="ghost" size="sm" className="text-terminal-muted hover:text-terminal-accent">
              {isFilterExpanded ? (
                <ChevronUp className="size-4 md:size-5" />
              ) : (
                <ChevronDown className="size-4 md:size-5" />
              )}
            </Button>
          </div>

          {isFilterExpanded && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-terminal-muted font-mono mb-2 block">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full bg-terminal-dark border border-terminal-border text-terminal-foreground text-xs font-mono rounded-md px-3 py-2 focus:outline-none focus:border-terminal-accent"
                  >
                    <option value="all">All Types</option>
                    <option value="Technical Analysis">Technical Analysis</option>
                    <option value="Whale Monitoring">Whale Monitoring</option>
                    <option value="Sentiment Analysis">Sentiment Analysis</option>
                    <option value="On-Chain Analysis">On-Chain Analysis</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-terminal-muted font-mono mb-2 block">Token</label>
                  <select
                    value={filters.token}
                    onChange={(e) => setFilters({ ...filters, token: e.target.value })}
                    className="w-full bg-terminal-dark border border-terminal-border text-terminal-foreground text-xs font-mono rounded-md px-3 py-2 focus:outline-none focus:border-terminal-accent"
                  >
                    <option value="all">All Tokens</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="BNB">BNB</option>
                    <option value="SOL">SOL</option>
                    <option value="ARB">ARB</option>
                    <option value="OP">OP</option>
                    <option value="Multi-Token">Multi-Token</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-terminal-muted font-mono mb-2 block">Time Frame</label>
                  <select
                    value={filters.timeframe}
                    onChange={(e) => setFilters({ ...filters, timeframe: e.target.value })}
                    className="w-full bg-terminal-dark border border-terminal-border text-terminal-foreground text-xs font-mono rounded-md px-3 py-2 focus:outline-none focus:border-terminal-accent"
                  >
                    <option value="all">All Timeframes</option>
                    <option value="1m">1 Minute</option>
                    <option value="3m">3 Minutes</option>
                    <option value="5m">5 Minutes</option>
                    <option value="15m">15 Minutes</option>
                    <option value="30m">30 Minutes</option>
                    <option value="1h">1 Hour</option>
                    <option value="4h">4 Hours</option>
                    <option value="6h">6 Hours</option>
                    <option value="1d">1 Day</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-terminal-muted font-mono mb-2 block">LLM Provider</label>
                  <select
                    value={filters.llm}
                    onChange={(e) => setFilters({ ...filters, llm: e.target.value })}
                    className="w-full bg-terminal-dark border border-terminal-border text-terminal-foreground text-xs font-mono rounded-md px-3 py-2 focus:outline-none focus:border-terminal-accent"
                  >
                    <option value="all">All Providers</option>
                    <option value="0G">0G Network</option>
                    <option value="OpenAI">OpenAI GPT-4</option>
                    <option value="Gemini">Google Gemini</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-terminal-muted font-mono mb-2 block">
                    Min Accuracy: {filters.minAccuracy}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={filters.minAccuracy}
                    onChange={(e) => setFilters({ ...filters, minAccuracy: Number.parseInt(e.target.value) })}
                    className="w-full h-2 bg-terminal-dark border border-terminal-border rounded-lg appearance-none cursor-pointer accent-terminal-accent"
                  />
                  <div className="flex justify-between text-[10px] text-terminal-muted font-mono mt-1">
                    <span>50%</span>
                    <span>95%</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-terminal-muted font-mono mb-2 block">Minimum Calls</label>
                  <select
                    value={filters.minCalls}
                    onChange={(e) => setFilters({ ...filters, minCalls: Number.parseInt(e.target.value) })}
                    className="w-full bg-terminal-dark border border-terminal-border text-terminal-foreground text-xs font-mono rounded-md px-3 py-2 focus:outline-none focus:border-terminal-accent"
                  >
                    <option value="0">No Minimum</option>
                    <option value="100">100+ Calls</option>
                    <option value="1000">1,000+ Calls</option>
                    <option value="5000">5,000+ Calls</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-terminal-muted font-mono mb-2 block">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full bg-terminal-dark border border-terminal-border text-terminal-foreground text-xs font-mono rounded-md px-3 py-2 focus:outline-none focus:border-terminal-accent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="accuracy">Highest Accuracy</option>
                    <option value="calls">Most Calls</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-terminal-muted font-mono mb-2 block">&nbsp;</label>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        type: "all",
                        token: "all",
                        timeframe: "all",
                        llm: "all",
                        minAccuracy: 50,
                        minCalls: 0,
                        sortBy: "newest",
                      })
                    }
                    className="w-full bg-terminal-dark border-terminal-border text-terminal-foreground hover:bg-terminal-darker text-xs font-mono"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-terminal-border">
                <p className="text-xs text-terminal-muted font-mono">
                  Showing {filteredAgents.length} of {researchAgents.length} agents
                </p>
              </div>
            </>
          )}
        </Card>

        <TooltipProvider>
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <Card
                key={agent.id}
                className="bg-terminal-darker border-terminal-border hover:border-terminal-green transition-all cursor-pointer group"
              >
                <div
                  className="p-4 md:p-5 flex flex-col"
                  onClick={() => (window.location.href = `/research/${agent.id}?from=marketplace`)}
                >
                  <div className="mb-3">
                    <h3 className="text-base md:text-lg font-bold font-mono text-terminal-foreground group-hover:text-terminal-green transition-colors mb-2">
                      {agent.name}
                    </h3>
                    <p className="text-xs md:text-sm text-terminal-muted font-mono leading-relaxed line-clamp-2 mb-2">
                      {agent.description ||
                        "Advanced technical analysis using multiple indicators and market sentiment for real-time signal generation"}
                    </p>
                    <a
                      href={`https://bscscan.com/address/${agent.creator}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-terminal-muted hover:text-terminal-accent font-mono transition-colors inline-block"
                    >
                      {t("marketplace.byOwner")} {agent.creatorShort}
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
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <p className="text-[10px] text-terminal-muted font-mono">{t("agent.accuracy")}</p>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center"
                              >
                                <Info className="size-3 text-terminal-muted hover:text-terminal-accent transition-colors" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-[250px] bg-terminal-darker border border-terminal-border text-terminal-foreground text-[10px] leading-relaxed"
                            >
                              The accuracy is calculated based on whether the price movement in the next 10 bars is
                              consistent with the bullish or bearish view (neutral signals are not counted as the agent
                              doesn't hold a strong view)
                            </TooltipContent>
                          </Tooltip>
                        </div>
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
                        <Badge className="text-[10px] font-mono px-2 py-0.5 bg-terminal-green/20 text-terminal-green border-terminal-green">
                          {t("agent.public")}
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
        </TooltipProvider>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-terminal-muted font-mono text-sm">No agents match your filter criteria</p>
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  type: "all",
                  token: "all",
                  timeframe: "all",
                  llm: "all",
                  minAccuracy: 50,
                  minCalls: 0,
                  sortBy: "newest",
                })
              }
              className="mt-4 bg-terminal-dark border-terminal-border text-terminal-foreground hover:bg-terminal-darker text-xs font-mono"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
