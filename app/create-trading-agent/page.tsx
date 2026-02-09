"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Zap,
  ExternalLink,
  Check,
  Eye,
  EyeOff,
  Lock,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Code,
  Quote,
  Undo,
  Redo,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  X,
  Shield,
  User,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/lib/wallet-context"

// Preset Q&A for Strategy Assistant (10 questions)
const PRESET_QA = [
  {
    id: 'which-style',
    question: 'Which trading style fits me?',
    answer: "It depends on your risk tolerance:\n\n**Conservative** — Fewer trades, tight stops, 3:1 reward. Best for beginners or part-time traders.\n\n**Balanced** — Moderate risk, good for most traders.\n\n**Aggressive** — More trades, wider stops, higher risk. For experienced traders.\n\nBased on most users, I recommend starting with **Balanced**. Here's a safety rule to add:",
    suggestion: `**RISK GUARDRAIL**
- If daily loss exceeds 3%, stop trading for the day
- If weekly loss exceeds 7%, reduce position size by 50%`,
  },
  {
    id: 'agent-combo',
    question: 'Which agents work well together?',
    answer: "Here are proven combinations:\n\n**Technical + Whale** — TA finds setups, Whale confirms with on-chain flow\n\n**Technical + Sentiment** — Avoid trading against the crowd\n\n**Technical + Funding** — Great for futures scalping\n\nHere's how to combine their signals:",
    suggestion: `**MULTI-AGENT CONFIRMATION**
- Require at least 2 agents to agree before entry
- If agents conflict, reduce position size by 50%
- Skip trade if any agent shows strong opposite signal`,
  },
  {
    id: 'explain-conservative',
    question: 'Explain Conservative style',
    answer: "**Conservative Style** prioritizes capital preservation:\n\n- Position: 1-2% per trade\n- Stop loss: 1-2% (tight)\n- Take profit: 3:1 minimum\n- Requires ALL confirmations\n- Max 2 positions\n\nHere are additional conservative rules:",
    suggestion: `**CONSERVATIVE ENTRY RULES**
- Wait for 3 confirmation signals before entry
- Only trade during high-liquidity hours (London/NY)
- Skip trade if spread > 0.1%
- Never chase price - wait for pullback`,
  },
  {
    id: 'explain-aggressive',
    question: 'Explain Aggressive style',
    answer: "**Aggressive Style** maximizes opportunities:\n\n- Position: 5-10% per trade\n- Stop loss: 3-5% (wide)\n- Take profit: 1.5:1\n- Only needs 1 confirmation\n- Up to 5 positions\n\nHere are rules to manage the higher risk:",
    suggestion: `**AGGRESSIVE RISK CONTROLS**
- Set hard daily loss limit at 10%
- Take partial profits at 1:1 (50% of position)
- Move stop to breakeven after 1.5:1
- No new positions if 3 consecutive losses`,
  },
  {
    id: 'whale-tracker',
    question: 'What does Whale Tracker do?',
    answer: "**Whale Tracker** monitors large wallet activity:\n\n- Tracks wallets >$1M\n- Detects exchange inflows (selling pressure)\n- Detects exchange outflows (accumulation)\n\nHere's how to use whale signals:",
    suggestion: `**WHALE SIGNAL RULES**
- Whale buying + TA bullish = Full position LONG
- Whale selling + TA bearish = Full position SHORT
- Whale activity contradicts TA = Skip or reduce 50%
- Large exchange inflow (>$10M) = Close longs immediately`,
  },
  {
    id: 'avoid-fakeouts',
    question: 'How to avoid fake breakouts?',
    answer: "Fake breakouts are common! Here's how to filter them:\n\n- Wait for candle close, not just wick\n- Require volume confirmation\n- Check if whales are participating\n- Avoid breakouts during low-volume hours\n\nAdd these filters:",
    suggestion: `**FAKEOUT PREVENTION**
- Wait for 2 candle close above/below level
- Require volume > 1.5x 20-period average
- Skip breakouts during Asian session (low liquidity)
- If price returns inside range within 5 min, exit immediately`,
  },
  {
    id: 'timeframe',
    question: 'What timeframe should I use?',
    answer: "Depends on your style:\n\n- **Scalping** — 1m-5m (requires active monitoring)\n- **Day trading** — 15m-1h (check every few hours)\n- **Swing trading** — 4h-1D (check once daily)\n\nFor automated agents, I recommend **1h as primary**. Here's a multi-timeframe approach:",
    suggestion: `**TIMEFRAME ALIGNMENT**
- Use 4h for trend direction (only trade with 4h trend)
- Use 1h for entry signals
- Use 15m for precise entry timing
- If 4h and 1h conflict, wait for alignment`,
  },
  {
    id: 'news-events',
    question: 'How to handle news events?',
    answer: "Major news (FOMC, CPI) causes extreme volatility. Options:\n\n- **Avoid completely** — Close positions before news\n- **Trade the reaction** — Wait for dust to settle\n- **Reduce size** — Trade with smaller positions\n\nHere's a safe news handling rule:",
    suggestion: `**NEWS EVENT PROTOCOL**
- Close all positions 30 min before major news (FOMC, CPI, NFP)
- No new entries 1 hour before/after news
- If caught in news: widen stop by 2x, don't panic exit
- Resume normal trading 2 hours after news`,
  },
  {
    id: 'specific-coins',
    question: 'Should I trade specific coins only?',
    answer: "Yes! Limiting coins helps you:\n\n- Learn price patterns better\n- Avoid overtrading\n- Focus on liquid markets\n\n**Recommendations:**\n- Beginners: BTC + ETH only\n- Intermediate: Add SOL, XRP\n- Advanced: Top 20 by volume\n\nHere's a coin filter:",
    suggestion: `**TRADING UNIVERSE**
- Only trade: BTC, ETH, SOL, XRP perpetuals
- Minimum 24h volume: $100M
- Skip coins with spread > 0.05%
- Avoid new listings (< 30 days old)`,
  },
  {
    id: 'position-sizing',
    question: 'How should I size positions?',
    answer: "Position sizing is crucial for survival:\n\n- **Fixed %** — Same size every trade (simple)\n- **Volatility-based** — Smaller when volatile\n- **Conviction-based** — Larger on A+ setups\n\nHere's a dynamic sizing approach:",
    suggestion: `**DYNAMIC POSITION SIZING**
- Base size: 3% of account
- A+ setup (all signals align): 5%
- B setup (most signals align): 3%
- C setup (mixed signals): 1.5% or skip
- High volatility (ATR > 2x normal): Reduce all by 50%`,
  },
]

