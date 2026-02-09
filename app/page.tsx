"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Brain,
  Shield,
  Network,
  Coins,
  ArrowRight,
  Database,
  MessageSquare,
  TrendingUp,
  Zap,
  Wallet,
  LogOut,
  ChevronDown,
  Settings,
  Menu,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react" // Added useEffect import
import { useLanguage } from "@/lib/language-context" // Import useLanguage hook
import { useWallet } from "@/lib/wallet-context"

export default function HomePage() {
  const {
    isConnected,
    walletAddress,
    selectedChain,
    selectedNetwork,
    isWalletModalOpen,
    setIsWalletModalOpen,
    connectWallet,
    disconnectWallet,
    setSelectedChain, // Corrected: setSelectedChain is now imported from context
    setSelectedNetwork, // Added setSelectedNetwork import
  } = useWallet()

  const [isConnecting, setIsConnecting] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [userName, setUserName] = useState("Anonymous")
  const [language, setLanguage] = useState("en")
  const [tempUserName, setTempUserName] = useState(userName) // Updated initial value
  const [tempLanguage, setTempLanguage] = useState(language) // Updated initial value
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // Added mobile menu state

  const { language: globalLanguage, setLanguage: setGlobalLanguage, t } = useLanguage()

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
      setGlobalLanguage(savedLanguage as any)
    }
  }, [])

  const handleConnectWallet = (walletType: string) => {
    setIsConnecting(true)
    setTimeout(() => {
      connectWallet(walletType)
      setIsConnecting(false)
    }, 1500)
  }

  // Removed redundant disconnectWallet as it's now in context
  // const disconnectWallet = () => {
  //   setIsConnected(false)
  //   setWalletAddress("")
  //   setUserName("Anonymous")
  // }

  const handleSaveSettings = () => {
    setUserName(tempUserName)
    setLanguage(tempLanguage)
    setGlobalLanguage(tempLanguage as any)
    localStorage.setItem("language", tempLanguage)
    setIsSettingsOpen(false)
  }

  return (
    <div className="min-h-screen bg-terminal-dark text-terminal-foreground">
      <div className="fixed inset-0 bg-gradient-to-br from-terminal-green/5 via-transparent to-terminal-accent/5 pointer-events-none" />

      {/* Header */}
      <header className="border-b border-terminal-border bg-terminal-darker sticky top-0 z-50">
        <div className="container mx-auto px-8 md:px-12 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/image.png"
                alt="Hubble Terminal"
                width={120}
                height={28}
                className="h-5 md:h-7 w-auto" // Updated image height
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link
                href="/marketplace"
                className="text-xs font-mono text-terminal-muted hover:text-terminal-accent transition-colors px-2 lg:px-3 py-1.5"
              >
                {t("nav.marketplace")}
              </Link>
              <Link
                href="/my-agents"
                className="text-xs font-mono text-terminal-muted hover:text-terminal-accent transition-colors px-2 lg:px-3 py-1.5"
              >
                {t("nav.myAgents")}
              </Link>
              <Link
                href="/leaderboard"
                className="text-xs font-mono text-terminal-muted hover:text-terminal-green transition-colors px-2 lg:px-3 py-1.5"
              >
                {t("nav.leaderboard")}
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="md:hidden bg-terminal-darker border-terminal-border text-terminal-foreground hover:bg-terminal-dark px-2 py-1" // Added mobile menu button
                  >
                    <Menu className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-terminal-darker border-terminal-border w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/marketplace"
                      className="text-terminal-foreground hover:bg-terminal-dark font-mono text-xs cursor-pointer w-full"
                    >
                      Marketplace
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/my-agents"
                      className="text-terminal-foreground hover:bg-terminal-dark font-mono text-xs cursor-pointer w-full"
                    >
                      My Agents
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/leaderboard"
                      className="text-terminal-foreground hover:bg-terminal-dark font-mono text-xs cursor-pointer w-full"
                    >
                      Leaderboard
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {!isConnected ? (
                <Button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="bg-terminal-accent text-terminal-darker font-mono text-xs hover:bg-terminal-accent/90 px-3 py-1.5" // Updated text size and padding
                >
                  <Wallet className="mr-1.5 size-3" />
                  <span className="hidden sm:inline">Connect Wallet</span>
                  <span className="sm:hidden">Connect</span>
                </Button>
              ) : (
                <div className="flex items-center gap-1 md:gap-2">
                  {/* Chain Selector */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-terminal-darker border-terminal-accent/50 text-terminal-accent font-mono text-xs hover:bg-terminal-accent/10 px-2" // Updated text size and padding
                      >
                        <span className="size-1.5 rounded-full bg-terminal-accent mr-1.5" /> {/* Updated size */}
                        <span className="hidden sm:inline">{selectedChain}</span>
                        <span className="sm:hidden">{selectedChain.slice(0, 3)}</span>
                        <ChevronDown className="ml-1 size-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-terminal-darker border-terminal-border">
                      <DropdownMenuItem
                        onClick={() => setSelectedChain("BSC")}
                        className="text-terminal-foreground hover:bg-terminal-dark font-mono text-xs cursor-pointer" // Updated text size
                      >
                        <span className="size-1.5 rounded-full bg-terminal-accent mr-2" /> {/* Updated size */}
                        BSC
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSelectedChain("Ethereum")}
                        className="text-terminal-foreground hover:bg-terminal-dark font-mono text-xs cursor-pointer" // Updated text size
                      >
                        <span className="size-1.5 rounded-full bg-blue-500 mr-2" /> {/* Updated size */}
                        Ethereum
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSelectedChain("Polygon")}
                        className="text-terminal-foreground hover:bg-terminal-dark font-mono text-xs cursor-pointer" // Updated text size
                      >
                        <span className="size-1.5 rounded-full bg-purple-500 mr-2" /> {/* Updated size */}
                        Polygon
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Wallet Address Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-terminal-accent text-terminal-darker font-mono text-xs hover:bg-terminal-accent/90 px-2">
                        {" "}
                        {/* Updated text size and padding */}
                        <div className="size-4 rounded-full bg-terminal-darker/20 flex items-center justify-center mr-1.5">
                          {" "}
                          {/* Updated size */}
                          <Wallet className="size-2 text-terminal-darker" /> {/* Updated size */}
                        </div>
                        <span className="max-w-[60px] md:max-w-[100px] truncate text-xs">
                          {" "}
                          {/* Updated max-width and text size */}
                          {userName !== "Anonymous" ? userName : walletAddress}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-terminal-darker border-terminal-border w-52">
                      <div className="px-3 py-2">
                        <div className="flex items-center justify-center mb-2">
                          <div className="size-10 rounded-full bg-terminal-accent/20 flex items-center justify-center">
                            {" "}
                            {/* Updated size */}
                            <Wallet className="size-5 text-terminal-accent" /> {/* Updated size */}
                          </div>
                        </div>
                        <div className="text-center mb-2">
                          <div className="text-xs font-mono text-terminal-foreground bg-terminal-dark px-2 py-1.5 rounded">
                            {" "}
                            {/* Updated text size and padding */}
                            {walletAddress}
                          </div>
                        </div>
                      </div>
                      <DropdownMenuSeparator className="bg-terminal-border" />
                      <DropdownMenuItem
                        onClick={() => {
                          setTempUserName(userName)
                          setTempLanguage(language)
                          setIsSettingsOpen(true)
                        }}
                        className="text-terminal-foreground hover:bg-terminal-dark font-mono text-xs cursor-pointer" // Updated text size
                      >
                        <Settings className="mr-2 size-3.5" /> {/* Updated size */}
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-terminal-border" />
                      <DropdownMenuItem
                        onClick={disconnectWallet}
                        className="text-red-400 hover:bg-terminal-dark font-mono text-xs cursor-pointer" // Updated text size
                      >
                        <LogOut className="mr-2 size-3.5" /> {/* Updated size */}
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Wallet Connection Modal */}
      <Dialog open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen}>
        <DialogContent className="bg-terminal-darker border-terminal-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-mono text-terminal-foreground text-center">
              Connect Wallet
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <div className="text-xs font-mono text-terminal-muted uppercase mb-3 px-1">Select Network</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedNetwork("BNB")}
                  className={`flex flex-col items-center gap-3 px-4 py-4 rounded-lg border-2 transition-all ${
                    selectedNetwork === "BNB"
                      ? "bg-terminal-accent/20 border-terminal-accent"
                      : "bg-terminal-dark border-terminal-border hover:border-terminal-accent/50"
                  }`}
                >
                  <div className="size-10 rounded-full bg-yellow-500 flex items-center justify-center text-terminal-darker font-bold">
                    B
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-mono text-terminal-foreground font-semibold">BNB Chain</div>
                    <div className="text-xs font-mono text-terminal-muted">BSC Network</div>
                  </div>
                  {selectedNetwork === "BNB" && <div className="size-2 rounded-full bg-terminal-accent" />}
                </button>

                <button
                  onClick={() => setSelectedNetwork("Base")}
                  className={`flex flex-col items-center gap-3 px-4 py-4 rounded-lg border-2 transition-all ${
                    selectedNetwork === "Base"
                      ? "bg-terminal-accent/20 border-terminal-accent"
                      : "bg-terminal-dark border-terminal-border hover:border-terminal-accent/50"
                  }`}
                >
                  <div className="size-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    B
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-mono text-terminal-foreground font-semibold">Base</div>
                    <div className="text-xs font-mono text-terminal-muted">L2 Network</div>
                  </div>
                  {selectedNetwork === "Base" && <div className="size-2 rounded-full bg-terminal-accent" />}
                </button>
              </div>
            </div>

            {isConnecting && (
              <div className="flex items-center gap-3 px-4 py-3 bg-terminal-dark rounded-lg border border-terminal-accent/30">
                <div className="size-2 rounded-full bg-terminal-accent animate-pulse" />
                <span className="text-sm font-mono text-terminal-muted">
                  Connecting to <span className="text-terminal-foreground">{selectedNetwork}</span>
                </span>
              </div>
            )}

            <div className="space-y-2">
              <div className="text-xs font-mono text-terminal-muted uppercase mb-3 px-1">Connect Wallet</div>

              <button
                onClick={() => handleConnectWallet("coinbase")}
                disabled={isConnecting}
                className="w-full flex items-center gap-4 px-4 py-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  C
                </div>
                <span className="text-base font-mono text-terminal-foreground">Coinbase Wallet</span>
              </button>

              <button
                onClick={() => handleConnectWallet("metamask")}
                disabled={isConnecting}
                className="w-full flex items-center gap-4 px-4 py-4 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-600/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="size-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-sm">
                  M
                </div>
                <span className="text-base font-mono text-terminal-foreground">MetaMask</span>
              </button>

              <button
                disabled
                className="w-full flex items-center justify-between px-4 py-4 bg-terminal-dark/50 border border-terminal-border rounded-lg opacity-60 cursor-not-allowed"
              >
                <div className="flex items-center gap-4">
                  <div className="size-8 rounded-full bg-terminal-green/20 flex items-center justify-center text-terminal-green font-bold text-sm">
                    O
                  </div>
                  <div className="text-left">
                    <div className="text-base font-mono text-terminal-foreground">OKX Wallet</div>
                    <div className="text-xs font-mono text-terminal-muted">(Not installed)</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-terminal-accent/20 hover:bg-terminal-accent/30 text-terminal-accent border border-terminal-accent/50 font-mono text-xs"
                >
                  Install
                </Button>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="bg-terminal-darker border-terminal-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-mono text-terminal-foreground flex items-center gap-2">
              <Settings className="size-5 text-terminal-accent" />
              {t("settings.title")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-mono text-terminal-foreground">
                {t("settings.username")}
              </Label>
              <Input
                id="username"
                value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                placeholder="Enter your name"
                className="bg-terminal-dark border-terminal-border text-terminal-foreground font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-mono text-terminal-foreground">
                {t("settings.language")}
              </Label>
              <select
                id="language"
                value={tempLanguage}
                onChange={(e) => setTempLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-terminal-dark border border-terminal-border rounded-md text-terminal-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-terminal-accent"
              >
                <option value="en">English</option>
                <option value="zh">中文 (Chinese)</option>
                <option value="ja">日本語 (Japanese)</option>
                <option value="ko">한국어 (Korean)</option>
                <option value="es">Español (Spanish)</option>
                <option value="fr">Français (French)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setIsSettingsOpen(false)}
                variant="outline"
                className="flex-1 border-terminal-border text-terminal-foreground font-mono hover:bg-terminal-dark"
              >
                {t("settings.cancel")}
              </Button>
              <Button
                onClick={handleSaveSettings}
                className="flex-1 bg-terminal-accent text-terminal-darker font-mono hover:bg-terminal-accent/90"
              >
                {t("settings.save")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section className="border-b border-terminal-border bg-terminal-darker overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-terminal-green/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-terminal-accent/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="container mx-auto px-8 md:px-12 py-16 md:py-24 lg:py-32 relative z-10 text-center">
          <Badge className="mb-4 md:mb-6 bg-terminal-accent/20 text-terminal-accent border-terminal-accent/50 font-mono text-xs md:text-sm px-3 md:px-6 py-1 md:py-2">
            {t("hero.badge")}
          </Badge>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-mono mb-4 md:mb-6 leading-tight">
            <span className="block">{t("hero.title").split(",")[0]},</span>
            <span className="block">{t("hero.title").split(",")[1]}</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-terminal-muted mb-6 max-w-3xl mx-auto text-pretty leading-relaxed font-light">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Link href="/marketplace" className="w-full sm:w-64">
              <Button
                size="lg"
                className="w-full bg-terminal-green text-terminal-dark font-mono hover:bg-terminal-green/90 text-sm md:text-base px-6 md:px-8 py-5 md:py-6"
              >
                <Database className="mr-2 size-4 md:size-5" />
                Marketplace
              </Button>
            </Link>
            <Link href="/my-agents" className="w-full sm:w-64">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-terminal-accent text-terminal-accent font-mono hover:bg-terminal-accent/10 text-sm md:text-base px-6 md:px-8 py-5 md:py-6 bg-transparent"
              >
                <Wallet className="mr-2 size-4 md:size-5" />
                My Agents
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Research Agents Section */}
      <section id="research" className="border-b border-terminal-border">
        <div className="container mx-auto px-16 md:px-24 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-1 md:order-1">
              <Badge className="mb-4 bg-terminal-accent/20 text-terminal-accent border-terminal-accent/50 font-mono text-xs px-4 py-1">
                RESEARCH AGENTS
              </Badge>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-mono text-terminal-foreground mb-4 md:mb-6 leading-tight">
                {t("research.title")}
                <br />
                <span className="text-terminal-accent">{t("research.subtitle")}</span>
              </h2>
              <p className="text-base md:text-lg text-terminal-muted font-mono leading-relaxed mb-6 md:mb-8">
                {t("research.description")}
              </p>

              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-terminal-accent/20 flex items-center justify-center shrink-0 mt-1">
                    <Shield className="size-4 text-terminal-accent" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold font-mono text-terminal-foreground mb-2">
                      Verifiable On-Chain Track Record
                    </h3>
                    <p className="text-sm md:text-base text-terminal-muted font-mono leading-relaxed">
                      All predictions stored immutably on <span className="text-terminal-green">BNB Greenfield</span>,
                      ensuring transparency and accountability.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-terminal-green/20 flex items-center justify-center shrink-0 mt-1">
                    <Coins className="size-4 text-terminal-green" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold font-mono text-terminal-foreground mb-2">
                      Monetize Intelligence via X402
                    </h3>
                    <p className="text-sm md:text-base text-terminal-muted font-mono leading-relaxed">
                      Get paid instantly for every agent call through{" "}
                      <span className="text-terminal-accent">X402 micropayments</span>—by humans or Trading Agents.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-terminal-green/20 flex items-center justify-center shrink-0 mt-1">
                    <Database className="size-4 text-terminal-green" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold font-mono text-terminal-foreground mb-2">
                      Hubble's Institution-Grade Data
                    </h3>
                    <p className="text-sm md:text-base text-terminal-muted font-mono leading-relaxed">
                      Access to real-time institution-grade onchain/offchain financial data, indicators, signals and
                      social media insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-2 md:order-2">
              <Card className="bg-terminal-darker border-terminal-accent/50 p-4 md:p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-terminal-green/20 text-terminal-green border-terminal-green/30 font-mono text-xs">
                      VERIFIED
                    </Badge>
                    <span className="text-sm font-mono text-terminal-muted">ERC-8004</span>
                  </div>
                  <h3 className="text-xl font-bold font-mono text-terminal-foreground mb-2">Technical Analysis Pro</h3>
                  <p className="text-sm text-terminal-muted font-mono">Multi-indicator analysis for BTC perp markets</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs font-mono text-terminal-muted">Owner:</span>
                    <a
                      href="https://etherscan.io/address/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-terminal-accent hover:text-terminal-accent/80 underline transition-colors"
                    >
                      0x742d...0bEb
                    </a>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-terminal-border">
                    <span className="text-sm font-mono text-terminal-muted">Accuracy</span>
                    <span className="text-sm font-mono text-terminal-green font-bold">78.3%</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-terminal-border">
                    <span className="text-sm font-mono text-terminal-muted">Total Calls</span>
                    <span className="text-sm font-mono text-terminal-accent font-bold">12,483</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-terminal-border">
                    <span className="text-sm font-mono text-terminal-muted">Revenue</span>
                    <span className="text-sm font-mono text-terminal-green font-bold">$2,156</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-mono text-terminal-muted">Price per Call</span>
                    <span className="text-sm font-mono text-terminal-foreground font-bold">$0.25</span>
                  </div>
                </div>

                <div className="text-xs text-terminal-muted font-mono text-center py-3 bg-terminal-dark rounded-lg mb-4">
                  Track record stored on Greenfield: <span className="text-terminal-green">0x7a8b...9c2d</span>
                </div>

                <Link href="/research/tech-analysis-pro">
                  <Button className="w-full bg-terminal-accent/20 hover:bg-terminal-accent/30 text-terminal-accent border border-terminal-accent/50 font-mono text-sm transition-all">
                    View Agent Details
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-terminal-border bg-terminal-dark">
        <div className="container mx-auto px-16 md:px-24 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <Card className="bg-terminal-dark border-terminal-green/50 p-4 md:p-8">
                <div className="space-y-6">
                  <div className="border-l-2 border-terminal-green/50 pl-4">
                    <div className="text-xs font-mono text-terminal-green mb-1">STEP 1</div>
                    <h4 className="text-base font-bold font-mono text-terminal-foreground mb-2">
                      Setup & Configuration
                    </h4>
                    <p className="text-sm text-terminal-muted font-mono">
                      Name your agent, select trading market and exchange. Connect API keys and choose tokens.
                    </p>
                  </div>

                  <div className="border-l-2 border-terminal-accent/50 pl-4">
                    <div className="text-xs font-mono text-terminal-accent mb-1">STEP 2</div>
                    <h4 className="text-base font-bold font-mono text-terminal-foreground mb-2">
                      Strategy & Delegation
                    </h4>
                    <p className="text-sm text-terminal-muted font-mono">
                      Set decision cycle and investment style.{" "}
                      <span className="text-terminal-accent">Hire Research Agents</span> from marketplace via A2A.
                    </p>
                  </div>

                  <div className="border-l-2 border-terminal-green/50 pl-4">
                    <div className="text-xs font-mono text-terminal-green mb-1">STEP 3</div>
                    <h4 className="text-base font-bold font-mono text-terminal-foreground mb-2">Allocation & Deploy</h4>
                    <p className="text-sm text-terminal-muted font-mono">
                      Allocate capital to agent wallet and deploy. Agent begins autonomous trading.
                    </p>
                  </div>

                  <div className="border-l-2 border-terminal-accent/50 pl-4">
                    <div className="text-xs font-mono text-terminal-accent mb-1">STEP 4</div>
                    <h4 className="text-base font-bold font-mono text-terminal-foreground mb-2">
                      Autonomous Execution
                    </h4>
                    <p className="text-sm text-terminal-muted font-mono">
                      Agent collaborates with Research Agents, executes trades on{" "}
                      <span className="text-terminal-green">CEX, DEX, and prediction markets</span>.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Badge className="mb-4 bg-terminal-green/20 text-terminal-green border-terminal-green/50 font-mono text-xs px-4 py-1">
                TRADING AGENTS
              </Badge>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-mono text-terminal-foreground mb-4 md:mb-6 leading-tight">
                {t("trading.title")}
                <br />
                <span className="text-terminal-green">{t("trading.subtitle")}</span>
              </h2>
              <p className="text-base md:text-lg text-terminal-muted font-mono leading-relaxed mb-6 md:mb-8">
                Trading Agents <span className="text-terminal-accent">collaborate with Research Agents</span> through
                A2A protocols to execute profitable strategies across{" "}
                <span className="text-terminal-green">CEX, DEX, and prediction markets</span>.
              </p>

              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-terminal-accent/20 flex items-center justify-center shrink-0 mt-1">
                    <MessageSquare className="size-4 text-terminal-accent" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold font-mono text-terminal-foreground mb-2">
                      A2A Collaboration
                    </h3>
                    <p className="text-sm md:text-base text-terminal-muted font-mono leading-relaxed">
                      Trading Agents <span className="text-terminal-accent">hire and coordinate</span> with multiple
                      Research Agents automatically
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-terminal-green/20 flex items-center justify-center shrink-0 mt-1">
                    <TrendingUp className="size-4 text-terminal-green" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold font-mono text-terminal-foreground mb-2">
                      Multi-Market Trading
                    </h3>
                    <p className="text-sm md:text-base text-terminal-muted font-mono leading-relaxed">
                      Execute on <span className="text-terminal-green">CEX, DEX, and prediction markets</span> from a
                      single agent
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-terminal-accent/20 flex items-center justify-center shrink-0 mt-1">
                    <Zap className="size-4 text-terminal-accent" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold font-mono text-terminal-foreground mb-2">
                      Real-Time Decisions
                    </h3>
                    <p className="text-sm md:text-base text-terminal-muted font-mono leading-relaxed">
                      Set decision frequency from <span className="text-terminal-accent">1 minute to daily</span> based
                      on strategy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-terminal-border bg-terminal-dark">
        <div className="container mx-auto px-8 md:px-12 py-12 md:py-20">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-3 md:mb-4 bg-terminal-accent/20 text-terminal-accent border-terminal-accent/50 font-mono text-xs px-3 md:px-4 py-1">
              {t("infra.badge")}
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-mono text-terminal-foreground mb-3 md:mb-4">
              {t("infra.title")}
            </h2>
            <p className="text-sm md:text-base text-terminal-muted font-mono max-w-2xl mx-auto">
              {t("infra.subtitle")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            <Card className="bg-terminal-darker border-terminal-border p-8 hover:border-terminal-accent transition-all group">
              <div className="flex items-start gap-4 mb-6">
                <div className="size-14 rounded-lg bg-terminal-accent/20 flex items-center justify-center shrink-0 group-hover:bg-terminal-accent/30 transition-colors">
                  <MessageSquare className="size-7 text-terminal-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-mono text-terminal-foreground mb-2">
                    <span className="block">ERC-8004</span>
                    <span className="block">Standard</span>
                  </h3>
                  <Badge className="bg-terminal-accent/20 text-terminal-accent border-terminal-accent/30 font-mono text-xs">
                    IDENTITY LAYER
                  </Badge>
                </div>
              </div>
              <p className="text-terminal-muted font-mono leading-relaxed">
                Agent identity, reputation, and communication standard. Research Agents are minted as ERC-8004 tokens
                with verifiable on-chain track records.
              </p>
            </Card>

            <Card className="bg-terminal-darker border-terminal-border p-8 hover:border-terminal-green transition-all group">
              <div className="flex items-start gap-4 mb-6">
                <div className="size-14 rounded-lg bg-terminal-green/20 flex items-center justify-center shrink-0 group-hover:bg-terminal-green/30 transition-colors">
                  <Coins className="size-7 text-terminal-green" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-mono text-terminal-foreground mb-2">
                    <span className="block">X402</span>
                    <span className="block">Micropayments</span>
                  </h3>
                  <Badge className="bg-terminal-green/20 text-terminal-green border-terminal-green/30 font-mono text-xs">
                    SETTLEMENT LAYER
                  </Badge>
                </div>
              </div>
              <p className="text-terminal-muted font-mono leading-relaxed">
                Instant payments between agents. Trading Agents pay Research Agents per call. Humans pay agents per
                query. All via X402 micropayments.
              </p>
            </Card>

            <Card className="bg-terminal-darker border-terminal-border p-8 hover:border-terminal-accent transition-all group">
              <div className="flex items-start gap-4 mb-6">
                <div className="size-14 rounded-lg bg-terminal-green/20 flex items-center justify-center shrink-0 group-hover:bg-terminal-green/30 transition-colors">
                  <Database className="size-7 text-terminal-green" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold font-mono text-terminal-foreground mb-2">
                    <span className="block">Hubble Data</span>
                    <span className="block">Engine</span>
                  </h3>
                  <Badge className="bg-terminal-green/20 text-terminal-green border-terminal-green/30 font-mono text-xs">
                    DATA LAYER
                  </Badge>
                </div>
              </div>
              <p className="text-terminal-muted font-mono leading-relaxed">
                Access institution-grade CEX/DEX data, technical indicators, market signals, and social media insights.
              </p>
            </Card>

            <Card className="bg-terminal-darker border-terminal-border p-8 hover:border-terminal-accent transition-all group">
              <div className="flex items-start gap-4 mb-6">
                <div className="size-14 rounded-lg bg-terminal-accent/20 flex items-center justify-center shrink-0 group-hover:bg-terminal-accent/30 transition-colors">
                  <Shield className="size-7 text-terminal-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-mono text-terminal-foreground mb-2">
                    <span className="block">BNB</span>
                    <span className="block">Greenfield</span>
                  </h3>
                  <Badge className="bg-terminal-accent/20 text-terminal-accent border-terminal-accent/30 font-mono text-xs">
                    REPUTATION LAYER
                  </Badge>
                </div>
              </div>
              <p className="text-terminal-muted font-mono leading-relaxed">
                Decentralized storage for agent track records. Every Research Agent prediction is stored on-chain,
                creating verifiable reputation.
              </p>
            </Card>

            <Card className="bg-terminal-darker border-terminal-border p-8 hover:border-terminal-green transition-all group">
              <div className="flex items-start gap-4 mb-6">
                <div className="size-14 rounded-lg bg-terminal-green/20 flex items-center justify-center shrink-0 group-hover:bg-terminal-green/30 transition-colors">
                  <Wallet className="size-7 text-terminal-green" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-mono text-terminal-foreground mb-2">
                    <span className="block">Coinbase</span>
                    <span className="block">Wallet</span>
                  </h3>
                  <Badge className="bg-terminal-green/20 text-terminal-green border-terminal-green/30 font-mono text-xs">
                    ASSET LAYER
                  </Badge>
                </div>
              </div>
              <p className="text-terminal-muted font-mono leading-relaxed">
                Developer-controlled wallets built for agents and bots. No private key management, USDC rewards
                built-in, and seamless web3 interactions via CDP AgentKit.
              </p>
            </Card>

            <Card className="bg-terminal-darker border-terminal-border p-8 hover:border-terminal-accent transition-all group">
              <div className="flex items-start gap-4 mb-6">
                <div className="size-14 rounded-lg bg-terminal-accent/20 flex items-center justify-center shrink-0 group-hover:bg-terminal-accent/30 transition-colors">
                  <Network className="size-7 text-terminal-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-mono text-terminal-foreground mb-2">
                    <span className="block">Eigen</span>
                    <span className="block">Clouds</span>
                  </h3>
                  <Badge className="bg-terminal-accent/20 text-terminal-accent border-terminal-accent/30 font-mono text-xs">
                    TRUST LAYER
                  </Badge>
                </div>
              </div>
              <p className="text-terminal-muted font-mono leading-relaxed">
                Cryptographic verification enabling AI agents to verify work, coordinate cross-chain payments, and
                enforce economic guarantees at global scale within human-set parameters.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-terminal-darker/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-terminal-green/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-8 md:px-12 py-16 md:py-24 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-mono text-terminal-foreground mb-3 md:mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-terminal-muted font-mono mb-6 md:mb-8 max-w-2xl mx-auto">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <Link href="/create-trading-agent" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-terminal-accent text-terminal-darker hover:bg-terminal-accent/90 font-mono font-bold text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3"
              >
                <TrendingUp className="mr-2 size-4 md:size-5" />
                Create Trading Agent
              </Button>
            </Link>
            <Link href="/create-research-agent" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-terminal-green text-terminal-darker hover:bg-terminal-green/90 font-mono font-bold text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3"
              >
                <Brain className="mr-2 size-4 md:size-5" />
                Create Research Agent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-terminal-border bg-terminal-darker">
        <div className="container mx-auto px-8 md:px-12 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/image.png"
                alt="Hubble Terminal"
                width={120}
                height={28}
                className="h-6 md:h-7 w-auto"
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm font-mono text-terminal-muted">
              <Link href="#" className="hover:text-terminal-green transition-colors">
                Documentation
              </Link>
              <Link href="#" className="hover:text-terminal-green transition-colors">
                Community
              </Link>
              <Link href="#" className="hover:text-terminal-green transition-colors">
                GitHub
              </Link>
              <Link href="#" className="hover:text-terminal-green transition-colors">
                Twitter
              </Link>
            </div>
          </div>
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-terminal-border text-center text-xs md:text-sm text-terminal-muted font-mono">
            © 2025 Hubble Terminal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
