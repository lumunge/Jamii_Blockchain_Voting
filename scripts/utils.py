from brownie import network, accounts, config

LOCAL_BLOCKCHAIN_ENVS = ["development", "ganache-local"]

election_cost = 2000000000000000000 # 2 ETH
ballot_cost = 1000000000000000000 # 1 ETH

def get_account(index=None):
    if(network.show_active() in LOCAL_BLOCKCHAIN_ENVS):
        return accounts[0]
    return accounts.add(config["wallets"]["from_key"])