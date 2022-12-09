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

@Info({
  title: "ScrowBazzar",
  description: "Smart contract for trading Orders",
})
export class ScrowBazzarContract extends Contract {
  @Transaction()
  public async InitLedger(ctx: Context): Promise<void> {
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
