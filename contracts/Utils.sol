// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.8;

contract Utils {
    function exists(string[] memory _voter_ballots, string memory _target)
        internal
        pure
        returns (bool)
    {
        uint256 n = _voter_ballots.length;
        for (uint256 i = 0; i < n; i++) {
            if (compare_strings(_voter_ballots[i], _target) == true) {
                return true;
            }
        }
        return false;
    }

    function compare_strings(string memory _string_1, string memory _string_2)
        internal
        pure
        returns (bool)
    {
        if (
            keccak256(abi.encodePacked(_string_1)) ==
            keccak256(abi.encodePacked(_string_2))
        ) {
            return true;
        }
        return false;
    }
}
