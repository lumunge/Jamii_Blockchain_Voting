pragma solidity 0.8.8;

import "./IJamiiFactory.sol";

contract JamiiFactory is IJamiiFactory {
    // Struct Arrays
    // Candidate[] public candidates;
    // address[] public registeredVoters;
    Election[] public elections;
    Ballot[3] public ballots;

    // numbers
    uint256 ballot_cost = 1000000000000000000;
    uint256 election_cost = 2000000000000000000;
    uint256 get_winner_cost = 500000000000000000;
    uint256 open_paid_voting_cost = 88000000000000000; // $100
    uint256 public candidates_count; // count candidates
    uint256 public ballot_count;
    uint256 public election_count = 0;
    uint256 public voters_count;
    uint256 public election_type;
    uint256 public current_block = block.number;
    uint256[] public voter_ids;
    uint256 public ballot_types = 3;
    uint256 public ballot_type;
    uint256 private max_ballots = 3;

    // strings
    string public organization_name;

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

    // modifiers
    modifier only_election_ballot_owner() {
        require(msg.sender == ballot_owner || msg.sender == election_owner);
        _;
    }

    // constructor - create an election with ballots
    constructor(string memory _organization_name) public payable {
        require(msg.value >= election_cost, "Start an Election with 2 ETH");
        organization_name = _organization_name;
        Election memory election = Election(
            election_count,
            msg.sender,
            _organization_name,
            true
        );
        election.election_id = election_count;
        elections[election_count++] = election;
        ballot_owner = msg.sender;
        election_owner = msg.sender;
        candidates_count = 0;
        ballot_count = 0;
        voters_count = 0;

        emit created_new_election(_organization_name);
    }

    function create_open_ballot(
        string memory _ballot_name,
        address[] memory _ballot_candidates,
        uint256 _ballot_type
    ) public payable only_election_ballot_owner {
        require(_ballot_candidates.length > 1, "Not Enough Ballot Candidates!");
        require(
            msg.sender == election_owner || msg.sender == ballot_owner,
            "Insufficient Permissions for this Action!"
        );
        require(
            msg.value >= ballot_cost,
            "Not Enough Funds to Start a Ballot!"
        );
        require(_ballot_type <= ballot_types, "Not a valid Ballot Type!");
        require(
            ballots.length <= max_ballots,
            "You have reached the Max Limit of Ballots for this Election!"
        );

        ballot_owner = msg.sender;
        Ballot memory new_ballot = ballots_mapping[msg.sender];
        new_ballot.ballot_id = ballot_count;
        new_ballot.ballot_type = _ballot_type;
        new_ballot.ballot_name = _ballot_name;
        new_ballot.chair = msg.sender;

        for (uint256 i = 0; i < _ballot_candidates.length; i++) {
            new_ballot.ballot_candidates[candidates_count] = Candidate(
                candidates_count,
                _ballot_candidates[i],
                0
            );
            new_ballot.ballot_candidates_addr[
                candidates_count
            ] = _ballot_candidates[i];
            candidates_count++;
        }

        chair_to_candidates[msg.sender] = new_ballot.ballot_candidates_addr;
        ballot_count++;

        emit created_ballot(ballot_count - 1);
    }

    // createBallot(_ballot_candidates)
    // ["0x583031D1113aD414F02576BD6afaBfb302140225", "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB"]

    function create_closed_free_ballot(
        string memory _ballot_name,
        address[] memory _ballot_candidates,
        uint256 _ballot_type
    ) public payable only_election_ballot_owner returns (Ballot memory) {
        // ballot_type = 1
        ballot_count++;
        emit created_ballot(ballot_count - 1);
    }

    function create_closed_paid_ballot(
        string memory _ballot_name,
        address[] memory _ballot_candidates,
        uint256 _ballot_type
    ) public payable only_election_ballot_owner returns (Ballot memory) {
        // ballot_type = 2
        ballot_count++;
        emit created_ballot(ballot_count - 1);
    }

    // register a voter
    function register_voter_open_ballot(uint256 _id_number, uint256 _ballot_id)
        public
        returns (bytes32)
    {
        require(ballots.length > 0, "No Ballots Open Yet!");
        Ballot memory ballot = ballots[_ballot_id];
        require(
            !exists_id(voter_ids, _id_number),
            "This id_number is registered!"
        );
        require(voter_to_unique_id[msg.sender] == 0, "You already registered!");
        require(ballots.length <= _ballot_id, "Invalid Ballot Id!");
        // id_number validation here
        bytes32 unique_voter_id = keccak256(abi.encode(_id_number));
        voter_to_unique_id[msg.sender] = unique_voter_id;

        Voter memory new_voter = Voter(
            voters_count,
            msg.sender,
            _ballot_id,
            true,
            true,
            false,
            unique_voter_id
        );
        ballot.ballot_voters[voters_count] = new_voter;
        ballot.ballot_voters_addr[voters_count] = msg.sender;
        id_to_voter[_id_number] = msg.sender;
        voter_ids.push(_id_number);
        return unique_voter_id;

        emit registered_voter(unique_voter_id);
    }

    // register voter closedPaidElection
    function register_voter_paid_ballot(uint256 _id_number, uint256 _ballot_id)
        public
        returns (bytes32)
    {
        // retuen hashed_id;
    }

    function get_ballot(uint256 _ballot_id)
        public
        view
        returns (Ballot memory)
    {
        require(_ballot_id <= ballots.length, "Invalid ballot Id!");
        Ballot memory ballot = ballots[_ballot_id];
        if (ballot.ballot_type == 0) {
            // open
            return ballots[_ballot_id];
        } else if (ballot.ballot_type >= 1) {
            // closed
            require(
                msg.sender == ballot_owner || msg.sender == election_owner,
                "You need Permissions for this Action!"
            ); // or authorized
            return ballots[_ballot_id];
        }
    }

    function get_ballot_candidates(uint256 _ballot_id)
        public
        view
        returns (Candidate[] memory)
    {
        require(_ballot_id <= ballots.length, "Invalid ballot Id!");
        Ballot memory ballot = ballots[_ballot_id];
        if (ballot.ballot_type == 0) {
            // open
            return ballots[_ballot_id].ballot_candidates;
        } else if (ballot.ballot_type >= 1) {
            // closed
            require(
                msg.sender == ballot_owner || msg.sender == election_owner,
                "You need Permissions for this Action!"
            ); // or authorized
            return ballots[_ballot_id].ballot_candidates;
        }
    }

    function get_registered_voters(uint256 _ballot_id)
        public
        view
        returns (Voter[] memory)
    {
        require(_ballot_id <= ballots.length, "Invalid ballot Id!");
        Ballot memory ballot = ballots[_ballot_id];
        if (ballot.ballot_type == 0) {
            // open
            return ballot.ballot_voters;
        } else if (ballot.ballot_type >= 1) {
            // closed
            require(
                msg.sender == ballot_owner || msg.sender == election_owner,
                "You need Permissions for this Action!"
            ); // or authorized
            return ballot.ballot_voters;
        }
    }

    // function get_candidate(address _candidate_address, uint256 _ballot_id) public view returns (uint256) {
    //     Candidate[] memory candidates = ballots[_ballot_id].ballot_candidates;
    //     uint256 n = candidates.length;

    //     for(uint256 i = 0; i < n; i++){
    //         if(keccak256(abi.encodePacked((ballot_candidates[i].candidate_address))) == keccak256(abi.encodePacked((_candidate_address)))){
    //             return i;
    //         }
    //     }
    //     return 0;
    // }

    function get_election(uint256 _election_id)
        public
        view
        only_election_ballot_owner
        returns (Election memory)
    {
        require(_election_id <= ballots.length, "Invalid election Id!");
        return elections[_election_id];
    }

    function assign_voting_rights(address _voter, uint256 _ballot_id)
        public
        only_election_ballot_owner
    {
        require(_ballot_id <= ballots.length, "Invalid ballot Id!");
        Ballot memory ballot = ballots[_ballot_id];
        require(ballot.open == true, "The Ballot is Closed!");
        require(ballots.length > 0, "No ballots Opened Yet!");
        require(
            !exists_address(ballot.ballot_voters_addr, _voter),
            "You are NOT a voter in this Ballot!"
        );
        require(
            ballot_type >= 1,
            "This Option is Possible in a Closed Ballot!"
        );
        require(
            voters[_voter].registered == true,
            "You are NOT a Registered Voter!"
        );
        require(
            voters[_voter].rights == false,
            "Address already has Voting Rights!"
        );

        voters[_voter].rights = true;

        emit assigned_voting_rights(_voter);
    }

    function vote_open_ballot(address _candidate, uint256 _ballot_id) public {
        Ballot memory ballot = ballots[_ballot_id];
        require(ballot.ballot_type == 0, "This Is an Open Ballot!");
        require(
            voters[msg.sender].registered == true,
            "Please Register to Vote!"
        );
        require(!voters[msg.sender].voted, "You already CAST your Vote!");
        require(current_block <= block.number, "The Ballot has Expired!");
        require(ballots.length <= _ballot_id, "Invalid Ballot Id!");
        // require(ballot.candidates_mapping[_candidate], "Candidate does not exist in Ballot!");

        current_winner = _candidate;

        // ballot.candidates_mapping[_candidate].vote_count++;
        voters[msg.sender].voted = true;
        emit voted(_candidate);
    }

    function vote_open_paid_ballot(address _candidate, uint256 _ballot_id)
        public
        payable
    {
        Ballot memory ballot = ballots[_ballot_id];
        require(ballot.ballot_type == 1, "This Is an Open Paid Ballot!");
        require(msg.value >= open_paid_voting_cost, "Cast vote with 1 ETH!");
        require(
            voters[msg.sender].registered = true,
            "You are NOT a registered Voter!"
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

        emit voted(_candidate);
    }

    function vote_closed_paid_ballot(address _candidate) public payable {
        require(election_type == 2);
    }

    function vote(address _candidate, uint256 _ballot_id) public payable {
        if (election_type == 0) {
            vote_open_ballot(_candidate, _ballot_id);
        } else if (election_type == 1) {
            vote_open_paid_ballot(_candidate, _ballot_id);
        } else if (election_type == 2) {
            vote_closed_paid_ballot(_candidate);
        }
    }

    // search an array
    function exists_id(uint256[] memory arr, uint256 target)
        private
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

    function exists_address(address[] memory arr, address _target_address)
        private
        returns (bool)
    {
        uint256 n = arr.length;
        for (uint256 i = 0; i < n; i++) {
            if (
                (keccak256(abi.encodePacked((arr[i]))) ==
                    keccak256(abi.encodePacked((_target_address))))
            ) {
                return true;
            }
        }
        return false;
    }

    function get_winner(uint256 _ballot_id) public payable returns (address) {
        require(current_block >= block.number);
        require(msg.value >= get_winner_cost, "Get results with 1 ETH!");

        Ballot memory ballot = get_ballot(_ballot_id);
        address[] memory ballot_candidates = ballot.ballot_candidates_addr;

        if (ballot.ballot_type >= 1) {
            require(
                msg.sender == ballot.chair || msg.sender == election_owner,
                "You have NO Permissions!"
            );
        } else {
            for (uint256 i = 0; i < ballot.ballot_candidates_addr.length; i++) {
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
                return current_winner;
            }
        }
    }

    function end_ballot(uint256 _ballot_id) public {
        require(msg.sender == ballot_owner, "You don't OWN this Ballot!");
        payable(ballot_owner).transfer(address(this).balance);
        Ballot memory ballot = get_ballot(_ballot_id);
        ballot.open = false;
    }

    function end_election(uint256 _election_id) public {
        require(msg.sender == owner);
        payable(owner).transfer(address(this).balance);
        Election memory election = get_election(_election_id);
        election.open = false;
    }

    // function withdraw(bool _destroy) public {
    //     require(msg.sender == owner);
    //     if(_destroy){
    //         payable(owner).transfer(address(this).balance);
    //     }else{
    //         payable(owner).transfer(address(this).balance);
    //     }
    // }
}
