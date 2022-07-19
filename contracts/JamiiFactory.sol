// SPDX-License-Identifier: MIT

pragma solidity 0.8.8;

import "../interfaces/IJamiiFactory.sol";

contract JamiiFactory is IJamiiFactory {
    // Struct Arrays
    Election[] private elections;
    Ballot[] private ballots;
    Voter[] private voters;

    // numbers
    uint256 private election_cost = 340000000000000000; // $
    // uint256 public election_cost = 340000000000000000; // $
    // uint256 public election_cost = 1000000000000000; // $
    // uint256 public get_winner_cost = 500000000000000000;
    // uint256 public open_paid_voting_cost = 88000000000000000; // $100
    uint256 private candidates_count; // count candidates
    uint256 private ballot_count;
    uint256 private election_count;
    uint256[] private voter_ids;
    uint256[] internal ballot_types_arr = [0, 1, 2, 3, 4, 5, 6]; // open free, closed free, open paid, closed paid, closed free secret, open paid secret, closed paid secret
    uint256 internal ballot_types = ballot_types_arr.length;
    uint256 private max_ballots = 3;
    uint256 private uid;

    // strings
    string public organization_name;

    // addresses
    address private owner = 0xdD870fA1b7C4700F2BD7f44238821C26f7392148;
    address public ballot_owner;
    address public election_owner;

    // mappings
    mapping(uint256 => string) internal ballot_types_mapping;
    mapping(address => Ballot) internal ballots_mapping;
    mapping(uint256 => Ballot) internal id_to_ballot_mapping;
    mapping(uint256 => address[]) internal ballot_candidate_mapping;
    mapping(uint256 => address[]) internal ballot_voters_mapping;
    mapping(address => Candidate) internal address_to_candidate_mapping; // store candidates
    mapping(address => address[]) internal chair_to_candidates;
    mapping(address => Voter) internal address_to_voter_mapping;
    // mapping(uint256 => Voter) public ballot_to_voter_mapping;
    mapping(address => bytes32) internal voter_to_unique_id;
    mapping(uint256 => address) internal id_to_voter;
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
        uid = 100;

        create_ballot_types();

        emit created_new_election(organization_name);
    }

    function create_ballot_types() private {
        ballot_types_mapping[0] = "open-free";
        ballot_types_mapping[1] = "closed-free";
        ballot_types_mapping[2] = "open-paid";
        ballot_types_mapping[3] = "closed-paid";
        ballot_types_mapping[4] = "closed-free-secret";
        ballot_types_mapping[5] = "open-paid-secret";
        ballot_types_mapping[6] = "closed-paid-secret";
    }

    function create_ballot_type(uint256 _ballot_type, string memory _name)
        public
    {
        require(msg.sender == owner, "This Action is NOT permitted!");
        require(_ballot_type > ballot_types, "Invalid Type Index!");
        ballot_types_arr.push(ballot_types + 1);
    }

    function create_ballot(
        string memory _ballot_name,
        address[] memory _ballot_candidates_addr,
        uint256 _ballot_type,
        uint256 _days,
        uint256 _registration_period
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
        require(
            _days > _registration_period,
            "Registration Period > Voting Days!"
        );

        address[] memory ballot_voters_addr;

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
            0,
            block.timestamp,
            _days,
            false,
            _registration_period,
            address(0x0),
            false
        );
        ballots.push(new_ballot);
        ballots_mapping[msg.sender] = new_ballot;
        id_to_ballot_mapping[uid] = new_ballot;
        chair_to_candidates[msg.sender] = _ballot_candidates_addr;
        ballot_count++;
        uid++;

        emit created_ballot(_ballot_type);
    }

    // createBallot(_ballot_candidates)
    // ["0xf9d48aC9eC8F207AEF93518B51D2CdA61e596904", "0x6c0A17AEe0a1420583446B77f0c8a55e369Bb07e"]

    /** REGISTERS VOTERS **/
    function register_voter_open_ballot(uint256 _id_number, uint256 _ballot_id)
        internal
        returns (bytes32)
    {
        uint256 int_ballot_id = _ballot_id - 100;
        require(int_ballot_id < max_ballots, "No such Ballot Exists!");
        // require(_ballot_id <= uid, "No Such Ballot!");
        Ballot storage ballot = ballots[int_ballot_id];

        // uint256 duration = (block.timestamp - ballot.open_date) / 60 / 60 / 24;

        uint256 duration = (block.timestamp - ballot.open_date);
        require(
            (duration < (ballot.registration_window * 86400)),
            "Registration Period has Passed!"
        );
        require(duration < (ballot._days * 86400), "This Ballot Expired!");
        require(
            id_to_voter[_id_number] == address(0x0),
            "This id_number is registered!"
        );
        require(voter_to_unique_id[msg.sender] == 0, "You already registered!");

        ballot_voters_mapping[_ballot_id].push(msg.sender);

        // id_number validation here
        bytes32 unique_voter_id = keccak256(abi.encode(_id_number));
        voter_to_unique_id[msg.sender] = unique_voter_id;

        Voter memory new_voter = Voter(
            ballot.voters_count,
            msg.sender,
            int_ballot_id,
            true,
            true,
            false,
            unique_voter_id
        );
        address_to_voter_mapping[msg.sender] = new_voter;
        // ballot_to_voter_mapping[int_ballot_id] = new_voter;
        voters.push(new_voter);
        ballot.voters_count++;

        id_to_ballot_mapping[_ballot_id].voters_count++;
        id_to_voter[_id_number] = msg.sender;
        // voter_ids.push(_id_number);

        emit registered_voter(unique_voter_id);

        return unique_voter_id;
    }

    function register_voter_closed_ballot(
        uint256 _id_number,
        uint256 _ballot_id
    ) internal returns (bytes32) {
        Ballot storage ballot = id_to_ballot_mapping[_ballot_id];
        require(ballot.ballot_type == 1, "Wrong ballot Type!");
    }

    // register voter closedPaidElection
    function register_voter_open_paid_ballot(
        uint256 _id_number,
        uint256 _ballot_id
    ) internal returns (bytes32) {
        Ballot storage ballot = id_to_ballot_mapping[_ballot_id];
        require(ballot.ballot_type == 2, "Wrong ballot Type!");
        // return hashed_id;
    }

    function register_voter_closed_paid_ballot(
        uint256 _id_number,
        uint256 _ballot_id
    ) internal returns (bytes32) {
        Ballot storage ballot = id_to_ballot_mapping[_ballot_id];
        require(ballot.ballot_type == 3, "Wrong ballot Type!");
        // return hashed_id;
    }

    function register_voter(uint256 _id_number, uint256 _ballot_id) public {
        uint256 int_ballot_id = _ballot_id - 100;
        require(int_ballot_id < max_ballots, "No such Ballot Exists!");
        Ballot memory ballot = ballots[int_ballot_id];

        // 0, 1, 2, 3, 4, 5, 6 => open free, closed free, open paid, closed paid,
        if (ballot.ballot_type == 0) {
            register_voter_open_ballot(_id_number, _ballot_id);
        } else if (ballot.ballot_type == 1) {
            register_voter_closed_ballot(_id_number, _ballot_id);
        } else if (ballot.ballot_type == 2) {
            register_voter_open_paid_ballot(_id_number, _ballot_id);
        } else if (ballot.ballot_type == 3) {
            register_voter_closed_paid_ballot(_id_number, _ballot_id);
        }
    }

    /** VOTING RIGHTS **/
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
            ballot.ballot_type >= 1,
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

    /** VOTING **/
    function vote_open_ballot(address _candidate, uint256 _ballot_id) internal {
        // uint256 int_ballot_id = _ballot_id - 100;
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        ballot.current_winner = _candidate;
        // uint256 duration = (block.timestamp - ballot.open_date) / 60 / 60 / 24;

        // require(
        //     duration > ballot.registration_window,
        //     "Registration Period is NOT Completed!"
        // );

        require(ballot.ballot_type == 0, "This Is an Open Ballot!");
        require(
            address_to_voter_mapping[msg.sender].registered == true,
            "Please Register to Vote!"
        );
        require(
            !address_to_voter_mapping[msg.sender].voted,
            "You already CAST your Vote!"
        );
        require(
            id_to_ballot_mapping[_ballot_id].ballot_id == _ballot_id,
            "Invalid Ballot Id!"
        );

        require(
            address_to_candidate_mapping[_candidate].ballot_id == _ballot_id,
            "Candidate does not exist in Ballot!"
        );
        require(ballot.expired == false, "Ballot has Expired");

        find_winner(_candidate, ballot);

        address_to_candidate_mapping[_candidate].vote_count++;
        address_to_voter_mapping[msg.sender].voted = true;

        emit voted(_candidate);
    }

    function vote_closed_free_ballot(address _candidate, uint256 _ballot_id)
        internal
    {
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        require(ballot.ballot_type == 1, "Wrong Ballot Type!");
    }

    function vote_open_paid_ballot(address _candidate, uint256 _ballot_id)
        internal
    {
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        require(ballot.ballot_type == 2, "Wrong Ballot Type!");
        ballot.current_winner = _candidate;

        // require(msg.value >= open_paid_voting_cost, "Cast vote with 1 ETH!");
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
        require(
            address_to_candidate_mapping[_candidate].ballot_id != _ballot_id,
            "Candidate does not exist in Ballot!"
        );

        address_to_candidate_mapping[_candidate].vote_count++;
        address_to_voter_mapping[msg.sender].voted = true;

        emit voted(_candidate);
    }

    function vote_closed_paid_ballot(address _candidate, uint256 _ballot_id)
        internal
    {
        // require(election_type == 2);
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        require(ballot.ballot_type == 3, "Wrong Ballot Type!");
    }

    function vote(address _candidate, uint256 _ballot_id) public {
        uint256 int_ballot_id = _ballot_id - 100;
        require(int_ballot_id < max_ballots, "No such Ballot Exists!");
        Ballot memory ballot = ballots[int_ballot_id];

        // 0, 1, 2, 3, 4, 5, 6 => open free, closed free, open paid, closed paid,
        if (ballot.ballot_type == 0) {
            vote_open_ballot(_candidate, _ballot_id);
        } else if (ballot.ballot_type == 1) {
            vote_closed_free_ballot(_candidate, _ballot_id);
        } else if (ballot.ballot_type == 2) {
            vote_open_paid_ballot(_candidate, _ballot_id);
        } else if (ballot.ballot_type == 3) {
            vote_closed_paid_ballot(_candidate, _ballot_id);
        }
    }

    /** GETTERS **/

    function get_ballot(uint256 _ballot_id)
        public
        view
        returns (Ballot memory)
    {
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        require(ballot.ballot_type <= 3, "This is a Secret Ballot!");
        return id_to_ballot_mapping[_ballot_id];
    }

    function get_candidate(address _candidate_addr, uint256 _ballot_id)
        public
        view
        returns (Candidate memory)
    {
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        require(ballot.ballot_type <= 3, "This is a Secret Ballot!");
        return address_to_candidate_mapping[_candidate_addr];
    }

    function get_voter(address _voter_address, uint256 _ballot_id)
        public
        view
        returns (Voter memory)
    {
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        require(ballot.ballot_type <= 3, "This is a Secret Ballot!");
        return address_to_voter_mapping[_voter_address];
    }

    function get_candidates(uint256 _ballot_id)
        public
        view
        returns (address[] memory)
    {
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        require(ballot.ballot_type <= 3, "This is a Secret Ballot!");
        return ballot_candidate_mapping[_ballot_id];
    }

    function get_voters(uint256 _ballot_id)
        public
        view
        returns (address[] memory)
    {
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        require(ballot.ballot_type <= 3, "This is a Secret Ballot!");
        return ballot_voters_mapping[_ballot_id];
    }

    function get_election(uint256 _election_id)
        public
        view
        only_election_ballot_owner
        returns (Election memory)
    {
        require(_election_id <= ballots.length, "Invalid election Id!");
        return elections[_election_id];
    }

    function find_winner(address _candidate, Ballot memory ballot)
        internal
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

    function get_winner(uint256 _ballot_id) public payable returns (address) {
        Ballot storage ballot = ballots[_ballot_id - 100];

        uint256 duration = (block.timestamp - ballot.open_date) / 60 / 60 / 24;

        require(duration < ballot._days, "This Ballot is still Open!");
        require(ballot.expired == true, "This Ballot is still Open!");
        // require(msg.value >= get_winner_cost, "Get results with 1 ETH!");
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
        id_to_ballot_mapping[_ballot_id].expired = true;
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
