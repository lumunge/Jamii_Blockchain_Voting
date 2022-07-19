from scripts.script_factory import deploy_election, create_open_ballot
from scripts.utils import get_account, election_cost
from brownie import accounts, network, config, reverts

ORGANIZATION_NAME = "TEST_ORG"
MAX_BALLOTS = 3
BALLOT_NAME = "BALLOT_1"
BALLOT_CANDIDATES = [
    "0xf9d48aC9eC8F207AEF93518B51D2CdA61e596904",
    "0x6c0A17AEe0a1420583446B77f0c8a55e369Bb07e",
]
BALLOT_TYPES = [0, 1, 2]
BALLOT_DAYS = 10
BALLOT_REG_DAYS = 4

FAKE_BALLOT_ID = 104

# VOTER
ID_NUMBER = 12345678


def test_create_election():
    account = get_account(0)
    _factory = deploy_election(ORGANIZATION_NAME)
    assert (
        _factory.election_cost() == election_cost
    ), "Not enough funds to start an Election"

    with reverts("Enter a valid Organization Name!"):
        create_election = deploy_election("")
        create_election.wait(1)

    assert (
        _factory.organization_name() == ORGANIZATION_NAME
    ), "Invalid _organization_name"
    assert _factory.ballot_owner() == account, "Ballot owner NOT account"
    assert _factory.election_owner() == account, "Election owner NOT account"
    assert _factory.max_ballots() == MAX_BALLOTS, "Max_Ballot Error"


# test create_open_ballot
def test_cob_requirements():
    _factory = deploy_election(ORGANIZATION_NAME)

    with reverts("Enter a valid Ballot Name!"):
        _factory.create_open_ballot(
            "", BALLOT_CANDIDATES, BALLOT_TYPES[0], BALLOT_DAYS, BALLOT_REG_DAYS
        )
    with reverts("Not Enough Ballot Candidates!"):
        _factory.create_open_ballot(
            BALLOT_NAME,
            ["0xf9d48aC9eC8F207AEF93518B51D2CdA61e596904"],
            BALLOT_TYPES[0],
            BALLOT_DAYS,
            BALLOT_REG_DAYS,
        )
    with reverts("Not a valid Ballot Type!"):
        _factory.create_open_ballot(
            BALLOT_NAME, BALLOT_CANDIDATES, 4, BALLOT_DAYS, BALLOT_REG_DAYS
        )
    with reverts("Insufficient Permissions for this Action!"):
        _factory.create_open_ballot(
            BALLOT_NAME,
            BALLOT_CANDIDATES,
            BALLOT_TYPES[0],
            BALLOT_DAYS,
            BALLOT_REG_DAYS,
            {"from": "0xf9d48aC9eC8F207AEF93518B51D2CdA61e596904"},
        )


# test create open ballot state changes
def test_cob_operations():
    account = get_account(0)
    _factory = deploy_election(ORGANIZATION_NAME)
    new_ballot = _factory.create_open_ballot(
        BALLOT_NAME,
        BALLOT_CANDIDATES,
        BALLOT_TYPES[0],
        BALLOT_DAYS,
        BALLOT_REG_DAYS,
        {"from": account},
    )
    new_ballot.wait(1)

    assert _factory.ballots(0)[1] <= len(BALLOT_TYPES), "Invalid Ballot Type"
    assert _factory.ballots(0)[2] == BALLOT_NAME, "Invalid Ballot Name"
    assert _factory.ballots(0)[3] == account, "Invalid Ballot Account"
    assert _factory.ballots(0)[4] == 0, "Ballot voters needs to be Zero"
    assert _factory.ballots(0)[7] == False, "Ballot is_expired = False"
    assert (
        _factory.ballots(0)[9] == "0x0000000000000000000000000000000000000000"
    ), "Invalid Initial Winner!"
    assert _factory.ballots(0)[7] == False, "No Tie in Ballot"

    assert _factory.candidates_count() > 1, "A Ballot needs to have > 1 Candidates"
    assert (
        _factory.address_to_candidate_mapping(BALLOT_CANDIDATES[0])[1]
        == _factory.ballots(0)[0]
    ), "Invalid Ballot_Id"


