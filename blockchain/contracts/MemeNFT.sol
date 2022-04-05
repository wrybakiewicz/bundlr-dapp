//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MemeNFT is ERC721URIStorage {

    enum Vote{NO_VOTE, UP, DOWN}

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(address => mapping(uint => Vote)) addressTokenIdVotes;

    event VoteUp(address voter, uint tokenId);
    event VoteDown(address voter, uint tokenId);

    constructor() ERC721("MemeNFT", "MNFT") {}

    function mint(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    function voteUp(uint _tokenId) public {
        addressTokenIdVotes[msg.sender][_tokenId] = Vote.UP;
        emit VoteUp(msg.sender, _tokenId);
    }

    function voteDown(uint _tokenId) public {
        addressTokenIdVotes[msg.sender][_tokenId] = Vote.DOWN;
        emit VoteDown(msg.sender, _tokenId);
    }

    function getAddressTokenIdVote(address _voter, uint _tokenId) public view returns (Vote) {
        return addressTokenIdVotes[_voter][_tokenId];
    }

}
