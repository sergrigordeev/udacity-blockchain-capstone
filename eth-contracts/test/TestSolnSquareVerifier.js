const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const truffleAssert = require('truffle-assertions');
contract('TestSolnSquareVerifier', accounts => {
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


    let a1 = [
        "0x13b9f99c30f4ffd8ce8ab81d962428ef9c957c6a5c04af627bacbf9de60f42ca",
        "0x27e625108d21ab218807622e70df0687b1644dbb1bdcd134c884ab4fc3119bc4"
    ]
    let b1 = [
        [
            "0x1b121fc13247bb5e490eceb74fce02e758062edf66599387d8b91e3de704fda5",
            "0x0f2a09c860e6987ef18a0533b9034e796b2cff51e80afbfa3099935b7d183c09"
        ],
        [
            "0x1075840744f685e9a4cfd7652c302b11f2b2a3aa063e7a53c49df936367b6f06",
            "0x1624d858b437f9373f80acf7550e7bb6732056ec72d60ea1da6e77c6df4fc5d4"
        ]
    ]
    let c1 = [
        "0x0b88a2e37b4df5349786c97b7caaece1ac1fe7e05bac3ae2edc1477e7903285a",
        "0x0d67c9528c1c67eea36244c4f25266574bef1dfd2a68407da6d76a16a71beafb"
    ]

    let inputs1 = [
        "0x0000000000000000000000000000000000000000000000000000000000000009",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
    ]
    const owner = accounts[0]
    const requestor1 = accounts[1]
    const requestor2 = accounts[2]
    describe('minting with zokrat', () => {

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('should add solution', async () => {
            const contract = await SolnSquareVerifier.deployed();
            let result = await contract.safeMint(requestor1, 111, a, b, c, inputs, { from: owner });
            truffleAssert.eventEmitted(result, "SolutionAdded", { "sender": requestor1, tokenId: web3.utils.toBN(111) })
        });
        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('should mint token', async () => {
            const contract = await SolnSquareVerifier.deployed();
            let result = await contract.safeMint(requestor2, 131, a1, b1, c1, inputs1, { from: owner });
            truffleAssert.eventEmitted(result, "Transfer", { "to": requestor2, tokenId: web3.utils.toBN(131) })

        });

        it('should not mint token with used solution', async () => {
            const contract = await SolnSquareVerifier.deployed();
            await truffleAssert.reverts(contract.safeMint(requestor2, 133, a, b, c, inputs, { from: owner }), 'solution is already used');
        });

        it('should not accept solution', async () => {
            const contract = await SolnSquareVerifier.deployed();
            await truffleAssert.reverts(contract.safeMint(requestor2, 134, a1, b, c, inputs, { from: owner }), 'wrong solution');
        });
    });
});
