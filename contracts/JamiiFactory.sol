// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.8;

import "../interfaces/IJamiiFactory.sol";
import "./JamiiBase.sol";
import "./Utils.sol";

contract JamiiFactory is IJamiiFactory, JamiiBase, Utils {
    Ballot[] private ballots;
    Voter[] private voters;

    // numbers
    // uint256 private ballot_fee = 340000000000000000; // $
    uint256 private ballot_fee = 10000000000000000; // $
    uint256 private ballot_count;
    uint256[] private voter_ids;
    uint256[] internal ballot_types_arr = [0, 1, 2, 3, 4];
    uint256 internal ballot_types = ballot_types_arr.length;

    // mappings
    mapping(string => Ballot) private id_to_ballot_mapping;
    mapping(string => address[]) private ballot_candidate_mapping;
    mapping(string => address[]) private ballot_voters_mapping;
    mapping(address => Candidate) private address_to_candidate_mapping;
    mapping(address => Voter) private address_to_voter_mapping;
    mapping(address => string[]) private voter_to_ballots;
    mapping(address => string[]) private voted_to_ballots;
    mapping(uint256 => string[]) private voter_id_to_ballots;

    modifier only_voter(address _candidate, string memory _ballot_id) {
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        require(
            address_to_voter_mapping[msg.sender].registered == true && // voter is registered
                !exists(voted_to_ballots[msg.sender], _ballot_id) && // voted has NOT voted
                compare_strings(
                    id_to_ballot_mapping[_ballot_id].ballot_id,
                    _ballot_id
                ) ==
                true && // ballot_id is valid
                ballot.expired == false && // ballot still open
                compare_strings(
                    address_to_candidate_mapping[_candidate].ballot_id,
                    _ballot_id
                ) ==
                true, // candidate exists in ballot
            "Voter Error!"
        );
        _;
    }

    modifier only_voter_closed_ballots(
        address _candidate,
        string memory _ballot_id
    ) {
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        Voter memory voter = address_to_voter_mapping[msg.sender];
        require(
            voter.rights == true && // voter has voting rights
                address_to_voter_mapping[msg.sender].registered == true && // voter is registered
                !exists(voted_to_ballots[msg.sender], _ballot_id) && // voter has NOT voted
                compare_strings(
                    id_to_ballot_mapping[_ballot_id].ballot_id,
                    _ballot_id
                ) ==
                true && // ballot_id is valid
                compare_strings(
                    address_to_candidate_mapping[_candidate].ballot_id,
                    _ballot_id
                ) ==
                true, // candidate exists in ballot
            "Voter Error(Closed Ballot)!"
        );
        _;
    }

    modifier only_secret_ballot(string memory _ballot_id) {
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        require(ballot.ballot_type < 3, "This is a Secret Ballot!");
        _;
    }

    modifier only_register_voter(uint256 _id_number, string memory _ballot_id) {
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        uint256 duration = (block.timestamp - ballot.open_date);
        uint256 n = ballots.length;
        require(
            n >= 1 && // ballot exists
                duration < (ballot._days * 86400) && // ballot NOT expired
                !exists(voter_to_ballots[msg.sender], _ballot_id) && // NOT yet registered(address)
                !exists(voter_id_to_ballots[_id_number], _ballot_id) && // NOT yet registered(id_number)
                duration < (ballot.registration_window * 86400), // registration still Open
            "Error Voter Registration!!"
        );
        _;
    }

    function initialize(string memory _arbitrary_text) public initializer {
        JamiiBase.initialize();
    }

    function create_ballot_type(
        uint256 _ballot_type,
        string memory _ballot_name
    ) public onlyOwner {
        require(
            _ballot_type > (ballot_types - 1) &&
                _ballot_type < (ballot_types + 1),
            "Invalid Type Index!"
        );
        ballot_types_arr.push(ballot_types + 1);
        ballot_types_mapping[_ballot_type] = _ballot_name;
    }

    function create_ballot(
        string memory _ballot_id,
        string memory _ballot_name,
        address[] memory _ballot_candidates_addr,
        uint256 _ballot_type,
        uint256 _days,
        uint256 _registration_period
    ) public payable {
        bytes memory bytes_ballot_name = bytes(_ballot_name);
        require(
            msg.value >= ballot_fee && // make sure funds are enough
                bytes_ballot_name.length > 0 && // Valid ballot name
                _ballot_candidates_addr.length > 1 && // > 2 ballot candidates
                _ballot_type <= ballot_types && // valid ballot type
                _days > _registration_period && // invalid dates
                _registration_period > 0, // invalid registration period
            "Error Ballot Creation!"
        );

        ballot_candidate_mapping[_ballot_id] = _ballot_candidates_addr;

        uint256 n = _ballot_candidates_addr.length;
        for (uint256 i = 0; i < n; i++) {
            Candidate memory candidate = Candidate(
                candidates_count,
                _ballot_id,
                _ballot_candidates_addr[i],
                0
            );
            address_to_candidate_mapping[
                _ballot_candidates_addr[i]
            ] = candidate;
            candidates_count++;
        }

        Ballot memory new_ballot = Ballot(
            _ballot_id,
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
        id_to_ballot_mapping[_ballot_id] = new_ballot;
        ballots.push(new_ballot);
        ballot_count++;

        emit created_ballot(_ballot_type);
    }

    // createBallot(_ballot_candidates)
    // ballot 0 -> ["0xf9d48aC9eC8F207AEF93518B51D2CdA61e596904", "0x6c0A17AEe0a1420583446B77f0c8a55e369Bb07e"]
    // ballot 1 -> ["0xa8d17cc9cAF29Af964d19267DDEb4dfF122697B0","0xA0341558519429f6A93475bA53AD319f99302bff"]
    // ballot 2 -> ["0x4A4eC531A0c952d76fdb0E1DC9561A893Cc3177c", "0xfA5C1650946124cB9ACBe478e6D37b5F6c1983D6"]
    // ballot 3 -> ["0x7ffC57839B00206D1ad20c69A1981b489f772031", "0x8E9a9f198d9d6457339A11b05A214F9aa78dbc8b"]
    // ballot 4 -> ["0xfA5C1650946124cB9ACBe478e6D37b5F6c1983D6", "0xfe3e6ab5d787f4099478bbe811a740d903e219fb"]
    // ballot 5 -> ballot 0
    // ballot 6 -> ballot 1

    /** REGISTERS VOTERS **/

    function create_voter_open_ballot(
        uint256 _id_number,
        string memory _ballot_id
    ) internal returns (bytes32) {
        Ballot storage ballot = id_to_ballot_mapping[_ballot_id];

        ballot_voters_mapping[_ballot_id].push(msg.sender);

        // id_number validation here
        bytes32 unique_voter_id = keccak256(abi.encode(_id_number));
        Voter memory new_voter = Voter(
            ballot.voters_count,
            msg.sender,
            _ballot_id,
            true,
            true,
            false,
            unique_voter_id
        );
        address_to_voter_mapping[msg.sender] = new_voter;
        voters.push(new_voter);

        id_to_ballot_mapping[_ballot_id].voters_count++;

        voter_to_ballots[msg.sender].push(_ballot_id);
        voter_id_to_ballots[_id_number].push(_ballot_id);

        emit registered_voter(unique_voter_id);

        return unique_voter_id;
    }

    function create_voter_closed_ballot(
        uint256 _id_number,
        string memory _ballot_id
    ) internal returns (bytes32) {
        Ballot storage ballot = id_to_ballot_mapping[_ballot_id];

        ballot_voters_mapping[_ballot_id].push(msg.sender);

        // id_number validation here
        bytes32 unique_voter_id = keccak256(abi.encode(_id_number));

        Voter memory new_voter = Voter(
            ballot.voters_count,
            msg.sender,
            _ballot_id,
            true,
            false,
            false,
            unique_voter_id
        );
        address_to_voter_mapping[msg.sender] = new_voter;
        voters.push(new_voter);

        id_to_ballot_mapping[_ballot_id].voters_count++;

        voter_to_ballots[msg.sender].push(_ballot_id);
        voter_id_to_ballots[_id_number].push(_ballot_id);

        emit registered_voter(unique_voter_id);

        return unique_voter_id;
    }

    function register_voter_open_ballot(
        uint256 _id_number,
        string memory _ballot_id
    ) internal only_register_voter(_id_number, _ballot_id) returns (bytes32) {
        bytes32 unique_voter_id = create_voter_open_ballot(
            _id_number,
            _ballot_id
        );
        return unique_voter_id;
    }

    function register_voter_closed_ballot(
        uint256 _id_number,
        string memory _ballot_id
    ) internal only_register_voter(_id_number, _ballot_id) returns (bytes32) {
        // require("You need to lock value in the Ballot! -> redistributed after ballot!");
        bytes32 unique_voter_id = create_voter_closed_ballot(
            _id_number,
            _ballot_id
        );
        return unique_voter_id;
    }

    function register_voter(uint256 _id_number, string memory _ballot_id)
        public
        only_register_voter(_id_number, _ballot_id)
        returns (bytes32)
    {
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];

        // 0, 1, 2, 3 -> open, closed, open secret, closed secret,
        if (ballot.ballot_type == 0 || ballot.ballot_type == 2) {
            bytes32 unique_voter_id = register_voter_open_ballot(
                _id_number,
                _ballot_id
            );
            return unique_voter_id;
        } else if (ballot.ballot_type == 1 || ballot.ballot_type == 3) {
            bytes32 unique_voter_id = register_voter_closed_ballot(
                _id_number,
                _ballot_id
            );
            return unique_voter_id;
        }
    }

    /** VOTING RIGHTS **/
    function assign_voting_rights(address _voter, string memory _ballot_id)
        public
    {
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        uint256 _ballot_type = ballot.ballot_type;

        require(
            (msg.sender == ballot.chair && // check permissions
                ballot.voters_count >= 1 && // ballot is valid
                ballot.expired == false && // balot is Open
                compare_strings(
                    address_to_voter_mapping[_voter].ballot_id,
                    _ballot_id
                ) ==
                true && // voter is registered in ballot
                address_to_voter_mapping[_voter].registered == true && // voter is registered voter
                address_to_voter_mapping[_voter].rights == false && // voter does NOT have voting rights
                _ballot_type == 1) || _ballot_type == 3, // ballot is closed-paid ballot
            "Error Assigning Voting Rights!"
        );
        // closed paid ballot [3]
        // require voter has sufficient voting tokens for a ballot -> buy voting rights -> awaiting approval
        address_to_voter_mapping[_voter].rights = true;

        emit assigned_voting_rights(_voter);
    }

    // function buy_voting_rights(){ }

    function create_vote(address _candidate) internal {
        address_to_candidate_mapping[_candidate].vote_count++;
        address_to_voter_mapping[msg.sender].voted = true;
        emit voted(_candidate);
    }

    function vote_open_ballot(address _candidate, string memory _ballot_id)
        internal
        only_voter(_candidate, _ballot_id)
    {
        // require("Need to have locked value in ballot during registration!")

        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        ballot.current_winner = _candidate;
        find_winner(_candidate, ballot);
        create_vote(_candidate);
    }

    function vote_closed_ballot(address _candidate, string memory _ballot_id)
        internal
        only_voter_closed_ballots(_candidate, _ballot_id)
    {
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        require(ballot.ballot_type == 1, "Wrong Ballot Type!");
        // require("Need to have locked value in ballot during registration!")

        ballot.current_winner = _candidate;
        find_winner(_candidate, ballot);
        create_vote(_candidate);
    }

    function vote(address _candidate, string memory _ballot_id)
        public
        only_voter(_candidate, _ballot_id)
    {
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];

        // 0, 1, 2, 3, 4, 5, 6 => open free, closed free, open paid, closed paid,
        if (ballot.ballot_type == 0) {
            vote_open_ballot(_candidate, _ballot_id);
        } else if (ballot.ballot_type == 1) {
            vote_closed_ballot(_candidate, _ballot_id);
        }
        voted_to_ballots[msg.sender].push(_ballot_id);
    }

    /** GETTERS **/
    function get_ballot(string memory _ballot_id)
        public
        view
        only_secret_ballot(_ballot_id)
        returns (Ballot memory)
    {
        return id_to_ballot_mapping[_ballot_id];
    }

    function get_candidate(address _candidate_addr)
        public
        view
        only_secret_ballot("")
        returns (Candidate memory)
    {
        return address_to_candidate_mapping[_candidate_addr];
    }

    function get_voter(address _voter_address)
        public
        view
        only_secret_ballot("")
        returns (Voter memory)
    {
        return address_to_voter_mapping[_voter_address];
    }

    function get_candidates(string memory _ballot_id)
        public
        view
        returns (address[] memory)
    {
        return ballot_candidate_mapping[_ballot_id];
    }

    function get_voters(string memory _ballot_id)
        public
        view
        only_secret_ballot(_ballot_id)
        returns (address[] memory)
    {
        return ballot_voters_mapping[_ballot_id];
    }

    function find_winner(address _candidate, Ballot memory ballot)
        internal
        view
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

    function get_winner(string memory _ballot_id)
        public
        only_secret_ballot(_ballot_id)
        returns (address)
    {
        Ballot memory ballot = id_to_ballot_mapping[_ballot_id];
        uint256 duration = (block.timestamp - ballot.open_date) / 60 / 60 / 24;

        require(
            id_to_ballot_mapping[_ballot_id].current_winner != address(0x0) &&
                duration > ballot._days,
            "Error Getting Winner!!"
        );
        // require(
        //     id_to_ballot_mapping[_ballot_id].current_winner != address(0x0),
        //     "No Such Ballot Exists!"
        // );

        // require(duration > ballot._days, "This Ballot is NOT yet Expired!");

        if (ballot.tie == true) {
            emit tied_ballot(ballot.tie);
            return address(0x0);
        } else {
            address winner = ballot.current_winner;
            return winner;
        }
    }

    function end_ballot(string memory _ballot_id) public {
        Ballot storage ballot = id_to_ballot_mapping[_ballot_id];

        uint256 duration = (block.timestamp - ballot.open_date) / 60 / 60 / 24;
        require(
            duration < ballot._days && msg.sender == ballot.chair,
            "Error Ending Ballot!!"
        );
        // require(duration < ballot._days, "This Ballot is NOT yet Expired!");

        // require(msg.sender == ballot.chair, "Insufficient Permissions!");

        ballot.expired = true;
        id_to_ballot_mapping[_ballot_id].expired = true;

        emit ended_ballot(_ballot_id);
    }

    function withdraw() public onlyOwner {
        payable(fee_addr).transfer(address(this).balance);
    }
}
