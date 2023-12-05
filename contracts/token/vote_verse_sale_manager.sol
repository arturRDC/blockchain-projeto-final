// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVVEToken {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 value) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 value) external returns (bool);

    function transferFrom(address from, address to, uint256 value) external returns (bool);

    function tokenPrice() external view returns (uint);

    function owner() external view returns (address);
}

contract VVETokenICO {
    IVVEToken private _token;

    address public owner;

    event BuyToken(address _buyer, uint _amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not onwer");
        _;
    }

    constructor(address _address)  {
        _token = IVVEToken(_address);
        owner = _token.owner();
    }

    receive() external payable {
        buyToken();
    }

    function buyToken() public payable {
        require(msg.value >= _token.tokenPrice(), "Insufficient value");

        uint amountToken = msg.value / _token.tokenPrice();

        require(amountToken <= tokensAvailableForPurchase(), "Insufficient amount of token for your purchase");

        _token.transferFrom(_token.owner(), msg.sender, amountToken);

        emit BuyToken(msg.sender, amountToken);
    }

    function redeemEther() public onlyOwner {
        (bool success, ) = payable(_token.owner()).call{value: address(this).balance}("");
        require(success, "Failed to send Ether");
    }

    function tokensAvailableForPurchase() public view returns (uint) {
        require(_token.balanceOf(_token.owner()) > 0, "The owner doesn't have tokens");
        require(_token.allowance(_token.owner(), address(this)) > 0, "No permission to transact");

        return _token.allowance(_token.owner(), address(this));
    }

    function tokenPrice() public view returns (uint) {
        return _token.tokenPrice();
    }
}
