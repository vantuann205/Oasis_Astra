# Astra.Oasis - Token Creator DApp

A decentralized application for creating and trading ERC20 tokens on Oasis Sapphire Testnet. Built with pump.fun-style trading mechanics.

## Features

- **Token Creation**: Create custom ERC20 tokens with configurable parameters
- **Direct Trading**: Buy and sell tokens directly from/to the contract (pump.fun style)
- **Instant Liquidity**: Contract holds all liquidity for immediate trading
- **Privacy-Enabled**: Built on Oasis Sapphire for enhanced privacy
- **No Marketplace Fees**: Direct peer-to-contract trading

## Architecture

### Smart Contracts

- **TokenFactory**: Factory contract for deploying new tokens
- **TokenPolicyMint**: Individual token contract with built-in trading functionality

### Frontend

- **Next.js 14**: Modern React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Ethers.js v6**: Ethereum interaction library

## Quick Start

### Prerequisites

- Node.js 18+
- MetaMask or compatible wallet
- Oasis Sapphire Testnet setup

### Installation

```bash
# Clone repository
git clone <repository-url>
cd Oasis_Astra

# Install dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Deployment

```bash
# Compile contracts
npm run compile

# Deploy TokenFactory
npm run deploy-factory

# Start frontend
npm run frontend:dev
```

### Network Configuration

Add Oasis Sapphire Testnet to MetaMask:

- **Network Name**: Oasis Sapphire Testnet
- **RPC URL**: https://testnet.sapphire.oasis.io
- **Chain ID**: 23295
- **Currency Symbol**: TEST
- **Block Explorer**: https://testnet.explorer.sapphire.oasis.io

## Usage

1. **Connect Wallet**: Connect your MetaMask to Oasis Sapphire Testnet
2. **Create Token**: Fill in token details and deploy
3. **Trade Tokens**: Buy/sell tokens directly with instant settlement
4. **Manage Portfolio**: View your token holdings and trading history

## Contract Addresses

- **TokenFactory**: `0x8baad22C0D3501aD56687881EaCBE836D88313e6`

## Technology Stack

- **Blockchain**: Oasis Sapphire Testnet
- **Smart Contracts**: Solidity ^0.8.24
- **Development**: Hardhat
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Web3**: Ethers.js v6, Oasis Sapphire Paratime

## Security Features

- **Privacy-Enabled**: Leverages Oasis Sapphire's confidential smart contracts
- **Audited Libraries**: Uses OpenZeppelin contracts as base
- **Input Validation**: Comprehensive parameter validation
- **Safe Math**: Built-in overflow protection

## Project Structure

```
Oasis_Astra/
├── contracts/
│   ├── TokenFactory.sol        # Factory contract
│   └── TokenPolicyMint.sol     # Token template with trading
├── scripts/
│   └── deploy-factory.ts       # Deploy script
├── frontend/
│   ├── app/                    # Next.js App Router
│   ├── components/
│   │   ├── CreateToken.tsx     # Token creation form
│   │   └── TokenMarketplace.tsx # Trading interface
│   └── abi/
│       └── factoryAbi.ts       # Contract ABIs
└── hardhat.config.ts
```

## Development

```bash
# Compile contracts
npm run compile

# Clean build artifacts
npm run clean

# Deploy to testnet
npm run deploy-factory

# Run frontend
npm run frontend:dev

# Build frontend
npm run frontend:build
```

## Trading Mechanics

### Buy Tokens
- Users send TEST tokens to contract
- Receive tokens at current price
- Contract holds TEST for liquidity

### Sell Tokens
- Users send tokens back to contract
- Receive TEST at current price
- Instant settlement

### Price Discovery
- Fixed price per token set by creator
- No slippage or AMM mechanics
- Simple and predictable trading

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue in the repository.

---

Built with ❤️ for Oasis Ecosystem