// Research Agents from Marketplace
const researchAgentOptions = [
  {
    id: "futures-ta",
    name: "Futures Technical Analysis",
    description: "AI-powered technical analysis for futures trading signals",
    accuracy: "78%",
    signals: "1.2k/week",
    price: "Free",
    priceType: "free",
    recommended: true,
  },
  {
    id: "whale-tracker",
    name: "Whale Movement Tracker",
    description: "Tracks large wallet movements and exchange flows",
    accuracy: "72%",
    signals: "200/week",
    price: "$0.002/run",
    priceType: "paid",
    recommended: true,
  },
  {
    id: "sentiment-ai",
    name: "Social Sentiment AI",
    description: "Analyzes Twitter, Discord, and news sentiment",
    accuracy: "65%",
    signals: "500/week",
    price: "$0.001/run",
    priceType: "paid",
    recommended: true,
  },
  {
    id: "funding-rate",
    name: "Funding Rate Scanner",
    description: "Monitors funding rates across exchanges for arbitrage",
    accuracy: "81%",
    signals: "100/week",
    price: "Free",
    priceType: "free",
    recommended: false,
  },
  {
    id: "liquidation-map",
    name: "Liquidation Heatmap",
    description: "Predicts liquidation clusters and stop hunts",
    accuracy: "69%",
    signals: "300/week",
    price: "$0.003/run",
    priceType: "paid",
    recommended: false,
  },
]

