from brownie import accounts, Election, network, config
from web3 import Web3

testAccounts = [accounts[1], accounts[2], accounts[3]]
cost = Web3.toWei(1, "ether")

def getAccount():
    if network.show_active() == "development":
        return accounts[0]
    else:
        return accounts.add(config["wallets"]["from_key"])

def deploy(_ballotName, _ballotCandidates):
    account = getAccount()
    election = Election.deploy(_ballotName, _ballotCandidates, {"from": account, "value": cost})
    print("Election deployed!!")
    return election

def vote(_candidate):
    account = getAccount()
    election = Election[-1]
    castVoteTx = election.vote(_candidate, {"from": account, "value": cost})
    castVoteTx.wait(1)
    print("Your vote was casted!!")

def getBallotCandidates():
    account = getAccount()
    election = Election[-1]
    candidates = election.getCandidates({"from": account})
    print(candidates)
    return candidates

def getCandidateVotes(_candidate):
    account = getAccount()
    election = Election[-1]
    votesTx = election.candidatesMap(_candidate, {"from": account})
    print(f"Candidate: {_candidate} has {votesTx[1]} votes")
    return votesTx[1]

def getWinner():
    account = getAccount()
    election = Election[-1]
    winnerTx = election.getWinner({"from": account, "value": cost})
    winnerTx.wait(1)
    print(f"Ther winner is {winnerTx}")
    return winnerTx

def withdraw(_flag=False):
    account = getAccount()
    election = Election[-1]
    withdrawTx = election.withdraw(_flag, {"from": account})
    withdrawTx.wait(1)
    print("Funds sent to owner")

def main():
    deploy("Ken2022", testAccounts)
    getBallotCandidates()
    vote(testAccounts[0])
    withdraw()