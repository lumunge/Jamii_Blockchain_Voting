// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.8;

import "../interfaces/IJamiiFactory.sol";

contract JamiiFactory is IJamiiFactory {
    // Struct Arrays
    // Candidate[] public candidates;
    // address[] public registeredVoters;
    Election[] public elections;
    Ballot[] public ballots;

    Candidate[] ballot_candidates;
    address[] ballot_candidates_addr;
    Voter[] ballot_voters;
    address[] ballot_voters_addr;

    // numbers
    // uint256 public ballot_cost = 0;
    uint256 public election_cost = 340000000000000000; // $500
    uint256 public get_winner_cost = 500000000000000000;
    uint256 public open_paid_voting_cost = 88000000000000000; // $100
    uint256 public candidates_count; // count candidates
    uint256 public ballot_count;
    uint256 public election_count;
    uint256 public voters_count;
    uint256 public election_type;
    uint256 public current_block = block.number;
    uint256[] public voter_ids;
    uint256 public ballot_types = 3;
    uint256 public ballot_type;
    uint256 public max_ballots = 3;
    uint256 public uid;

    // strings
    string public organization_name;

    // addresses
    address private owner = 0xdD870fA1b7C4700F2BD7f44238821C26f7392148;
    address public ballot_owner;
    address public election_owner;
    // address private current_winner;
    // address[] public ballot_candidates_arr;

    // mappings
    mapping(address => Ballot) public ballots_mapping;
    mapping(uint256 => address[]) public ballot_candidate_mapping;
    mapping(address => Candidate) public address_to_candidate_mapping; // store candidates
    mapping(address => address[]) public chair_to_candidates;
    mapping(address => Voter) public address_to_voter_mapping;
    mapping(uint256 => Voter) public ballot_to_voter_mapping;
    mapping(address => bytes32) public voter_to_unique_id;
    mapping(uint256 => address) public id_to_voter;
    // mapping(address => bool) public voters; // voters that have voted

    // modifiers
    modifier only_election_ballot_owner() {
        require(
            msg.sender == ballot_owner || msg.sender == election_owner,
            "Insufficient Permissions for this Action!"
        );
        _;
    }

    // constructor - create an election with ballots
    constructor(string memory _organization_name) public payable {
        require(msg.value >= election_cost, "Start an Election with $500");
        bytes memory bytes_organization_name = bytes(_organization_name);
        require(
            bytes_organization_name.length > 0,
            "Enter a valid Organization Name!"
        );
        election_count = 0;
        organization_name = _organization_name;
        Election memory election = Election(
            election_count,
            msg.sender,
            _organization_name,
            true
        );
        election.election_id = election_count;
        elections.push(election);
        election_count++;
        ballot_owner = msg.sender;
        election_owner = msg.sender;
        ballot_count = 0;
        voters_count = 0;
        uid = 100;
        emit created_new_election(organization_name);
    }

    function create_open_ballot(
        string memory _ballot_name,
        address[] memory _ballot_candidates_addr,
        uint256 _ballot_type,
        uint256 _days
    ) public only_election_ballot_owner {
        bytes memory bytes_ballot_name = bytes(_ballot_name);
        require(bytes_ballot_name.length > 0, "Enter a valid Ballot Name!");
        require(
            _ballot_candidates_addr.length > 1,
            "Not Enough Ballot Candidates!"
        );
        // require(msg.value >= ballot_cost, "Not Enough Funds to Start a Ballot!");
        require(_ballot_type <= ballot_types, "Not a valid Ballot Type!");
        require(
            ballot_count < max_ballots,
            "You have reached the Max Limit of Ballots for this Election!"
        );

        ballot_candidate_mapping[uid] = _ballot_candidates_addr;

        uint256 n = _ballot_candidates_addr.length;
        for (uint256 i = 0; i < n; i++) {
            Candidate memory candidate = Candidate(
                i,
                uid,
                _ballot_candidates_addr[i],
                0
            );
            address_to_candidate_mapping[
                _ballot_candidates_addr[i]
            ] = candidate;
        }

        ballot_owner = msg.sender;
        candidates_count = _ballot_candidates_addr.length;
        Ballot memory new_ballot = Ballot(
            uid,
            _ballot_type,
            _ballot_name,
            msg.sender,
            // ballot_candidates,
            _ballot_candidates_addr,
            // ballot_voters,
            ballot_voters_addr,
            0,
            _days,
            block.timestamp,
            false,
            address(0x0),
            false
        );
        ballots.push(new_ballot);
        ballots_mapping[msg.sender] = new_ballot;
        chair_to_candidates[msg.sender] = _ballot_candidates_addr;
        ballot_count++;
        uid++;

        emit created_ballot(ballot_count - 1);
    }

    // createBallot(_ballot_candidates)
    // ["0xf9d48aC9eC8F207AEF93518B51D2CdA61e596904", "0x6c0A17AEe0a1420583446B77f0c8a55e369Bb07e"]

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
        uint256 int_ballot_id = _ballot_id - 100;
        require(int_ballot_id < max_ballots, "No such Ballot Exists!");
        // require(_ballot_id <= uid, "No Such Ballot!");
        Ballot storage ballot = ballots[int_ballot_id];
        uint256 duration = (block.timestamp - ballot.open_date) / 60 / 60 / 24;
        require(duration > ballot._days, "This Ballot Expired!");
        require(
            id_to_voter[_id_number] == address(0x0),
            "This id_number is registered!"
        );
        require(voter_to_unique_id[msg.sender] == 0, "You already registered!");

        // id_number validation here
        bytes32 unique_voter_id = keccak256(abi.encode(_id_number));
        voter_to_unique_id[msg.sender] = unique_voter_id;

        Voter memory new_voter = Voter(
            voters_count,
            msg.sender,
            int_ballot_id,
            true,
            true,
            false,
            unique_voter_id
        );
        ballot_to_voter_mapping[int_ballot_id] = new_voter;
        address_to_voter_mapping[msg.sender].registered = true;
        ballot.voters_count++;
        id_to_voter[_id_number] = msg.sender;

        // voter_ids.push(_id_number);
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
        // require(_ballot_id <= ballots.length, "Invalid ballot Id!");
        // Ballot memory ballot = ballots[_ballot_id];
        // if (ballot.ballot_type == 0) {
        //     // open
        //     return ballots[_ballot_id];
        // } else if (ballot.ballot_type >= 1) {
        //     // closed
        //     require(
        //         msg.sender == ballot_owner || msg.sender == election_owner,
        //         "You need Permissions for this Action!"
        //     ); // or authorized
        //     return ballots[_ballot_id];
        // }
    }

    function get_ballot_candidates_addr(uint256 _ballot_id)
        public
        view
        returns (address[] memory)
    {
        require(_ballot_id <= ballots.length, "Invalid ballot Id!");
        Ballot storage ballot = ballots[_ballot_id];
        if (ballot.ballot_type == 0) {
            // open
            return ballots[_ballot_id].ballot_candidates_addr;
        } else if (ballot.ballot_type >= 1) {
            // closed
            require(
                msg.sender == ballot_owner || msg.sender == election_owner,
                "You need Permissions for this Action!"
            ); // or authorized
            return ballots[_ballot_id].ballot_candidates_addr;
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
            // return ballot.ballot_voters;
        } else if (ballot.ballot_type >= 1) {
            // closed
            require(
                msg.sender == ballot_owner || msg.sender == election_owner,
                "You need Permissions for this Action!"
            ); // or authorized
            // return ballot.ballot_voters;
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
        uint256 duration = (block.timestamp - ballot.open_date) / 60 / 60 / 24;
        require(duration > ballot._days, "This Ballot Expired!");
        require(ballots.length > 0, "No ballots Opened Yet!");
        require(
            address_to_voter_mapping[msg.sender].ballot_id == _ballot_id,
            "Voter does NOT belong to this Ballot."
        );
        require(
            ballot_type >= 1,
            "This Option is Possible in a Closed Ballot!"
        );
        require(
            address_to_voter_mapping[msg.sender].registered == true,
            "You are NOT a Registered Voter!"
        );
        require(
            address_to_voter_mapping[msg.sender].rights == false,
            "Address already has Voting Rights!"
        );

        address_to_voter_mapping[msg.sender].rights = true;

        emit assigned_voting_rights(_voter);
    }

    function find_winner(address _candidate, Ballot memory ballot)
        private
        returns (bool)
    {
        if (
            address_to_candidate_mapping[_candidate].vote_count + 1 >
            address_to_candidate_mapping[ballot.current_winner].vote_count
        ) {
            ballot.current_winner = _candidate;
            ballot.tie = false;
        } else if (
            address_to_candidate_mapping[_candidate].vote_count + 1 ==
            address_to_candidate_mapping[ballot.current_winner].vote_count
        ) {
            ballot.tie = true;
        }
        return ballot.tie;
    }

    function vote_open_ballot(address _candidate, uint256 _ballot_id) public {
        uint256 int_ballot_id = _ballot_id - 100;
        Ballot memory ballot = ballots[int_ballot_id];
        ballot.current_winner = _candidate;

        require(ballot.ballot_type == 0, "This Is an Open Ballot!");
        require(
            address_to_voter_mapping[msg.sender].registered == true,
            "Please Register to Vote!"
        );
        require(
            !address_to_voter_mapping[msg.sender].voted,
            "You already CAST your Vote!"
        );
        require(current_block <= block.number, "The Ballot has Expired!");
        require(int_ballot_id <= ballot_count, "Invalid Ballot Id!");
        require(
            address_to_candidate_mapping[_candidate].ballot_id == _ballot_id,
            "Candidate does not exist in Ballot2!"
        );

        find_winner(_candidate, ballot);

        address_to_candidate_mapping[_candidate].vote_count++;
        address_to_voter_mapping[msg.sender].voted = true;

        emit voted(_candidate);
    }

    function vote_open_paid_ballot(address _candidate, uint256 _ballot_id)
        public
        payable
    {
        Ballot memory ballot = ballots[_ballot_id];
        ballot.current_winner = _candidate;

        require(ballot.ballot_type == 1, "This Is an Open Paid Ballot!");
        require(msg.value >= open_paid_voting_cost, "Cast vote with 1 ETH!");
        require(
            address_to_voter_mapping[msg.sender].registered = true,
            "You are NOT a registered Voter!"
        );
        require(
            address_to_voter_mapping[msg.sender].rights = true,
            "You don't have any Voting Rights!"
        );
        require(
            !address_to_voter_mapping[msg.sender].voted,
            "You already cast your vote!"
        );
        require(current_block <= block.number, "This Ballot Ended!");
        require(
            address_to_candidate_mapping[_candidate].ballot_id != _ballot_id,
            "Candidate does not exist in Ballot!"
        );

        if (
            address_to_candidate_mapping[_candidate].vote_count + 1 >
            address_to_candidate_mapping[ballot.current_winner].vote_count
        ) {
            ballot.current_winner = _candidate;
        }

        address_to_candidate_mapping[_candidate].vote_count++;
        address_to_voter_mapping[msg.sender].voted = true;

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

    function get_winner(uint256 _ballot_id) public payable returns (address) {
        Ballot storage ballot = ballots[_ballot_id - 100];

        uint256 duration = (block.timestamp - ballot.open_date) / 60 / 60 / 24;

        require(duration < ballot._days, "This Ballot is still Open!");
        require(msg.value >= get_winner_cost, "Get results with 1 ETH!");
        require(
            _ballot_id <= ballot_count,
            "Ballot with that Id does NOT exist!"
        );

        if (ballot.tie == true) {
            emit tied_ballot(ballot.tie);
        } else {
            address winner = ballot.current_winner;
            return winner;
        }
    }

    function end_open_ballot(uint256 _ballot_id) public {
        require(msg.sender == ballot_owner, "You don't OWN this Ballot!");
        Ballot storage ballot = ballots[_ballot_id - 100];
        uint256 duration = (block.timestamp - ballot.open_date) / 60 / 60 / 24;
        require(duration < ballot._days, "This Ballot is NOT yet Expired!");
        payable(ballot_owner).transfer(address(this).balance);

        ballot.expired = true;
        ballots_mapping[msg.sender].expired = true;
    }

    function end_election(uint256 _election_id) public {
        require(msg.sender == owner);
        payable(owner).transfer(address(this).balance);
        Election memory election = get_election(_election_id);
        election.open = false;
    }

    function withdraw(bool _destroy) public {
        require(msg.sender == owner);
        if (_destroy) {
            payable(owner).transfer(address(this).balance);
        } else {
            payable(owner).transfer(address(this).balance);
        }
    }
}
