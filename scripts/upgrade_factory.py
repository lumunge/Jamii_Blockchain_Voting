from brownie import (
    JamiiFactoryV2,
    TransparentUpgradeableProxy,
    ProxyAdmin,
    config,
    network,
    Contract,
)
from scripts.utils import get_account, upgrade_jamii_factory
from scripts.script_factory import deploy_jamii


def upgrade():
    account = get_account()
    jamii_factory_v2 = JamiiFactoryV2.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    proxy = TransparentUpgradeableProxy[-1]
    proxy_admin = ProxyAdmin[-1]
    upgrade_jamii_factory(account, proxy, jamii_factory_v2, proxy_admin)
    proxy_factory = Contract.from_abi(
        "JamiiFactoryV2", proxy.address, JamiiFactoryV2.abi
    )
    print(f"Upgrade deployed @ {proxy_factory}")


def deploy_and_upgrade():
    deploy_jamii()
    upgrade()


def main():
    deploy_and_upgrade()
