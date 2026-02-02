# Oasis Token Creator

Token Creator DApp trên Oasis Sapphire Testnet.

## Tính năng

- **Create Token**: Tạo ERC20 token với metadata
- **MetaMask**: Kết nối MetaMask, auto switch network
- **IPFS Upload**: Upload image và metadata
- **Factory Pattern**: Deploy contract riêng cho mỗi token

## Cấu trúc dự án

```
Oasis_Astra/
├── contracts/
│   ├── TokenFactory.sol        # Factory contract
│   └── TokenPolicyMint.sol     # Token template
├── scripts/
│   └── deploy-factory.ts       # Deploy script
├── frontend/
│   ├── app/                    # Next.js pages
│   ├── components/
│   │   └── CreateToken.tsx     # Main component
│   └── abi/
│       └── factoryAbi.ts       # Contract ABIs
└── hardhat.config.ts
```

## Cài đặt và chạy

### 1. Cài đặt dependencies

```bash
npm install
cd frontend && npm install
```

### 2. Chạy frontend

```bash
npm run frontend:dev
```

## Smart Contracts

### TokenFactory
- **Address**: `0xD88489fCd77552fbB57A03dE4Be838dD136d1c40`
- **Network**: Oasis Sapphire Testnet
- **Function**: Deploy TokenPolicyMint contracts

### TokenPolicyMint
- **Template**: ERC20 token với metadata
- **Supply**: 100% mint cho creator
- **Features**: Transfer, approve, allowance

## Mạng Sapphire Testnet

- **RPC URL**: https://testnet.sapphire.oasis.io
- **Chain ID**: 23295 (0x5aff)
- **Currency**: TEST
- **Explorer**: https://testnet.explorer.sapphire.oasis.io

## Scripts

```bash
npm run compile         # Compile contracts
npm run deploy-factory  # Deploy TokenFactory
npm run frontend:dev    # Start frontend
npm run frontend:build  # Build frontend
```

## Cách sử dụng

1. Mở http://localhost:3000
2. Kết nối MetaMask
3. Nhập thông tin token (Name, Symbol, Supply, Description, Image)
4. Nhấn "Create Token"
5. Confirm transaction
6. Nhận contract address mới

---

Made with ❤️ for Oasis Ecosystem