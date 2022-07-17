pragma solidity 0.8.8;

interface IJamiiFactory {
    /*
        * @dev election struct
        * @arg election_id A unique identification number for an election
        * @arg election_owner The address of the election owner
        * @arg organization The name of the organization
        * @arg open A boolean value indicating the election status

    */
    struct Election {
        uint256 election_id;
        address election_owner;
        string organization_name;
        bool open;
    }

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
        uint256 ballot_id;
        uint256 ballot_type;
        string ballot_name;
        address chair;
        // Candidate[] ballot_candidates;
        address[] ballot_candidates_addr;
        // Voter[] ballot_voters;
        address[] ballot_voters_addr;
        uint256 voters_count;
        bool open;
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
        uint256 ballot_id;
        address candidate_address;
        uint256 vote_count;
        // implement party
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
        uint256 ballot_id;
        bool registered;
        bool rights;
        bool voted;
        bytes32 unique_voter_id;
        // implement voting weight
        // implement multiple ballot -> ballot_id
    }

    /**
     * @dev Emitted when msg.sender creates new `_organization_name`.
     */
    event created_new_election(string _organization_name);

    /**
     * @dev Emitted when ballot_owner/election_owner create a new Ballot with unique `_ballot_id`.
     */
    event created_ballot(uint256 _ballot_id);

    /**
     * @dev Emitted when `_voter` registers to vote.
     */
    event registered_voter(bytes32 _voter_unique_id);

    /**
     * @dev Emitted when `ballot_owner/election_owner` assigns voting rights to `voter`.
     */
    event assigned_voting_rights(address _voter);

    /**
     * @dev Emitted when `_voter` casts a vote to `_candidate`.
     */
    event voted(address indexed _candidate);

    /**
     * @dev Emitted when there is a tie between `ballot_candidates` in a Ballot.
     */
    event tied_ballot(bool _tie);

    /*
     * @dev creates a new open ballot
     * @param _ballot_name An arbitrary ballot name
     * @param _ballot_candidates An array of address of candidates participating in the ballot
     * @param _ballot_type The type of ballot, open, closed...
     *
     * @require:
     *  - ballot_candidates.length > 1
     *  - msg.sender == ballot_owner || election_owner
     *  - creators pay ballot_cost
     *  - valid ballot_type <= ballot_types
     *  - ballots.length <= limit
     */
    function create_open_ballot(
        string memory _ballot_name,
        address[] memory _ballot_candidates,
        uint256 _ballot_type
    ) external payable;

    /*
     * @dev creates a new closed ballot`
     * @param _ballot_name An arbitrary ballot name
     * @param _ballot_candidates An array of address of candidates participating in the ballot
     * @return A new ballot struct
     *
     * @require:
     *  - ballot_candidates.length > 1
     *  - valid ballot_type (1)
     *  - creators pay ballot_cost
     *  - ballots.length <= limit
     */
    function create_closed_free_ballot(
        string memory _ballot_name,
        address[] memory _ballot_candidates,
        uint256 _ballot_type
    ) external payable returns (Ballot memory);

    /*
     * @dev creates a new closed paid ballot
     * @param _ballot_name An arbitrary ballot name
     * @param _ballot_candidates An array of address of candidates participating in the ballot
     * @return A new ballot struct
     *
     * @require:
     *  - ballot_candidates.length > 1
     *  - valid ballot_type (2)
     *  - creators pay ballot_cost
     *  - ballots.length <= limit
     */
    function create_closed_paid_ballot(
        string memory _ballot_name,
        address[] memory _ballot_candidates,
        uint256 _ballot_type
    ) external payable returns (Ballot memory);

    /*
     * @dev registers a voter in a open ballot
     * @param _id_number A unique identification number
     * @param _ballot The ballot identification number
     * @return A bytes32 unique user id
     *
     * @require:
     *  - ballot is status:open
     *  - unique _id_number(no duplicates)
     *  - unregistered msg.sender
     *  - valid _ballot_id number
     */
    function register_voter_open_ballot(uint256 _id_number, uint256 _ballot_id)
        external
        returns (bytes32);

    /*
     * @dev registers a voter in a paid ballot
     * @param _id_number A unique identification number
     * @param _ballot The ballot identification number
     * @return A bytes32 unique user id
     *
     * @require:
     *  - ballot is status:open
     *  - unique _id_number(no duplicates)
     *  - unregistered msg.sender
     *  - valid _ballot_id number
     *  - msg.value <= registration_fee
     */
    function register_voter_paid_ballot(uint256 _id_number, uint256 _ballot_id)
        external
        returns (bytes32);

    /*
     * @dev get a ballot in open ballot
     * @param _ballot_id A unique identification number for a ballot
     * @return A Ballot struct if ballot_type == 0 else request rights from chair
     *
     * @require:
     *  - valid _ballot_id
     *  - if ballot_type == closed msg.sender == ballot_owner || election_owner
     */
    function get_ballot(uint256 _ballot_id) external returns (Ballot memory);

    /*
     * @dev get the candidates in a ballot
     * @param _ballot_id A unique identification number for a ballot
     * @return An array of addresses representing candidates in a ballot if ballot_type == 0 else request permissions
     *
     * @require:
     *  - if ballot_type == closed msg.sender == ballot_owner || election_owner
     *  - valid _ballot_id
     */
    function get_ballot_candidates_addr(uint256 _ballot_id)
        external
        returns (address[] memory);

    /*
     * @dev get a ballot's registered voters in an open ballot, requests permissions in closed ballot
     * @param _ballot_id A unique identification number
     * @return An array of addresses representing ballot registered voters
     *
     * @require:
     *  - if ballot_type == closed msg.sender == ballot_owner || election_owner
     *  - valid _ballot_id
     */
    function get_registered_voters(uint256 _ballot_id)
        external
        returns (Voter[] memory);

    /*
     * @dev get an election
     * @param _election_id A unique identification number for an election
     * @return An Election struct
     *
     * @require:
     *  - msg.sender == ballot_owner || msg.sender == authorized
     *  - valid _election_id
     */
    function get_election(uint256 _election_id)
        external
        returns (Election memory);

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
    function assign_voting_rights(address _voter, uint256 _ballot_id) external;

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
    function vote_open_ballot(address _candidate, uint256 _ballot_id) external;

    /*
     *@dev voter votes in an open payable ballot
     *@param _candidate The address of the candidate in the open paid ballot
     *
     * @require:
     *  - Ballot is Open Paid Ballot
     *  - msg.value == open_paid_voting_cost
     *  - msg.sender == registered Voter
     *  - msg.sender has Valid Voting Rights

     *  - _candidate to be valid candidate
     *  - msg.sender to be registered voter
     *  - ballot is open(in progress)
     *  - msg.sender first time voting
     *  - msg.value >= voting_price
     */
    function vote_open_paid_ballot(address _candidate, uint256 _ballot_id)
        external
        payable;

    /*
     *@dev voter votes in an closed payable ballot
     *@param _candidate The address of the candidate in the open paid ballot
     *
     * @require:
     *  - msg.sender == registered voters
     *  - msg.sender == voting rights(weight)
     *  - msg.sender first time voting
     *  - msg.value >= voting price
     */
    function vote_closed_paid_ballot(address _candidate) external payable;

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
    function get_winner(uint256 _ballot_id) external payable returns (address);

    /*
     * @dev ends a ballot
     * @param _ballot_id The Id of a ballot
     *
     * @require:
     *  - time for ballot is up block_number >= set_block_number
     *  - msg.sender == ballot_owner
     */
    function end_ballot(uint256 _ballot_id) external;

    /*
     * @dev ends an election(ends all currently opened ballots)
     * @param _ballot_id The ballot Id
     *
     * @require:
     *  - msg.sender == election_owner
     */
    function end_election(uint256 _election_id) external;
}