export default function CreateTradingAgentPage() {
  const { isConnected, setIsWalletModalOpen } = useWallet()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showApiSecret, setShowApiSecret] = useState(false)
  const [formData, setFormData] = useState({
    agentName: "",
    agentDescription: "",
    exchange: "",
    apiKey: "",
    apiSecret: "",
    apiPassphrase: "",
    tokens: [] as string[],
    cycle: "",
    style: "",
    llmProvider: "",
    customPrompt: `**POSITION DIRECTION RULES:**
**REVERSAL CONSTRAINT**: Reversing a position (LONG→SHORT or SHORT→LONG) incurs DOUBLE fees. Follow these rules:
**Primary Trend Authority**: The 1h timeframe trend is authoritative for direction decisions.
If 1h trend is UP → Only LONG or HOLD or EXIT allowed
If 1h trend is DOWN → Only SHORT or HOLD or EXIT allowed
If 1h trend is SIDEWAYS → HOLD or EXIT preferred
**Orderbook Data Usage**: Orderbook imbalance should ONLY influence:
Position SIZE (larger when favorable, smaller when unfavorable)
Entry TIMING (wait for better entry if orderbook unfavorable)
NEVER use orderbook alone to decide direction reversal
**Existing Position Rule**:
If a FILLED position already exists in SAME direction as market trend → choose HOLD
Example: Have LONG + 1h trend UP → HOLD (not LONG again)
Note: Pending limit orders do not count as existing position (Position-Status shows NONE)
**Reversal Requirements**: To reverse, ALL conditions must be met:
Primary (1h) trend has clearly reversed
Multiple timeframes align with new direction
Expected profit from reversal > 2x round-trip fees
**WHEN TO CHOOSE HOLD**:
Position exists and aligns with 1h trend
Short-term signals conflict with primary trend
Orderbook temporarily unfavorable but trend intact
**WHEN TO CHOOSE EXIT**:
PnL ≥80% of take-profit target
1h trend confirms reversal (not just pause)
Margin ratio >95% or liquidation distance <10%
**EXAMPLE DECISION**:
"The 1h trend is UP and I already have a LONG position, so I choose HOLD. The orderbook shows temporary sell pressure, but this doesn't change the primary trend direction."`,
    researchAgents: [] as string[],
  })

  const totalSteps = 3
  const [showAllAgents, setShowAllAgents] = useState(false)
  const [showAllQuestions, setShowAllQuestions] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{role: string, text: string, suggestion?: string}>>([
    { 
      role: 'assistant', 
      text: "Hi! I'm here to help you configure your trading agent. I see you've selected Balanced style - this is great for most traders. Do you want me to explain the differences between styles, or help you customize your prompt?" 
    },
    { 
      role: 'user', 
      text: "I want to trade XRP specifically, and I prefer to wait for strong confirmations before entering." 
    },
    { 
      role: 'assistant', 
      text: "Great choice! For XRP-specific trading with strong confirmations, I'd suggest adding these rules to your Custom Prompt:",
      suggestion: `**XRP-SPECIFIC RULES**
- Only trade XRPUSDT perpetual
- Require BTC trend alignment (XRP follows BTC)
- Wait for 2-candle close above resistance
- Check XRP funding rate before entry`
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [promptTab, setPromptTab] = useState<"custom" | "system" | "preview">("custom")
  const [isAssistantCollapsed, setIsAssistantCollapsed] = useState(false)

  const displayedAgents = showAllAgents ? researchAgentOptions : researchAgentOptions.filter(a => a.recommended)
  const displayedQuestions = showAllQuestions ? PRESET_QA : PRESET_QA.slice(0, 3)

  const llmProviders = [
    { value: "deepseek", label: "deepseek / deepseek-chat" },
    { value: "gemini", label: "google / gemini-3-flash-preview" },
  ]

  // Trading Styles with systemPrompt and defaultCustomPrompt
  const TRADING_STYLES = {
    conservative: {
      name: "Conservative",
      description: "Lower risk, fewer trades, strict confirmations",
      riskProfile: {
        positionSize: "1-2% per trade",
        stopLoss: "1-2%",
        takeProfit: "3:1 minimum",
      },
      systemPrompt: `**RISK MANAGEMENT (CONSERVATIVE)**
You are a conservative trading agent. Capital preservation is your PRIMARY objective.

**POSITION SIZING**
- Maximum position size: 2% of account per trade
- Scale in gradually: Start with 50% of intended size
- Never add to losing positions

**ENTRY REQUIREMENTS (ALL must be met)**
- Primary trend (4h) must align with trade direction
- Minimum 3 confirmation signals required
- Volume must be >1.5x 20-period average
- Wait for pullback to support/resistance before entry
- RSI must not be in overbought/oversold extremes

**EXIT RULES**
- Stop loss: Maximum 2% from entry (tight stops)
- Take profit: Minimum 3:1 risk/reward ratio
- Trail stop after 1.5:1 profit reached
- Exit immediately if primary trend reverses

**FORBIDDEN ACTIONS**
- Never chase price after breakout
- Never trade against 4h trend
- Never hold through major news events
- Never exceed 2 concurrent positions`,
      defaultCustomPrompt: `**ENTRY TIMING**
- Wait for 2 candle close above/below key level
- Require volume spike on breakout
- Prefer entries during London/NY overlap

**MARKET CONDITIONS**
- Avoid trading when BTC dominance is shifting rapidly
- Reduce size by 50% during high volatility (ATR > 2x normal)
- Skip trades if funding rate is extreme (>0.1%)

**SPECIFIC RULES FOR THIS AGENT**
- Focus on major pairs only (BTC, ETH, SOL)
- Prefer trend continuation over reversal trades
- Use 1h timeframe for entry, 4h for trend direction`,
    },
    balanced: {
      name: "Balanced",
      description: "Moderate risk, balanced approach",
      riskProfile: {
        positionSize: "3-5% per trade",
        stopLoss: "2-3%",
        takeProfit: "2:1 target",
      },
      systemPrompt: `**RISK MANAGEMENT (BALANCED)**
You are a balanced trading agent. Aim for consistent returns with controlled risk.

**POSITION SIZING**
- Standard position size: 3-5% of account per trade
- Can scale in/out based on conviction
- Add to winners only, never losers

**ENTRY REQUIREMENTS (2 of 3 must be met)**
- Trend alignment on 1h timeframe
- Volume confirmation (>1.2x average)
- Key level breakout or bounce

**EXIT RULES**
- Stop loss: 2-3% from entry
- Take profit: Target 2:1 risk/reward
- Partial profit at 1:1, let rest run
- Use trailing stop after 1.5:1

**POSITION MANAGEMENT**
- Can hold up to 3 concurrent positions
- Reduce exposure if correlation is high
- Close weakest position if drawdown > 5%`,
      defaultCustomPrompt: `**ENTRY TIMING**
- Enter on breakout + 1 candle confirmation
- Can enter on strong momentum without pullback
- Use limit orders 0.5% below breakout for better entry

**MARKET CONDITIONS**
- Trade both trending and ranging markets
- Adjust position size based on volatility
- Reduce activity during unclear market structure

**SPECIFIC RULES FOR THIS AGENT**
- Trade top 20 coins by market cap
- Balance between trend following and mean reversion
- 1h timeframe primary, 15m for fine-tuning entry`,
    },
    aggressive: {
      name: "Aggressive",
      description: "Higher risk, more trades, quick entries",
      riskProfile: {
        positionSize: "5-10% per trade",
        stopLoss: "3-5%",
        takeProfit: "1.5:1 target",
      },
      systemPrompt: `**RISK MANAGEMENT (AGGRESSIVE)**
You are an aggressive trading agent. Maximize gains while accepting higher volatility.

**POSITION SIZING**
- Standard position size: 5-10% of account per trade
- Can use up to 20% for high-conviction setups
- Pyramiding allowed on strong trends

**ENTRY REQUIREMENTS (1 is sufficient)**
- Clear momentum in intended direction
- OR breakout of key level
- OR strong divergence signal

**EXIT RULES**
- Stop loss: 3-5% from entry (give room to breathe)
- Take profit: 1.5:1 risk/reward minimum
- Quick partial profits to lock in gains
- Can hold through minor pullbacks

**POSITION MANAGEMENT**
- Up to 5 concurrent positions allowed
- Can concentrate in one sector if thesis is strong
- Aggressive add to winners strategy`,
      defaultCustomPrompt: `**ENTRY TIMING**
- Enter immediately on signal, don't wait for confirmation
- Chase momentum when volume confirms
- Use market orders for fast execution

**MARKET CONDITIONS**
- Trade any market condition
- Increase size during high volatility
- Take advantage of funding rate arbitrage

**SPECIFIC RULES FOR THIS AGENT**
- Trade any coin with sufficient liquidity
- Favor momentum and breakout strategies
- 15m timeframe primary, scalp on 5m when appropriate
- Accept wider stops for bigger potential gains`,
    },
  }

  // Strategy presets with their core rules (for conflict detection)
  const strategyPresets = {
    conservative: {
      name: "Conservative",
      rules: [
        { key: "position_size", value: "max 5% per trade", description: "Maximum 5% capital per trade" },
        { key: "entry_confirmation", value: "3+ signals required", description: "Require 3+ confirming signals before entry" },
        { key: "stop_loss", value: "tight 1.5%", description: "Tight stop loss at 1.5%" },
        { key: "trend_authority", value: "4h timeframe", description: "4h trend is authoritative" },
      ]
    },
    balanced: {
      name: "Balanced",
      rules: [
        { key: "position_size", value: "max 10% per trade", description: "Maximum 10% capital per trade" },
        { key: "entry_confirmation", value: "2+ signals required", description: "Require 2+ confirming signals before entry" },
        { key: "stop_loss", value: "moderate 2.5%", description: "Moderate stop loss at 2.5%" },
        { key: "trend_authority", value: "1h timeframe", description: "1h trend is authoritative" },
      ]
    },
    aggressive: {
      name: "Aggressive",
      rules: [
        { key: "position_size", value: "max 20% per trade", description: "Maximum 20% capital per trade" },
        { key: "entry_confirmation", value: "1+ signal required", description: "Single strong signal can trigger entry" },
        { key: "stop_loss", value: "wide 4%", description: "Wide stop loss at 4%" },
        { key: "trend_authority", value: "15m timeframe", description: "15m trend is authoritative" },
      ]
    }
  }

  // Conflict detection between custom prompt and strategy preset
  const detectConflicts = useMemo(() => {
    if (!formData.style || !formData.customPrompt) return []
    
    const conflicts: Array<{
      type: "override" | "contradiction" | "enhancement"
      strategyRule: string
      customRule: string
      severity: "high" | "medium" | "low"
      resolution: string
    }> = []

    const prompt = formData.customPrompt.toLowerCase()
    const preset = strategyPresets[formData.style as keyof typeof strategyPresets]
    
    // Check for position size conflicts
    if (prompt.includes("position size") || prompt.includes("capital")) {
      if (formData.style === "conservative" && (prompt.includes("20%") || prompt.includes("15%"))) {
        conflicts.push({
          type: "contradiction",
          strategyRule: preset.rules[0].description,
          customRule: "Custom prompt specifies larger position sizes",
          severity: "high",
          resolution: "Custom prompt will override conservative 5% limit"
        })
      }
    }

    // Check for trend authority conflicts
    if (prompt.includes("1h trend") && formData.style === "conservative") {
      conflicts.push({
        type: "override",
        strategyRule: "4h trend is authoritative (Conservative)",
        customRule: "1h timeframe trend is authoritative",
        severity: "medium",
        resolution: "Custom prompt's 1h authority will be used"
      })
    }
    
    if (prompt.includes("4h trend") && formData.style === "aggressive") {
      conflicts.push({
        type: "override",
        strategyRule: "15m trend is authoritative (Aggressive)",
        customRule: "4h timeframe trend is authoritative",
        severity: "medium",
        resolution: "Custom prompt's 4h authority will be used"
      })
    }

    // Check for entry confirmation conflicts
    if (prompt.includes("breakout") && prompt.includes("confirmation")) {
      if (formData.style === "aggressive") {
        conflicts.push({
          type: "enhancement",
          strategyRule: "Single strong signal can trigger entry",
          customRule: "Requires breakout confirmation (more conservative)",
          severity: "low",
          resolution: "Custom confirmation rules will be applied"
        })
      }
    }

    // Check for stop loss conflicts  
    if (prompt.includes("stop") || prompt.includes("sl")) {
      if (prompt.includes("2%") && formData.style === "aggressive") {
        conflicts.push({
          type: "override",
          strategyRule: "Wide stop loss at 4% (Aggressive)",
          customRule: "Custom prompt specifies tighter 2% stop loss",
          severity: "medium",
          resolution: "Custom 2% stop loss will be used"
        })
      }
    }

    return conflicts
  }, [formData.style, formData.customPrompt])

  const tokens = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "DOGEUSDT", "XRPUSDT", "ADAUSDT", "LTCUSDT"]
  const cycles = ["15m", "30m"]

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStyleSelect = (style: string) => {
    updateFormData("style", style)
    // Update custom prompt with style default
    const styleData = TRADING_STYLES[style as keyof typeof TRADING_STYLES]
    if (styleData) {
      updateFormData("customPrompt", styleData.defaultCustomPrompt)
    }
  }

  // Strategy Assistant handlers
  const handlePresetQuestion = (qa: typeof PRESET_QA[0]) => {
    setChatMessages(prev => [
      ...prev,
      { role: 'user', text: qa.question },
      { role: 'assistant', text: qa.answer, suggestion: qa.suggestion },
    ])
  }

  const handleApplySuggestion = (suggestion: string) => {
    updateFormData("customPrompt", formData.customPrompt + '\n\n' + suggestion)
  }

  // Calculate estimated cost per run
  const estimatedCost = useMemo(() => {
    const selectedAgentData = formData.researchAgents.map(id => 
      researchAgentOptions.find(a => a.id === id)
    ).filter(Boolean)
    
    const allFree = selectedAgentData.every(a => a?.priceType === 'free')
    if (allFree) return 'Free'
    
    const totalCost = selectedAgentData.reduce((sum, a) => {
      if (a?.priceType === 'paid') {
        // Parse price like "$0.002/run"
        const match = a.price.match(/\$?([\d.]+)/)
        const price = match ? parseFloat(match[1]) : 0
        return sum + price
      }
      return sum
    }, 0)
    
    return `$${totalCost.toFixed(3)}/run`
  }, [formData.researchAgents])

  // Format markdown-like text for display
  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold
      const boldedLine = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#00d4aa]">$1</strong>')
      // Bullet points
      if (line.startsWith('- ')) {
        return <div key={i} className="ml-2" dangerouslySetInnerHTML={{ __html: '• ' + boldedLine.slice(2) }} />
      }
      if (line === '') {
        return <div key={i} className="h-2" />
      }
      return <div key={i} dangerouslySetInnerHTML={{ __html: boldedLine }} />
    })
  }

  const toggleResearchAgent = (agentId: string) => {
    const current = formData.researchAgents
    if (current.includes(agentId)) {
      updateFormData(
        "researchAgents",
        current.filter((id) => id !== agentId),
      )
    } else {
      updateFormData("researchAgents", [...current, agentId])
    }
  }

  const handleNext = () => {
    if (!isConnected) {
      setIsWalletModalOpen(true)
      return
    }

    if (canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleDeploy = () => {
    if (!isConnected) {
      setIsWalletModalOpen(true)
      return
    }

    const newAgent = {
      id: `ta-${Date.now()}`,
      name: formData.agentName,
      description: formData.agentDescription,
      tokens: formData.tokens,
      token: formData.tokens[0] || "", // backwards compatibility
      cycle: formData.cycle,
      platform: formData.exchange,
      llm: formData.llmProvider,
      style: formData.style,
      researchAgent: formData.researchAgents[0] || "",
      researchAgents: formData.researchAgents,
      created: new Date().toLocaleDateString(),
      totalValue: "$10,000",
      pnl: "+$0",
      isRunning: true,
      apiKey: formData.apiKey,
      customPrompt: formData.customPrompt,
    }

    const existingAgents = JSON.parse(localStorage.getItem("tradingAgents") || "[]")
    localStorage.setItem("tradingAgents", JSON.stringify([...existingAgents, newAgent]))

    router.push("/my-agents")
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        const baseValidation =
          formData.agentName.trim() !== "" &&
          formData.exchange !== "" &&
          formData.tokens.length > 0 &&
          formData.cycle !== "" &&
          formData.llmProvider !== ""

        if (formData.exchange === "aster") {
          return baseValidation && formData.apiKey !== "" && formData.apiSecret !== ""
        }
        if (formData.exchange === "weex") {
          return baseValidation && formData.apiKey !== "" && formData.apiSecret !== "" && formData.apiPassphrase !== ""
        }
        return baseValidation
      case 2:
        return formData.style !== "" && formData.researchAgents.length > 0
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-[#07070a]">
      {/* Header */}
      <header className="border-b border-[#18181f] bg-[#0a0a0e]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <ArrowLeft className="size-4 text-[#5a5a65] group-hover:text-[#00d4aa] transition-colors" />
              <span className="text-[13px] font-mono text-[#5a5a65] group-hover:text-[#a0a0ab] transition-colors">
                Back to Home
              </span>
            </Link>
            <Badge className="bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/30 font-mono text-xs px-3 py-1">
              STEP {currentStep} / {totalSteps}
            </Badge>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-[#18181f] bg-[#0a0a0e]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  idx < currentStep ? "bg-[#00d4aa]" : "bg-[#22222a]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-[#0c0c10] border border-[#18181f] rounded-xl p-8">
            {/* Step 1: Basic Trading Parameters */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-[22px] font-bold text-white mb-2">Basic Trading Parameters</h2>
                  <p className="text-[13px] text-[#5a5a65]">
                    {"Configure your Trading Agent's identity and core settings"}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <Label className="text-[13px] text-[#a0a0ab] mb-2 block">
                        Agent Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        value={formData.agentName}
                        onChange={(e) => updateFormData("agentName", e.target.value)}
                        placeholder="e.g., Alpha Hunter, Conservative Trader"
                        className="bg-[#18181f] border-[#22222a] text-white font-mono text-[13px] h-11 focus:border-[#00d4aa] placeholder:text-[#3a3a48]"
                      />
                    </div>

                    <div>
                      <Label className="text-[13px] text-[#a0a0ab] mb-2 block">Agent Description</Label>
                      <Textarea
                        value={formData.agentDescription}
                        onChange={(e) => updateFormData("agentDescription", e.target.value)}
                        placeholder="Describe your trading strategy, goals, and approach..."
                        rows={3}
                        className="bg-[#18181f] border-[#22222a] text-white font-mono text-[13px] focus:border-[#00d4aa] placeholder:text-[#3a3a48] resize-none"
                      />
                    </div>

                    <div>
                      <Label className="text-[13px] text-[#a0a0ab] mb-3 block">
                        Trading Platform <span className="text-red-400">*</span>
                      </Label>
                      <div className="space-y-3">
                        {/* Aster (BNB Chain) */}
                        <div
                          className={`rounded-lg border transition-all ${
                            formData.exchange === "aster"
                              ? "border-[#00d4aa] bg-[#00d4aa]/5"
                              : "border-[#22222a] hover:border-[#3a3a48]"
                          }`}
                        >
                          <button
                            onClick={() => {
                              updateFormData("exchange", "aster")
                              updateFormData("tokens", [])
                            }}
                            className="w-full p-4 text-left flex items-center justify-between"
                          >
                            <span className="text-[14px] font-medium text-white">Aster (BNB Chain)</span>
                            {formData.exchange === "aster" && <Check className="size-5 text-[#00d4aa]" />}
                          </button>

                          {formData.exchange === "aster" && (
                            <div className="px-4 pb-4 space-y-4 border-t border-[#22222a]/50 pt-4">
                              <div>
                                <Label className="text-[12px] text-[#5a5a65] mb-2 flex items-center gap-1.5">
                                  <span className="text-[#00d4aa]">%</span> Aster API Key{" "}
                                  <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                  type="text"
                                  value={formData.apiKey}
                                  onChange={(e) => updateFormData("apiKey", e.target.value)}
                                  placeholder="Enter your Aster API Key"
                                  className="bg-[#18181f] border-[#22222a] text-white font-mono text-[13px] h-10 focus:border-[#00d4aa] placeholder:text-[#3a3a48]"
                                />
                              </div>

                              <div>
                                <Label className="text-[12px] text-[#5a5a65] mb-2 flex items-center gap-1.5">
                                  <span className="text-[#00d4aa]">%</span> Aster API Secret{" "}
                                  <span className="text-red-400">*</span>
                                </Label>
                                <div className="relative">
                                  <Input
                                    type={showApiSecret ? "text" : "password"}
                                    value={formData.apiSecret}
                                    onChange={(e) => updateFormData("apiSecret", e.target.value)}
                                    placeholder="Enter your Aster API Secret"
                                    className="bg-[#18181f] border-[#22222a] text-white font-mono text-[13px] h-10 pr-10 focus:border-[#00d4aa] placeholder:text-[#3a3a48]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowApiSecret(!showApiSecret)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a5a65] hover:text-[#a0a0ab]"
                                  >
                                    {showApiSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                  </button>
                                </div>
                              </div>

                              <a
                                href="https://aster.finance/api"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[12px] text-[#00d4aa] hover:underline inline-flex items-center gap-1"
                              >
                                Aster API Documentation <ExternalLink className="size-3" />
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Weex (CEX) */}
                        <div
                          className={`rounded-lg border transition-all ${
                            formData.exchange === "weex"
                              ? "border-[#00d4aa] bg-[#00d4aa]/5"
                              : "border-[#22222a] hover:border-[#3a3a48]"
                          }`}
                        >
                          <button
                            onClick={() => {
                              updateFormData("exchange", "weex")
                              updateFormData("tokens", [])
                            }}
                            className="w-full p-4 text-left flex items-center justify-between"
                          >
                            <span className="text-[14px] font-medium text-white">Weex (CEX)</span>
                            {formData.exchange === "weex" && <Check className="size-5 text-[#00d4aa]" />}
                          </button>

                          {formData.exchange === "weex" && (
                            <div className="px-4 pb-4 space-y-4 border-t border-[#22222a]/50 pt-4">
                              <div>
                                <Label className="text-[12px] text-[#5a5a65] mb-2 flex items-center gap-1.5">
                                  <span className="text-[#00d4aa]">%</span> Weex API Key{" "}
                                  <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                  type="text"
                                  value={formData.apiKey}
                                  onChange={(e) => updateFormData("apiKey", e.target.value)}
                                  placeholder="Enter your Weex API Key"
                                  className="bg-[#18181f] border-[#22222a] text-white font-mono text-[13px] h-10 focus:border-[#00d4aa] placeholder:text-[#3a3a48]"
                                />
                              </div>

                              <div>
                                <Label className="text-[12px] text-[#5a5a65] mb-2 flex items-center gap-1.5">
                                  <span className="text-[#00d4aa]">%</span> Weex API Secret{" "}
                                  <span className="text-red-400">*</span>
                                </Label>
                                <div className="relative">
                                  <Input
                                    type={showApiSecret ? "text" : "password"}
                                    value={formData.apiSecret}
                                    onChange={(e) => updateFormData("apiSecret", e.target.value)}
                                    placeholder="Enter your Weex API Secret"
                                    className="bg-[#18181f] border-[#22222a] text-white font-mono text-[13px] h-10 pr-10 focus:border-[#00d4aa] placeholder:text-[#3a3a48]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowApiSecret(!showApiSecret)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a5a65] hover:text-[#a0a0ab]"
                                  >
                                    {showApiSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                  </button>
                                </div>
                              </div>

                              <div>
                                <Label className="text-[12px] text-[#5a5a65] mb-2 flex items-center gap-1.5">
                                  <span className="text-[#00d4aa]">%</span> Weex API Passphrase{" "}
                                  <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                  type="password"
                                  value={formData.apiPassphrase}
                                  onChange={(e) => updateFormData("apiPassphrase", e.target.value)}
                                  placeholder="Enter your Weex API Passphrase"
                                  className="bg-[#18181f] border-[#22222a] text-white font-mono text-[13px] h-10 focus:border-[#00d4aa] placeholder:text-[#3a3a48]"
                                />
                              </div>

                              <a
                                href="https://www.weex.com/api"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[12px] text-[#00d4aa] hover:underline inline-flex items-center gap-1"
                              >
                                Weex API Documentation <ExternalLink className="size-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Select Tokens - Multi-select */}
                    {formData.exchange && (
                      <div>
                        <Label className="text-[13px] text-[#a0a0ab] mb-2 block">
                          Select Tokens <span className="text-red-400">*</span>
                          <span className="text-[11px] text-[#5a5a65] ml-2">(Select multiple)</span>
                        </Label>
                        {formData.tokens.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {formData.tokens.map((t) => (
                              <span key={t} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00d4aa]/10 border border-[#00d4aa]/30 text-[#00d4aa] text-[11px] font-medium">
                                {t}
                                <button 
                                  onClick={() => updateFormData("tokens", formData.tokens.filter(tk => tk !== t))}
                                  className="hover:text-white"
                                >
                                  <X className="size-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          {tokens.map((token) => {
                            const isSelected = formData.tokens.includes(token)
                            return (
                              <button
                                key={token}
                                onClick={() => {
                                  if (isSelected) {
                                    updateFormData("tokens", formData.tokens.filter(t => t !== token))
                                  } else {
                                    updateFormData("tokens", [...formData.tokens, token])
                                  }
                                }}
                                className={`p-3 rounded-lg border transition-all text-[13px] font-medium flex items-center justify-between ${
                                  isSelected
                                    ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]"
                                    : "border-[#22222a] text-[#a0a0ab] hover:border-[#3a3a48]"
                                }`}
                              >
                                <span>{token}</span>
                                {isSelected && <Check className="size-4" />}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Trading Cycle */}
                    {formData.exchange && (
                      <div>
                        <Label className="text-[13px] text-[#a0a0ab] mb-3 block">
                          Trading Cycle <span className="text-red-400">*</span>
                        </Label>
                        <div className="flex gap-2">
                          {cycles.map((cycle) => (
                            <button
                              key={cycle}
                              onClick={() => updateFormData("cycle", cycle)}
                              className={`px-6 py-2.5 rounded-lg border transition-all text-[13px] font-medium ${
                                formData.cycle === cycle
                                  ? "border-[#00d4aa] bg-[#00d4aa] text-[#07070a]"
                                  : "border-[#22222a] text-[#a0a0ab] hover:border-[#3a3a48]"
                              }`}
                            >
                              {cycle}
                            </button>
                          ))}
                        </div>
                        <p className="text-[11px] text-[#5a5a65] mt-2">
                          How often your agent evaluates and executes trades
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column - LLM Provider */}
                  <div>
                    <Label className="text-[13px] text-[#a0a0ab] mb-3 block">
                      LLM Provider <span className="text-red-400">*</span>
                    </Label>
                    <div className="space-y-2">
                      {llmProviders.map((llm) => (
                        <button
                          key={llm.value}
                          onClick={() => updateFormData("llmProvider", llm.value)}
                          className={`w-full p-4 rounded-lg border transition-all text-left flex items-center justify-between ${
                            formData.llmProvider === llm.value
                              ? "border-[#00d4aa] bg-[#00d4aa]/5"
                              : "border-[#22222a] hover:border-[#3a3a48]"
                          }`}
                        >
                          <span className="text-[13px] text-white font-mono">{llm.label}</span>
                          {formData.llmProvider === llm.value && <Check className="size-5 text-[#00d4aa]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

{/* Step 2: Trading Strategy - New Layout with Strategy Assistant */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Configuration Summary - Shows Step 1 parameters */}
                <div className="p-4 rounded-lg border border-[#22222a] bg-[#0a0a0e]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] text-[#5a5a65] uppercase tracking-wide">Step 1 Configuration</span>
                    <button onClick={() => setCurrentStep(1)} className="text-[11px] text-[#00d4aa] hover:underline">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-[10px] text-[#5a5a65] mb-1">Platform</div>
                      <div className="text-[12px] text-white font-medium capitalize">{formData.exchange || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#5a5a65] mb-1">Trading Tokens</div>
                      <div className="flex flex-wrap gap-1">
                        {formData.tokens.length > 0 ? formData.tokens.map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/30">{t}</span>
                        )) : <span className="text-[12px] text-[#5a5a65]">N/A</span>}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#5a5a65] mb-1">Cycle</div>
                      <div className="text-[12px] text-white font-medium">{formData.cycle || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#5a5a65] mb-1">LLM Provider</div>
                      <div className="text-[12px] text-white font-medium uppercase">{formData.llmProvider || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Main Content */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <h2 className="text-[22px] font-bold text-white mb-2 font-mono">Trading Strategy</h2>
                      <p className="text-[13px] text-[#5a5a65]">Select research agents and define your trading style</p>
                    </div>

                    {/* Research Agents from Marketplace */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-[11px] text-[#5a5a65] uppercase tracking-wide">
                          Research Agents <span className="text-[#00d4aa]">({formData.researchAgents.length} selected)</span>
                        </Label>
                        <span className="text-[10px] text-[#5a5a65]">From Marketplace</span>
                      </div>
                      
                      <div className="space-y-2">
                        {displayedAgents.map((agent) => (
                          <button
                            key={agent.id}
                            onClick={() => toggleResearchAgent(agent.id)}
                            className={`w-full p-3.5 rounded-lg border transition-all text-left ${
                              formData.researchAgents.includes(agent.id)
                                ? "border-[#00d4aa] bg-[#00d4aa]/5"
                                : "border-[#22222a] hover:border-[#3a3a48]"
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                  formData.researchAgents.includes(agent.id)
                                    ? "border-[#00d4aa] bg-[#00d4aa]"
                                    : "border-[#3a3a48]"
                                }`}
                              >
                                {formData.researchAgents.includes(agent.id) && <Check className="size-2.5 text-[#07070a]" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[13px] font-semibold text-white">{agent.name}</span>
                                  {agent.recommended && (
                                    <Badge className="bg-[#00d4aa]/10 text-[#00d4aa] border-0 text-[9px] px-1.5 py-0">
                                      Recommended
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#5a5a65] mt-0.5">{agent.description}</p>
                              </div>
                            </div>
                            <div className="flex gap-4 text-[10px] text-[#5a5a65] ml-7">
                              <span>Accuracy: <span className="text-[#00d4aa]">{agent.accuracy}</span></span>
                              <span>{agent.signals}</span>
                              <span className={`ml-auto ${agent.priceType === 'free' ? 'text-[#00d4aa]' : 'text-yellow-400'}`}>
                                {agent.price}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Show more/less agents */}
                      <button
                        onClick={() => setShowAllAgents(!showAllAgents)}
                        className="w-full p-3 mt-2 border border-dashed border-[#3a3a48] rounded-lg text-[#5a5a65] hover:text-white hover:border-[#5a5a65] transition-colors text-[11px]"
                      >
                        {showAllAgents ? 'Show less' : `Show ${researchAgentOptions.length - 3} more agents`}
                      </button>

                      {/* Cost Summary */}
                      {formData.researchAgents.length > 0 && (
                        <div className="flex items-center justify-between mt-3 p-3 bg-[#18181f] rounded-lg text-[11px]">
                          <span className="text-[#5a5a65]">{formData.researchAgents.length} agent{formData.researchAgents.length > 1 ? 's' : ''} selected</span>
                          <span>Est. cost: <span className="text-[#00d4aa]">{estimatedCost}</span></span>
                        </div>
                      )}
                    </div>

                    {/* Trading Style Selection */}
                    <div>
                      <Label className="text-[11px] text-[#5a5a65] uppercase tracking-wide mb-3 block">Select Trading Style</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {Object.entries(TRADING_STYLES).map(([key, style]) => (
                          <button
                            key={key}
                            onClick={() => handleStyleSelect(key)}
                            className={`p-4 rounded-lg border transition-all text-left ${
                              formData.style === key
                                ? "border-[#00d4aa] bg-[#141a17]"
                                : "border-[#22222a] hover:border-[#3a3a48] bg-[#0d1210]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[14px] font-semibold text-white">{style.name}</span>
                              {formData.style === key && (
                                <div className="size-[18px] rounded-full bg-[#00d4aa] flex items-center justify-center">
                                  <Check className="size-2.5 text-[#07070a]" />
                                </div>
                              )}
                            </div>
                            <p className="text-[12px] text-[#5a5a65] mb-3">{style.description}</p>
                            <div className="text-[11px] text-[#5a5a65] space-y-1">
                              <div>Position: <span className="text-white">{style.riskProfile.positionSize}</span></div>
                              <div>Stop Loss: <span className="text-white">{style.riskProfile.stopLoss}</span></div>
                              <div>Target: <span className="text-white">{style.riskProfile.takeProfit}</span></div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Trading Prompt with Tabs */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-[11px] text-[#5a5a65] uppercase tracking-wide">Trading Prompt</Label>
                        <span className="text-[10px] text-[#00d4aa]">Ask AI Assistant for help →</span>
                      </div>
                      
                      {/* Tabs */}
                      <div className="flex border-b border-[#22222a]">
                        {[
                          { id: "custom" as const, label: "Custom Prompt", editable: true },
                          { id: "system" as const, label: "Base Rules (Read-only)" },
                          { id: "preview" as const, label: "Full Preview" },
                        ].map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setPromptTab(tab.id)}
                            className={`px-5 py-3 text-[13px] border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
                              promptTab === tab.id
                                ? "border-[#00d4aa] text-white"
                                : "border-transparent text-[#5a5a65] hover:text-white"
                            }`}
                          >
                            {tab.label}
                            {tab.editable && <span className="text-[10px] text-[#00d4aa]">&#9998;</span>}
                          </button>
                        ))}
                      </div>

                      {/* Tab Content */}
                      <div className="rounded-b-lg border border-t-0 border-[#22222a] bg-[#0d1210]">
                        {/* Custom Prompt Tab */}
                        {promptTab === "custom" && (
                          <div>
                            {/* Toolbar */}
                            <div className="flex gap-1 p-2 border-b border-[#22222a]">
                              {["B", "I", "S", "|", "H1", "H2", "H3", "|", "=", "•", "|", "<>", '""'].map((btn, i) => (
                                <button
                                  key={i}
                                  className={`px-2.5 py-1.5 rounded text-[12px] ${
                                    btn === "|" 
                                      ? "text-[#2d3d36] cursor-default px-1" 
                                      : "border border-[#2d3d36] text-[#5a5a65] hover:text-white"
                                  }`}
                                >
                                  {btn}
                                </button>
                              ))}
                              <div className="ml-auto flex gap-1">
                                <button className="px-2.5 py-1.5 rounded border border-[#2d3d36] text-[#5a5a65] hover:text-white text-[12px]">&#8617;</button>
                                <button className="px-2.5 py-1.5 rounded border border-[#2d3d36] text-[#5a5a65] hover:text-white text-[12px]">&#8618;</button>
                              </div>
                            </div>
                            
                            {/* Editor */}
                            <Textarea
                              value={formData.customPrompt}
                              onChange={(e) => updateFormData("customPrompt", e.target.value)}
                              className="border-0 bg-transparent text-[12px] text-[#c8c8c8] font-mono p-4 resize-y focus-visible:ring-0 focus-visible:ring-offset-0 leading-[1.8] min-h-[280px]"
                            />
                            
                          </div>
                        )}

                        {/* System Prompt Tab */}
                        {promptTab === "system" && (
                          <div>
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[#22222a] bg-[#141a17]">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-[#0d2818] text-[#00d4aa] border-0 text-[11px]">
                                  {formData.style ? TRADING_STYLES[formData.style as keyof typeof TRADING_STYLES]?.name : "Select a style"}
                                </Badge>
                                <span className="text-[12px] text-[#5a5a65]">Base Rules</span>
                              </div>
                              <Badge className="bg-[#1a1a1a] text-[#5a5a65] border-0 text-[10px]">
                                <Lock className="size-2.5 mr-1" /> Read-only
                              </Badge>
                            </div>
                            <div className="p-4 font-mono text-[12px] leading-[1.8] text-[#5a5a65] min-h-[280px] whitespace-pre-wrap">
                              {formData.style 
                                ? TRADING_STYLES[formData.style as keyof typeof TRADING_STYLES]?.systemPrompt 
                                : "Select a trading style to view base rules"}
                            </div>
                          </div>
                        )}

                        {/* Full Preview Tab */}
                        {promptTab === "preview" && (
                          <div>
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[#22222a] bg-[#141a17]">
                              <span className="text-[12px] text-[#5a5a65]">Complete prompt that will be used for trading</span>
                              <button className="px-2.5 py-1 rounded border border-[#2d3d36] text-[#5a5a65] hover:text-white text-[11px]">
                                Copy
                              </button>
                            </div>
                            <div className="p-4 font-mono text-[12px] leading-[1.8] min-h-[280px] max-h-[400px] overflow-auto">
                              {/* Base Rules Section */}
                              <div className="mb-6 pb-6 border-b border-dashed border-[#2d3d36]">
                                <div className="text-[10px] text-[#00d4aa] mb-2 uppercase tracking-wider">
                                  ▼ BASE RULES ({formData.style ? TRADING_STYLES[formData.style as keyof typeof TRADING_STYLES]?.name.toUpperCase() : "NONE"})
                                </div>
                                <div className="text-[#5a5a65] whitespace-pre-wrap">
                                  {formData.style 
                                    ? TRADING_STYLES[formData.style as keyof typeof TRADING_STYLES]?.systemPrompt 
                                    : "Select a trading style"}
                                </div>
                              </div>
                              {/* Custom Rules Section */}
                              <div>
                                <div className="text-[10px] text-yellow-500 mb-2 uppercase tracking-wider">
                                  ▼ CUSTOM RULES (EDITABLE)
                                </div>
                                <div className="text-[#c8c8c8] whitespace-pre-wrap">
                                  {formData.customPrompt}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Conflict Detection */}
                    {formData.style && detectConflicts.length > 0 && (
                      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="size-4 text-yellow-400" />
                          <span className="text-[12px] font-medium text-yellow-400">
                            {detectConflicts.length} conflict{detectConflicts.length > 1 ? 's' : ''} detected
                          </span>
                        </div>
                        <div className="space-y-2">
                          {detectConflicts.slice(0, 2).map((conflict, idx) => (
                            <div key={idx} className="text-[11px] text-[#a0a0ab]">
                              <span className="text-yellow-400">{conflict.type}:</span> {conflict.customRule}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Strategy Assistant */}
                  <div className={`transition-all duration-300 ${isAssistantCollapsed ? "lg:col-span-1" : "lg:col-span-5"}`}>
                    <div className={`rounded-xl border border-[#1a2420] bg-[#0d1210] sticky top-4 flex flex-col transition-all duration-300 ${isAssistantCollapsed ? "p-3" : "p-5"}`} style={{ minHeight: isAssistantCollapsed ? "auto" : "700px" }}>
{isAssistantCollapsed ? (
                        <div className="flex flex-col items-center h-full min-h-[200px] py-4">
                          <button
                            onClick={() => setIsAssistantCollapsed(false)}
                            className="flex flex-col items-center gap-2 px-2 py-3 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/30 hover:bg-[#00d4aa]/20 hover:border-[#00d4aa]/50 transition-all cursor-pointer group"
                          >
                            <ChevronLeft className="w-5 h-5 text-[#00d4aa] group-hover:text-[#00d4aa] transition-colors" />
                            <div className="text-[10px] font-medium text-[#00d4aa] tracking-wide transition-colors" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
                              AI Assistant
                            </div>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="mb-4 flex items-start justify-between">
                            <div>
                              <h3 className="text-[16px] font-semibold text-white">Strategy Assistant</h3>
                              <p className="text-[12px] text-[#6b7c74]">Help me configure your trading agent</p>
                            </div>
                            <button
                              onClick={() => setIsAssistantCollapsed(true)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#141a17] transition-colors"
                            >
                              <ChevronRight className="w-5 h-5 text-[#6b7c74]" />
                            </button>
                          </div>

                          {/* Current Selection Summary */}
                          {(formData.style || formData.researchAgents.length > 0) && (
                            <div className="p-3 bg-[#141a17] rounded-lg mb-4">
                              <div className="text-[11px] text-[#6b7c74] uppercase tracking-wide mb-3">Current Configuration</div>
                              
                              {/* Research Agents */}
                              {formData.researchAgents.length > 0 && (
                                <div className="mb-3">
                                  <div className="text-[11px] text-[#6b7c74] mb-1.5">Research Agents ({formData.researchAgents.length})</div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {formData.researchAgents.map(id => {
                                      const agent = researchAgentOptions.find(a => a.id === id)
                                      return (
                                        <Badge key={id} className="bg-[#1a2420] text-white border-0 text-[10px] px-2 py-0.5">
                                          {agent?.name.split(' ').slice(0, 2).join(' ')}
                                        </Badge>
                                      )
                                    })}
                                  </div>
                                  <div className="text-[10px] text-[#6b7c74] mt-1.5">
                                    Est. cost: <span className="text-[#00d4aa]">{estimatedCost}</span>
                                  </div>
                                </div>
                              )}

                              {/* Trading Style */}
                              {formData.style && (
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge className="bg-[#0d2818] text-[#00d4aa] border-0 text-[11px] font-semibold px-2.5">
                                      {TRADING_STYLES[formData.style as keyof typeof TRADING_STYLES]?.name}
                                    </Badge>
                                    <span className="text-[11px] text-[#6b7c74]">Trading Style</span>
                                  </div>
                                  <div className="text-[10px] text-[#6b7c74] ml-0.5">
                                    {TRADING_STYLES[formData.style as keyof typeof TRADING_STYLES]?.riskProfile.positionSize} · {TRADING_STYLES[formData.style as keyof typeof TRADING_STYLES]?.riskProfile.stopLoss} SL · {TRADING_STYLES[formData.style as keyof typeof TRADING_STYLES]?.riskProfile.takeProfit}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Chat Messages */}
                          <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-3">
                            {chatMessages.map((msg, i) => (
                              <div 
                                key={i} 
                                className={`p-3.5 rounded-lg ${
                                  msg.role === 'user' 
                                    ? 'bg-[#1a2420]' 
                                    : 'bg-[#141a17] border-l-2 border-[#00d4aa]'
                                }`}
                              >
                                <div className="text-[11px] text-[#6b7c74] mb-1.5">
                                  {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                </div>
                                <div className="text-[13px] text-white leading-[1.6]">
                                  {formatMessage(msg.text)}
                                </div>
                                
                                {/* Suggestion with Apply button */}
                                {msg.suggestion && (
                                  <div className="mt-3 p-3 bg-[#0a0f0d] rounded-md border border-[#00d4aa]/30">
                                    <div className="text-[11px] text-[#6b7c74] mb-2">Suggested addition to Custom Prompt:</div>
                                    <pre className="text-[12px] font-mono text-[#00d4aa] whitespace-pre-wrap mb-3 leading-[1.6]">{msg.suggestion}</pre>
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleApplySuggestion(msg.suggestion!)}
                                      className="bg-[#00d4aa] text-[#0a0f0d] hover:bg-[#00d4aa]/90 text-[11px] h-7 font-semibold"
                                    >
                                      + Add to Custom Prompt
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Quick Questions - Pill style with all 10 */}
                          <div className="mb-3">
                            <div className="text-[11px] text-[#6b7c74] mb-2">Quick questions:</div>
                            <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
                              {PRESET_QA.map(qa => (
                                <button
                                  key={qa.id}
                                  onClick={() => handlePresetQuestion(qa)}
                                  className="px-2.5 py-1.5 rounded-full border border-[#2d3d36] text-[10px] text-[#6b7c74] hover:border-[#00d4aa] hover:text-white transition-colors"
                                >
                                  {qa.question}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Chat Input */}
                          <div className="flex gap-2 p-3 bg-[#141a17] rounded-lg mt-auto">
                            <Input
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              placeholder="Ask Question..."
                              className="flex-1 bg-transparent border-0 text-[13px] text-white placeholder:text-[#6b7c74] focus-visible:ring-0"
                            />
                            <Button size="sm" className="bg-[#00d4aa] text-[#0a0f0d] hover:bg-[#00d4aa]/90 size-8 p-0 rounded-full">
                              <ArrowRight className="size-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Connect & Deploy */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-[22px] font-bold text-white mb-2">Connect & Deploy</h2>
                  <p className="text-[13px] text-[#5a5a65]">Review your configuration and deploy your trading agent</p>
                </div>

                {/* Configuration Summary Card */}
                <div className="rounded-lg border border-[#22222a] overflow-hidden">
                  <div className="divide-y divide-[#22222a]">
                    <div className="p-4 bg-[#00d4aa]/5 border-b border-[#00d4aa]/20">
                      <span className="text-[11px] text-[#00d4aa] uppercase tracking-wide font-medium">Step 1: Basic Parameters</span>
                    </div>
                    <div className="flex justify-between items-center p-4">
                      <span className="text-[13px] text-[#5a5a65]">Agent Name</span>
                      <span className="text-[14px] text-white font-medium">{formData.agentName || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center p-4">
                      <span className="text-[13px] text-[#5a5a65]">Platform</span>
                      <span className="text-[14px] text-white font-medium capitalize">{formData.exchange || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-start p-4">
                      <span className="text-[13px] text-[#5a5a65]">Trading Tokens</span>
                      <div className="flex flex-wrap gap-1.5 justify-end max-w-[60%]">
                        {formData.tokens.length > 0 ? (
                          formData.tokens.map(t => (
                            <Badge key={t} className="bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/30 text-[11px] px-2 py-0.5">
                              {t}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-[14px] text-white font-medium">N/A</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4">
                      <span className="text-[13px] text-[#5a5a65]">Cycle Time</span>
                      <span className="text-[14px] text-white font-medium">{formData.cycle || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center p-4">
                      <span className="text-[13px] text-[#5a5a65]">LLM</span>
                      <span className="text-[14px] text-white font-medium uppercase">
                        {formData.llmProvider === "gemini" ? "GEMINI" : formData.llmProvider?.toUpperCase() || "N/A"}
                      </span>
                    </div>
                    <div className="p-4 bg-[#00d4aa]/5 border-y border-[#00d4aa]/20">
                      <span className="text-[11px] text-[#00d4aa] uppercase tracking-wide font-medium">Step 2: Trading Strategy</span>
                    </div>
                    <div className="flex justify-between items-center p-4">
                      <span className="text-[13px] text-[#5a5a65]">Trading Style</span>
                      <span className="text-[14px] text-white font-medium capitalize">{formData.style || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-start p-4">
                      <span className="text-[13px] text-[#5a5a65]">Research Agents</span>
                      <div className="flex flex-wrap gap-1.5 justify-end max-w-[60%]">
                        {formData.researchAgents.length > 0 ? (
                          formData.researchAgents.map(id => {
                            const agent = researchAgentOptions.find(a => a.id === id)
                            return (
                              <Badge key={id} className="bg-[#22222a] text-white border-0 text-[11px] px-2 py-0.5">
                                {agent?.name.split(' ').slice(0, 2).join(' ')}
                              </Badge>
                            )
                          })
                        ) : (
                          <span className="text-[14px] text-white font-medium">None</span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[13px] text-[#5a5a65]">Custom Prompt</span>
                        <span className="text-[11px] text-[#5a5a65]">{formData.customPrompt.length} chars</span>
                      </div>
                      <div className="p-3 bg-[#12121a] rounded-lg">
                        <p className="text-[12px] text-[#a0a0ab] font-mono leading-relaxed">
                          {formData.customPrompt.slice(0, 200)}{formData.customPrompt.length > 200 ? '...' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ready to Deploy Card */}
                <div className="rounded-lg border border-[#00d4aa]/30 bg-[#00d4aa]/5 p-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="size-5 text-[#00d4aa] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[14px] font-semibold text-[#00d4aa] mb-1">Ready to Deploy</h4>
                      <p className="text-[12px] text-[#5a5a65]">
                        Your Trading Agent will start executing trades based on Research Agent signals immediately after
                        deployment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#18181f]">
              <Button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                variant="outline"
                className="border-[#22222a] text-[#a0a0ab] hover:bg-[#18181f] hover:text-white font-mono text-[13px] h-10 px-4 bg-transparent disabled:opacity-30"
              >
                <ArrowLeft className="size-4 mr-2" />
                Back
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-transparent border border-[#00d4aa] text-[#00d4aa] hover:bg-[#00d4aa]/10 font-mono text-[13px] h-10 px-6 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleDeploy}
                  disabled={!canProceed()}
                  className="bg-transparent border border-[#00d4aa] text-[#00d4aa] hover:bg-[#00d4aa]/10 font-mono text-[13px] h-10 px-6 disabled:opacity-30"
                >
                  <Zap className="size-4 mr-2" />
                  Deploy Trading Agent
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
