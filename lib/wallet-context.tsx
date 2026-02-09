"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface WalletContextType {
  isConnected: boolean
  walletAddress: string
  selectedChain: string
  selectedNetwork: "BNB" | "Base"
  isWalletModalOpen: boolean
  setIsWalletModalOpen: (open: boolean) => void
  connectWallet: (walletType: string) => void
  disconnectWallet: () => void
  setSelectedNetwork: (network: "BNB" | "Base") => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [selectedChain, setSelectedChain] = useState("BSC")
  const [selectedNetwork, setSelectedNetwork] = useState<"BNB" | "Base">("BNB")
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    const savedWallet = localStorage.getItem("walletConnection")
    if (savedWallet) {
      const { isConnected, walletAddress, selectedChain, selectedNetwork } = JSON.parse(savedWallet)
      setIsConnected(isConnected)
      setWalletAddress(walletAddress)
      setSelectedChain(selectedChain)
      setSelectedNetwork(selectedNetwork)
    }
  }, [])

  useEffect(() => {
    if (isConnected) {
      localStorage.setItem(
        "walletConnection",
        JSON.stringify({
          isConnected,
          walletAddress,
          selectedChain,
          selectedNetwork,
        }),
      )
    } else {
      localStorage.removeItem("walletConnection")
    }
  }, [isConnected, walletAddress, selectedChain, selectedNetwork])

  const connectWallet = (walletType: string) => {
    setIsConnecting(true)
    setTimeout(() => {
      setWalletAddress("0xcc9...d15")
      setIsConnected(true)
      setIsConnecting(false)
      setIsWalletModalOpen(false)
      setSelectedChain(selectedNetwork === "BNB" ? "BSC" : "Base")
    }, 1500)
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress("")
    setSelectedChain("BSC")
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        selectedChain,
        selectedNetwork,
        isWalletModalOpen,
        setIsWalletModalOpen,
        connectWallet,
        disconnectWallet,
        setSelectedNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
