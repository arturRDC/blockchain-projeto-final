// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CPNToken is ERC20 {
    address public owner;
    uint public tokenPrice;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not onwer");
        _;
    }
   
    constructor() ERC20("VoteVerse", "VVE") {
        _mint(msg.sender, 100000);
        owner = msg.sender;
        tokenPrice = 0.00001 ether;
    }

    function createTokens(uint _amount) public onlyOwner {
        _mint(owner, _amount);
    }

    function destroyTokens(uint _amount) public onlyOwner {
        _burn(owner, _amount);
    }
}