'use client'

import dynamic from 'next/dynamic'

const ConnectWallet = dynamic(() => import('@/components/ConnectWallet'), { ssr: false })
const SendTransaction = dynamic(() => import('@/components/SendTransaction'), { ssr: false })

export default function Home() {
  return (
    <main className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4">Sapphire dApp</h1>

      <ConnectWallet />

      <SendTransaction />
    </main>
  )
}
