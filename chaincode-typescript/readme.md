
## API Reference

#### Initialize Contract

```http
  GET /init
```


#### Mint Tokens

```http
  GET /mint_tokens
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Required**. User to mint tokens to |
| `amount`      | `string` | **Required**. Amount of tokens to mint |

#### Get balance

```http
  GET /balance_of
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Required**. User to get the balance for |

#### Create Signle party Escrow Order

```http
  GET /create_order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `orderid`      | `string` | **Required**. Unique id for order |
| `amount`      | `string` | **Required**. amount for order |
| `buyer`      | `string` | **Required**. buyer id for order |
| `seller`      | `string` | **Required**. seller id for order |

#### Get order list of user

```http
  GET /get_order_list
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `seller`      | `string` | **Required**. User to get the order list for |

#### Approve Signle party Escrow Order

```http
  GET /approve_order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `orderid`      | `string` | **Required**. id for order to approve |

#### Process Signle party Escrow Order

```http
  GET /process_order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `orderid`      | `string` | **Required**. id for order to process |

#### Complete Signle party Escrow Order

```http
  GET /complete_order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `orderid`      | `string` | **Required**. id for order to complete |


#### Complete Escrow Signle party Escrow Order

```http
  GET /complete_escrow
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `orderid`      | `string` | **Required**. id for order to complete |

#### Create Multi party Escrow Order with payment customization

```http
  GET /create_custom_escrow_order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `orderid`      | `string` | **Required**. unique id for order |
| `seller`      | `string` | **Required**. seller id for order |
| `buyers`      | `string` | **Required**. buyer ids string sperated by comma for order |
| `shares`      | `string` | **Required**. shares sperated by comma for order |
| `customTransfer`      | `string` | **Required**. transfer amount for each step sperated by comma for order |

#### Approve Multi party Escrow Order with payment customization

```http
  GET /approve_custom_escrow_order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `orderid`      | `string` | **Required**. id for order to approve |

#### Process Multi party Escrow Order with payment customization

```http
  GET /process_custom_escrow_order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `orderid`      | `string` | **Required**. id for order to approve |

#### Complete Multi party Escrow Order with payment customization

```http
  GET /complete_custom_escrow_order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `orderid`      | `string` | **Required**. id for order to approve |

#### Accept Order Delivery Multi party Escrow Order with payment customization

```http
  GET /accept_order_delivery
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `orderid`      | `string` | **Required**. id for order to approve |