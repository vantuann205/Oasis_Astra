// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleToken {
    string public name = "Oasis Astra Token";
    string public symbol = "OAT";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    uint256 public mintPrice = 0.001 ether;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public mintedAmount;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event TokensMinted(address indexed to, uint256 amount, uint256 cost);
    
    constructor() {
        totalSupply = 100000 * 10**18; // 100k initial supply
        balanceOf[msg.sender] = totalSupply;
    }
    
    function mint(uint256 amount) external payable {
        require(amount > 0, "Amount must be greater than 0");
        require(msg.value >= (amount * mintPrice) / 10**18, "Insufficient payment");
        
        mintedAmount[msg.sender] += amount;
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
        
        // Refund excess payment
        if (msg.value > (amount * mintPrice) / 10**18) {
            payable(msg.sender).transfer(msg.value - (amount * mintPrice) / 10**18);
        }
        
        emit TokensMinted(msg.sender, amount, (amount * mintPrice) / 10**18);
        emit Transfer(address(0), msg.sender, amount);
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function calculateMintCost(uint256 amount) external view returns (uint256) {
        return (amount * mintPrice) / 10**18;
    }
}