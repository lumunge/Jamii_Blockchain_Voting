from brownie import network, accounts, config

LOCAL_BLOCKCHAIN_ENVS = ["development", "ganache-local", "hardhat"]

ballot_cost = 340000000000000000


def get_account(index=None):
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVS:
        return accounts[0]
    if index:
        return accounts[index]
    if network.show_active() in config["networks"]:
        account = accounts.add(config["wallets"]["from_key"])
        return account
    return None


def upgrade_jamii_factory(
    account, proxy, new_implementation, proxy_admin=None, initializer=None, *args
):
    tx = None
    if proxy_admin:
        if initializer:
            encoded_function_call = "f62d18880000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000767656e6573697300000000000000000000000000000000000000000000000000"
            tx = proxy_admin.upgradeAndCall(
                proxy.address,
                new_implementation,
                encoded_function_call,
                {"from": account},
            )
        # else:
        #     tx = proxy_admin.upgrade(
        #         proxy.address, new_implementation, {"from": account}
        #     )
    else:
        if initializer:
            encoded_function_call = "f62d18880000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000767656e6573697300000000000000000000000000000000000000000000000000"
            tx = proxy.upgradeAndCall(
                new_implementation, encoded_function_call, {"from": account}
            )
        # else:
        #     tx = proxy.upgradeTo(new_implementation, {"from": account})
    return tx


def main():
    account = get_account()
