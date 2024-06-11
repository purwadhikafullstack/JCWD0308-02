# Order API SPEC

## Creating New Order

### Endpoint

`POST /order`

### Description

Creates a new order based on the products and addresses selected during checkout. The order will be sent to the nearest store from the destination address, and the stock availability will be checked before creating the order.

### Request Body

```json
{
  "userId": "string",
  "addressId": "string",
  "items": [
    {
      "stockId": "string",
      "quantity": number
    }
  ],
  "paymentMethod": "string",
  "courier": "string",
  "service": "string",
  "note": "string"
}
```

| Field         | Type   | Description                   |
| ------------- | ------ | ----------------------------- |
| userId        | string | ID of the user                |
| addressId     | string | ID of the user's address      |
| items         | array  | List of items in the order    |
| stockId       | string | ID of the stock/product       |
| quantity      | number | Quantity of the item          |
| paymentMethod | string | Payment method chosen         |
| courier       | string | Courier type                  |
| service       | string | Courier service               |
| note          | string | Additional note for the order |

### Response

- `201 Created` on success.
- `401 Unauthorized` if the user is not authenticated.
- `404 Not Found` if the address or stock/product is not found.
- `400 Bad Request` if the request body is invalid or stock is unavailable.

## Upload Payment Proof

### Endpoint

`POST /order/:orderId/upload`

### Description

Uploads proof of payment for the specified order.

### Request Body

```json
{
  "paymentPicture": "string"
}
```

| Field          | Type   | Description                    |
| -------------- | ------ | ------------------------------ |
| paymentPicture | string | URL of the payment proof image |

### Response

- `200 OK` on success.
- `401 Unauthorized` if the user is not authenticated.
- `404 Not Found` if the order is not found.
- `400 Bad Request` if the request body is invalid.

## Get Orders

### Endpoint

`GET /orders`

### Description

Retrieves the list of orders for the authenticated user.

### Response

```json
[
  {
    "id": "string",
    "orderStatus": "string",
    "userId": "string",
    "courier": "string",
    "service": "string",
    "serviceDescription": "string",
    "estimation": "string",
    "note": "string",
    "paymentMethod": "string",
    "totalPrice": number,
    "shippingCost": number,
    "discountProducts": number,
    "discountShippingCost": number,
    "totalPayment": number,
    "paymentPicture": "string",
    "storeId": "string",
    "storeAdminId": "string",
    "isDeleted": boolean,
    "deletedAt": "string",
    "updatedAt": "string",
    "createdAt": "string",
    "orderItems": [
      {
        "id": "string",
        "orderItemType": "string",
        "isChecked": boolean,
        "userId": "string",
        "orderId": "string",
        "stockId": "string",
        "quantity": number,
        "isPack": boolean,
        "bonus": number,
        "isDeleted": boolean,
        "deletedAt": "string",
        "updatedAt": "string",
        "createdAt": "string"
      }
    ]
  }
]
```

### Response Codes

- `200 OK` on success.
- `401 Unauthorized` if the user is not authenticated.

## Get Order by ID

### Endpoint

`GET /order/:orderId`

### Description

Retrieves the details of a specific order by ID.

### Response

```json
{
  "id": "string",
  "orderStatus": "string",
  "userId": "string",
  "courier": "string",
  "service": "string",
  "serviceDescription": "string",
  "estimation": "string",
  "note": "string",
  "paymentMethod": "string",
  "totalPrice": number,
  "shippingCost": number,
  "discountProducts": number,
  "discountShippingCost": number,
  "totalPayment": number,
  "paymentPicture": "string",
  "storeId": "string",
  "storeAdminId": "string",
  "isDeleted": boolean,
  "deletedAt": "string",
  "updatedAt": "string",
  "createdAt": "string",
  "orderItems": [
    {
      "id": "string",
      "orderItemType": "string",
      "isChecked": boolean,
      "userId": "string",
      "orderId": "string",
      "stockId": "string",
      "quantity": number,
      "isPack": boolean,
      "bonus": number,
      "isDeleted": boolean,
      "deletedAt": "string",
      "updatedAt": "string",
      "createdAt": "string"
    }
  ]
}
```

### Response Codes

- `200 OK` on success.
- `401 Unauthorized` if the user is not authenticated.
- `404 Not Found` if the order is not found.
