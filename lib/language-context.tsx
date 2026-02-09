"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "zh" | "ja" | "ko" | "es" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.marketplace": "Marketplace",
    "nav.myAgents": "My Agents",
    "nav.features": "Features",
    "nav.leaderboard": "Leaderboard",
    "nav.connectWallet": "Connect Wallet",
    "nav.settings": "Settings",
    "nav.logout": "Logout",

    // Hero
    "hero.badge": "AGENTIC TRADING INFRASTRUCTURE",
    "hero.title": "Deploy AI Agents, Trade Autonomously",
    "hero.subtitle": "Agentic Trading infrastructure for Perp DEX, CEX and prediction market",
    "hero.createTradingAgent": "Create Trading Agent",
    "hero.createResearchAgent": "Create Research Agent",

    // Research Agents
    "research.title": "On-Chain Intelligence,",
    "research.subtitle": "Traceable and Verifiable",
    "research.description":
      "Research Agents are specialized AI agents built on Hubble Data Engine and minted on-chain through ERC-8004.",
    "research.exampleTitle": "Example Research Query",

    // Trading Agents
    "trading.title": "Fully Autonomous",
    "trading.subtitle": "Trading Agent",
    "trading.description": "Trading Agents collaborate with Research Agents through",

    // Infrastructure
    "infra.badge": "INFRASTRUCTURE",
    "infra.title": "Agentic Trading Stack",
    "infra.subtitle": "Built on modular infrastructure for autonomous trading",

    // CTA
    "cta.title": "Try Agentic Trading",
    "cta.subtitle": "Join traders leveraging AI agents for autonomous trading",
    "cta.button": "Create Trading Agent",

    // Settings
    "settings.title": "Settings",
    "settings.username": "User Name",
    "settings.language": "Language",
    "settings.cancel": "Cancel",
    "settings.save": "Save Changes",

    // Agent Cards
    "agent.type": "Type",
    "agent.token": "Token",
    "agent.timeframe": "Timeframe",
    "agent.llm": "LLM",
    "agent.created": "Created",
    "agent.accuracy": "Accuracy",
    "agent.calls": "Calls",
    "agent.revenue": "Revenue",
    "agent.pricePerCall": "Price per call",
    "agent.public": "Public",
    "agent.private": "Private",
    "agent.owner": "Owner",

    // Marketplace
    "marketplace.title": "Research Agent Marketplace",
    "marketplace.subtitle": "Discover and use AI-driven market analysis agents",
    "marketplace.createAgent": "Create Agent",
    "marketplace.byOwner": "By",

    // My Agents
    "myAgents.title": "My Agents",
    "myAgents.subtitle": "Manage Your Trading and Research Agents",
    "myAgents.trading": "Trading",
    "myAgents.research": "Research",
    "myAgents.tradingAgents": "Trading Agents",
    "myAgents.tradingSubtitle": "Active agents trading on your behalf",
    "myAgents.researchAgents": "Research Agents",
    "myAgents.researchSubtitle": "Your AI analysis agents",
    "myAgents.newAgent": "New Agent",
    "myAgents.totalValue": "Total Value",
    "myAgents.pnl": "P&L",
    "myAgents.token": "Token",
    "myAgents.cycle": "Cycle",
    "myAgents.market": "Market",
    "myAgents.status": "Status",

    // Leaderboard
    "leaderboard.title": "Leaderboard",
    "leaderboard.subtitle": "Top agents in the Hubble ecosystem",
    "leaderboard.researchAgents": "Research Agents",
    "leaderboard.tradingAgents": "Trading Agents",
    "leaderboard.owner": "Owner",
    "leaderboard.viewDetails": "View Details",
    "leaderboard.note": "Note:",
    "leaderboard.noteText":
      "Only public trading agents are displayed. Users can choose to make their AI trading terminal public to appear on the leaderboard.",
    "leaderboard.trades": "Trades",
    "leaderboard.winRate": "Win Rate",
    "leaderboard.return": "Return",

    // Research Detail
    "researchDetail.backToMarketplace": "Back to Marketplace",
    "researchDetail.basicInfo": "Basic Info",
    "researchDetail.performance": "Performance Metrics",
    "researchDetail.dataSources": "Data Sources",
    "researchDetail.historicalTrack": "Historical Track Record",
    "researchDetail.runAgent": "Run Agent",
    "researchDetail.description": "Description",
    "researchDetail.timeCreated": "Time Created",
    "researchDetail.totalRevenue": "Total Revenue",
    "researchDetail.dataSource": "Data Source",
    "researchDetail.prompt": "Prompt",
    "researchDetail.deploymentInfo": "Deployment Info",
    "researchDetail.visibility": "Visibility",
    "researchDetail.callHistory": "Call History",
    "researchDetail.time": "Time",
    "researchDetail.output": "Output",
    "researchDetail.user": "User",
    "researchDetail.bullish": "Bullish",
    "researchDetail.bearish": "Bearish",
    "researchDetail.neutral": "Neutral",
    "researchDetail.analysisResult": "Analysis Result",
    "researchDetail.close": "Close",
    "researchDetail.payment": "Payment Confirmation",
    "researchDetail.paymentText": "Running this agent requires payment via the X402 micro-payment protocol",
    "researchDetail.confirm": "Confirm Payment",
    "researchDetail.filterAll": "All",
    "researchDetail.filterBuy": "Buy",
    "researchDetail.filterSell": "Sell",
    "researchDetail.filterNeutral": "Neutral",

    // Trading Terminal
    "terminal.title": "AI Trading Terminal",
    "terminal.backToLeaderboard": "Back to Leaderboard",
    "terminal.accountValue": "Account Value",
    "terminal.modelChats": "Model Chats",
    "terminal.all": "All",
    "terminal.totalAssets": "Total Assets",
    "terminal.orders": "Orders",
    "terminal.positions": "Positions",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.connect": "Connect",
    "common.live": "Live",
  },
  zh: {
    // Navigation
    "nav.marketplace": "市场",
    "nav.myAgents": "我的代理",
    "nav.features": "功能",
    "nav.leaderboard": "排行榜",
    "nav.connectWallet": "连接钱包",
    "nav.settings": "设置",
    "nav.logout": "退出登录",

    // Hero
    "hero.badge": "智能交易基础设施",
    "hero.title": "部署AI代理，自主交易",
    "hero.subtitle": "为永续DEX、CEX和预测市场提供的智能交易基础设施",
    "hero.createTradingAgent": "创建交易代理",
    "hero.createResearchAgent": "创建研究代理",

    // Research Agents
    "research.title": "链上智能，",
    "research.subtitle": "可追溯且可验证",
    "research.description": "研究代理是基于Hubble数据引擎构建的专业AI代理，通过ERC-8004在链上铸造。",
    "research.exampleTitle": "研究查询示例",

    // Trading Agents
    "trading.title": "完全自主的",
    "trading.subtitle": "交易代理",
    "trading.description": "交易代理通过以下方式与研究代理协作",

    // Infrastructure
    "infra.badge": "基础设施",
    "infra.title": "智能交易技术栈",
    "infra.subtitle": "基于模块化基础设施构建自主交易",

    // CTA
    "cta.title": "尝试智能交易",
    "cta.subtitle": "加入使用AI代理进行自主交易的交易者",
    "cta.button": "创建交易代理",

    // Settings
    "settings.title": "设置",
    "settings.username": "用户名",
    "settings.language": "语言",
    "settings.cancel": "取消",
    "settings.save": "保存更改",

    // Agent Cards
    "agent.type": "类型",
    "agent.token": "代币",
    "agent.timeframe": "时间框架",
    "agent.llm": "大模型",
    "agent.created": "创建时间",
    "agent.accuracy": "准确率",
    "agent.calls": "调用次数",
    "agent.revenue": "收益",
    "agent.pricePerCall": "每次调用价格",
    "agent.public": "公开",
    "agent.private": "私有",
    "agent.owner": "所有者",

    // Marketplace
    "marketplace.title": "研究代理市场",
    "marketplace.subtitle": "发现并使用AI驱动的市场分析代理",
    "marketplace.createAgent": "创建代理",
    "marketplace.byOwner": "由",

    // My Agents
    "myAgents.title": "我的代理",
    "myAgents.subtitle": "管理您的交易和研究代理",
    "myAgents.trading": "交易",
    "myAgents.research": "研究",
    "myAgents.tradingAgents": "交易代理",
    "myAgents.tradingSubtitle": "代表您交易的活跃代理",
    "myAgents.researchAgents": "研究代理",
    "myAgents.researchSubtitle": "您的AI分析代理",
    "myAgents.newAgent": "新代理",
    "myAgents.totalValue": "总价值",
    "myAgents.pnl": "盈亏",
    "myAgents.token": "代币",
    "myAgents.cycle": "周期",
    "myAgents.market": "市场",
    "myAgents.status": "状态",

    // Leaderboard
    "leaderboard.title": "排行榜",
    "leaderboard.subtitle": "Hubble生态系统中表现最佳的代理",
    "leaderboard.researchAgents": "研究代理",
    "leaderboard.tradingAgents": "交易代理",
    "leaderboard.owner": "所有者",
    "leaderboard.viewDetails": "查看详情",
    "leaderboard.note": "注意：",
    "leaderboard.noteText": "仅显示公开的交易代理。用户可以选择公开其AI交易终端以显示在排行榜上。",
    "leaderboard.trades": "交易次数",
    "leaderboard.winRate": "胜率",
    "leaderboard.return": "回报率",

    // Research Detail
    "researchDetail.backToMarketplace": "返回市场",
    "researchDetail.basicInfo": "基本信息",
    "researchDetail.performance": "性能指标",
    "researchDetail.dataSources": "数据源",
    "researchDetail.historicalTrack": "历史追踪记录",
    "researchDetail.runAgent": "运行代理",
    "researchDetail.description": "描述",
    "researchDetail.timeCreated": "创建时间",
    "researchDetail.totalRevenue": "总收益",
    "researchDetail.dataSource": "数据源",
    "researchDetail.prompt": "提示",
    "researchDetail.deploymentInfo": "部署信息",
    "researchDetail.visibility": "可见性",
    "researchDetail.callHistory": "调用历史",
    "researchDetail.time": "时间",
    "researchDetail.output": "输出",
    "researchDetail.user": "用户",
    "researchDetail.bullish": "看涨",
    "researchDetail.bearish": "看跌",
    "researchDetail.neutral": "中性",
    "researchDetail.analysisResult": "分析结果",
    "researchDetail.close": "关闭",
    "researchDetail.payment": "支付确认",
    "researchDetail.paymentText": "运行此代理需要通过X402微支付协议支付",
    "researchDetail.confirm": "确认支付",
    "researchDetail.filterAll": "全部",
    "researchDetail.filterBuy": "买入",
    "researchDetail.filterSell": "卖出",
    "researchDetail.filterNeutral": "中性",

    // Trading Terminal
    "terminal.title": "AI交易终端",
    "terminal.backToLeaderboard": "返回排行榜",
    "terminal.accountValue": "账户价值",
    "terminal.modelChats": "模型对话",
    "terminal.all": "全部",
    "terminal.totalAssets": "总资产",
    "terminal.orders": "订单",
    "terminal.positions": "持仓",

    // Common
    "common.loading": "加载中...",
    "common.error": "错误",
    "common.success": "成功",
    "common.connect": "连接",
    "common.live": "运行中",
  },
  ja: {},
  ko: {},
  es: {},
  fr: {},
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("language")
    if (saved && ["en", "zh", "ja", "ko", "es", "fr"].includes(saved)) {
      setLanguageState(saved as Language)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
