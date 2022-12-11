/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction,
} from "fabric-contract-api";
import stringify from "json-stringify-deterministic";
import sortKeysRecursive from "sort-keys-recursive";
import { Order } from "./order";

// Define objectType names for prefix
const balancePrefix = "balance";
const allowancePrefix = "allowance";
const orderListPrefix = "orderList";
// Define key names for options
const nameKey = "name";
const symbolKey = "symbol";
const decimalsKey = "decimals";
const totalSupplyKey = "totalSupply";
const escrowKey = "escrow";
@Info({
  title: "ScrowBazzar",
  description: "Smart contract for trading Orders",
})
export class ScrowBazzarContract extends Contract {

  @Transaction()
  public async InitLedger(ctx: Context, name: String, symbol: String, decimals: String): Promise<void> {
    const nameBytes = await ctx.stub.getState(nameKey);
    if (nameBytes && nameBytes.length > 0) {
      throw new Error(
        "contract options are already set, client is not authorized to change them"
      );
    }

    await ctx.stub.putState(nameKey, Buffer.from(name));
    await ctx.stub.putState(symbolKey, Buffer.from(symbol));
    await ctx.stub.putState(decimalsKey, Buffer.from(decimals));
    const Orders: Order[] = [
      {
        OrderId: "00001",
        Amount: "100",
        Account: "123456789",
        Owner: "Tomoko",
        Status: "Pending",
      },
    ];

    for (const Order of Orders) {
      Order.docType = "Order";
      await ctx.stub.putState(
        Order.OrderId,
        Buffer.from(stringify(sortKeysRecursive(Order)))
      );
      console.info(`Order ${Order.OrderId} initialized`);
    }
  }

  @Transaction(false)
  async TokenName(ctx: Context): Promise<string> {
    const nameBytes = await ctx.stub.getState(nameKey);
    return nameBytes.toString();
  }

  @Transaction(false)
  async TokenSymbol(ctx: Context): Promise<string> {
    const symbolBytes = await ctx.stub.getState(symbolKey);
    return symbolBytes.toString();
  }

  @Transaction(false)
  async TokenDecimals(ctx: Context): Promise<string> {
    const decimalsBytes = await ctx.stub.getState(decimalsKey);
    return decimalsBytes.toString();
  }

  @Transaction(false)
  async TotalSupply(ctx: Context): Promise<string> {
    const totalSupplyBytes = await ctx.stub.getState(totalSupplyKey);
    return totalSupplyBytes.toString();
  }

  @Transaction(false)
  async BalanceOf(ctx: Context, account: string): Promise<string> {
    const balanceKey = ctx.stub.createCompositeKey(balancePrefix, [account]);
    const balanceBytes = await ctx.stub.getState(balanceKey);
    if (!balanceBytes || balanceBytes.length === 0) {
      throw new Error(`the account ${account} does not exist`);
    }
    return balanceBytes.toString();
  }

  @Transaction(false)
  async Allowance(
    ctx: Context,
    owner: string,
    spender: string
  ): Promise<string> {
    const allowanceKey = ctx.stub.createCompositeKey(allowancePrefix, [
      owner,
      spender,
    ]);
    const allowanceBytes = await ctx.stub.getState(allowanceKey);
    if (!allowanceBytes || allowanceBytes.length === 0) {
      throw new Error(
        `the allowance for ${spender} from ${owner} does not exist`
      );
    }
    return allowanceBytes.toString();
  }

  @Transaction(true)
  async Transfer(ctx: Context, from: string, to: string, amount: string): Promise<boolean> {

    const transferResp = await this._transfer(ctx, from, to, amount);
    if (!transferResp) {
      throw new Error(`the transfer failed`);
    }

    const transferEvent = { from, to, amount };
    ctx.stub.setEvent("Transfer", Buffer.from(stringify(transferEvent)));

    return true;

  }

