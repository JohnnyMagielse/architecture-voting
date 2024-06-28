'use strict';

const { Contract } = require('fabric-contract-api');

class EVotingContract extends Contract {

    // Check if the invoker is admin
    _isAdmin(ctx) {
       const adminMSP = 'Org1MSP';
       const invokerMSP = ctx.clientIdentity.getMSPID();

       return invokerMSP === adminMSP;
    }

    // Initialize the ledger with a default question and empty votes
    async initLedger(ctx) {
        if (!this._isAdmin(ctx)) {
            throw new Error('Only admin can initialize the ledger');
        }

        const initialData = {
            question: '',
            votes: {
                yes: 0,
                no: 0
            },
            startDate: new Date().toISOString(),
            endDate: '',
            totalVotes: 0
        };
        
        await ctx.stub.putState('election', Buffer.from(JSON.stringify(initialData)));
    }

    /**
     * Set a new question for the election
     * @param ctx
     * @param newQuestion
     * @param endDate
     * @return {Promise<void>}
     */
    async setQuestion(ctx, newQuestion, endDate) {
        if (!this._isAdmin(ctx)) {
            throw new Error('Only admin can set a new question');
        }

        const electionAsBytes = await ctx.stub.getState('election');
        if (!electionAsBytes || electionAsBytes.length === 0) {
            throw new Error('Election data not found');
        }
        const election = JSON.parse(electionAsBytes.toString());
        election.question = newQuestion;
        election.votes = { yes: 0, no: 0 }; // Reset votes
        election.startDate = new Date().toISOString();
        election.endDate = endDate;
        election.totalVotes = 0; // Reset total votes

        await ctx.stub.putState('election', Buffer.from(JSON.stringify(election)));
    }
    
    /**
     * Get the current question for the election along with start date, end date, and total votes
     * @param ctx
     * @return {Promise<object>}
     */
    async getQuestion(ctx) {
        const electionAsBytes = await ctx.stub.getState('election');
        if (!electionAsBytes || electionAsBytes.length === 0) {
            throw new Error('Election data not found');
        }
        const election = JSON.parse(electionAsBytes.toString());

        return {
            question: election.question,
            startDate: election.startDate,
            endDate: election.endDate
        };
    }

    /**
     * Vote for the current election
     * @param ctx
     * @param answer
     * @return {Promise<void>}
     */
    async vote(ctx, answer) {
        const electionAsBytes = await ctx.stub.getState('election');
        if (!electionAsBytes || electionAsBytes.length === 0) {
            throw new Error('Election data not found');
        }
        const election = JSON.parse(electionAsBytes.toString());
        if (answer.toLowerCase() === 'yes') {
            election.votes.yes += 1;
        } else if (answer.toLowerCase() === 'no') {
            election.votes.no += 1;
        } else {
            throw new Error('Invalid vote. Only "yes" or "no" are accepted');
        }

        election.totalVotes += 1;

        await ctx.stub.putState('election', Buffer.from(JSON.stringify(election)));
    }

    /**
     * Get the results of the election
     * @param ctx
     * @return {Promise<{no: number, yes: number, totalVotes: number, startDate: string, endDate: string}>}
     */
    async getResults(ctx) {
        const electionAsBytes = await ctx.stub.getState('election');
        if (!electionAsBytes || electionAsBytes.length === 0) {
            throw new Error('Election data not found');
        }
        const election = JSON.parse(electionAsBytes.toString());
        
        return {
            yes: election.votes.yes,
            no: election.votes.no,
            totalVotes: election.totalVotes,
            startDate: election.startDate,
            endDate: election.endDate,
            question: election.question
        };
    }

}

module.exports = EVotingContract;
