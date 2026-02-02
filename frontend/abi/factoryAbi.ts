export const FACTORY_ABI = [
  "function createToken(string memory _name, string memory _symbol, uint256 _totalSupply, string memory _metadataURI) returns (address)",
  "function getTokenCount() view returns (uint256)",
  "function getTokensByCreator(address creator) view returns (address[])",
  "function getTokenInfo(uint256 index) view returns (tuple(address tokenAddress, string name, string symbol, uint256 totalSupply, string metadataURI, address creator, uint256 createdAt))",
  "function getAllTokens() view returns (tuple(address tokenAddress, string name, string symbol, uint256 totalSupply, string metadataURI, address creator, uint256 createdAt)[])",
  "function isToken(address) view returns (bool)",
  "event TokenCreated(address indexed tokenAddress, address indexed creator, string name, string symbol, uint256 totalSupply, string metadataURI)"
] as const;

export const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function metadataURI() view returns (string)",
  "function creator() view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
] as const;

// TokenFactory deployed on Sapphire Testnet
export const FACTORY_ADDRESS = "0xD88489fCd77552fbB57A03dE4Be838dD136d1c40";