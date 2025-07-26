// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CrossChainEmitter {
    event MessageSent(string message);

    function sendMessage(string calldata message) public {
        emit MessageSent(message);
    }
}
