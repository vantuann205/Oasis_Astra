# astra.oasis

A decentralized token creation and trading platform built on Oasis Sapphire Testnet with pump.fun-style mechanics.

## Overview

Astra.oasis is a DApp that enables users to create custom ERC20 tokens and trade them instantly through a built-in automated market maker. Each token contract maintains its own liquidity pool, allowing for immediate buy/sell operations without external exchanges.

## Key Features

- **One-Click Token Creation**: Deploy custom ERC20 tokens with configurable parameters
- **Instant Trading**: Buy and sell tokens directly through smart contracts
- **Built-in Liquidity**: Each token maintains its own liquidity pool
- **Privacy-First**: Leverages Oasis Sapphire's confidential computing capabilities
- **Zero Slippage**: Fixed-price trading model for predictable transactions
- **Gas Efficient**: Optimized smart contracts for minimal transaction costs

## Architecture

### Smart Contract Layer
- **TokenFactory.sol**: Factory pattern for deploying individual token contracts
- **TokenPolicyMint.sol**: ERC20 token with integrated trading functionality

### Frontend Layer
- **Next.js 14**: React-based frontend with App Router
- **TypeScript**: Type-safe development environment
- **Tailwind CSS**: Utility-first styling framework
- **Ethers.js v6**: Web3 integration library

## Getting Started

### Prerequisites
- Node.js 18 or higher
- MetaMask or compatible Web3 wallet
- Access to Oasis Sapphire Testnet

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/astra.oasis.git
cd astra.oasis

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Configuration

1. **Environment Setup**
   ```bash
   cp .env.example .env
   # Add your private key to .env file
   ```

2. **Network Configuration**
   Add Oasis Sapphire Testnet to your wallet:
   - **Network Name**: Oasis Sapphire Testnet
   - **RPC URL**: https://testnet.sapphire.oasis.io
   - **Chain ID**: 23295
   - **Currency Symbol**: TEST
   - **Block Explorer**: https://testnet.explorer.sapphire.oasis.io

### Deployment

```bash
# Compile smart contracts
npm run compile

# Deploy TokenFactory to testnet
npm run deploy-factory

# Start development server
npm run frontend:dev
```

## Usage Guide

### Creating Tokens
1. Connect your wallet to Oasis Sapphire Testnet
2. Fill in token details (name, symbol, supply, price, metadata)
3. Submit transaction and wait for confirmation
4. Your token is now live and tradeable

### Trading Tokens
1. Browse available tokens in the trading interface
2. Enter amount to buy/sell
3. Confirm transaction
4. Tokens are instantly transferred

## Smart Contract Details

### TokenFactory
- **Address**: `0x8baad22C0D3501aD56687881EaCBE836D88313e6`
- **Purpose**: Deploys and manages individual token contracts
- **Functions**: Create tokens, retrieve token information

### TokenPolicyMint
- **Type**: ERC20 with trading capabilities
- **Features**: Buy/sell functions, liquidity management, creator controls
- **Security**: Input validation, overflow protection, access controls

## Technical Specifications

### Blockchain
- **Network**: Oasis Sapphire Testnet
- **Consensus**: Proof of Stake
- **Privacy**: Confidential smart contracts
- **Finality**: ~6 seconds

### Development Stack
- **Smart Contracts**: Solidity ^0.8.24
- **Framework**: Hardhat
- **Testing**: Hardhat Test Suite
- **Frontend**: Next.js 14, TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Ethers.js v6, Oasis Sapphire Paratime

## Project Structure

```
astra.oasis/
├── contracts/
│   ├── TokenFactory.sol        # Factory contract
│   └── TokenPolicyMint.sol     # Token template
├── scripts/
│   └── deploy-factory.ts       # Deployment script
├── frontend/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main page
│   ├── components/
│   │   ├── CreateToken.tsx     # Token creation form
│   │   └── TokenMarketplace.tsx # Trading interface
│   └── abi/
│       └── factoryAbi.ts       # Contract ABIs
├── hardhat.config.ts           # Hardhat configuration
└── package.json                # Dependencies
```

## Trading Mechanics

### Buy Process
1. User specifies token amount to purchase
2. Contract calculates required TEST payment
3. TEST is transferred to token contract
4. Tokens are minted/transferred to user
5. Contract maintains TEST for future sell orders

### Sell Process
1. User specifies token amount to sell
2. Contract validates user balance
3. Tokens are transferred back to contract
4. TEST is transferred to user at current price
5. Liquidity pool is updated

### Price Model
- Fixed price per token set by creator
- No dynamic pricing or AMM curves
- Predictable costs for users
- No impermanent loss risk

## Security Features

- **Access Controls**: Creator-only functions for token management
- **Input Validation**: Comprehensive parameter checking
- **Overflow Protection**: SafeMath operations throughout
- **Reentrancy Guards**: Protection against reentrancy attacks
- **Privacy**: Confidential transactions on Oasis Sapphire

## Development Commands

```bash
# Smart contract operations
npm run compile              # Compile contracts
npm run clean               # Clean build artifacts
npm run deploy-factory      # Deploy to testnet

# Frontend operations
npm run frontend:dev        # Start development server
npm run frontend:build      # Build for production
npm run frontend:start      # Start production server
```

## API Reference

### TokenFactory Methods
- `createToken()`: Deploy new token contract
- `getAllTokens()`: Retrieve all created tokens
- `getTokensByCreator()`: Get tokens by creator address

### TokenPolicyMint Methods
- `buyTokens()`: Purchase tokens with TEST
- `sellTokens()`: Sell tokens back to contract
- `getAvailableTokens()`: Check available token supply
- `getContractBalance()`: Check contract TEST balance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- **Live Demo**: [https://astra-oasis.vercel.app](https://astra-oasis.vercel.app)
- **Documentation**: [https://docs.astra-oasis.com](https://docs.astra-oasis.com)
- **Explorer**: [https://testnet.explorer.sapphire.oasis.io](https://testnet.explorer.sapphire.oasis.io)
- **Oasis Network**: [https://oasisprotocol.org](https://oasisprotocol.org)

## Support

For questions, issues, or contributions:
- Open an issue on GitHub
- Join our Discord community
- Follow us on Twitter [@astra_oasis](https://twitter.com/astra_oasis)

---

**Built with ❤️ for the Oasis Ecosystem**