// SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0; 

import "./Ownable.sol";

//  TODO's: Create a Pausable contract that inherits from the Ownable contract
contract Pausable is Ownable {
    //  5) create a Paused & Unpaused event that emits the address that triggered the event
    event Paused();
    event Unpaused();

    //  1) create a private '_paused' variable of type bool
    //  3) create an internal constructor that sets the _paused variable to false
    constructor() public {
       _paused = false;
    }

    bool private _paused;

    //  2) create a public setter using the inherited onlyOwner modifier
    function pause() public onlyOwner whenNotPaused {
        _paused = true;
        emit Paused();
    }

    function resume() public onlyOwner paused {
        _paused = false;
        emit Unpaused();
    }

    function setPause(bool value) public onlyOwner {
        _paused = value;
        if (value) {
            this.pause();
        } else {
            this.resume();
        }
    }

    function isPaused() external view returns (bool) {
        return _paused;
    }

    //  4) create 'whenNotPaused' & 'paused' modifier that throws in the appropriate situation
    modifier whenNotPaused() {
        require(!_paused, "only for active contract");
        _;
    }
    modifier paused() {
        require(_paused, "only for paused contract");
        _;
    }
}
