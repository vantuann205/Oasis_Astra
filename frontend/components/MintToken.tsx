'use client'

import { useState, useEffect } from 'react'
import { BrowserProvider, Contract, formatEther, parseEther } from 'ethers'
import { wrapEthereumProvider } from '@oasisprotocol/sapphire-paratime'
import { TOKEN_ABI, TOKEN_ADDRESS } from '../abi/tokenAbi'

interface TokenInfo {
  name: string
  symbol: string
  balance: string
  mintPrice: string
  maxMintPerAddress: string
  mintedAmount: string
  remainingMintable: string
}

export default function MintToken() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [mintAmount, setMintAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [testBalance, setTestBalance] = useState('0')

  // Check if wallet is already connected
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        // Use MetaMask specifically
        let ethereum = window.ethereum
        if (window.ethereum.providers) {
          ethereum = window.ethereum.providers.find((provider: any) => provider.isMetaMask)
          if (!ethereum) return
        }
        
        const accounts = await ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setConnected(true)
          await loadTokenInfo(accounts[0])
          await loadTestBalance(accounts[0])
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

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

    try {
      // Request account access from MetaMask
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length > 0) {
        // Switch to Sapphire Testnet first
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

        setAddress(accounts[0])
        setConnected(true)
        await loadTokenInfo(accounts[0])
        await loadTestBalance(accounts[0])
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error)
      alert('Lỗi kết nối ví!')
    }
  }

  const loadTestBalance = async (userAddress: string) => {
    try {
      // Use MetaMask provider specifically
      let ethereum = window.ethereum
      if (window.ethereum.providers) {
        ethereum = window.ethereum.providers.find((provider: any) => provider.isMetaMask)
      }
      
      const provider = new BrowserProvider(ethereum)
      const balance = await provider.getBalance(userAddress)
      setTestBalance(formatEther(balance))
    } catch (error) {
      console.error('Lỗi load TEST balance:', error)
    }
  }

  const loadTokenInfo = async (userAddress: string) => {
    try {
      // Use MetaMask provider specifically
      let ethereum = window.ethereum
      if (window.ethereum.providers) {
        ethereum = window.ethereum.providers.find((provider: any) => provider.isMetaMask)
      }
      
      const provider = new BrowserProvider(ethereum)
      const contract = new Contract(TOKEN_ADDRESS, TOKEN_ABI, provider)
      
      const [name, symbol, balance, mintPrice, mintedAmount] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.balanceOf(userAddress),
        contract.mintPrice(),
        contract.mintedAmount(userAddress)
      ])

      setTokenInfo({
        name,
        symbol,
        balance: formatEther(balance),
        mintPrice: formatEther(mintPrice),
        maxMintPerAddress: '1000', // Default limit
        mintedAmount: formatEther(mintedAmount),
        remainingMintable: (1000 - parseFloat(formatEther(mintedAmount))).toString()
      })
    } catch (error) {
      console.error('Lỗi load thông tin token:', error)
      // Set default info if contract not deployed yet
      setTokenInfo({
        name: 'Oasis Astra Token',
        symbol: 'OAT',
        balance: '0',
        mintPrice: '0.001',
        maxMintPerAddress: '1000',
        mintedAmount: '0',
        remainingMintable: '1000'
      })
    }
  }

  const mintTokens = async () => {
    if (!mintAmount || !connected) return

    setLoading(true)
    setTxHash('')

    try {
      // Use MetaMask provider specifically
      let ethereum = window.ethereum
      if (window.ethereum.providers) {
        ethereum = window.ethereum.providers.find((provider: any) => provider.isMetaMask)
        if (!ethereum) {
          alert('Không tìm thấy MetaMask!')
          setLoading(false)
          return
        }
      }

      // Use Sapphire wrapper for transactions
      const wrappedProvider = wrapEthereumProvider(ethereum)
      const provider = new BrowserProvider(wrappedProvider)
      const signer = await provider.getSigner()
      const contract = new Contract(TOKEN_ADDRESS, TOKEN_ABI, signer)

      const amount = parseEther(mintAmount)
      const cost = await contract.calculateMintCost(amount)

      console.log('Minting:', formatEther(amount), 'OAT')
      console.log('Cost:', formatEther(cost), 'TEST')

      const tx = await contract.mint(amount, { value: cost })
      setTxHash(tx.hash)
      
      console.log('Transaction sent:', tx.hash)
      console.log('Waiting for confirmation...')
      
      await tx.wait()
      
      alert('✅ Mint thành công!')
      await loadTokenInfo(address)
      await loadTestBalance(address)
      setMintAmount('')
    } catch (error: any) {
      console.error('Lỗi mint:', error)
      if (error.message.includes('insufficient funds')) {
        alert('❌ Không đủ TEST token để trả phí gas!')
      } else if (error.message.includes('user rejected')) {
        alert('❌ Bạn đã từ chối transaction!')
      } else {
        alert(`❌ Lỗi mint: ${error.message || error}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const calculateCost = () => {
    if (!mintAmount || !tokenInfo) return '0'
    try {
      const amount = parseFloat(mintAmount)
      const price = parseFloat(tokenInfo.mintPrice)
      return (amount * price).toFixed(6)
    } catch {
      return '0'
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">🪙 Mint Oasis Token</h2>
      
      {!connected ? (
        <div className="text-center space-y-4">
          <p className="text-gray-600">Kết nối MetaMask để mint token trên Sapphire Testnet</p>
          
          {/* Wallet Detection Info */}
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <p className="text-blue-800 font-medium">🔍 Wallet Detection:</p>
            <p className="text-blue-600">
              {window.ethereum ? (
                window.ethereum.providers ? (
                  `Phát hiện ${window.ethereum.providers.length} ví. Sẽ dùng MetaMask.`
                ) : window.ethereum.isMetaMask ? (
                  'MetaMask detected ✅'
                ) : (
                  'Wallet khác detected. Cần MetaMask!'
                )
              ) : (
                'Không phát hiện wallet nào'
              )}
            </p>
          </div>
          
          <button
            onClick={connectWallet}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            🔗 Kết nối MetaMask
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Thông tin ví */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Địa chỉ ví:</p>
            <p className="font-mono text-sm break-all">{address}</p>
            <p className="text-sm text-gray-600 mt-1">
              Số dư TEST: <span className="font-semibold">{parseFloat(testBalance).toFixed(4)} TEST</span>
            </p>
          </div>

          {/* Thông tin token */}
          {tokenInfo && (
            <div className="bg-green-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-green-800">{tokenInfo.name} ({tokenInfo.symbol})</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Số dư:</span>
                  <p className="font-semibold">{parseFloat(tokenInfo.balance).toFixed(2)} {tokenInfo.symbol}</p>
                </div>
                <div>
                  <span className="text-gray-600">Giá mint:</span>
                  <p className="font-semibold">{tokenInfo.mintPrice} TEST</p>
                </div>
                <div>
                  <span className="text-gray-600">Đã mint:</span>
                  <p className="font-semibold">{parseFloat(tokenInfo.mintedAmount).toFixed(2)} {tokenInfo.symbol}</p>
                </div>
                <div>
                  <span className="text-gray-600">Còn lại:</span>
                  <p className="font-semibold">{parseFloat(tokenInfo.remainingMintable).toFixed(2)} {tokenInfo.symbol}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form mint */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng token muốn mint
              </label>
              <input
                type="number"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                placeholder="Ví dụ: 100"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {mintAmount && tokenInfo && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  💰 Chi phí: <span className="font-semibold">{calculateCost()} TEST</span>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  + phí gas (khoảng 0.0001 TEST)
                </p>
              </div>
            )}

            <button
              onClick={mintTokens}
              disabled={loading || !mintAmount || parseFloat(mintAmount) <= 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              {loading ? '⏳ Đang mint...' : '🪙 Mint Token'}
            </button>
          </div>

          {/* Transaction hash */}
          {txHash && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Transaction Hash:</p>
              <a
                href={`https://testnet.explorer.sapphire.oasis.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-blue-600 hover:underline break-all"
              >
                {txHash}
              </a>
            </div>
          )}

          {/* Network info */}
          <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
            <p className="text-xs text-purple-800">
              🌐 <strong>Oasis Sapphire Testnet</strong><br/>
              Chain ID: 23295 | RPC: testnet.sapphire.oasis.io
            </p>
          </div>
        </div>
      )}
    </div>
  )
}