  @Transaction(true)
  async TransferFrom(ctx: Context, from: string, to: string, value: string): Promise<boolean> {

    //check contract options are already set first to execute the function
    await this.CheckInitialized(ctx);

    const spender = ctx.clientIdentity.getID();

    // Retrieve the allowance of the spender
    const allowanceKey = ctx.stub.createCompositeKey(allowancePrefix, [from, spender]);
    const currentAllowanceBytes = await ctx.stub.getState(allowanceKey);

    if (!currentAllowanceBytes || currentAllowanceBytes.length === 0) {
      throw new Error(`spender ${spender} has no allowance from ${from}`);
    }

    const currentAllowance = parseInt(currentAllowanceBytes.toString());

    // Convert value from string to int
    const valueInt = parseInt(value);

    // Check if the transferred value is less than the allowance
    if (currentAllowance < valueInt) {
      throw new Error('The spender does not have enough allowance to spend.');
    }

    const transferResp = await this._transfer(ctx, from, to, value);
    if (!transferResp) {
      throw new Error('Failed to transfer');
    }

    // Decrease the allowance
    const updatedAllowance = this.sub(currentAllowance, valueInt);
    await ctx.stub.putState(allowanceKey, Buffer.from(updatedAllowance.toString()));
    console.log(`spender ${spender} allowance updated from ${currentAllowance} to ${updatedAllowance}`);

    // Emit the Transfer event
    const transferEvent = { from, to, value: valueInt };
    ctx.stub.setEvent('Transfer', Buffer.from(JSON.stringify(transferEvent)));

    console.log('transferFrom ended successfully');
    return true;
  }

  @Transaction(true)
  async Mint(ctx: Context, to: string, amount: string): Promise<void> {
    const minter = ctx.clientIdentity.getID();

    // Get the state from the ledger
    const totalSupplyBytes = await ctx.stub.getState(totalSupplyKey);
    const totalSupply = parseInt(totalSupplyBytes.toString(), 10);
    //check if total supply exists
    let tSupply = 0;
    if (!totalSupplyBytes || totalSupplyBytes.length === 0) {
      tSupply = 0;
    }
    else {
      tSupply = totalSupply;
    }

    const toBalanceKey = ctx.stub.createCompositeKey(balancePrefix, [to]);
    const toBalanceBytes = await ctx.stub.getState(toBalanceKey);

    const toBalance = parseInt(toBalanceBytes.toString(), 10);
    let balance = 0;
    if (!toBalanceBytes || toBalanceBytes.length === 0) {
      balance = 0;
    }
    else {
      balance = toBalance;
    }


    // Calculate the new balance
    const newTotalSupply = tSupply + parseInt(amount, 10);
    const newToBalance = balance + parseInt(amount, 10);

    // Write the states back to the ledger
    await ctx.stub.putState(totalSupplyKey, Buffer.from(newTotalSupply.toString()));
    await ctx.stub.putState(toBalanceKey, Buffer.from(newToBalance.toString()));
  }

  @Transaction(true)
  async Burn(ctx: Context, from: string, amount: string): Promise<void> {
    const burner = ctx.clientIdentity.getID();

    // Get the state from the ledger
    const totalSupplyBytes = await ctx.stub.getState(totalSupplyKey);
    const totalSupply = parseInt(totalSupplyBytes.toString(), 10);

    const fromBalanceKey = ctx.stub.createCompositeKey(balancePrefix, [from]);
    const fromBalanceBytes = await ctx.stub.getState(fromBalanceKey);
    const fromBalance = parseInt(fromBalanceBytes.toString(), 10);

    // Calculate the new balance
    const newTotalSupply = totalSupply - parseInt(amount, 10);
    const newFromBalance = fromBalance - parseInt(amount, 10);

    // Write the states back to the ledger
    await ctx.stub.putState(totalSupplyKey, Buffer.from(newTotalSupply.toString()));
    await ctx.stub.putState(fromBalanceKey, Buffer.from(newFromBalance.toString()));
  }



