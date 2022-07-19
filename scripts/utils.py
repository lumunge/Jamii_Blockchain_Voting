from brownie import network, accounts, config

LOCAL_BLOCKCHAIN_ENVS = ["development", "ganache-local"]

election_cost = 340000000000000000  # $500


def get_account(index=None):
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVS:
        return accounts[0]
    return accounts.add(config["wallets"]["from_key"])


def main():
    account = get_account()
