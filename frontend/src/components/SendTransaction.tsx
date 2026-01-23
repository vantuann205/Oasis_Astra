'use client'

import { useState } from 'react'
import { useAccount, useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'

export default function SendTransaction() {
  const { isConnected } = useAccount()
  const { sendTransaction } = useSendTransaction()

  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')

  const send = () => {
    if (!to || !amount) return alert('Nhập đầy đủ thông tin')

    sendTransaction({
      to,
      value: parseEther(amount),
    })
  }

  if (!isConnected) return null

  return (
    <div className="mt-6 space-y-3">
      <div>
        <input
          className="border p-2 w-full"
          placeholder="Địa chỉ người nhận"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      <div>
        <input
          className="border p-2 w-full"
          placeholder="Số TEST muốn gửi (vd 0.01)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          min="0"
          step="0.0001"
        />
      </div>

      <button
        onClick={send}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Gửi TEST (Sapphire)
      </button>
    </div>
  )
}