def test_max_ballots():
    _factory = deploy_election(ORGANIZATION_NAME)
    ballot_1 = _factory.create_open_ballot(
        BALLOT_NAME, BALLOT_CANDIDATES, BALLOT_TYPES[0], BALLOT_DAYS, BALLOT_REG_DAYS
    )
    ballot_1.wait(1)
    ballot_2 = _factory.create_open_ballot(
        BALLOT_NAME, BALLOT_CANDIDATES, BALLOT_TYPES[0], BALLOT_DAYS, BALLOT_REG_DAYS
    )
    ballot_2.wait(1)

    ballot_3 = _factory.create_open_ballot(
        BALLOT_NAME, BALLOT_CANDIDATES, BALLOT_TYPES[0], BALLOT_DAYS, BALLOT_REG_DAYS
    )
    ballot_3.wait(1)

    assert _factory.ballot_count() == 3, "Ballot count does NOT match!"

    with reverts("You have reached the Max Limit of Ballots for this Election!"):
        ballot_4 = _factory.create_open_ballot(
            BALLOT_NAME,
            BALLOT_CANDIDATES,
            BALLOT_TYPES[0],
            BALLOT_DAYS,
            BALLOT_REG_DAYS,
        )
        ballot_4.wait(1)


def test_candidate():
    _factory = deploy_election(ORGANIZATION_NAME)
    ballot_1 = _factory.create_open_ballot(
        BALLOT_NAME, BALLOT_CANDIDATES, BALLOT_TYPES[0], BALLOT_DAYS, BALLOT_REG_DAYS
    )
    ballot_1.wait(1)
    _ballot_id = _factory.ballots(0)[0]
    _candidate_address = _factory.ballot_candidate_mapping(_ballot_id, 0)

    assert (
        _ballot_id == _factory.address_to_candidate_mapping(BALLOT_CANDIDATES[0])[1]
    ), "Candidate Ballot Mapping Error!"
    assert _candidate_address in BALLOT_CANDIDATES, "Candidate NOT in Ballot Candidates"
    assert (
        _factory.address_to_candidate_mapping(BALLOT_CANDIDATES[0])[3] == 0
    ), "Candidate Vote Count Error"


# test register voter open ballot requirements
def test_rvob_requirements():
    _factory = deploy_election(ORGANIZATION_NAME)
    _factory.create_open_ballot(
        BALLOT_NAME, BALLOT_CANDIDATES, BALLOT_TYPES[0], BALLOT_DAYS, BALLOT_REG_DAYS
    )
    _ballot_id = _factory.ballots(0)[0]
    account = get_account(0)

    with reverts("You already registered!"):
        reg_1 = _factory.register_voter_open_ballot(
            ID_NUMBER, _ballot_id, {"from": account}
        )
        reg_1.wait(1)
        reg_2 = _factory.register_voter_open_ballot(
            ID_NUMBER + 1, _ballot_id, {"from": account}
        )
        reg_2.wait()

    with reverts("This id_number is registered!"):
        reg_1 = _factory.register_voter_open_ballot(
            ID_NUMBER, _ballot_id, {"from": account}
        )
        reg_1.wait(1)
        reg_2 = _factory.register_voter_open_ballot(
            ID_NUMBER, _ballot_id, {"from": get_account(1)}
        )
        reg_2.wait()

    with reverts("No such Ballot Exists!"):
        _factory.register_voter_open_ballot(
            ID_NUMBER, FAKE_BALLOT_ID, {"from": account}
        )


