"use client"

import { useState } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  BarChart3, 
  Wallet, 
  Settings,
  ChevronRight,
  ChevronDown,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Home,
  History,
  Bot,
  User
} from "lucide-react"

// Types
interface Position {
  id: number
  coin: string
  symbol: string
  side: "LONG" | "SHORT"
  size: string
  entry: number
  current: number
  pnl: number
  pnlPercent: number
  sl: number
  tp: number
  holding: string
}

interface Decision {
  id: number
  type: string
  coin: string
  time: string
  detail: string
  pnl: number | null
}

export default function MobileTradingTerminal({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<"home" | "positions" | "history" | "agents">("home")
  const [expandedPosition, setExpandedPosition] = useState<number | null>(null)

  // Mock data
  const agentName = "Alpha Momentum v2"
  const agentStatus = "RUNNING"
  const totalPnl = 1245.80
  const winRate = 65
  const totalTrades = 47

  const positions: Position[] = [
    { id: 1, coin: "BTC", symbol: "Bitcoin", side: "LONG", size: "0.15 BTC", entry: 94250, current: 95180, pnl: 139.45, pnlPercent: 0.99, sl: 92300, tp: 99000, holding: "4h 23m" },
    { id: 2, coin: "ETH", symbol: "Ethereum", side: "LONG", size: "2.5 ETH", entry: 3420, current: 3485, pnl: 162.50, pnlPercent: 1.90, sl: 3350, tp: 3650, holding: "6h 45m" },
    { id: 3, coin: "SOL", symbol: "Solana", side: "SHORT", size: "50 SOL", entry: 195.20, current: 192.45, pnl: 137.50, pnlPercent: 1.41, sl: 202, tp: 180, holding: "2h 30m" },
  ]

  const recentDecisions: Decision[] = [
    { id: 1, type: "OPEN LONG", coin: "BTC", time: "2 min ago", detail: "0.05 BTC @ $94,250", pnl: null },
    { id: 2, type: "ADD", coin: "ETH", time: "15 min ago", detail: "Added 0.5 ETH @ $3,460", pnl: null },
    { id: 3, type: "REDUCE", coin: "SOL", time: "32 min ago", detail: "Partial close 10 SOL", pnl: 28.50 },
    { id: 4, type: "HOLD", coin: "BTC", time: "1h ago", detail: "Waiting for confirmation", pnl: null },
    { id: 5, type: "CLOSE", coin: "AVAX", time: "2h ago", detail: "TP Hit @ $42.80", pnl: 85.20 },
  ]

  const agents = [
    { name: "Technical Analysis", status: "active", signal: "BULLISH", confidence: 78 },
    { name: "Whale Tracker", status: "active", signal: "NEUTRAL", confidence: 52 },
    { name: "Sentiment", status: "active", signal: "BULLISH", confidence: 72 },
    { name: "On-chain", status: "paused", signal: "—", confidence: 0 },
  ]

  const getTypeColor = (type: string) => {
    if (type.includes("OPEN") || type === "ADD") return "#22c55e"
    if (type.includes("CLOSE") || type === "REDUCE") return "#f59e0b"
    if (type === "HOLD") return "#6b7c74"
    return "#3b82f6"
  }

  const getTypeIcon = (type: string) => {
    if (type.includes("OPEN") || type === "ADD") return <TrendingUp className="w-4 h-4" />
    if (type.includes("CLOSE") || type === "REDUCE") return <TrendingDown className="w-4 h-4" />
    if (type === "HOLD") return <Clock className="w-4 h-4" />
    return <Activity className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8e8e8] font-sans pb-20">
      {/* Status Bar Area */}
      <div className="h-12 bg-[#0a0f0d]" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0f0d]/95 backdrop-blur-sm border-b border-[#1a2420] px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">{agentName}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-xs text-[#6b7c74]">{agentStatus}</span>
              <span className="text-xs text-[#6b7c74]">·</span>
              <span className="text-xs text-[#6b7c74]">ID: {params.id}</span>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-[#141a17] flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#6b7c74]" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4">
        {/* Home Tab */}
        {activeTab === "home" && (
          <div className="space-y-4">
            {/* Performance Card */}
            <div className="bg-[#0d1210] rounded-2xl border border-[#1a2420] p-4">
              <div className="text-xs text-[#6b7c74] uppercase tracking-wider mb-2">Total PnL</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#22c55e]">+${totalPnl.toLocaleString()}</span>
                <span className="text-sm text-[#22c55e]">+12.5%</span>
              </div>
              <div className="flex gap-6 mt-4 pt-4 border-t border-[#1a2420]">
                <div>
                  <div className="text-xs text-[#6b7c74]">Win Rate</div>
                  <div className="text-lg font-semibold">{winRate}%</div>
                </div>
                <div>
                  <div className="text-xs text-[#6b7c74]">Trades</div>
                  <div className="text-lg font-semibold">{totalTrades}</div>
                </div>
                <div>
                  <div className="text-xs text-[#6b7c74]">Active</div>
                  <div className="text-lg font-semibold">{positions.length}</div>
                </div>
              </div>
            </div>

            {/* Active Positions Preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[#6b7c74] uppercase tracking-wider">Active Positions</h2>
                <button 
                  onClick={() => setActiveTab("positions")}
                  className="text-xs text-[#22c55e] flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                {positions.slice(0, 2).map(pos => (
                  <div 
                    key={pos.id}
                    className="bg-[#0d1210] rounded-xl border border-[#1a2420] p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#141a17] flex items-center justify-center text-sm font-bold">
                          {pos.coin}
                        </div>
                        <div>
                          <div className="font-medium">{pos.symbol}</div>
                          <div className="flex items-center gap-2 text-xs text-[#6b7c74]">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              pos.side === "LONG" ? "bg-[#0d2818] text-[#22c55e]" : "bg-[#2d1f1f] text-[#ef4444]"
                            }`}>
                              {pos.side}
                            </span>
                            <span>{pos.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${pos.pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                          {pos.pnl >= 0 ? "+" : ""}${pos.pnl.toFixed(2)}
                        </div>
                        <div className={`text-xs ${pos.pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                          {pos.pnlPercent >= 0 ? "+" : ""}{pos.pnlPercent}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[#6b7c74] uppercase tracking-wider">Recent Decisions</h2>
                <button 
                  onClick={() => setActiveTab("history")}
                  className="text-xs text-[#22c55e] flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                {recentDecisions.slice(0, 3).map(dec => (
                  <div 
                    key={dec.id}
                    className="bg-[#0d1210] rounded-xl border border-[#1a2420] p-3 flex items-center gap-3"
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: getTypeColor(dec.type) + "20", color: getTypeColor(dec.type) }}
                    >
                      {getTypeIcon(dec.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{dec.type}</span>
                        <span className="text-xs text-[#6b7c74]">{dec.coin}</span>
                      </div>
                      <div className="text-xs text-[#6b7c74] truncate">{dec.detail}</div>
                    </div>
                    <div className="text-right">
                      {dec.pnl !== null && (
                        <div className={`text-sm font-medium ${dec.pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                          {dec.pnl >= 0 ? "+" : ""}${dec.pnl.toFixed(2)}
                        </div>
                      )}
                      <div className="text-xs text-[#6b7c74]">{dec.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Positions Tab */}
        {activeTab === "positions" && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-[#6b7c74] uppercase tracking-wider mb-4">
              Active Positions ({positions.length})
            </h2>
            {positions.map(pos => (
              <div 
                key={pos.id}
                className="bg-[#0d1210] rounded-2xl border border-[#1a2420] overflow-hidden"
              >
                <button
                  onClick={() => setExpandedPosition(expandedPosition === pos.id ? null : pos.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#141a17] flex items-center justify-center text-sm font-bold">
                        {pos.coin}
                      </div>
                      <div>
                        <div className="font-semibold">{pos.symbol}</div>
                        <div className="flex items-center gap-2 text-xs text-[#6b7c74] mt-0.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            pos.side === "LONG" ? "bg-[#0d2818] text-[#22c55e]" : "bg-[#2d1f1f] text-[#ef4444]"
                          }`}>
                            {pos.side === "LONG" ? "↗" : "↘"} {pos.side}
                          </span>
                          <span>{pos.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className={`text-lg font-bold ${pos.pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                          {pos.pnl >= 0 ? "+" : ""}${pos.pnl.toFixed(2)}
                        </div>
                        <div className={`text-xs ${pos.pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                          {pos.pnlPercent >= 0 ? "+" : ""}{pos.pnlPercent}%
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-[#6b7c74] transition-transform ${expandedPosition === pos.id ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </button>
                
                {/* Expanded Details */}
                {expandedPosition === pos.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-[#1a2420]">
                    <div className="grid grid-cols-2 gap-3 py-3">
                      <div>
                        <div className="text-xs text-[#6b7c74]">Entry</div>
                        <div className="font-medium">${pos.entry.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6b7c74]">Current</div>
                        <div className="font-medium">${pos.current.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6b7c74]">Stop Loss</div>
                        <div className="font-medium text-[#ef4444]">${pos.sl.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6b7c74]">Take Profit</div>
                        <div className="font-medium text-[#22c55e]">${pos.tp.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#1a2420]">
                      <div className="text-xs text-[#6b7c74]">Holding: {pos.holding}</div>
                      <button className="px-4 py-2 rounded-lg bg-[#2d1f1f] text-[#ef4444] text-sm font-medium">
                        Force Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-[#6b7c74] uppercase tracking-wider mb-4">
              Decision History
            </h2>
            {recentDecisions.map(dec => (
              <div 
                key={dec.id}
                className="bg-[#0d1210] rounded-2xl border border-[#1a2420] p-4"
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: getTypeColor(dec.type) + "20", color: getTypeColor(dec.type) }}
                  >
                    {getTypeIcon(dec.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{dec.type}</span>
                        <span className="px-2 py-0.5 rounded bg-[#141a17] text-xs text-[#6b7c74]">{dec.coin}</span>
                      </div>
                      {dec.pnl !== null && (
                        <span className={`font-semibold ${dec.pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                          {dec.pnl >= 0 ? "+" : ""}${dec.pnl.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-[#a0a0a0] mt-1">{dec.detail}</div>
                    <div className="text-xs text-[#6b7c74] mt-2">{dec.time}</div>
                  </div>
                </div>
                <button className="w-full mt-3 py-2 text-xs text-[#6b7c74] border-t border-[#1a2420] flex items-center justify-center gap-1">
                  View Decision Details <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === "agents" && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-[#6b7c74] uppercase tracking-wider mb-4">
              Research Agents
            </h2>
            {agents.map((agent, idx) => (
              <div 
                key={idx}
                className="bg-[#0d1210] rounded-2xl border border-[#1a2420] p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      agent.status === "active" ? "bg-[#0d2818]" : "bg-[#1a1a1a]"
                    }`}>
                      <Bot className={`w-5 h-5 ${agent.status === "active" ? "text-[#22c55e]" : "text-[#6b7c74]"}`} />
                    </div>
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="flex items-center gap-2 text-xs mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "active" ? "bg-[#22c55e]" : "bg-[#6b7c74]"}`} />
                        <span className="text-[#6b7c74] capitalize">{agent.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {agent.status === "active" && (
                      <>
                        <div className={`font-semibold ${
                          agent.signal === "BULLISH" ? "text-[#22c55e]" : 
                          agent.signal === "BEARISH" ? "text-[#ef4444]" : "text-[#6b7c74]"
                        }`}>
                          {agent.signal}
                        </div>
                        <div className="text-xs text-[#6b7c74]">{agent.confidence}% conf.</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0f0d]/95 backdrop-blur-sm border-t border-[#1a2420] px-6 py-2 safe-area-pb">
        <div className="flex items-center justify-around">
          {[
            { id: "home" as const, icon: Home, label: "Home" },
            { id: "positions" as const, icon: Wallet, label: "Positions" },
            { id: "history" as const, icon: History, label: "History" },
            { id: "agents" as const, icon: Bot, label: "Agents" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
                activeTab === tab.id 
                  ? "text-[#22c55e]" 
                  : "text-[#6b7c74]"
              }`}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
