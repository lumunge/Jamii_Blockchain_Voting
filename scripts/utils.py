from brownie import network, accounts, config

LOCAL_BLOCKCHAIN_ENVS = ["development", "ganache-local"]

ballot_cost = 340000000000000000


def get_account(index=None):
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVS:
        return accounts[index]
    return accounts.add(config["wallets"]["from_key"])


def main():
    account = get_account()
