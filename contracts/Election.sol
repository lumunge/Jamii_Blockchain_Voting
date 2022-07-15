pragma solidity 0.8.0;

contract Election {
    // structs
    struct Candidate {
        address addr;
        uint256 voteCount;
    }

    struct Voter {
        address addr;
        bool registered;
        bool rights;
        bool voted;
        bytes32 uniqueId; // ID_number
        // implement voting weight
    }

    struct Ballot {
        string ballotName;
        address chair;
        address[] ballotCandidates;
        address[] ballotVoters;
    }

    // Struct Arrays
    // Candidate[] public candidates;
    // address[] public registeredVoters;
    Ballot[] public ballots;

    // numbers
    uint256 ballotCost = 1000000000000000000;
    uint256 electionCost = 2000000000000000000;
    uint256 getWinnerCost = 500000000000000000;
    uint256 votingCost = 88000000000000000; // $100
    uint256 public candidatesCount; // count candidates
    uint256 public electionType;
    uint256 public currBlock = block.number;

    // strings
    string public organizationName;

    // addresses
    address private owner = 0xdD870fA1b7C4700F2BD7f44238821C26f7392148;
    address private ballotOwner;
    address private electionOwner;
    address private currentWinner;
    address[] private ballotCandidatesArr;

    // mappings
    mapping(address => Ballot) public ballotsMapping;
    mapping(address => Candidate) public candidatesMap; // store candidates
    mapping(address => address[]) public chairToCandidates;
    mapping(address => Voter) public voters;
    mapping(address => bytes32) public voterToUniqueId;
    mapping(address => uint256) public voterToId;
    // mapping(address => bool) public voters; // voters that have voted

    //events
    event votedEvent(address indexed _candidate);

    constructor(string memory _organizationName, uint256 _electionType)
        public
        payable
    {
        require(msg.value >= electionCost, "Start an Election with 2 ETH");
        electionOwner = msg.sender;
        ballotOwner = msg.sender;
        organizationName = _organizationName;
        electionType = _electionType;
    }

    function createBallot(
        string memory _ballotName,
        address[] memory _ballotCandidates
    ) public payable {
        require(_ballotCandidates.length > 1, "Ballot candidates < 1");
        require(
            msg.sender == electionOwner || msg.sender == ballotOwner,
            "Request appropriate permissions from Owner"
        );
        require(msg.value >= ballotCost, "Start a ballot with 1 ETH");

        ballotOwner = msg.sender;
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

    // createBallot(_ballotCandidates)
    // ["0x583031D1113aD414F02576BD6afaBfb302140225", "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB"]

    function getCandidates() public view returns (address[] memory) {
        return ballotCandidatesArr;
    }

    // register a voter
    function register(uint256 _idNumber) public returns (bytes32) {
        require(voterToUniqueId[msg.sender] == 0, "You already registered!");
        require(
            voterToId[msg.sender] != _idNumber,
            "This id_number is registered!"
        );
        // id_number validation here
        bytes32 hashedId = keccak256(abi.encode(_idNumber));
        voterToUniqueId[msg.sender] = hashedId;
        voterToId[msg.sender] = _idNumber;
        voters[msg.sender].registered = true;
        return hashedId;
    }

    // register voter closedPaidElection
    function registerPaidElection(uint256 _idNumber) public returns (bytes32) {
        // retuen hashedId;
    }

    /*
    - election must be a closed election
    - ballot chair can assign votes
    - 
    */
    function assignVotingRights(address _voter) public {
        require(
            electionType == 1 || electionType == 2,
            "This is NOT a Closed Election"
        );
        require(
            voters[_voter].registered == true,
            "The address is NOT Registered!"
        );
        require(msg.sender == ballotOwner, "Ballot Owner | No Ballot yet");

        voters[_voter].rights = true;
    }

    function voteOpenBallot(address _candidate) private {
        require(electionType == 1);
        require(msg.value >= votingCost, "Cast vote with 1 ETH!");
        require(!voters[msg.sender].voted, "This User has already VOTED!");
        require(
            voters[msg.sender].registered == true,
            "Please Register to Vote!"
        );
        require(currBlock <= block.number, "The Ballot is CLOSED!");

        currentWinner = _candidate;
        bool flag = false;
        for (uint256 i = 0; i < ballotCandidatesArr.length; i++) {
            if (ballotCandidatesArr[i] == _candidate) {
                flag = true;
            }
        }
        require(flag == true, "Candidate does not exist in Ballot!");
        candidatesMap[_candidate].voteCount++;
        voters[msg.sender].voted = true;
        payable(electionOwner).transfer(msg.value);
        emit votedEvent(_candidate);
    }

    function voteClosedBallot(address _candidate) private {
        require(electionType == 1);
        require(msg.value >= votingCost, "Cast vote with 1 ETH!");
        require(
            voters[msg.sender].registered = true,
            "This User is NOT registered!"
        );
        require(
            voters[msg.sender].rights = true,
            "You don't have any Voting Rights!"
        );
        require(!voters[msg.sender].voted, "You already cast your vote!");
        require(currBlock <= block.number, "This Ballot Ended!");

        bool flag = false;
        for (uint256 i = 0; i < ballotCandidatesArr.length; i++) {
            if (ballotCandidatesArr[i] == _candidate) {
                flag = true;
            }
        }
        currentWinner = _candidate;

        require(flag == true, "Candidate does not exist in Ballot!");

        candidatesMap[_candidate].voteCount++;
        voters[msg.sender].voted = true;

        emit votedEvent(_candidate);
    }

    function voteClosedPaidBallot(address _candidate) private {
        require(electionType == 2);
        //    - vote(candidate_address)
        //     - The voter must be a registered voter
        //     - The voter must have ENOUGH voting rights
        //     - The candidate must be a registered candidate
        //     - The ETH is 1
        //     - The voter has not yet voted
        //     - The ballot must be OPEN
    }

    function vote(address _candidate) public payable {
        if (electionType == 0) {
            voteOpenBallot(_candidate);
        } else if (electionType == 1) {
            voteClosedBallot(_candidate);
        } else if (electionType == 2) {
            voteClosedPaidBallot(_candidate);
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
                revert("There seems to be a TIE in Votes!");
            }
        }
        return currentWinner;
    }

    function withdraw(bool _destroy) public {
        require(msg.sender == owner);
        if (_destroy) {
            payable(owner).transfer(address(this).balance);

            Election election;
            address payable addr = payable(address(election));
            selfdestruct(addr);
        } else {
            payable(owner).transfer(address(this).balance);
        }
    }
}
