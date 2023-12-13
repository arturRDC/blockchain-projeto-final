// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./token/vote_verse_token.sol"; 
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DappPoll {
    struct Poll {
        address owner;
        string title;
        string description;
        string[] options;
        mapping(uint => uint) votesPerOption;
        uint totalVotes;
        uint closingTime;
        bool open;
    }

    address public owner;
    address public voteVerseToken;
    uint public minimumDuration;
    uint public _amountTokenToRedeem;
    uint[] public pollIDs;
    mapping (uint => Poll) private _polls;
    mapping (address => bool) private _authorizedsScreenwriters;

    event CreatePoll(address ownerPoll, string title, string description, string[] options, uint id, uint closingTime);
    event VotePoll(address voter, uint option, uint totalVotes);
    event ClosePoll(address ownerPoll, uint id, uint timesTamp);

    constructor(address _voteVerseToken) {
        owner = msg.sender;
        voteVerseToken = _voteVerseToken;
        minimumDuration = 1 minutes;
        addScreenwriter(owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner.");
        _;
    }

    modifier onlyScreenwriter() {
        require(_authorizedsScreenwriters[msg.sender], "Not authorized to manage polls.");
        _;
    }

    modifier canTransfer(uint _tokenAmount) {
        uint allowance = IERC20(voteVerseToken).allowance(msg.sender, address(this));

        if (allowance == 0) {
            revert("This contract is not approved to transfer your tokens");
        } else if (allowance < _tokenAmount) {
            revert("You are trying to transfer more tokens than approved for this contract");
        }
        _;
    }

    modifier pollOpen(uint _id) {
        require(_polls[_id].open, "Poll is closed.");
        require(block.timestamp < _polls[_id].closingTime, "Poll is closed");

        _;
    }

    function addScreenwriter(address _screenwriter) public onlyOwner {
        _authorizedsScreenwriters[_screenwriter] = true;
    }

    function removeScreenwriter(address _screenwriter) public onlyOwner {
        _authorizedsScreenwriters[_screenwriter] = false;
    }

    function createPoll(string memory _title, string memory _description, string[] memory _options, uint _duration) public onlyScreenwriter {
        require(_options.length > 1, "There must be at least two options");
        require(_duration >= minimumDuration, "The duration must be greater than the minimum duration time");

        uint _pollID = _generatePollID();
        uint _closingTime = block.timestamp + _duration;

        _polls[_pollID].owner = msg.sender;
        _polls[_pollID].title = _title;
        _polls[_pollID].description = _description;
        _polls[_pollID].options = _options;
        _polls[_pollID].closingTime = _closingTime;
        _polls[_pollID].open = true;

        pollIDs.push(_pollID);

        for (uint i = 0; i < _options.length; i++) {
            _polls[_pollID].votesPerOption[i] = 0;
        }

        emit CreatePoll(msg.sender, _title, _description, _options, _pollID, _closingTime);
    }

    function votePoll(uint _id, uint _option, uint _tokenAmount) public pollOpen(_id) canTransfer(_tokenAmount) {
        require(_option < _polls[_id].options.length, "Option does not exist");
        require(_tokenAmount > 0, "Token amount must be greater than 0");
        require(IERC20(voteVerseToken).transferFrom(msg.sender, address(this), _tokenAmount), "Token transfer failed");

        _polls[_id].votesPerOption[_option] += _tokenAmount;
        _polls[_id].totalVotes += _tokenAmount;
        _amountTokenToRedeem += ((_tokenAmount * 30) / 100);

        emit VotePoll(msg.sender, _option, _polls[_id].totalVotes);
    }

    function getPoll(uint _id) public view returns (string memory title, string memory description, string[] memory options, uint totalVotes,uint[] memory votesPerOption, uint _closingTime, bool open) {
        Poll storage poll = _polls[_id];
        uint amountOptions = poll.options.length;
        uint[] memory _votesPerOption = new uint[](amountOptions);

        for (uint i = 0; i < amountOptions; i++) {
            _votesPerOption[i] = poll.votesPerOption[i];
        }

        return (
            poll.title,
            poll.description,
            poll.options,
            poll.totalVotes,
            _votesPerOption,
            poll.closingTime,
            poll.open
        );
    }

    function closePoll(uint _id) public onlyScreenwriter {
        require(_polls[_id].open == true);
        require(msg.sender == _polls[_id].owner, "Not owner of poll");
        require(block.timestamp >  _polls[_id].closingTime, "The poll has not yet reached the defined maximum time");
        
        _polls[_id].open = false;
        _transferTokenToWriter(_id);

        emit ClosePoll(_polls[_id].owner, _id, block.timestamp);
    }

    function setMinimumDuration(uint _time) public onlyOwner {
        minimumDuration = _time;
    }

    function redeemToken() public onlyOwner returns (uint) {
        uint aux = _amountTokenToRedeem;

        IERC20(voteVerseToken).transfer(owner, _amountTokenToRedeem);
        _amountTokenToRedeem = 0;

        return aux;
    }

    function _transferTokenToWriter(uint _id) private {
        uint amountToTransfer = ((_polls[_id].totalVotes * 70) / 100);
        
        if (amountToTransfer > 0) {
            IERC20(voteVerseToken).transfer(_polls[_id].owner, amountToTransfer);
        }

    }

    function _generatePollID() private view returns (uint) {
        uint id = uint(keccak256(abi.encodePacked(msg.sender, block.timestamp)));
        return id % 1000; 
    }
}