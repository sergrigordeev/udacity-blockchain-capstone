
const truffleAssert = require('truffle-assertions');;
const Pausable = artifacts.require('Pausable');

contract('TestPausable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('check pausable', function () {

        it('should set owner when contract created and event should be emited emited', async function () {

            this.contract = await Pausable.new({ from: account_one });

            // Get the hash of the deployment transaction
            let txHash = this.contract.transactionHash

            let result = await truffleAssert.createTransactionResult(this.contract, txHash)

            truffleAssert.eventEmitted(result, 'OwnerShipTransferd');

            assert.equal(account_one, await this.contract.owner())
            assert.equal(false, await this.contract.isPaused())
        })

        it('should not pause contract: not owner', async function () {
            await truffleAssert.reverts(this.contract.pause({ from: account_two }));
            assert.equal(false, await this.contract.isPaused())
        })

        it('should pause contract', async function () {
            let result = await this.contract.pause({ from: account_one })
            truffleAssert.eventEmitted(result, 'Paused');
            assert.equal(true, await this.contract.isPaused())
        })

        it('should not pause contract: contract already paused', async function () {
            await truffleAssert.reverts(this.contract.pause({ from: account_two }));
            assert.equal(true, await this.contract.isPaused())
        })

        it('should not resume contract: not owner', async function () {
            await truffleAssert.reverts(this.contract.resume({ from: account_two }));
            assert.equal(true, await this.contract.isPaused())
        })

        it('should resume contract', async function () {
            let result = await this.contract.resume({ from: account_one })
            truffleAssert.eventEmitted(result, 'Unpaused');
            assert.equal(false, await this.contract.isPaused())
        })
    });
})