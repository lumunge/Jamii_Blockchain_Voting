pragma solidity 0.8.8;

interface IElectionFactory {
    /*
        * @dev election struct
        * @arg election_id A unique identification number for an election
        * @arg election_owner The address of the election owner
        * @arg organization The name of the organization
        * @arg ballots An array of Ballot structs representing individual ballots
        * @arg ballot_candidates Array of address of ballot candidates
        * @arg open A boolean value indicating the election status

    */
    struct Election {
        uint256 election_id;
        address election_owner;
        string organization;
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

    */
    struct Ballot {
        uint256 ballot_id;
        uint256 ballot_type;
        string ballot_name;
        address chair;
        address[] ballot_candidates;
        address[] ballot_voters;
        bool open;
    }

    /*
     * @dev creates a new open ballot
     * @param _ballot_name An arbitrary ballot name
     * @param _ballot_candidates An array of address of candidates participating in the ballot
     * @return A new ballot struct
     */
    function create_open_ballot(
        string memory _ballot_name,
        address[] memory _ballot_candidates,
        uint256 _ballot_type
    ) external payable returns (Ballot memory);

    /*
     * @dev creates a new closed ballot
     * @param _ballot_name An arbitrary ballot name
     * @param _ballot_candidates An array of address of candidates participating in the ballot
     * @return A new ballot struct
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
     */
    function create_closed_paid_ballot(
        string memory _ballot_name,
        address[] memory _ballot_candidates,
        uint256 _ballot_type
    ) external payable returns (Ballot memory);

    /*
     * @dev registers a voter
     * @param _id_number A unique identification number
     * @return A bytes32 unique user id
     */
    function register_voter_open_ballot(uint256 _id_number)
        external
        returns (bytes32);

    /*
     * @dev get a ballot
     * @param _ballot_id A unique identification number for a ballot
     * @return A Ballot struct
     */
    function get_ballot(uint256 _ballot_id) external returns (Ballot memory);

    /*
     * @dev get the candidates in a ballot
     * @param _ballot_id A unique identification number for a ballot
     * @return An array of addresses representing candidates in a ballot
     */
    function get_ballot_candidates(uint256 _ballot_id)
        external
        returns (address[] memory);

    /*
     * @dev get a ballot's registered voters
     * @param _ballot_id A unique identification number
     * @return An array of addresses representing ballot registered voters
     */
    function get_registered_voters(uint256 _ballot_id)
        external
        returns (address[] memory);

    /*
     * @dev get an election
     * @param _election_id A unique identification number for an election
     * @return An Election struct
     */
    function get_election(uint256 _election_id)
        external
        returns (Election memory);

    /*
     * @dev voter votes for a candidate
     * @param _candidate The address of a candidate in the ballot
     */
    function vote_open_ballot(address _candidate) external;

    /*
     *@dev voter votes in an open payable ballot
     *@param _candidate The address of the candidate in the open paid ballot
     */
    function vote_open_paid_ballot(address _candidate) external payable;

    /*
     *@dev voter votes in an closed payable ballot
     *@param _candidate The address of the candidate in the open paid ballot
     */
    function vote_closed_paid_ballot(address _candidate) external payable;

    /*
     * @dev Get the winner of a ballot
     * @param _ballot_id A integer representing the ballot id
     * @return An address of the winner(candidate)
     */
    function get_winner(uint256 _ballot_id) external payable returns (address);

    /*
     * @dev ends a ballot
     * @param _ballot_id The Id of a ballot
     */
    function end_ballot(uint256 _ballot_id) external;

    /*
     * @dev ends an election(ends all currently opened ballots)
     * @param _ballot_id The ballot Id
     */
    function end_election(uint256 _election_id) external;
}
