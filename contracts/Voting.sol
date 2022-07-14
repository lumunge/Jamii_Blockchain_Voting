pragma solidity 0.6.6;

contract Election {
    struct Candidate {
        address addr;
        uint256 voteCount;
    }

    struct Ballot {
        string ballotName;
        address chair;
        address[] ballotCandidates;
        address[] ballotVoters;
    }

    Candidate[] public candidates;

    address private owner;

    uint256 cost = 1000000000000000000;

    mapping(address => Candidate) public candidatesMap; // store candidates

    mapping(address => bool) public voters; // voters that have voted

    mapping(address => Ballot) public ballotsMapping;

    mapping(address => address[]) public chairToCandidates;

    address private currentWinner;

    address[] private ballotCandidatesArr;

    uint256 public candidatesCount; // count candidates

    event votedEvent(address indexed _candidate);

    uint256 public currBlock = block.number;

    constructor(string memory _ballotName, address[] memory _ballotCandidates)
        public
        payable
    {
        // Start ballot
        // ballot name
        // ["0x7c13bAFCd522b48eF843D620a11F464089EE31c8", "0x4afa11124eb39bbe34b237fd83c5a42042231de4", "0x00192Fb10dF37c9FB26829eb2CC623cd1BF599E8"]
        createBallot(_ballotName, _ballotCandidates);
        owner = msg.sender;
    }

    function createBallot(
        string memory _ballotName,
        address[] memory _ballotCandidates
    ) private {
        require(msg.value >= cost, "Start a ballot with 1 ETH");
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
    }

    function getCandidates() public view returns (address[] memory) {
        return ballotCandidatesArr;
    }

    function vote(address _candidate) public payable {
        require(msg.value >= cost, "Cast vote with 1 ETH!");
        require(!voters[msg.sender]);
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
        voters[msg.sender] = true;
        emit votedEvent(_candidate);
    }

    function getWinner() public payable returns (address) {
        require(currBlock >= block.number);
        require(msg.value >= cost, "Get results with 1 ETH!");
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
