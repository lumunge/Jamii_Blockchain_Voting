from scripts.script_factory import deploy_election, create_open_ballot
from scripts.utils import get_account
from brownie import accounts

ORGANIZATION_NAME = "TEST_ORG"
MAX_BALLOTS = 3
BALLOT_NAME = "BALLOT_1"
BALLOT_CANDIDATES = [
    "0xf9d48aC9eC8F207AEF93518B51D2CdA61e596904",
    "0x6c0A17AEe0a1420583446B77f0c8a55e369Bb07e",
]
BALLOT_TYPES = [0, 1, 2]
BALLOT_COST = 1000000000000000000
ELECTION_COST = 2000000000000000000


def test_create_election():
    account = get_account()
    _factory = deploy_election(ORGANIZATION_NAME)
    assert (
        _factory.election_cost() == ELECTION_COST
    ), "Not enough funds to start an Election"
    assert (
        _factory.organization_name() == ORGANIZATION_NAME
    ), "Invalid _organization_name"
    assert _factory.ballot_owner() == account, "Ballot owner NOT account"
    assert _factory.election_owner() == account, "Election owner NOT account"
    assert _factory.max_ballots() == MAX_BALLOTS, "Max_Ballot Error"


def test_create_open_ballot():
    account = get_account()
    _factory = deploy_election(ORGANIZATION_NAME)
    new_ballot = _factory.create_open_ballot(
        BALLOT_NAME,
        BALLOT_CANDIDATES,
        BALLOT_TYPES[0],
        {"from": account, "value": BALLOT_COST},
    )

    assert _factory.ballots(0)[1] <= len(BALLOT_TYPES), "Invalid Ballot Type"
    assert _factory.ballots(0)[2] == BALLOT_NAME, "Invalid Ballot Name"
    assert _factory.ballots(0)[3] == account, "Invalid Ballot Account"
    assert _factory.ballots(0)[4] == 0, "Ballot voters needs to be Zero"
    assert _factory.ballots(0)[5] == True, "Ballot is_open = True"
    assert (
        _factory.ballots(0)[6] == "0x0000000000000000000000000000000000000000"
    ), "Invalid winner address"
    assert _factory.ballots(0)[7] == False, "No Tie in Ballot"

    assert _factory.candidates_count() > 1, "Ballot need to have > 1 Candidates"
    assert _factory.ballot_count() < MAX_BALLOTS, "Maximum ballots number supursed"
    assert (
        _factory.address_to_candidate_mapping(BALLOT_CANDIDATES[0])[1]
        == _factory.ballots(0)[0]
    ), "Invalid Ballot_Id"


"""
register_voter_open_ballot(_id_number, _ballot_id) public returns (bytes32)
    Require:
        - ballot exists *
        - ballot is Open *
        - voter is NOT registered *
        - ID is unique *

vote_open_ballot(address _candidate, uint256 _ballot_id)
    Require:
        - ballot is open_ballot == 0 *
        - voter is Registered *
        - voter has Not voted *
        - ballot is Open *
        - ballot_id is Valid *
        - candidates Not in Ballot *
"""
