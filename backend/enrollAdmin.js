'use strict';

import { getCA, getWallet } from "./services/contractService.js";

async function main() {
    try {
        const ca = getCA();
        const wallet = await getWallet();
        const identity = await wallet.get('admin');

        if (identity) {
            console.log('[*] An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put('admin', x509Identity);
        console.log('[√] Successfully enrolled admin user "admin" and imported it into the wallet');
    } catch (error) {
        console.error(`[!] Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();