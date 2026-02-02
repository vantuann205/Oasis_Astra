'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'

const CreateToken = dynamic(() => import('../components/CreateToken'), { ssr: false })
const TokenMarketplace = dynamic(() => import('../components/TokenMarketplace'), { ssr: false })

export default function Home() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [createdTokens, setCreatedTokens] = useState<string[]>([])
  const [showMarketplace, setShowMarketplace] = useState(false)
  const marketplaceRef = useRef<any>(null)

  const handleTokenCreated = (tokenAddress: string) => {
    const updatedTokens = [...createdTokens, tokenAddress]
    setCreatedTokens(updatedTokens)
    localStorage.setItem('createdTokens', JSON.stringify(updatedTokens))
    
    // Show marketplace after first token is created
    if (!showMarketplace) {
      setShowMarketplace(true)
    }
  }

  // Load saved tokens on mount and check wallet connection
  useEffect(() => {
    const saved = localStorage.getItem('createdTokens')
    if (saved) {
      const tokens = JSON.parse(saved)
      setCreatedTokens(tokens)
    }

    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            setConnected(true)
            setAddress(accounts[0])
            console.log('Auto-detected wallet connection:', accounts[0])
          }
        } catch (error) {
          console.log('No wallet connection detected')
        }
      }
    }

    checkConnection()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-12" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #eef2ff 100%)',
      padding: '3rem 0'
    }}>
      <div className="container mx-auto px-4" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="text-center mb-12" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4" style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #9333ea, #db2777)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            Oasis Token Creator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{
            fontSize: '1.25rem',
            color: '#4b5563',
            maxWidth: '42rem',
            margin: '0 auto'
          }}>
            Create and deploy your own ERC20 tokens on Oasis Sapphire Testnet with just a few clicks
          </p>
        </div>

        <CreateToken 
          onTokenCreated={handleTokenCreated}
          onConnectionChange={(connected, address) => {
            setConnected(connected)
            setAddress(address)
          }}
          onTokenCreatedSuccess={() => {
            // Refresh marketplace when token is created
            if (marketplaceRef.current?.refreshTokens) {
              marketplaceRef.current.refreshTokens()
            }
          }}
        />

        {connected && (
          <TokenMarketplace 
            ref={marketplaceRef}
            connected={connected}
            address={address}
            createdTokens={createdTokens}
          />
        )}

        <div className="text-center mt-12" style={{ textAlign: 'center', marginTop: '3rem' }}>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto" style={{
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem',
            maxWidth: '28rem',
            margin: '0 auto'
          }}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4" style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>Network Info</h3>
            <div className="space-y-2 text-sm text-gray-600" style={{ color: '#4b5563', fontSize: '0.875rem' }}>
              <div className="flex justify-between" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Network:</span>
                <span className="font-medium" style={{ fontWeight: '500' }}>Oasis Sapphire Testnet</span>
              </div>
              <div className="flex justify-between" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Chain ID:</span>
                <span className="font-medium" style={{ fontWeight: '500' }}>23295</span>
              </div>
              <div className="flex justify-between" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Currency:</span>
                <span className="font-medium" style={{ fontWeight: '500' }}>TEST</span>
              </div>
            </div>
            <a 
              href="https://testnet.explorer.sapphire.oasis.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition duration-200"
              style={{
                display: 'inline-block',
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#9333ea',
                color: 'white',
                fontSize: '0.875rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}
            >
              View Explorer
            </a>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm" style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: '#6b7280',
          fontSize: '0.875rem'
        }}>
          <p>Powered by Oasis Sapphire - Privacy-enabled EVM</p>
        </div>
      </div>
    </main>
  )
}
