// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Coinflip {
    event CoinFlipped(address indexed player, bool won, uint256 amount);

    function flipCoin(bool _guess) external payable {
        require(msg.value > 0, "You must send some ether!");

        uint256 randomResult = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 2; // 0 or 1
        bool result = randomResult == 0; // Let's say 0 is heads and 1 is tails

        if (result == _guess) {
            // Player wins, return double their bet
            payable(msg.sender).transfer(msg.value * 2);
            emit CoinFlipped(msg.sender, true, msg.value * 2);
        } else {
            // Player loses, keep their bet
            emit CoinFlipped(msg.sender, false, msg.value);
        }
    }
}
