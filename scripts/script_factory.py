from brownie import (
    JamiiFactory,
    network,
    config,
    ProxyAdmin,
    TransparentUpgradeableProxy,
    Contract,
)
from scripts.utils import ballot_cost, get_account
from web3 import Web3

# fee_addr = config["owner"]["addr"]
# ballot_owner = get_account(0)
# random_voter = get_account(1)
# random_voter1 = get_account(2)
# id_number = 12345678
# id_number1 = 91011121
# ballot_id = 100

# ballot0 = [  # 100
#     "ballot-0",
#     [
#         "0xf9d48aC9eC8F207AEF93518B51D2CdA61e596904",
#         "0x6c0A17AEe0a1420583446B77f0c8a55e369Bb07e",
#     ],
#     0,
#     80,
#     30,
# ]
# ballot1 = [  # 101
#     "ballot-1",
#     [
#         "0xa8d17cc9cAF29Af964d19267DDEb4dfF122697B0",
#         "0xA0341558519429f6A93475bA53AD319f99302bff",
#     ],
#     1,
#     100,
#     60,
# ]
# candidate = ballot0[1][1]


def deploy_jamii():  # deploy upgradeable contract
    account = get_account()
    new_jamii = JamiiFactory.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify"),
    )
    proxy_admin = ProxyAdmin.deploy({"from": account})

    proxy = TransparentUpgradeableProxy.deploy(
        new_jamii.address,
        proxy_admin.address,
        "f62d18880000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000767656e6573697300000000000000000000000000000000000000000000000000",
        {"from": account},
    )
    proxy_factory = Contract.from_abi("JamiiFactory", proxy.address, JamiiFactory.abi)
    print(f"PROXY FACTORY: {proxy_factory}")


# def deploy_jamii(text="Genesis"): # non-upgradeable
#     new_jamii = JamiiFactory.deploy(
#         text,
#         {"from": fee_addr},
#         publish_source=config["networks"][network.show_active()].get("verify"),
#     )
#     print(f"Deployed Contract ('{text}')")
#     return new_jamii


# def create_ballot_type(_ballot_type, _ballot_name):
#     _factory = deploy_jamii()
#     _factory.create_ballot_type(_ballot_type, _ballot_name, {"from": fee_addr})
#     print(f"Created ballot type {_ballot_type}")


# def create_ballot(
#     _ballot_name, _ballot_candidates_addr, _ballot_type, _days, _registration_period
# ):
#     _factory = deploy_jamii("Genesis")
#     _factory.create_ballot(
#         _ballot_name,
#         _ballot_candidates_addr,
#         _ballot_type,
#         _days,
#         _registration_period,
#         {"from": ballot_owner, "value": ballot_cost},
#     )
#     print("Created ballot: {_ballot_name}")


# def register_voter(_id_number, _ballot_id):
#     _factory = deploy_jamii("Genesis")
#     _factory.create_ballot(
#         ballot0[0],
#         ballot0[1],
#         ballot0[2],
#         ballot0[3],
#         ballot0[4],
#         {"from": ballot_owner, "value": ballot_cost},
#     )
#     _factory.register_voter(_id_number, _ballot_id, {"from": random_voter})
#     print(f"Voter {random_voter} is now Registered!")


# def assign_voting_rights(_voter, _ballot_id, _id_number):
#     _factory = deploy_jamii("Genesis")
#     _factory.create_ballot(
#         ballot1[0],
#         ballot1[1],
#         ballot1[2],
#         ballot1[3],
#         ballot1[4],
#         {"from": ballot_owner, "value": ballot_cost},
#     )
#     _factory.register_voter(_id_number, _ballot_id, {"from": random_voter})
#     _factory.assign_voting_rights(_voter, _ballot_id, {"from": ballot_owner})
#     print(f"Voter {random_voter} noew has Voting Rights!")


# def vote(_id_number, _candidate, _ballot_id):
#     _factory = deploy_jamii("Genesis")
#     _factory.create_ballot(
#         ballot0[0],
#         ballot0[1],
#         ballot0[2],
#         ballot0[3],
#         ballot0[4],
#         {"from": ballot_owner, "value": ballot_cost},
#     )
#     _factory.register_voter(_id_number, _ballot_id, {"from": random_voter})
#     _factory.vote(_candidate, _ballot_id, {"from": random_voter})
#     print(f"{random_voter} Voted just Now!")


