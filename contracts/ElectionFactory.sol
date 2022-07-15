pragma solidity >=0.5.0;

contract ElectionFactory {
    // structs
    struct Candidate {
        address addr;
        uint256 vote_count;
    }

    struct Voter {
        address addr;
        bool registered;
        bool rights;
        bool voted;
        uint256 unique_id; // ID_number
        // implement voting weight
    }

    struct Ballot {
        string ballot_name;
        address chair;
        address[] ballot_candidates;
        address[] ballot_voters;
    }

    // Struct Arrays
    // Candidate[] public candidates;
    // address[] public registeredVoters;
    Ballot[] public ballots;

    // numbers
    uint256 ballot_cost = 1000000000000000000;
    uint256 election_cost = 2000000000000000000;
    uint256 get_winner_cost = 500000000000000000;
    uint256 voting_cost = 88000000000000000; // $100
    uint256 public candidates_count; // count candidates
    uint256 public election_type;
    uint256 public current_block = block.number;
    uint256[] public voter_ids;

    // strings
    string public organization;

    // addresses
    address private owner = 0xdD870fA1b7C4700F2BD7f44238821C26f7392148;
    address private ballot_owner;
    address private election_owner;
    address private current_winner;
    address[] private ballot_candidates_arr;

    // mappings
    mapping(address => Ballot) public ballots_mapping;
    mapping(address => Candidate) public candidates_map; // store candidates
    mapping(address => address[]) public chair_to_candidates;
    mapping(address => Voter) public voters;
    mapping(address => bytes32) public voter_to_unique_id;
    mapping(uint256 => address) public id_to_voter;
    // mapping(address => bool) public voters; // voters that have voted

    //events
    event voted_event(address indexed _candidate);

    constructor(string memory _organization_name, uint256 _election_type)
        public
        payable
    {
        require(msg.value >= election_cost, "Start an Election with 2 ETH");
        election_owner = msg.sender;
        ballot_owner = msg.sender;
        organization = _organization_name;
        election_type = _election_type;
    }

    function create_ballot(
        string memory _ballot_name,
        address[] memory _ballot_candidates
    ) public payable {
        require(_ballot_candidates.length > 1, "Ballot candidates < 1");
        require(
            msg.sender == election_owner || msg.sender == ballot_owner,
            "Request appropriate permissions from Owner"
        );
        require(msg.value >= ballot_cost, "Start a ballot with 1 ETH");

        ballot_owner = msg.sender;
        Ballot memory new_ballot = ballots_mapping[msg.sender];
        new_ballot.ballot_name = _ballot_name;
        new_ballot.chair = msg.sender;

        for (uint256 i = 0; i < _ballot_candidates.length; i++) {
            ballot_candidates_arr.push(_ballot_candidates[i]);
            candidates_map[_ballot_candidates[i]] = Candidate(
                _ballot_candidates[i],
                0
            );
            candidates_count++;
        }

        chair_to_candidates[msg.sender] = ballot_candidates_arr;
        new_ballot.ballot_candidates = ballot_candidates_arr;
        ballots.push(new_ballot);
    }

    // createBallot(_ballot_candidates)
    // ["0x583031D1113aD414F02576BD6afaBfb302140225", "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB"]

    function get_candidates() public view returns (address[] memory) {
        return ballot_candidates_arr;
    }

    // search an array
    function exists_id(uint256[] memory arr, uint256 target)
        internal
        returns (bool)
    {
        uint256 n = arr.length;
        for (uint256 i = 0; i < n; i++) {
            if (arr[i] == target) {
                return true;
            }
        }
        return false;
    }

    // register a voter
    function register_open_free(uint256 _id_number) public returns (bytes32) {
        require(ballots.length > 0, "No Ballots Open Yet!");
        require(
            !exists_id(voter_ids, _id_number),
            "This id_number is registered!"
        );
        require(voter_to_unique_id[msg.sender] == 0, "You already registered!");
        // id_number validation here
        bytes32 unique_voter_id = keccak256(abi.encode(_id_number));
        voter_to_unique_id[msg.sender] = unique_voter_id;
        // voterToId[msg.sender] = _id_number;
        voter_ids.push(_id_number);
        id_to_voter[_id_number] = msg.sender;
        voters[msg.sender].registered = true;
        return unique_voter_id;
    }

    // register voter closedPaidElection
    function register_paid_election(uint256 _id_number)
        public
        returns (bytes32)
    {
        // retuen hashed_id;
    }

    /*
    - election must be a closed election
    - ballot chair can assign votes
    - 
    */
    function assign_voting_rights(address _voter) public {
        require(
            election_type == 1 || election_type == 2,
            "This is NOT a Closed Election"
        );
        require(
            voters[_voter].registered == true,
            "The address is NOT Registered!"
        );
        require(msg.sender == ballot_owner, "Ballot Owner | No Ballot yet");

        voters[_voter].rights = true;
    }

    function vote_open_ballot(address _candidate) private {
        require(election_type == 1);
        require(msg.value >= voting_cost, "Cast vote with 1 ETH!");
        require(!voters[msg.sender].voted, "This User has already VOTED!");
        require(
            voters[msg.sender].registered == true,
            "Please Register to Vote!"
        );
        require(current_block <= block.number, "The Ballot is CLOSED!");

        current_winner = _candidate;
        bool flag = false;
        for (uint256 i = 0; i < ballot_candidates_arr.length; i++) {
            if (ballot_candidates_arr[i] == _candidate) {
                flag = true;
            }
        }
        require(flag == true, "Candidate does not exist in Ballot!");
        candidates_map[_candidate].vote_count++;
        voters[msg.sender].voted = true;
        payable(election_owner).transfer(msg.value);
        emit voted_event(_candidate);
    }

    function vote_closed_ballot(address _candidate) private {
        require(election_type == 1);
        require(msg.value >= voting_cost, "Cast vote with 1 ETH!");
        require(
            voters[msg.sender].registered = true,
            "This User is NOT registered!"
        );
        require(
            voters[msg.sender].rights = true,
            "You don't have any Voting Rights!"
        );
        require(!voters[msg.sender].voted, "You already cast your vote!");
        require(current_block <= block.number, "This Ballot Ended!");

        bool flag = false;
        for (uint256 i = 0; i < ballot_candidates_arr.length; i++) {
            if (ballot_candidates_arr[i] == _candidate) {
                flag = true;
            }
        }
        current_winner = _candidate;

        require(flag == true, "Candidate does not exist in Ballot!");

        candidates_map[_candidate].vote_count++;
        voters[msg.sender].voted = true;

        emit voted_event(_candidate);
    }

    function vote_closed_paid_ballot(address _candidate) private {
        require(election_type == 2);
        //    - vote(candidate_address)
        //     - The voter must be a registered voter
        //     - The voter must have ENOUGH voting rights
        //     - The candidate must be a registered candidate
        //     - The ETH is 1
        //     - The voter has not yet voted
        //     - The ballot must be OPEN
    }

    function vote(address _candidate) public payable {
        if (election_type == 0) {
            vote_open_ballot(_candidate);
        } else if (election_type == 1) {
            vote_closed_ballot(_candidate);
        } else if (election_type == 2) {
            vote_closed_paid_ballot(_candidate);
        }
    }

    function get_winner() public payable returns (address) {
        require(current_block >= block.number);
        require(msg.value >= get_winner_cost, "Get results with 1 ETH!");

        for (uint256 i = 0; i < candidates_count; i++) {
            if (
                candidates_map[ballot_candidates_arr[i]].vote_count + 1 >
                candidates_map[current_winner].vote_count
            ) {
                current_winner = ballot_candidates_arr[i];
            } else if (
                candidates_map[ballot_candidates_arr[i]].vote_count + 1 ==
                candidates_map[current_winner].vote_count
            ) {
                revert("There seems to be a TIE in Votes!");
            }
        }
        return current_winner;
    }

    function withdraw(bool _destroy) public {
        require(msg.sender == owner);
        if (_destroy) {
            payable(owner).transfer(address(this).balance);

            ElectionFactory election;
            address payable addr = payable(address(election));
            selfdestruct(addr);
        } else {
            payable(owner).transfer(address(this).balance);
        }
    }
}
