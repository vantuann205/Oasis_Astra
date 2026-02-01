# Astra.Oasis DApp

DApp mint token trên Oasis Sapphire Testnet với MetaMask.

## Tính năng

- **Mint Token**: Mint OAT token với phí 0.001 TEST
- **MetaMask**: Kết nối MetaMask, auto switch network
- **Sapphire**: Sử dụng Oasis Sapphire privacy features
- **Responsive**: Giao diện thân thiện

## Cấu trúc dự án

```
Oasis_Astra/
├── contracts/              # Smart contracts
│   └── SimpleToken.sol     # ERC20 token với mint
├── scripts/                # Deploy scripts
│   └── deploy.ts          # Deploy script
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   └── abi/              # Contract ABIs
├── hardhat.config.ts      # Hardhat config
└── package.json          # Dependencies
```

## Cài đặt và chạy

### 1. Cài đặt dependencies

```bash
# Root project
npm install

# Frontend
cd frontend && npm install
```

### 2. Deploy contract (nếu cần)

```bash
npm run deploy-metamask
```

### 3. Chạy frontend

```bash
npm run frontend:dev
```

## Smart Contract - SimpleToken

- **Name**: Oasis Astra Token (OAT)
- **Address**: `0x774372fB7c8D6e484dbc7AE9c0f7771F070C30Db`
- **Mint Price**: 0.001 TEST per token
- **Network**: Oasis Sapphire Testnet

### Chức năng

- `mint(uint256 amount)`: Mint token với phí
- `calculateMintCost(uint256 amount)`: Tính chi phí mint
- `balanceOf(address)`: Xem số dư token

## Mạng Sapphire Testnet

- **RPC URL**: https://testnet.sapphire.oasis.io
- **Chain ID**: 23295 (0x5aff)
- **Currency**: TEST
- **Explorer**: https://testnet.explorer.sapphire.oasis.io

## Scripts

```bash
npm run compile        # Compile contracts
npm run deploy         # Deploy to testnet
npm run deploy-metamask # Deploy với MetaMask key
npm run frontend:dev   # Start frontend
npm run frontend:build # Build frontend
```

## Cách sử dụng

1. Mở http://localhost:3000
2. Kết nối MetaMask (tự động switch network)
3. Nhập số lượng token muốn mint
4. Confirm transaction
5. Xem trên explorer

---