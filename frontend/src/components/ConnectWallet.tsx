'use client'

import { BrowserProvider } from 'ethers'
import { wrapEthereumProvider } from '@oasisprotocol/sapphire-paratime'
import { useState } from 'react'

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function ConnectWallet() {
  const [address, setAddress] = useState<string>('')

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Install MetaMask')
      return
    }

    // switch sang Sapphire Testnet
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x5aff' }],
    })

    // 🔥 QUAN TRỌNG NHẤT
    const provider = wrapEthereumProvider(window.ethereum)

    const ethersProvider = new BrowserProvider(provider)
    const signer = await ethersProvider.getSigner()
    const addr = await signer.getAddress()

    setAddress(addr)
  }

  return (
    <div>
      {address ? (
        <p>✅ Connected: {address}</p>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}