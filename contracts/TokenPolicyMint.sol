// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TokenPolicyMint {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    string public metadataURI;
    address public creator;
    uint256 public pricePerToken;
    bool public isForSale;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TokenPurchased(address indexed buyer, uint256 amount, uint256 totalPrice);
    event TokenSold(address indexed seller, uint256 amount, uint256 totalPrice);
    event PriceUpdated(uint256 newPrice);
    event SaleStatusChanged(bool isForSale);
    
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        string memory _metadataURI,
        address _creator,
        uint256 _pricePerToken
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * 10**decimals;
        metadataURI = _metadataURI;
        creator = _creator;
        pricePerToken = _pricePerToken;
        isForSale = true;
        
        balanceOf[address(this)] = totalSupply;
        emit Transfer(address(0), address(this), totalSupply);
    }
    
    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator can call this function");
        _;
    }
    
    function buyTokens(uint256 amount) external payable {
        require(isForSale, "Token is not for sale");
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf[address(this)] >= amount, "Not enough tokens available");
        
        uint256 totalPrice = (amount * pricePerToken) / (10**decimals);
        require(msg.value >= totalPrice, "Insufficient payment");
        
        balanceOf[address(this)] -= amount;
        balanceOf[msg.sender] += amount;
        
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
        
        emit Transfer(address(this), msg.sender, amount);
        emit TokenPurchased(msg.sender, amount, totalPrice);
    }
    
    function setPrice(uint256 _pricePerToken) external onlyCreator {
        pricePerToken = _pricePerToken;
        emit PriceUpdated(_pricePerToken);
    }
    
    function setSaleStatus(bool _isForSale) external onlyCreator {
        isForSale = _isForSale;
        emit SaleStatusChanged(_isForSale);
    }
    
    function withdrawUnsoldTokens(uint256 amount) external onlyCreator {
        require(balanceOf[address(this)] >= amount, "Not enough tokens in contract");
        
        balanceOf[address(this)] -= amount;
        balanceOf[creator] += amount;
        
        emit Transfer(address(this), creator, amount);
    }
    
    function getAvailableTokens() external view returns (uint256) {
        return balanceOf[address(this)];
    }
    
    function sellTokens(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf[msg.sender] >= amount, "Insufficient token balance");
        require(isForSale, "Token sales are disabled");
        
        uint256 totalPrice = (amount * pricePerToken) / (10**decimals);
        
        require(address(this).balance >= totalPrice, "Contract has insufficient TEST balance");
        
        balanceOf[msg.sender] -= amount;
        balanceOf[address(this)] += amount;
        
        payable(msg.sender).transfer(totalPrice);
        
        emit Transfer(msg.sender, address(this), amount);
        emit TokenSold(msg.sender, amount, totalPrice);
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
}