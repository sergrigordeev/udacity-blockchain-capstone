// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/utils/Address.sol';

contract Ownable {
    using Address for address;
    //  5) create an event that emits anytime ownerShip is transfered (including in the constructor)
    event OwnerShipTransferd();

    //  TODO's
    //  1) create a private '_owner' variable of type address with a public getter function
    address private _owner;

    //  2) create an internal constructor that sets the _owner var to the creater of the contract
    constructor() public {
        _setOwner(msg.sender);
    }

    //  3) create an 'onlyOwner' modifier that throws if called by any account other than the owner.
    modifier onlyOwner() {
        require(_owner == msg.sender, "only for woner");
        _;
    }

    function getOwner() public view returns (address) {
        return _owner;
    }

    //  4) fill out the transferOwnership function
    function transferOwnership(address newOwner) public onlyOwner {
        // make sure the new owner is a real address
        _setOwner(newOwner);
    }

    function _setOwner(address newOwner) internal {
        require(newOwner == address(newOwner), "Invalid address");
        require(!newOwner.isContract(), "only Externally-owned addresses");
        _owner = newOwner;
        emit OwnerShipTransferd();
    }
}
