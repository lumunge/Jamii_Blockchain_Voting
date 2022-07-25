// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.8;

import "@openzeppelin_upgradeable/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin_upgradeable/contracts/access/OwnableUpgradeable.sol";

contract JamiiBase is Initializable, OwnableUpgradeable {
    address internal fee_addr;
    uint256 internal candidates_count;
    mapping(uint256 => string) internal ballot_types_mapping;

    function initialize() internal onlyInitializing {
        candidates_count = 1000;
        create_ballot_types();
        __Ownable_init();
        fee_addr = owner();
    }

    function create_ballot_types() private {
        ballot_types_mapping[0] = "open-free";
        ballot_types_mapping[1] = "closed-free";
        ballot_types_mapping[2] = "open-paid";
        ballot_types_mapping[3] = "closed-paid";
        ballot_types_mapping[4] = "closed-free-secret";
        ballot_types_mapping[5] = "open-paid-secret";
        ballot_types_mapping[6] = "closed-paid-secret";
    }
}
