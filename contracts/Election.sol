pragma solidity 0.8.0;

contract Election {
    struct Candidate {
        address addr;
        uint256 voteCount;
    }

    struct Voter {
        address addr;
        bool registered;
        bool rights;
        bool voted;
        bytes32 uniqueId; // identification number
        // implement voting weight
    }

    struct Ballot {
        string ballotName;
        address chair;
        address[] ballotCandidates;
        address[] ballotVoters;
    }

    // string[2] ballotTypes = ["open", "close"];

    // Candidate[] public candidates;

    address private owner;

    uint256 ballotCost = 1000000000000000000;
    uint256 electionCost = 2000000000000000000;
    uint256 getWinnerCost = 500000000000000000;
    uint256 votingCost = 88000000000000000; // $100

    mapping(address => Candidate) public candidatesMap; // store candidates

    // mapping(address => bool) public voters; // voters that have voted

    mapping(address => Ballot) public ballotsMapping;

    Ballot[] public ballots;

    mapping(address => address[]) public chairToCandidates;

    address private currentWinner;

    address[] private ballotCandidatesArr;

    uint256 public candidatesCount; // count candidates

    // address[] public registeredVoters;

    event votedEvent(address indexed _candidate);

    uint256 public currBlock = block.number;

    string public electionName;
    string public electionType;

    mapping(address => Voter) voters;
    mapping(address => bytes32) voterToUniqueId;

    constructor(string memory _electionName, string memory _electionType)
        public
        payable
    {
        require(msg.value >= electionCost, "Start an Election with 2 ETH");
        owner = msg.sender;
        electionType = _electionType;
    }

    function createBallot(
        string memory _ballotName,
        address[] memory _ballotCandidates
    ) public payable {
        require(msg.value >= ballotCost, "Start a ballot with 1 ETH");
        Ballot memory newBallot = ballotsMapping[msg.sender];
        newBallot.ballotName = _ballotName;
        newBallot.chair = msg.sender;
        for (uint256 i = 0; i < _ballotCandidates.length; i++) {
            ballotCandidatesArr.push(_ballotCandidates[i]);
            candidatesMap[_ballotCandidates[i]] = Candidate(
                _ballotCandidates[i],
                0
            );
            candidatesCount++;
        }
        chairToCandidates[msg.sender] = ballotCandidatesArr;
        newBallot.ballotCandidates = ballotCandidatesArr;
        ballots.push(newBallot);
    }

    function getCandidates() public view returns (address[] memory) {
        return ballotCandidatesArr;
    }

    function registerVoter(uint256 _idNumber) public returns (bytes32) {
        require(
            voters[msg.sender].registered == false,
            "You already registered!"
        );
        bytes32 hashedId = keccak256(abi.encode(_idNumber));
        voterToUniqueId[msg.sender] = hashedId;
        voters[msg.sender].registered = true;
        return hashedId;
    }

    function assignVotingRights(address _voter) private {
        require(msg.sender == owner);
        require(voters[_voter].registered = true);
        voters[_voter].rights = true;
    }

    function voteOpenBallot(address _candidate) private {
        require(msg.value >= votingCost, "Cast vote with 1 ETH!");
        require(!voters[msg.sender].voted);
        currentWinner = _candidate;
        bool flag = false;
        for (uint256 i = 0; i < ballotCandidatesArr.length; i++) {
            if (ballotCandidatesArr[i] == _candidate) {
                flag = true;
            }
        }
        require(flag == true, "Candidate does not exist in Ballot!");
        require(currBlock <= block.number);
        candidatesMap[_candidate].voteCount++;
        voters[msg.sender].voted = true;
        emit votedEvent(_candidate);
    }

    function voteClosedBallot(address _candidate) private {
        require(msg.value >= votingCost, "Cast vote with 1 ETH!");
        require(
            voters[msg.sender].registered = true,
            "This is a closed ballot, Make sure you register!"
        );
        require(
            voters[msg.sender].rights = true,
            "You don't have any voting rights!"
        );
        require(!voters[msg.sender].voted, "You already cast your vote!");
        currentWinner = _candidate;
        bool flag = false;
        for (uint256 i = 0; i < ballotCandidatesArr.length; i++) {
            if (ballotCandidatesArr[i] == _candidate) {
                flag = true;
            }
        }
        require(flag == true, "Candidate does not exist in Ballot!");
        require(currBlock <= block.number);
        candidatesMap[_candidate].voteCount++;
        voters[msg.sender].voted = true;
        emit votedEvent(_candidate);
    }

    function vote(address _candidate) public payable {
        if (
            keccak256(abi.encodePacked(electionType)) ==
            keccak256(abi.encodePacked("open"))
        ) {
            voteOpenBallot(_candidate);
        } else if (
            keccak256(abi.encodePacked(electionType)) ==
            keccak256(abi.encodePacked("close"))
        ) {
            voteClosedBallot(_candidate);
        }
    }

    function getWinner() public payable returns (address) {
        require(currBlock >= block.number);
        require(msg.value >= getWinnerCost, "Get results with 1 ETH!");
        for (uint256 i = 0; i < candidatesCount; i++) {
            if (
                candidatesMap[ballotCandidatesArr[i]].voteCount + 1 >
                candidatesMap[currentWinner].voteCount
            ) {
                currentWinner = ballotCandidatesArr[i];
            } else if (
                candidatesMap[ballotCandidatesArr[i]].voteCount + 1 ==
                candidatesMap[currentWinner].voteCount
            ) {
                revert("There seems to be a tie");
            }
        }
        return currentWinner;
    }

    function withdraw(bool _flag) public {
        require(msg.sender == owner);
        // destroy contract and send funds
        if (_flag) {
            // send winnings to contract owner
            payable(owner).transfer(address(this).balance);
            Election election;
            address payable addr = payable(address(election));
            selfdestruct(addr);
        } else {
            // send winnings to contract owner
            payable(owner).transfer(address(this).balance);
        }
    }
}
