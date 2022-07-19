from brownie import accounts, JamiiFactory, network, config
from scripts.utils import election_cost, get_account
from web3 import Web3

# testAccounts = [accounts[1], accounts[2], accounts[3]]
# cost = Web3.toWei(1, "ether")

ELECTION_NAME = "TEST_ORG"


def deploy_election(_organization_name):
    account = get_account(0)
    new_election = JamiiFactory.deploy(
        _organization_name,
        {"from": account, "value": election_cost},
        publish_source=config["networks"][network.show_active()].get("verify"),
    )
    print(f"Election deployed @ {new_election}")
    return new_election


def create_open_ballot(
    _ballot_name, _ballot_candidates_addr, _ballot_type, _days, _registration_window
):
    account = get_account(0)
    new_election = deploy_election("JAVA")
    new_ballot = new_election.create_open_ballot(
        _ballot_name,
        _ballot_candidates_addr,
        _ballot_type,
        _days,
        _registration_window,
        {"from": account},
    )
    new_ballot.wait(1)
    print(
        f"Ballot Created @ {new_ballot} for {_days} days, Voter Registration open for {_registration_window} days"
    )
    return new_ballot


# def vote(_candidate):
#     account = getAccount()
#     election = Election[-1]
#     castVoteTx = election.vote(_candidate, {"from": account, "value": cost})
#     castVoteTx.wait(1)
#     print("Your vote was casted!!")

# def getBallotCandidates():
#     account = getAccount()
#     election = Election[-1]
#     candidates = election.getCandidates({"from": account})
#     print(candidates)
#     return candidates

# def getCandidateVotes(_candidate):
#     account = getAccount()
#     election = Election[-1]
#     votesTx = election.candidatesMap(_candidate, {"from": account})
#     print(f"Candidate: {_candidate} has {votesTx[1]} votes")
#     return votesTx[1]

# def getWinner():
#     account = getAccount()
#     election = Election[-1]
#     winnerTx = election.getWinner({"from": account, "value": cost})
#     winnerTx.wait(1)
#     print(f"Ther winner is {winnerTx}")
#     return winnerTx

# def withdraw(_flag=False):
#     account = getAccount()
#     election = Election[-1]
#     withdrawTx = election.withdraw(_flag, {"from": account})
#     withdrawTx.wait(1)
#     print("Funds sent to owner")

ballot_candidates = [
    "0xf9d48aC9eC8F207AEF93518B51D2CdA61e596904",
    "0x6c0A17AEe0a1420583446B77f0c8a55e369Bb07e",
]


def main():
    deploy_election("ORG_1")
    create_open_ballot("Ballot1", ballot_candidates, 0, 10, 4)
    # getBallotCandidates()
    # vote(testAccounts[0])
    # withdraw()
