// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Send {
    function send(address payable to) external payable {
        to.transfer(msg.value);
    }
}