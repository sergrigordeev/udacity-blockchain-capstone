var CustomERC721Token = artifacts.require('CustomERC721Token');
const truffleAssert = require('truffle-assertions');
const NAME = "SG_RE_TOKEN"
const SYMBOL = "SGRET"
contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    
    const BASE_URI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/"
    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await CustomERC721Token.new(NAME, SYMBOL, { from: account_one });

            await this.contract.mint(account_two, 21)
            await this.contract.mint(account_two, 22)
            await this.contract.mint(account_two, 23)
            await this.contract.mint(account_two, 24)

            await this.contract.mint(account_three, 31)
            await this.contract.mint(account_three, 32)


        })
        it('should set CustomERC721Token default value', async function () {

            assert.equal(NAME, await this.contract.name())
            assert.equal(SYMBOL, await this.contract.symbol())
            assert.equal(BASE_URI, await this.contract.baseTokenURI())
        })
        it('should return total supply', async function () {
            assert.equal(6, await this.contract.totalSupply())
        })

        it('should get token balance', async function () {
            assert.equal(4, await this.contract.balanceOf(account_two))
            assert.equal(2, await this.contract.balanceOf(account_three))
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            assert.equal(BASE_URI + "21", await this.contract.tokenURI(21))
            assert.equal(BASE_URI + "31", await this.contract.tokenURI(31))
        })

        it('should NOT transfer token from one owner to another', async function () {
            await truffleAssert.reverts(this.contract.safeTransferFrom(account_three, account_two, 31, { from: account_one }));
        })

        it('should transfer token from one owner to another', async function () {
            let result = await this.contract.safeTransferFrom(account_three, account_two, 31, { from: account_three });
            truffleAssert.eventEmitted(result, "Transfer", { "from": account_three, "to": account_two, tokenId: web3.utils.toBN(31) })

            assert.equal(6, await this.contract.totalSupply())
            assert.equal(1, await this.contract.balanceOf(account_three))
            assert.equal(5, await this.contract.balanceOf(account_two))

            assert.equal(account_two, await this.contract.ownerOf(31))
        })

        it('should mint token', async function () {
            let newToken = 25
            let result = await this.contract.mint(account_two, newToken)
            truffleAssert.eventEmitted(result, "Transfer", { "to": account_two, tokenId: web3.utils.toBN(newToken) })
            assert.equal(account_two, await this.contract.ownerOf(newToken))
            assert.equal(BASE_URI + newToken, await this.contract.tokenURI(newToken))
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await CustomERC721Token.new(NAME, SYMBOL, { from: account_one });
        })

        it('should fail when minting when address is not contract owner', async function () {
            await truffleAssert.reverts(this.contract.mint(account_two, 26, { from: account_three }));
        })

        it('should return contract owner', async function () {
            assert.equal(account_one, await this.contract.owner())
        })

    });
})