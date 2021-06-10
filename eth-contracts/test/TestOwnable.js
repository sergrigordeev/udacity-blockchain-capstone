
const truffleAssert = require('truffle-assertions');;
const Ownable = artifacts.require('Ownable');

contract('TestOwnable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('check ownable', function () {

        it('should set owner when contract created and event shoulb be emited emited', async function () {
            this.contract = await Ownable.new({ from: account_one });
            // Get the hash of the deployment transaction
            let txHash = this.contract.transactionHash


            let result = await truffleAssert.createTransactionResult(this.contract, txHash)


            truffleAssert.eventEmitted(result, 'OwnerShipTransferd');
            assert.equal(account_one, await this.contract.getOwner())
        })

        it('should transfer ownership and emit event', async function () {
            let result = await this.contract.transferOwnership(account_two, { from: account_one })
            truffleAssert.eventEmitted(result, 'OwnerShipTransferd');
            assert.equal(account_two, await this.contract.getOwner())
        })

        it('should not transfer ownership', async function () {
            await truffleAssert.reverts(this.contract.transferOwnership(account_one, { from: account_one }));
            assert.equal(account_two, await this.contract.getOwner())
        })
    });
})