# def get_ballot_owner(_ballot_id):
#     _factory = deploy_jamii("Genesis")
#     _factory.create_ballot(
#         ballot0[0],
#         ballot0[1],
#         ballot0[2],
#         ballot0[3],
#         ballot0[4],
#         {"from": ballot_owner, "value": ballot_cost},
#     )
#     owner = _factory.get_ballot_owner(_ballot_id)
#     print(f"Ballot Owner: {owner}")
#     return owner


# def get_ballot(_ballot_id):
#     _factory = deploy_jamii("Genesis")
#     ballot = _factory.create_ballot(
#         ballot0[0],
#         ballot0[1],
#         ballot0[2],
#         ballot0[3],
#         ballot0[4],
#         {"from": ballot_owner, "value": ballot_cost},
#     )
#     ballot = _factory.get_ballot(_ballot_id)
#     print(f"Ballot: {ballot}")
#     return ballot


# def get_candidate(_candidate_addr):
#     _factory = deploy_jamii("Genesis")
#     _factory.create_ballot(
#         ballot0[0],
#         ballot0[1],
#         ballot0[2],
#         ballot0[3],
#         ballot0[4],
#         {"from": ballot_owner, "value": ballot_cost},
#     )
#     candidate = _factory.get_candidate(_candidate_addr)
#     print(f"Candidate: f{candidate}")
#     return candidate


# def get_candidates(_ballot_id):
#     _factory = deploy_jamii("Genesis")
#     _factory.create_ballot(
#         ballot0[0],
#         ballot0[1],
#         ballot0[2],
#         ballot0[3],
#         ballot0[4],
#         {"from": ballot_owner, "value": ballot_cost},
#     )
#     candidates = _factory.get_candidates(_ballot_id)
#     print(f"Ballot-{_ballot_id} Candidates: {candidates}")
#     return candidates


# def get_voter(_id_number, _voter_address, _ballot_id):
#     _factory = deploy_jamii("Genesis")
#     _factory.create_ballot(
#         ballot0[0],
#         ballot0[1],
#         ballot0[2],
#         ballot0[3],
#         ballot0[4],
#         {"from": ballot_owner, "value": ballot_cost},
#     )
#     _factory.register_voter(_id_number, _ballot_id, {"from": random_voter})
#     voter = _factory.get_voter(_voter_address, _ballot_id)
#     print(f"Voter: {voter}")
#     return voter


# def get_voters(_id_number, _id_number1, _ballot_id):
#     _factory = deploy_jamii("Genesis")
#     _factory.create_ballot(
#         ballot0[0],
#         ballot0[1],
#         ballot0[2],
#         ballot0[3],
#         ballot0[4],
#         {"from": ballot_owner, "value": ballot_cost},
#     )
#     _factory.register_voter(_id_number, _ballot_id, {"from": random_voter})
#     _factory.register_voter(_id_number1, _ballot_id, {"from": random_voter1})
#     voters = _factory.get_voters(_ballot_id)
#     print(f"Ballot-{_ballot_id} Voters: {voters}")
#     return voters


# def get_winner(_ballot_id):
#     _factory = deploy_jamii("Genesis")
#     winner = _factory.get_winner(_ballot_id)
#     return winner


# def end_ballot(_ballot_id):
#     _factory = deploy_jamii("Genesis")
#     _factory.end_ballot(_ballot_id)


# def withdraw(_ballot_id, _destroy):
#     _factory = deploy_jamii("Genesis")
#     _factory.withdraw(_ballot_id, _destroy)


def main():
    deploy_jamii()
    # create_ballot_type(7, "closed_closed")
    # create_ballot(
    #     ballot0[0],
    #     ballot0[1],
    #     ballot0[2],
    #     ballot0[3],
    #     ballot0[4],
    # )
    # register_voter(id_number, ballot_id)
    # assign_voting_rights(random_voter, ballot_id, id_number)
    # vote(id_number, candidate, ballot_id)  # open-free*
    # # vote(id_number, candidate1, ballot_id1)  # closed-free**
    # # vote(id_number, candidate2, ballot_id2)  # open-paid*
    # # vote(id_number, candidate3, ballot_id3)  # closed-paid**

    # get_ballot_owner(ballot_id)
    # get_ballot(ballot_id)
    # get_candidate(candidate)
    # get_candidates(ballot_id)
    # get_voter(id_number, random_voter, ballot_id)
    # get_voters(id_number, id_number1, ballot_id)
