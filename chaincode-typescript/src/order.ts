/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';

@Object()
export class Order {
    @Property()
    public docType?: string;

    @Property()
    public OrderId: string;

    @Property()
    public Amount: string;

    @Property()
    public Account: string;

    @Property()
    public Owner: string;

    @Property()
    public Status: string;
}