  @Transaction()
  public async CreateOrder(
    ctx: Context,
    orderId: string,
    amount: string,
    owner: string,
    seller: string
  ): Promise<boolean> {


    //check if owner has enough balance
    const balanceKey = ctx.stub.createCompositeKey(balancePrefix, [owner]);
    const balanceBytes = await ctx.stub.getState(balanceKey);
    if (!balanceBytes || balanceBytes.length === 0) {
      throw new Error(`the balance for ${owner} does not exist`);
    }
    const balance = parseInt(balanceBytes.toString(), 10);
    if (balance < parseInt(amount, 10)) {
      throw new Error(`the balance for ${owner} is not enough`);
    }



    const exists = await this.OrderExists(ctx, orderId);
    if (exists) {
      throw new Error(`The Order ${orderId} already exists`);
    }

    const order = {
      OrderId: orderId,
      Amount: amount,
      Owner: owner,
      Account: seller,
    };
    await ctx.stub.putState(
      orderId,
      Buffer.from(stringify(sortKeysRecursive(order)))
    );

    //transfer amount from owner to escrow account
    const transferResp = await this._transfer(ctx, owner, escrowKey, amount);
    if (!transferResp) {
      throw new Error('Failed to transfer');
    }
    // add order to seller's order list
    const sellerOrderListKey = ctx.stub.createCompositeKey(orderListPrefix, [seller]);
    const sellerOrderListBytes = await ctx.stub.getState(sellerOrderListKey);
    let orderList = [];
    if (!sellerOrderListBytes || sellerOrderListBytes.length === 0) {
      orderList = [];
    }
    else {
      orderList = JSON.parse(sellerOrderListBytes.toString());
    }
    orderList.push(orderId);
    await ctx.stub.putState(sellerOrderListKey, Buffer.from(stringify(sortKeysRecursive(orderList))));

    // add order to owner's order list
    const ownerOrderListKey = ctx.stub.createCompositeKey(orderListPrefix, [owner]);
    const ownerOrderListBytes = await ctx.stub.getState(ownerOrderListKey);
    let ownerOrderList = [];
    if (!ownerOrderListBytes || ownerOrderListBytes.length === 0) {
      ownerOrderList = [];
    }
    else {
      ownerOrderList = JSON.parse(ownerOrderListBytes.toString());
    }
    ownerOrderList.push(orderId);
    await ctx.stub.putState(ownerOrderListKey, Buffer.from(stringify(sortKeysRecursive(ownerOrderList))));
    return true;
  }

  @Transaction(false)
  public async GetOrderList(ctx: Context, account: string): Promise<string> {
    const orderListKey = ctx.stub.createCompositeKey(orderListPrefix, [account]);
    const orderListBytes = await ctx.stub.getState(orderListKey);
    if (!orderListBytes || orderListBytes.length === 0) {
      throw new Error(`the order list for ${account} does not exist`);
    }
    return orderListBytes.toString();
  }



  @Transaction(false)
  public async ReadOrder(ctx: Context, id: string): Promise<string> {
    const orderJSON = await ctx.stub.getState(id); // get the Order from chaincode state
    if (!orderJSON || orderJSON.length === 0) {
      throw new Error(`The Order ${id} does not exist`);
    }
    return orderJSON.toString();
  }

