'use strict';

import FabricCAServices from 'fabric-ca-client';
import { Gateway, Wallets } from 'fabric-network';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function getCCP() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const networkPath = "../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/"

    // Get the network configuration
    const ccpPath = path.resolve(__dirname, `${networkPath}/connection-org1.json`);
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    return ccp;
}

export function getCA() {
    const caURL = getCCP().certificateAuthorities['ca.org1.example.com'].url;
    const ca = new FabricCAServices(caURL);

    return ca;
}

export async function initLedger() {
    const { contract, gateway } = await getContract('admin');
    await contract.submitTransaction('initLedger');
    console.log('Ledger has been initialized');
    await gateway.disconnect();
}

export async function getWallet() {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    return wallet;
}

async function getContract(identityName) {
    const wallet = await getWallet();
    const identity = await wallet.get(identityName);
    
    if (!identity) {
        throw new Error(`An identity for the user "${identityName}" does not exist in the wallet. Run the registerUser.js application before retrying`);
    }

    const gateway = new Gateway();
    await gateway.connect(getCCP(), { wallet, identity: identityName, discovery: { enabled: true, asLocalhost: true } });
    const network = await gateway.getNetwork('hvachannel');
    const contract = network.getContract('acc-mgmt');
    return { contract, gateway };
}

export async function setQuestion(newQuestion) {
    const { contract, gateway } = await getContract('admin');
    await contract.submitTransaction('setQuestion', newQuestion);
    console.log('Transaction has been submitted');
    await gateway.disconnect();
}

export async function getQuestion() {
    const { contract, gateway } = await getContract('appUser');
    const question = await contract.evaluateTransaction('getQuestion');
    await gateway.disconnect();
    return question.toString();
}

export async function vote(answer) {
    const { contract, gateway } = await getContract('appUser');
    await contract.submitTransaction('vote', answer);
    console.log('Vote has been submitted');
    await gateway.disconnect();
}

export async function getResults() {
    const { contract, gateway } = await getContract('appUser');
    const results = await contract.evaluateTransaction('getResults');
    await gateway.disconnect();
    return JSON.parse(results.toString());
}
