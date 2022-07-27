// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.8;

interface IJamiiFactory {
    /*
     * @dev ballot struct
     * @arg ballot_id A unique identification number for a ballot
     * @arg ballot_type An integer representing the type of ballot
     * @arg ballot_name The name of the ballot
     * @arg chair Address of the ballot creator/owner
     * @arg ballot_candidates Array of address of ballot candidates
     * @arg ballot_voters Registered voters of a ballot
     * @arg open The status of the Ballot, open/closed
     * @arg current_winner The current_winner of a Ballot
     * @arg tie True is there is a tie between candidates False otherwise
     */
    struct Ballot {
        string ballot_id;
        uint256 ballot_type;
        string ballot_name;
        address chair;
        uint256 voters_count;
        uint256 open_date;
        uint256 _days;
        bool expired;
        uint256 registration_window;
        address current_winner;
        bool tie;
    }

    /*
     * @dev candidate struct
     * @arg candidate_id A unique identification number for a candidate
     * @arg ballot_id A unique identifier for a Ballot
     * @arg candidate_address The address of a candidate
     * @arg vote_count The number of votes a candidates has
     */
    struct Candidate {
        uint256 candidate_id;
        string ballot_id;
        address candidate_address;
        uint256 vote_count;
        // implement other stats(party, funding)
    }

    /*
     * @dev voter struct
     * @arg voter_id A unique identification number for a candidate
     * @arg voter_address The address of a voter
     * @arg ballot_id A unique identifier for a Ballot
     * @arg registered A bool indicating whether the candidate is registered in Ballot
     * @arg rights A voter's voting rights in Ballot
     * @arg voted Status of a Voter, voted/not voted
     * @arg unique_voter_id A unique identifier for a voter in Ballot
     */
    struct Voter {
        uint256 voter_id;
        address voter_address;
        string ballot_id;
        bool registered;
        bool rights;
        bool voted;
        bytes32 unique_voter_id;
        // implement other stats(voting weight, tokens)
    }

    /*
     * @dev Emitted when ballot_ownercreate a new Ballot with unique `_ballot_id`.
     */
    event created_ballot(uint256 _ballot_type);

    /*
     * @dev Emitted when `_voter` registers to vote.
     */
    event registered_voter(bytes32 _voter_unique_id);

    /*
     * @dev Emitted when `ballot_owner` assigns voting rights to `voter`.
     */
    event assigned_voting_rights(address _voter);

    /*
     * @dev Emitted when `_voter` casts a vote to `_candidate`.
     */
    event voted(address indexed _candidate);

    /*
     * @dev Emitted when there is a tie between `ballot_candidates` in a Ballot.
     */
    event tied_ballot(bool _tie);

    /*
     * @dev Emitted when a ballot chair ends a ballot with `_ballot_id`.
     */
    event ended_ballot(string _ballot_id);

    /*
     * @dev creates a new open ballot
     * @param _ballot_name An arbitrary ballot name
     * @param _ballot_candidates An array of address of candidates participating in the ballot
     * @param _ballot_type The type of ballot, open, closed...
     *
     * @require:
     *  - ballot_candidates.length > 1
     *  - msg.sender == ballot_owner
     *  - creators pay ballot_cost
     *  - valid ballot_type <= ballot_types
     *  - ballots.length <= limit
     */
    function create_ballot(
        string memory _ballot_id,
        string memory _ballot_name,
        address[] memory _ballot_candidates,
        uint256 _ballot_type,
        uint256 _days,
        uint256 _registration_window
    ) external payable;

    function register_voter(uint256 _id_number, string memory _ballot_id)
        external
        returns (bytes32);

    /*
     * @dev assign voting rights
     * @param _voter A unique voter address
     * @param _ballot_id The Id of a specific ballot
     *
     * @require:
     *  - valid _ballot_id
     *  - ballot is still open
     *  - Ballots must exist
     *  - msg.sender == ballot_owner || msg.sender == authorized
     *  - msg.sender is registered voter in specified ballot
     *  - ballot_type >= 1
     *  - msg.sender == registered voter
     *  - voting_rights == None
     */
    function assign_voting_rights(address _voter, string memory _ballot_id)
        external;

    /*
     * @dev voter votes for a candidate
     * @param _candidate The address of a candidate in the ballot
     *
     * @require:
     *  - ballot_type == 0(open)
     *  - msg.sender registered voter
     *  - msg.sender NOT voted
     *  - ballot is Open
     *  - _candidate is a valid candidate
     *  - ballot_id is valid
     */
    function vote(address _candidate, string memory _ballot_id) external;

    /*
     * @dev msg.sender gets a ballot.
     * @param _ballot_id The unique Id of a Ballot!
     *
     * @require:
     *
     *
     *
     */
    function get_ballot(string memory _ballot_id)
        external
        view
        returns (Ballot memory);

    /*
     * @dev msg.sender gets a candidate.
     * @param _candidate_addr The unique address of a Candidate!
     *
     * @require:
     *
     *
     *
     */
    function get_candidate(address _candidate_addr)
        external
        view
        returns (Candidate memory);

    /*
     * @dev msg.sender gets a voter of a ballot.
     * @param _voter_address The unique address of a voter!
     * @param _ballot_id The unique Id of a Ballot!
     *
     * @require:
     *
     *
     *
     */
    function get_voter(address _voter_address)
        external
        view
        returns (Voter memory);

    /*
     * @dev msg.sender gets candidates of a ballot.
     * @param _ballot_id The unique Id of a Ballot!
     *
     * @require:
     *
     *
     *
     */
    function get_candidates(string memory _ballot_id)
        external
        view
        returns (address[] memory);

    /*
     * @dev msg.sender gets the voters of a ballot.
     * @param _ballot_id The unique Id of a Ballot!
     *
     * @require:
     *
     *
     *
     */
    function get_voters(string memory _ballot_id)
        external
        view
        returns (address[] memory);

    /*
     * @dev Get the winner of a ballot
     * @param _ballot_id A integer representing the ballot id
     * @return An address of the winner(candidate)
     *
     * @require:
     *  - valid _ballot_id
     *  - if ballot_type >= 1, Require msg.sender == ballot_owner || authorized owner
     *  - ballot is over(closed)
     */
    function get_winner(string memory _ballot_id) external returns (address);

    /*
     * @dev ends a ballot
     * @param _ballot_id The Id of a ballot
     *
     * @require:
     *  - time for ballot is up block_number >= set_block_number
     *  - msg.sender == ballot_owner
     */
    function end_ballot(string memory _ballot_id) external;

    // function withdraw(string memory _ballot_id, bool _destroy) external;
}
