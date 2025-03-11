// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PostingContract is Ownable {
    struct Posting {
        string id;
        address issuer;
        bool isCompleted;
        uint256 createdAt;
        uint256 completedAt;
    }

    mapping(string => Posting) public postings;
    uint256 public postingFee = 0.00001 ether;

    event PostingCompleted(address indexed issuer, string postingId);
    event PostingCreated(address indexed issuer, string postingId);

    constructor() Ownable(msg.sender) {}

    function createPosting(string memory _postingId) external payable {
        require(msg.value >= postingFee, "Insufficient fee");
        require(postings[_postingId].issuer == address(0), "Posting already exists");

        postings[_postingId] = Posting({
            id: _postingId,
            issuer: msg.sender,
            isCompleted: false,
            createdAt: block.timestamp,
            completedAt: 0
        });

        emit PostingCreated(msg.sender, _postingId);
    }

    function completePosting(string memory _postingId) external payable {
        require(msg.value >= postingFee, "Insufficient fee");
        require(postings[_postingId].issuer == msg.sender, "Not the posting issuer");
        require(!postings[_postingId].isCompleted, "Posting already completed");

        postings[_postingId].isCompleted = true;
        postings[_postingId].completedAt = block.timestamp;

        emit PostingCompleted(msg.sender, _postingId);
    }

    function updatePostingFee(uint256 _newFee) external onlyOwner {
        postingFee = _newFee;
    }

    function withdrawFees() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }
}