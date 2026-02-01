'use client'

import { useState } from 'react'

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function ConnectWallet() {
  const [address, setAddress] = useState<string>('')
  const [connecting, setConnecting] = useState(false)

  const connectWallet = async () => {
    // Check for MetaMask specifically
    if (!window.ethereum) {
      alert('Vui lòng cài đặt MetaMask!')
      return
    }

    // If multiple wallets, try to use MetaMask specifically
    let ethereum = window.ethereum
    if (window.ethereum.providers) {
      // Multiple wallets detected, find MetaMask
      ethereum = window.ethereum.providers.find((provider: any) => provider.isMetaMask)
      if (!ethereum) {
        alert('Không tìm thấy MetaMask! Vui lòng đảm bảo MetaMask đã được cài đặt.')
        return
      }
    } else if (!window.ethereum.isMetaMask) {
      // Single wallet but not MetaMask
      alert('Vui lòng sử dụng MetaMask!')
      return
    }

    setConnecting(true)
    
    try {
      // Request account access from MetaMask
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length > 0) {
        setAddress(accounts[0])
        
        // Try to switch to Sapphire Testnet
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x5aff' }], // Sapphire Testnet
          })
        } catch (switchError: any) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x5aff',
                chainName: 'Oasis Sapphire Testnet',
                nativeCurrency: {
                  name: 'TEST',
                  symbol: 'TEST',
                  decimals: 18
                },
                rpcUrls: ['https://testnet.sapphire.oasis.io'],
                blockExplorerUrls: ['https://testnet.explorer.sapphire.oasis.io']
              }]
            })
          }
        }
      }
    } catch (error) {
      console.error('Lỗi kết nối ví:', error)
      alert('Lỗi kết nối ví. Vui lòng thử lại!')
    } finally {
      setConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAddress('')
  }

  return (
    <div className="space-y-3">
      {address ? (
        <div className="space-y-2">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-600 font-medium">✅ Đã kết nối</p>
            <p className="text-xs font-mono text-gray-600 break-all">{address}</p>
          </div>
          <button
            onClick={disconnectWallet}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200"
          >
            Ngắt kết nối
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={connecting}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition duration-200 font-medium"
        >
          {connecting ? '⏳ Đang kết nối...' : '🔗 Kết nối MetaMask'}
        </button>
      )}
      
      <div className="text-xs text-gray-500 text-center">
        Cần MetaMask để kết nối với Oasis Sapphire Testnet
      </div>
    </div>
  )
}