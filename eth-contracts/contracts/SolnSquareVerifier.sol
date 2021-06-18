// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;
import {CustomERC721Token} from "./ERC721Mintable.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {
    ISquareVerifier private verifierContract;

    constructor(
        address verifierAddress,
        string memory name,
        string memory symbol
    ) public CustomERC721Token(name, symbol) {
        verifierContract = ISquareVerifier(verifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 tokenId;
        address sender;
        bytes32 idx;
    }

    // TODO define an array of the above struct
    //Solution[] private solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) solutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 tokenId, address sender);

    // TODO Create a function to add the solutions to the array and emit the event
    function _addSolution(
        uint256 tokenId,
        address to,
        bytes32 idx
    ) internal {
        solutions[idx] = Solution(tokenId, to, idx);
        emit SolutionAdded(tokenId, to);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function safeMint(
        address to,
        uint256 tokenId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public whenNotPaused onlyOwner {
        require(verifierContract.verifyTx(a, b, c, input), "wrong solution");
        bytes32 index = keccak256(abi.encodePacked(a, b, c, input));
        require(
            solutions[index].sender == address(0),
            "solution is already used"
        );

        _addSolution(tokenId, to, index);
        super.mint(to, tokenId);
    }
}

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
interface ISquareVerifier {
    function verifyTx(
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[2] calldata input
    ) external returns (bool);
}
