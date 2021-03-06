// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
const SquareVerifier = artifacts.require('SquareVerifier');
const truffleAssert = require('truffle-assertions');
contract('TestSquareVerifier', accounts => {
    let a = [
        "0x1feb1d6d37888f8f089369da4d13b72cf26849b7d9554dd9dc9e34f92378d20e",
        "0x17417b6b30f1273677fae4f7ddcd741ab9673cf577e898b56ff52167e0638d9a"
    ]
    let b = [
        [
            "0x0d285c7b8a10606ff9f79973a0351692e79c41d8c3ec4e36b677214810e58c2f",
            "0x1d1f0cd7e23a82f5fa19bdf8c816b1d52e428a8c254d6abe11a5bb09dfbd8450"
        ],
        [
            "0x29be9f000ac9a101f2fcc06c11b602850639d5e85c8085e77b57d42b8ed51832",
            "0x231b5df13b06fddfd147a1b3c8d41875acc4ddd21ba496086cba715ac250470a"
        ]
    ]
    let c = [
        "0x22dd3c401b4f536ee6b2735df6d55e44ccbb24cd4d6f636a2ed12e131482dbf3",
        "0x0e7ec0680de75dc806e02cdcf5c1921494b2ecd7a7997d496e5a8137d9ee9038"
    ]

    let inputs = [
        "0x0000000000000000000000000000000000000000000000000000000000000024",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
    ]


    describe('test verification', () => {
        // Test verification with correct proof
        // - use the contents from proof.json generated from zokrates steps
        // using proof.json for 6^6
        it('should be correct', async () => {
            const contract = await SquareVerifier.deployed();
            let result = await contract.verifyTx.call(a, b, c, inputs);
            assert.equal(true, result, "should be true");
        });

        // use prof  from previous test but  with corrupted inputs
        it('should not be true', async () => {
            const contract = await SquareVerifier.deployed();
            let corrupted = [
                "0x0000000000000000000000000000000000000000000000000000000000000000",
                "0x0000000000000000000000000000000000000000000000000000000000000001"
            ]
            let result = await contract.verifyTx.call(a, b, c, corrupted);
            assert.equal(false, result, "should be false");
        });
    });
});
