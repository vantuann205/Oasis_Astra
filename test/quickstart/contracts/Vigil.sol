// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Vigil {
    struct SecretMetadata {
        address creator;
        string name;
        uint256 longevity;
    }

    event SecretCreated(
        address indexed creator,
        string indexed name,
        uint256 index
    );

    SecretMetadata[] public _metas;
    bytes[] private _secrets;
    mapping(address => uint256) public _lastSeen;

    function createSecret(
        string calldata name,
        uint256 longevity,
        bytes calldata secret
    ) external {
        _updateLastSeen();
        _metas.push(
            SecretMetadata({
                creator: msg.sender,
                name: name,
                longevity: longevity
            })
        );
        _secrets.push(secret);
        emit SecretCreated(msg.sender, name, _metas.length - 1);
    }

    function revealSecret(uint256 index) external view returns (bytes memory) {
        require(index < _metas.length, "no such secret");
        address creator = _metas[index].creator;
        uint256 expiry = _lastSeen[creator] + _metas[index].longevity;
        require(block.timestamp >= expiry, "not expired");
        return _secrets[index];
    }

    function refreshSecrets() external {
        _updateLastSeen();
    }

    function _updateLastSeen() internal {
        _lastSeen[msg.sender] = block.timestamp;
    }
}
