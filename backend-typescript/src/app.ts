
import { Gateway, GatewayOptions } from 'fabric-network';
import * as path from 'path';
import { buildCCPOrg1, buildWallet, prettyJSONString } from './utils/AppUtil';
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from './utils/CAUtil';
const bodyParser = require('body-parser')
const channelName = 'mychannel';
const chaincodeName = 'escrow';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';
const express = require("express");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
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
        res.send(err);
    }
});
// '{"function":"Mint","Args":["vinay","20000"]}'
app.post("/mint_tokens", async (req: any, res: any) => {
    //get the user and amount from the request body
    const { user, amount } = req.body;
    try {
        const mintval = await contract.submitTransaction('Mint', user, amount);
        res.send(prettyJSONString(mintval.toString()));
    }
    catch (err) {
        console.log(err);
        res.send(err);
    }
});

// '{"function":"BalanceOf","Args":["vinay"]}'
app.post("/balance_of", async (req: any, res: any) => {
    const { user } = req.body;
    try {
        const balval = await contract.submitTransaction('BalanceOf', user);
        res.send(prettyJSONString(balval.toString()));
    }
    catch (err) {
        console.log(err);
        res
            .status(500)
            .send(err);
    }
});

// '{"function":"CreateOrder","Args":["0001","1000","vinay","hdsp"]}'
app.post("/create_order", async (req: any, res: any) => {
    const { orderid, amount, buyer, seller } = req.body;
    try {
        const orderval = await contract.submitTransaction('CreateOrder', orderid, amount, buyer, seller);

        res.send(prettyJSONString(orderval.toString()));
    }
    catch (err) {
        console.log(err);
        res
            .status(500)
            .send(err);
    }
});

// '{"function":"GetOrderList","Args":["hdsp"]}'

app.post("/get_order_list", async (req: any, res: any) => {
    const { seller } = req.body;
    try {
        const orderListVal = await contract.submitTransaction('GetOrderList', seller);

        res.send(prettyJSONString(orderListVal.toString()));
    }
    catch (err) {
        console.log(err);
        res
            .status(500)
            .send(err);
    }
});

// '{"function":"ApproveOrder","Args":["0001"]}'
app.post("/approve_order", async (req: any, res: any) => {
    const { orderid } = req.body;
    try {
        const approveval = await contract.submitTransaction('ApproveOrder', orderid);
        res.send(prettyJSONString(approveval.toString()));
    }
    catch (err) {
        console.log(err);
        res
            .status(500)
            .send(err);
    }
});

// '{"function":"ProcessOrder","Args":["0001"]}'
app.post("/process_order", async (req: any, res: any) => {
    const { orderid } = req.body;
    try {
        const processval = await contract.submitTransaction('ProcessOrder', orderid);
        res.send(prettyJSONString(processval.toString()));
    }
    catch (err) {
        console.log(err);
        res
            .status(500)
            .send(err);
    }
});

// '{"function":"CompleteOrder","Args":["0001"]}'
app.post("/complete_order", async (req: any, res: any) => {
    const { orderid } = req.body;
    try {
        const completeval = await contract.submitTransaction('CompleteOrder', orderid);
        res.send(prettyJSONString(completeval.toString()));
    }
    catch (err) {
        console.log(err);
        res
            .status(500)
            .send(err);
    }
});

// '{"function":"CompleteEscrow","Args":["0001"]}'
app.post("/complete_escrow", async (req: any, res: any) => {
    const { orderid } = req.body;
    try {
        const escrowval = await contract.submitTransaction('CompleteEscrow', orderid);
        res.send(prettyJSONString(escrowval.toString()));
    }
    catch (err) {
        console.log(err);
        res
            .status(500)
            .send(err);
    }
});




// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