  @Transaction()
  public async UpdateOrder(
    ctx: Context,
    id: string,
    state: string
  ): Promise<void> {
    const exists = await this.OrderExists(ctx, id);
    if (!exists) {
      throw new Error(`The Order ${id} does not exist`);
    }

    const orderJSON = await ctx.stub.getState(id);
    const order = JSON.parse(orderJSON.toString()) as Order;
    order.Status = state;
    return ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(order)))
    );
  }

  @Transaction()
  public async ApproveOrder(
    ctx: Context,
    id: string,
  ): Promise<boolean> {
    const exists = await this.OrderExists(ctx, id);
    if (!exists) {
      throw new Error(`The Order ${id} does not exist`);
    }

    const orderJSON = await ctx.stub.getState(id);
    const order = JSON.parse(orderJSON.toString()) as Order;
    order.Status = "Approved";
    ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(order)))
    );
    return true;
  }

  @Transaction()
  public async ProcessOrder(
    ctx: Context,
    id: string,
  ): Promise<boolean> {
    const exists = await this.OrderExists(ctx, id);
    if (!exists) {
      throw new Error(`The Order ${id} does not exist`);
    }

    const orderJSON = await ctx.stub.getState(id);
    const order = JSON.parse(orderJSON.toString()) as Order;
    order.Status = "Processing";
    ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(order)))
    );
    return true;
  }

  @Transaction()
  public async CompleteOrder(
    ctx: Context,
    id: string,
  ): Promise<boolean> {
    const exists = await this.OrderExists(ctx, id);
    if (!exists) {
      throw new Error(`The Order ${id} does not exist`);
    }

    const orderJSON = await ctx.stub.getState(id);
    const order = JSON.parse(orderJSON.toString()) as Order;
    order.Status = "Completed";
    ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(order)))
    );
    return true;
  }

  @Transaction()
  public async CompleteEscrow(
    ctx: Context,
    id: string,
  ): Promise<boolean> {
    const exists = await this.OrderExists(ctx, id);
    if (!exists) {
      throw new Error(`The Order ${id} does not exist`);
    }

    const orderJSON = await ctx.stub.getState(id);
    const order = JSON.parse(orderJSON.toString()) as Order;
    //check if order is completed
    if (order.Status !== "Completed") {
      throw new Error(`The Order ${id} is not completed`);
    }
    //trnasfer money to seller
    const seller = order.Account;
    const amount = order.Amount;
    const transferResp = await this.Transfer(ctx, escrowKey, seller, amount);
    if (!transferResp) {
      throw new Error(`Failed to transfer money to seller`);
    }
    //update order status to escrow completed
    order.Status = "EscrowCompleted";
    ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(order)))
    );
    return true;
  }

  @Transaction()
  public async DeleteOrder(ctx: Context, id: string): Promise<void> {
    const exists = await this.OrderExists(ctx, id);
    if (!exists) {
      throw new Error(`The Order ${id} does not exist`);
    }
    return ctx.stub.deleteState(id);
  }

  @Transaction(false)
  @Returns("boolean")
  public async OrderExists(ctx: Context, id: string): Promise<boolean> {
    const orderJSON = await ctx.stub.getState(id);
    return orderJSON && orderJSON.length > 0;
  }

  // GetAllOrders returns all Orders found in the world state.
  @Transaction(false)
  @Returns("string")
  public async GetAllOrders(ctx: Context): Promise<string> {
    const allResults = [];
    // range query with empty string for startKey and endKey does an open-ended query of all Orders in the chaincode namespace.
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }


  async _transfer(ctx: Context, from: string, to: string, value: string): Promise<boolean> {

    if (from === to) {
      throw new Error('cannot transfer to and from same client account');
    }

    // Convert value from string to int
    const valueInt = parseInt(value);

    if (valueInt < 0) { // transfer of 0 is allowed in ERC20, so just validate against negative amounts
      throw new Error('transfer amount cannot be negative');
    }

    // Retrieve the current balance of the sender
    const fromBalanceKey = ctx.stub.createCompositeKey(balancePrefix, [from]);
    const fromCurrentBalanceBytes = await ctx.stub.getState(fromBalanceKey);

    if (!fromCurrentBalanceBytes || fromCurrentBalanceBytes.length === 0) {
      throw new Error(`client account ${from} has no balance`);
    }

    const fromCurrentBalance = parseInt(fromCurrentBalanceBytes.toString());

    // Check if the sender has enough tokens to spend.
    if (fromCurrentBalance < valueInt) {
      throw new Error(`client account ${from} has insufficient funds.`);
    }

    // Retrieve the current balance of the recepient
    const toBalanceKey = ctx.stub.createCompositeKey(balancePrefix, [to]);
    const toCurrentBalanceBytes = await ctx.stub.getState(toBalanceKey);

    let toCurrentBalance;
    // If recipient current balance doesn't yet exist, we'll create it with a current balance of 0
    if (!toCurrentBalanceBytes || toCurrentBalanceBytes.length === 0) {
      toCurrentBalance = 0;
    } else {
      toCurrentBalance = parseInt(toCurrentBalanceBytes.toString());
    }

    // Update the balance
    const fromUpdatedBalance = this.sub(fromCurrentBalance, valueInt);
    const toUpdatedBalance = this.add(toCurrentBalance, valueInt);

    await ctx.stub.putState(fromBalanceKey, Buffer.from(fromUpdatedBalance.toString()));
    await ctx.stub.putState(toBalanceKey, Buffer.from(toUpdatedBalance.toString()));

    console.log(`client ${from} balance updated from ${fromCurrentBalance} to ${fromUpdatedBalance}`);
    console.log(`recipient ${to} balance updated from ${toCurrentBalance} to ${toUpdatedBalance}`);

    return true;
  }

  add(a: number, b: number) {
    let c = a + b;
    if (a !== c - b || b !== c - a) {
      throw new Error(`Math: addition overflow occurred ${a} + ${b}`);
    }
    return c;
  }

  // add two number checking for overflow
  sub(a: number, b: number) {
    let c = a - b;
    if (a !== c + b || b !== a - c) {
      throw new Error(`Math: subtraction overflow occurred ${a} - ${b}`);
    }
    return c;
  }
  @Transaction(false)
  async CheckInitialized(ctx: Context) {
    const nameBytes = await ctx.stub.getState(nameKey);
    if (!nameBytes || nameBytes.length === 0) {
      throw new Error('contract options need to be set before calling any function, call Initialize() to initialize contract');
    }
  }


}
