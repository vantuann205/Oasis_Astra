'use client'

import { useState } from 'react'
import { BrowserProvider, Contract } from 'ethers'
import { wrapEthereumProvider } from '@oasisprotocol/sapphire-paratime'
import { FACTORY_ABI, FACTORY_ADDRESS } from '../abi/factoryAbi'

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

interface TokenForm {
  name: string
  symbol: string
  totalSupply: string
  description: string
  image: File | null
}

export default function CreateToken() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [form, setForm] = useState<TokenForm>({
    name: '',
    symbol: '',
    totalSupply: '',
    description: '',
    image: null
  })
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [createdToken, setCreatedToken] = useState('')

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Vui lòng cài đặt MetaMask!')
      return
    }

    // If multiple wallets, try to use MetaMask specifically
    let ethereum = window.ethereum
    if (window.ethereum.providers) {
      ethereum = window.ethereum.providers.find((provider: any) => provider.isMetaMask)
      if (!ethereum) {
        alert('Không tìm thấy MetaMask!')
        return
      }
    }

    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length > 0) {
        // Switch to Sapphire Testnet
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x5aff' }],
          })
        } catch (switchError: any) {
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
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error)
      alert('Lỗi kết nối ví!')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm({ ...form, image: file })
    }
  }

  const uploadToIPFS = async (data: any): Promise<string> => {
    // Simulate IPFS upload - trong thực tế sẽ upload lên IPFS/Arweave
    console.log('Uploading to IPFS...', data)
    
    // Mock IPFS hash
    const mockHash = 'QmX' + Math.random().toString(36).substring(2, 15)
    return `ipfs://${mockHash}`
  }

  const createToken = async () => {
    if (!form.name || !form.symbol || !form.totalSupply) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    setLoading(true)
    setTxHash('')
    setCreatedToken('')

    try {
      // 1. Upload image and metadata to IPFS
      let metadataURI = ''
      if (form.image || form.description) {
        const metadata = {
          name: form.name,
          symbol: form.symbol,
          description: form.description,
          image: form.image ? await uploadToIPFS(form.image) : '',
          totalSupply: form.totalSupply
        }
        metadataURI = await uploadToIPFS(metadata)
      }

      // 2. Connect to contract
      let ethereum = window.ethereum
      if (window.ethereum?.providers) {
        ethereum = window.ethereum.providers.find((provider: any) => provider.isMetaMask)
      }

      const wrappedProvider = wrapEthereumProvider(ethereum)
      const provider = new BrowserProvider(wrappedProvider)
      const signer = await provider.getSigner()
      const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI, signer)

      // 3. Create token
      console.log('Creating token...', {
        name: form.name,
        symbol: form.symbol,
        totalSupply: form.totalSupply,
        metadataURI
      })

      const tx = await factory.createToken(
        form.name,
        form.symbol,
        form.totalSupply,
        metadataURI
      )

      setTxHash(tx.hash)
      console.log('Transaction sent:', tx.hash)

      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt)

      // Extract token address from event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = factory.interface.parseLog(log)
          return parsed?.name === 'TokenCreated'
        } catch {
          return false
        }
      })

      if (event) {
        const parsed = factory.interface.parseLog(event)
        const tokenAddress = parsed?.args[0]
        setCreatedToken(tokenAddress)
        alert(`✅ Token created successfully!\nAddress: ${tokenAddress}`)
      }

      // Reset form
      setForm({
        name: '',
        symbol: '',
        totalSupply: '',
        description: '',
        image: null
      })

    } catch (error: any) {
      console.error('Lỗi tạo token:', error)
      if (error.message.includes('insufficient funds')) {
        alert('❌ Không đủ TEST token để trả phí gas!')
      } else if (error.message.includes('user rejected')) {
        alert('❌ Bạn đã từ chối transaction!')
      } else {
        alert(`❌ Lỗi tạo token: ${error.message || error}`)
      }
    } finally {
      setLoading(false)
    }
  }

  if (!connected) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8" style={{
        maxWidth: '28rem',
        margin: '0 auto',
        background: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '2rem'
      }}>
        <div className="text-center space-y-6" style={{ textAlign: 'center' }}>
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center" style={{
            width: '4rem',
            height: '4rem',
            background: 'linear-gradient(90deg, #a855f7, #ec4899)',
            borderRadius: '50%',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span className="text-white text-2xl font-bold" style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>T</span>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>Token Creator</h2>
            <p className="text-gray-600" style={{ color: '#4b5563' }}>Tạo token của riêng bạn trên Oasis Sapphire</p>
          </div>
          <button
            onClick={connectWallet}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, #9333ea, #db2777)',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #7c3aed, #be185d)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #9333ea, #db2777)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Kết nối MetaMask
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8" style={{
      maxWidth: '42rem',
      margin: '0 auto',
      background: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '2rem'
    }}>
      <div className="text-center mb-8" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center mb-4" style={{
          width: '4rem',
          height: '4rem',
          background: 'linear-gradient(90deg, #a855f7, #ec4899)',
          borderRadius: '50%',
          margin: '0 auto 1rem auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span className="text-white text-2xl font-bold" style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>T</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2" style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>Create Your Token</h2>
        <p className="text-gray-600" style={{ color: '#4b5563' }}>Deploy your own ERC20 token on Oasis Sapphire</p>
      </div>

      {/* Wallet Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6" style={{
        background: '#f9fafb',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <p className="text-sm text-gray-600" style={{ fontSize: '0.875rem', color: '#4b5563' }}>Connected Wallet:</p>
        <p className="font-mono text-sm text-gray-800 break-all" style={{
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          color: '#1f2937',
          wordBreak: 'break-all'
        }}>{address}</p>
      </div>

      {/* Form */}
      <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="grid md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Token Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. My Awesome Token"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                outline: 'none',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Symbol *
            </label>
            <input
              type="text"
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
              placeholder="e.g. MAT"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                outline: 'none',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Total Supply *
          </label>
          <input
            type="number"
            value={form.totalSupply}
            onChange={(e) => setForm({ ...form, totalSupply: e.target.value })}
            placeholder="e.g. 1000000"
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              outline: 'none',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your token..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              outline: 'none',
              fontSize: '1rem',
              resize: 'vertical',
              minHeight: '80px'
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Token Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              outline: 'none',
              fontSize: '1rem'
            }}
          />
          {form.image && (
            <p className="text-sm text-green-600 mt-2" style={{
              fontSize: '0.875rem',
              color: '#059669',
              marginTop: '0.5rem'
            }}>
              Selected: {form.image.name}
            </p>
          )}
        </div>

        <button
          onClick={createToken}
          disabled={loading || !form.name || !form.symbol || !form.totalSupply}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:scale-100"
          style={{
            width: '100%',
            background: loading || !form.name || !form.symbol || !form.totalSupply 
              ? 'linear-gradient(90deg, #9ca3af, #9ca3af)' 
              : 'linear-gradient(90deg, #9333ea, #db2777)',
            color: 'white',
            fontWeight: 'bold',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: loading || !form.name || !form.symbol || !form.totalSupply ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            transform: 'scale(1)',
            fontSize: '1rem'
          }}
          onMouseEnter={(e) => {
            if (!loading && form.name && form.symbol && form.totalSupply) {
              e.currentTarget.style.background = 'linear-gradient(90deg, #7c3aed, #be185d)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && form.name && form.symbol && form.totalSupply) {
              e.currentTarget.style.background = 'linear-gradient(90deg, #9333ea, #db2777)';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          {loading ? 'Creating Token...' : 'Create Token'}
        </button>
      </div>

      {/* Transaction Info */}
      {txHash && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4" style={{
          marginTop: '1.5rem',
          background: '#eff6ff',
          borderRadius: '0.5rem',
          padding: '1rem'
        }}>
          <p className="text-sm text-blue-800 font-medium" style={{
            fontSize: '0.875rem',
            color: '#1e40af',
            fontWeight: '500'
          }}>Transaction Hash:</p>
          <a
            href={`https://testnet.explorer.sapphire.oasis.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-blue-600 hover:underline break-all"
            style={{
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              color: '#2563eb',
              textDecoration: 'none',
              wordBreak: 'break-all'
            }}
          >
            {txHash}
          </a>
        </div>
      )}

      {/* Created Token */}
      {createdToken && (
        <div className="mt-6 bg-green-50 rounded-lg p-4" style={{
          marginTop: '1.5rem',
          background: '#f0fdf4',
          borderRadius: '0.5rem',
          padding: '1rem'
        }}>
          <p className="text-sm text-green-800 font-medium" style={{
            fontSize: '0.875rem',
            color: '#166534',
            fontWeight: '500'
          }}>Token Created Successfully!</p>
          <p className="text-sm text-green-700" style={{
            fontSize: '0.875rem',
            color: '#15803d'
          }}>Contract Address:</p>
          <a
            href={`https://testnet.explorer.sapphire.oasis.io/address/${createdToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-green-600 hover:underline break-all"
            style={{
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              color: '#16a34a',
              textDecoration: 'none',
              wordBreak: 'break-all'
            }}
          >
            {createdToken}
          </a>
        </div>
      )}
    </div>
  )
}