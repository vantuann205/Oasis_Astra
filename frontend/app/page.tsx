'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import Header from '../components/Header'

const CreateToken = dynamic(() => import('../components/CreateToken'), { ssr: false })
const TokenMarketplace = dynamic(() => import('../components/TokenMarketplace'), { ssr: false })

export default function Home() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [createdTokens, setCreatedTokens] = useState<string[]>([])
  const [showMarketplace, setShowMarketplace] = useState(false)

  const handleTokenCreated = (tokenAddress: string) => {
    const updatedTokens = [...createdTokens, tokenAddress]
    setCreatedTokens(updatedTokens)
    localStorage.setItem('createdTokens', JSON.stringify(updatedTokens))
    
    if (!showMarketplace) {
      setShowMarketplace(true)
    }
  }

  const handleConnectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length > 0) {
          setConnected(true)
          setAddress(accounts[0])
          console.log('Wallet connected:', accounts[0])
        }
      } catch (error) {
        console.log('Wallet connection failed')
      }
    }
  }

  // Load saved tokens on mount and check wallet connection
  useEffect(() => {
    const saved = localStorage.getItem('createdTokens')
    if (saved) {
      try {
        const tokens = JSON.parse(saved)
        setCreatedTokens(tokens)
      } catch (e) {
        console.log('Could not load saved tokens')
      }
    }

    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            setConnected(true)
            setAddress(accounts[0])
          }
        } catch (error) {
          console.log('No wallet connection detected')
        }
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="min-h-screen bg-pump-bg text-pump-text font-sans">
      <Header 
        onConnectWallet={handleConnectWallet}
        walletConnected={connected}
        walletAddress={address}
      />

      <main className="container mx-auto px-4 py-8">
        <CreateToken 
          onTokenCreated={handleTokenCreated}
          onConnectionChange={(connected, address) => {
            setConnected(connected)
            setAddress(address)
          }}
        />

        {connected && (
          <TokenMarketplace 
            connected={connected}
            address={address}
            createdTokens={createdTokens}
          />
        )}
      </main>
    </div>
  )
}