def test_register_voter():
    account = get_account(0)
    _factory = deploy_election(ORGANIZATION_NAME)
    _factory.create_open_ballot(
        BALLOT_NAME, BALLOT_CANDIDATES, BALLOT_TYPES[0], BALLOT_DAYS, BALLOT_REG_DAYS
    )
    _ballot_voters_count = _factory.ballots(0)[4]
    _ballot_id = _factory.ballots(0)[0]
    _factory.register_voter_open_ballot(ID_NUMBER, _ballot_id, {"from": account})
    assert (
        _factory.address_to_voter_mapping(account)[5] == False
    ), "Voted Should be False!"
    assert (
        _factory.address_to_voter_mapping(account)[3] == True
    ), "Registered Should be True!"
    assert _factory.ballots(0)[7] == False, "Ballot is Expired!"
    assert (
        _factory.ballots(0)[4] == _ballot_voters_count + 1
    ), "Ballot Voters did NOT increment"


def test_vob_requirements():
    account = get_account(0)
    _factory = deploy_election(ORGANIZATION_NAME)
    _factory.create_open_ballot(
        BALLOT_NAME, BALLOT_CANDIDATES, BALLOT_TYPES[0], BALLOT_DAYS, BALLOT_REG_DAYS
    )
    _ballot_id = _factory.ballots(0)[0]
    _factory.register_voter_open_ballot(ID_NUMBER, _ballot_id, {"from": account})

    # _factory.create_open_ballot(
    #     BALLOT_NAME, BALLOT_CANDIDATES, BALLOT_TYPES[1], BALLOT_DAYS, BALLOT_REG_DAYS
    # )

    with reverts("Invalid Ballot Id!"):
        _factory.vote_open_ballot(
            _factory.ballot_candidate_mapping(_ballot_id, 0),
            FAKE_BALLOT_ID,
            {"from": account},
        )

    with reverts("Candidate does not exist in Ballot!"):
        _factory.vote_open_ballot(
            "0x5419710735c2D6c3e4db8F30EF2d361F70a4b380",
            _ballot_id,
            {"from": account},
        )

    # with reverts("This Is an Open Ballot!"):
    #     _factory.vote_open_ballot(
    #         _factory.ballot_candidate_mapping(_ballot_id, 0),
    #         101,
    #         {"from": account},
    #     )

    with reverts("Please Register to Vote!"):
        _factory.vote_open_ballot(
            _factory.ballot_candidate_mapping(_ballot_id, 0),
            _ballot_id,
            {"from": "0x5419710735c2D6c3e4db8F30EF2d361F70a4b380"},
        )

    with reverts("You already CAST your Vote!"):
        vote_1 = _factory.vote_open_ballot(
            _factory.ballot_candidate_mapping(_ballot_id, 0),
            _ballot_id,
            {"from": account},
        )
        vote_1.wait(1)
        vote_2 = _factory.vote_open_ballot(
            _factory.ballot_candidate_mapping(_ballot_id, 0),
            _ballot_id,
            {"from": account},
        )
        vote_2.wait(1)


def test_vote_open_ballot():
    account = get_account(0)
    _factory = deploy_election(ORGANIZATION_NAME)
    _factory.create_open_ballot(
        BALLOT_NAME, BALLOT_CANDIDATES, BALLOT_TYPES[0], BALLOT_DAYS, BALLOT_REG_DAYS
    )
    _ballot_id = _factory.ballots(0)[0]
    assert (
        _factory.address_to_candidate_mapping(BALLOT_CANDIDATES[0])[1] == _ballot_id
    ), "Candidate NOT in Ballot!"

    initial_voters = _factory.ballots(0)[4]
    _factory.register_voter_open_ballot(ID_NUMBER, _ballot_id, {"from": account})
    assert _factory.ballots(0)[4] == initial_voters + 1, "VoteCount did NOT Increase!"

    assert (
        _factory.id_to_ballot_mapping(_ballot_id)[4] == initial_voters + 1
    ), "VoteCount did NOT Increase!"
    assert _factory.voters(0)[5] == False, "Voter has Voted on Registration!"
    assert _factory.voters(0)[3] == True, "Voter is NOT registered!"
    assert (
        _factory.voters(0)[4] == True
    ), "Vote SHOULD have voting rights in Open Ballot!"
    assert _factory.ballots(0)[7] == False, "Ballot SHOULD be Expired!"
    assert _factory.ballots(0)[1] == BALLOT_TYPES[0], "Wrong Ballot Id!"
