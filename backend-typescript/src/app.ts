/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Gateway, GatewayOptions } from 'fabric-network';
import * as path from 'path';
import { buildCCPOrg1, buildWallet, prettyJSONString } from './utils/AppUtil';
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from './utils/CAUtil';

const channelName = 'mychannel';
const chaincodeName = 'escrow';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';
const express = require("express");
const app = express();
const port = 8080; // default port to listen
const ccp = buildCCPOrg1();

// build an instance of the fabric ca services client based on
// the information in the network configuration
let caClient = null;
let wallet = null;
let gateway = null;
let network = null;
let contract: any = null;
async function setUp() {
    caClient = buildCAClient(ccp, 'ca.org1.example.com');
    wallet = await buildWallet(walletPath);
    await enrollAdmin(caClient, wallet, mspOrg1);
    await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
    gateway = new Gateway();
    const gatewayOpts: GatewayOptions = {
        wallet,
        identity: org1UserId,
        discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
    };
    await gateway.connect(ccp, gatewayOpts);
    network = await gateway.getNetwork(channelName);
    contract = network.getContract(chaincodeName);
}
setUp();
// define a route handler for the default home page
app.get("/init", async (req: any, res: any) => {
    try {
        const initval = await contract.submitTransaction('InitLedger', 'escrowtest', 'inr', '2');
        console.log('*** Result: committed');
        console.log(prettyJSONString(initval.toString()));
        res.send(prettyJSONString(initval.toString()));
    } catch (err) {
        console.log(err);
    }
});

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
