'use client'

import dynamic from 'next/dynamic'

const ConnectWallet = dynamic(() => import('../components/ConnectWallet'), { ssr: false })
const MintToken = dynamic(() => import('../components/MintToken'), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🌟 Oasis Astra DApp
          </h1>
          <p className="text-gray-600">
            Mint token thật trên Oasis Sapphire Testnet
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Mint Token Section */}
          <div>
            <MintToken />
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">💼 Kết nối ví</h2>
              <ConnectWallet />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">ℹ️ Thông tin mạng</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mạng:</span>
                  <span className="font-semibold">Oasis Sapphire Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chain ID:</span>
                  <span className="font-semibold">23295 (0x5aff)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">RPC URL:</span>
                  <span className="font-mono text-xs">testnet.sapphire.oasis.io</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Explorer:</span>
                  <a 
                    href="https://testnet.explorer.sapphire.oasis.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs"
                  >
                    testnet.explorer.sapphire.oasis.io
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">🚀 Cách sử dụng</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>Đảm bảo MetaMask đã cài đặt</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>Có TEST token trong ví</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>Kết nối ví và mint OAT token</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>Xem transaction trên explorer</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">⚙️ Contract Info</h2>
              <div className="space-y-2 text-xs">
                <div className="bg-gray-100 p-2 rounded font-mono break-all">
                  0x774372fB7c8D6e484dbc7AE9c0f7771F070C30Db
                </div>
                <a 
                  href="https://testnet.explorer.sapphire.oasis.io/address/0x774372fB7c8D6e484dbc7AE9c0f7771F070C30Db" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs"
                >
                  View on Explorer
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>🔒 Powered by Oasis Sapphire - Privacy-enabled EVM</p>
        </div>
      </div>
    </main>
  )
}
