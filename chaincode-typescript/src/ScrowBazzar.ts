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

// Define key names for options
const nameKey = "name";
const symbolKey = "symbol";
const decimalsKey = "decimals";
const totalSupplyKey = "totalSupply";

@Info({
  title: "ScrowBazzar",
  description: "Smart contract for trading Orders",
})
export class ScrowBazzarContract extends Contract {
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
  async Transfer(ctx: Context, to: string, amount: string): Promise<void> {
    const from = ctx.clientIdentity.getID();

    // Get the state from the ledger
    const fromBalanceKey = ctx.stub.createCompositeKey(balancePrefix, [from]);
    const fromBalanceBytes = await ctx.stub.getState(fromBalanceKey);
    if (!fromBalanceBytes || fromBalanceBytes.length === 0) {
      throw new Error(`the account ${from} does not exist`);
    }
    const fromBalance = parseInt(fromBalanceBytes.toString(), 10);

    const toBalanceKey = ctx.stub.createCompositeKey(balancePrefix, [to]);

    // Calculate the new balance
    const newFromBalance = fromBalance - parseInt(amount, 10);
    const newToBalance = parseInt(amount, 10);

    // Write the states back to the ledger
    await ctx.stub.putState(fromBalanceKey, Buffer.from(newFromBalance.toString()));
    await ctx.stub.putState(toBalanceKey, Buffer.from(newToBalance.toString()));
  }

  @Transaction(true)
  async Approve(ctx: Context, spender: string, amount: string): Promise<void> {
    const owner = ctx.clientIdentity.getID();

    // Get the state from the ledger
    const allowanceKey = ctx.stub.createCompositeKey(allowancePrefix, [
      owner,
      spender,
    ]);

    // Write the states back to the ledger
    await ctx.stub.putState(allowanceKey, Buffer.from(amount));
  }

  @Transaction(true)
  async TransferFrom(
    ctx: Context,
    from: string,
    to: string,
    amount: string
  ): Promise<void> {
    const spender = ctx.clientIdentity.getID();

    // Get the state from the ledger
    const fromBalanceKey = ctx.stub.createCompositeKey(balancePrefix, [from]);
    const fromBalanceBytes = await ctx.stub.getState(fromBalanceKey);
    if (!fromBalanceBytes || fromBalanceBytes.length === 0) {
      throw new Error(`the account ${from} does not exist`);
    }

    const fromBalance = parseInt(fromBalanceBytes.toString(), 10);

    const toBalanceKey = ctx.stub.createCompositeKey(balancePrefix, [to]);

    const allowanceKey = ctx.stub.createCompositeKey(allowancePrefix, [
      from,
      spender,
    ]);
    const allowanceBytes = await ctx.stub.getState(allowanceKey);
    if (!allowanceBytes || allowanceBytes.length === 0) {
      throw new Error(
        `the allowance for ${spender} from ${from} does not exist`
      );
    }

    const allowance = parseInt(allowanceBytes.toString(), 10);

    // Calculate the new balance
    const newFromBalance = fromBalance - parseInt(amount, 10);
    const newToBalance = parseInt(amount, 10);
    const newAllowance = allowance - parseInt(amount, 10);

    // Write the states back to the ledger
    await ctx.stub.putState(fromBalanceKey, Buffer.from(newFromBalance.toString()));
    await ctx.stub.putState(toBalanceKey, Buffer.from(newToBalance.toString()));
    await ctx.stub.putState(allowanceKey, Buffer.from(newAllowance.toString()));
  }

  @Transaction(true)
  async Mint(ctx: Context, to: string, amount: string): Promise<void> {
    const minter = ctx.clientIdentity.getID();

    // Get the state from the ledger
    const totalSupplyBytes = await ctx.stub.getState(totalSupplyKey);
    const totalSupply = parseInt(totalSupplyBytes.toString(), 10);

    const toBalanceKey = ctx.stub.createCompositeKey(balancePrefix, [to]);
    const toBalanceBytes = await ctx.stub.getState(toBalanceKey);
    const toBalance = parseInt(toBalanceBytes.toString(), 10);

    // Calculate the new balance
    const newTotalSupply = totalSupply + parseInt(amount, 10);
    const newToBalance = toBalance + parseInt(amount, 10);

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
  public async InitLedger(ctx: Context, name:String, symbol:String, decimals:String): Promise<void> {
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

  @Transaction()
  public async CreateOrder(
    ctx: Context,
    orderId: string,
    amount: string,
    owner: string,
    account: string
  ): Promise<void> {
    const exists = await this.OrderExists(ctx, orderId);
    if (exists) {
      throw new Error(`The Order ${orderId} already exists`);
    }

    const order = {
      OrderId: orderId,
      Amount: amount,
      Owner: owner,
      Account: account,
    };
    await ctx.stub.putState(
      orderId,
      Buffer.from(stringify(sortKeysRecursive(order)))
    );
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
}
