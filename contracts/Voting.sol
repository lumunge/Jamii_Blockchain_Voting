pragma solidity >=0.5.0;

contract Election {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Ballot {
        string ballotName;
        address chair;
        address[] ballotCandidates;
        uint256 totalVotes;
    }

    mapping(uint256 => Candidate) public candidates; // store candidates

    mapping(address => bool) public voters; // voters that have voted

    mapping(address => Ballot) public ballotsMapping;

    mapping(address => address[]) public chairToCandidates;

    address[] public ballotChairsArray;

    address[] public ballotCandidatesArr;

    uint256 public candidatesCount; // count candidate

    event votedEvent(uint256 indexed _candidateId);

    // constructor
    // constructor() public {
    //     addCandidate("Candidate 1");
    //     addCandidate("Candidate 2");
    // }

    function createBallot(
        string memory _ballotName,
        address _chair,
        address[] memory _ballotCandidates
    ) public payable {
        require(msg.value >= 1000000000000000000, "Start a ballot with 1 ETH");
        ballotChairsArray.push(_chair);
        Ballot memory newBallot = ballotsMapping[_chair];
        newBallot.ballotName = _ballotName;
        newBallot.chair = _chair;
        for (uint256 i = 0; i < _ballotCandidates.length; i++) {
            ballotCandidatesArr.push(_ballotCandidates[i]);
        }
        chairToCandidates[_chair] = ballotCandidatesArr;
        newBallot.ballotCandidates = ballotCandidatesArr;
        newBallot.totalVotes = 0;
    }

    function addCandidate(string memory _name) private {
        // add new candidate
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // ["0x7c13bAFCd522b48eF843D620a11F464089EE31c8", "0x4afa11124eb39bbe34b237fd83c5a42042231de4"]

    function vote(uint256 _candidateId) public {
        // voter does not vote twice
        require(!voters[msg.sender]);

        // candidate needs to to a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record voter
        voters[msg.sender] = true;
        // update vote count
        candidates[_candidateId].voteCount++;

        emit votedEvent(_candidateId);
    }
}
