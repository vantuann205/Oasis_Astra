import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';

export const sapphireTestnet = defineChain({
  id: 0x5aff,
  name: 'Oasis Sapphire Testnet',
  network: 'sapphire-testnet',
  nativeCurrency: {
    name: 'Oasis TEST',
    symbol: 'TEST',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.sapphire.oasis.io/'],
    },
  },
  blockExplorers: {
    default: { name: 'Oasis Explorer', url: 'https://explorer.oasis.io/testnet/sapphire' },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [sapphireTestnet],
  transports: {
    [sapphireTestnet.id]: http(),
  },
});