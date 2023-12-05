// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract DappPoll {
    // Estrutura básica de uma enquete 
    struct Poll {
        address owner;
        string title;
        string description;
        string[] options;
        mapping(uint => uint) votesPerOption;
        uint totalVotes;
    }

    address public owner;
    uint[] public pollIDs;
    mapping (uint => Poll) private _polls; // As enquetes serão acessadas a partir do seu id, que é gerado aleatoriamente
    mapping (address => bool) private _authorizedsScreenwriters;

    event CreatePoll(address ownerPoll, string title, string description, string[] options, uint id);
    event VotePoll(address voter, uint option, uint totalVotes);

    constructor() {
        owner = msg.sender;
        addScreenwriter(owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner.");
        _;
    }

    modifier onlyScreenwriter() {
        require(_authorizedsScreenwriters[msg.sender], "Not authorized to create polls.");
        _;
    }

    function addScreenwriter(address _screenwriter) public onlyOwner {
        _authorizedsScreenwriters[_screenwriter] = true;
    }

    function removeScreenwriter(address _screenwriter) public onlyOwner {
        _authorizedsScreenwriters[_screenwriter] = false;
    }

    function createPoll(string memory _title, string memory _description, string[] memory _options) public onlyScreenwriter {
        require(_options.length > 1, "There must be at least two options");

        uint _pollID = _generatePollID();

        _polls[_pollID].owner = msg.sender;
        _polls[_pollID].title = _title;
        _polls[_pollID].description = _description;
        _polls[_pollID].options = _options;

        pollIDs.push(_pollID);

        // Inicializando a chave do mapping votesPerOption 
        for (uint i = 0; i < _options.length; i++) {
            _polls[_pollID].votesPerOption[i] = 0;
        }

        emit CreatePoll(msg.sender, _title, _description, _options, _pollID);
    }

    function votePoll(uint _id, uint _option) public {
        _polls[_id].votesPerOption[_option]++;
        _polls[_id].totalVotes++;

        emit VotePoll(msg.sender, _option, _polls[_id].totalVotes);
    } 

    function getPoll(uint _id) public view returns (address, string memory, string memory, string[] memory, uint[] memory, uint) {
        uint qtdOptions = _polls[_id].options.length;
        
        uint[] memory votesPerOption = new uint[](qtdOptions);
        
        for (uint i = 0; i < qtdOptions; i++) {
            votesPerOption[i] = _polls[_id].votesPerOption[i];
        }

        return (_polls[_id].owner, _polls[_id].title, _polls[_id].description, _polls[_id].options, votesPerOption, _polls[_id].totalVotes);
    }

    function _generatePollID() private view returns (uint) {
        uint id = uint(keccak256(abi.encodePacked(msg.sender, block.timestamp)));
        return id % 1000; 
    }
}
