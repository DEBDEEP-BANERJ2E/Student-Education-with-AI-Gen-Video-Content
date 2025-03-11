// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./UserProfile.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProfileFactory is Ownable {
    UserProfile public userProfileContract;
    
    event ProfileContractDeployed(address contractAddress);

    constructor() Ownable(msg.sender) {
        userProfileContract = new UserProfile();
        emit ProfileContractDeployed(address(userProfileContract));
    }

    function upgradeProfileContract() external onlyOwner {
        userProfileContract = new UserProfile();
        emit ProfileContractDeployed(address(userProfileContract));
    }
}