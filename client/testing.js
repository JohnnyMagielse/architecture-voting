'use strict';

import { setQuestion, getQuestion, vote, getResults, initLedger } from './functions.js';

async function testVotingContract() {
    try {
        // Initialize the ledger
        console.log('Initializing ledger...');
        await initLedger();
        console.log('Ledger initialized successfully.');

        // Set a question for the election
        console.log('Setting question...');
        await setQuestion('Do you support blockchain technology?');
        console.log('Question set successfully.');

        // Get the current question
        console.log('Getting current question...');
        const question = await getQuestion();
        console.log(`Current Question: ${question}`);

        // Vote 'yes'
        console.log('Voting "yes"...');
        await vote('yes');
        console.log('Vote submitted successfully.');

        // Get the results
        console.log('Getting results...');
        const results = await getResults();
        console.log(`Current Results: ${JSON.stringify(results)}`);

    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

testVotingContract();
