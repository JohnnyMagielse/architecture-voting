'use strict';

import { setQuestion } from "./services/contractService.js";

async function main() {
    try {
        if (process.argv.length < 3) {
            console.log('Usage: node createVote.js <question>');
            process.exit(1);
        }

        const answer = process.argv.slice(2).join(' ');
        const nextWeek = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

        await setQuestion(answer, nextWeek); // 1 week from now

        console.log(`Vote "${answer}" has been submitted successfully.`);
    } catch (error) {
        console.error(`Failed to submit vote: ${error}`);
        process.exit(1);
    }
}

main();
