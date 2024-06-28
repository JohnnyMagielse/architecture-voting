const { Context } = require('fabric-contract-api');
const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const EVotingContract = require('../EVotingContract');
const assert = require('assert');
const sinon = require('sinon');

const testQuestion = "Is blockchain the future?";

describe('EVotingContract', () => {
    let sandbox;
    let stub;
    let ctx;
    let clientIdentity;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        stub = sandbox.createStubInstance(ChaincodeStub);
        ctx = new Context();
        ctx.stub = stub;
        clientIdentity = sandbox.createStubInstance(ClientIdentity);
        ctx.clientIdentity = clientIdentity;

        clientIdentity.getMSPID.returns('Org1MSP');
    });

    afterEach(() => {
        sandbox.restore();
    });

    // Test if the contract initializes the ledger correctly
    it('should initialize the ledger', async () => {
        const contract = new EVotingContract();
        await contract.initLedger(ctx);
        assert.strictEqual(stub.putState.calledOnce, true);
        const state = stub.putState.getCall(0).args[1];
        assert.deepStrictEqual(JSON.parse(state.toString()), {
            question: '',
            votes: { yes: 0, no: 0 }
        });
    });

    // Test if the contract sets / retrieves the election state correctly
    it('should set a question', async () => {
        const contract = new EVotingContract();
        const election = {
            question: '',
            votes: { yes: 0, no: 0 }
        };

        stub.getState.resolves(Buffer.from(JSON.stringify(election)));
        await contract.setQuestion(ctx, testQuestion);
        assert.strictEqual(stub.putState.calledOnce, true);
        const state = stub.putState.getCall(0).args[1];
        const updatedElection = JSON.parse(state.toString());
        assert.strictEqual(updatedElection.question, testQuestion);
    });

    it('should get the current question', async () => {
        const contract = new EVotingContract();
        const election = {
            question: testQuestion,
            votes: { yes: 0, no: 0 }
        };

        stub.getState.resolves(Buffer.from(JSON.stringify(election)));
        const question = await contract.getQuestion(ctx);
        assert.strictEqual(question, testQuestion);
    });

    it('should cast a vote', async () => {
        const contract = new EVotingContract();
        const election = {
            question: testQuestion,
            votes: { yes: 0, no: 0 }
        };

        stub.getState.resolves(Buffer.from(JSON.stringify(election)));

        await contract.vote(ctx, 'yes');
        assert.strictEqual(stub.putState.calledOnce, true);
        const state = stub.putState.getCall(0).args[1];
        const updatedElection = JSON.parse(state.toString());
        assert.strictEqual(updatedElection.votes.yes, 1);
        assert.strictEqual(updatedElection.votes.no, 0);
        stub.getState.resolves(state);

        await contract.vote(ctx, 'no');
        assert.strictEqual(stub.putState.calledTwice, true);
        const state2 = stub.putState.getCall(1).args[1];
        const updatedElection2 = JSON.parse(state2.toString());

        assert.strictEqual(updatedElection2.votes.yes, 1);
        assert.strictEqual(updatedElection2.votes.no, 1);
    });

    it('should get the election results', async () => {
        const contract = new EVotingContract();
        const election = {
            question: testQuestion,
            votes: { yes: 1, no: 1 }
        };

        stub.getState.resolves(Buffer.from(JSON.stringify(election)));
        const results = await contract.getResults(ctx);
        assert.deepStrictEqual(results, { yes: 1, no: 1 });
    });

    it('should not allow non-admin to set a question', async () => {
        const contract = new EVotingContract();
        const election = {
            question: '',
            votes: { yes: 0, no: 0 }
        };

        // Simulate a non-admin MSP
        clientIdentity.getMSPID.returns('NonAdminMSP');
        stub.getState.resolves(Buffer.from(JSON.stringify(election)));

        try {
            await contract.setQuestion(ctx, testQuestion);
            assert.fail('Expected error not thrown');
        } catch (err) {
            assert.strictEqual(err.message, 'Only admin can set a new question');
        }
    });
});
