export const TOKEN_ABI = [
  // ERC20 Basic
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  
  // Mint Functions
  "function mint(uint256 amount) payable",
  "function mintPrice() view returns (uint256)",
  "function mintedAmount(address) view returns (uint256)",
  "function calculateMintCost(uint256 amount) view returns (uint256)",
  
  // Events
  "event TokensMinted(address indexed to, uint256 amount, uint256 cost)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
] as const;

// Địa chỉ contract đã deploy trên Sapphire Testnet
export const TOKEN_ADDRESS = "0x774372fB7c8D6e484dbc7AE9c0f7771F070C30Db";