# Cart API SPEC

## Add To Cart

### Endpoint

`POST /cart`

### Description

Adds an item to the user's cart.

### Request Body

```json
{
  "userId": "string",
  "stockId": "string",
  "quantity": number,
  "isPack": boolean
}
```

| Field    | Type    | Description              |
| -------- | ------- | ------------------------ |
| userId   | string  | ID of the user           |
| stockId  | string  | ID of the stock/product  |
| quantity | number  | Quantity of the item     |
| isPack   | boolean | Indicates if it's a pack |

### Response

- `200 OK` on success.
- `401 Unauthorized` if the user is not authenticated.
- `404 Not Found` if the stock/product is not found.
- `400 Bad Request` if the request body is invalid.

## Update Cart

### Endpoint

`PATCH /cart/:cartId`

### Description

Updates the quantity of an item in the user's cart.

### Request Body

```json
{
  "quantity": number
}
```

| Field    | Type   | Description              |
| -------- | ------ | ------------------------ |
| quantity | number | New quantity of the item |

### Response

- `200 OK` on success.
- `401 Unauthorized` if the user is not authenticated.
- `404 Not Found` if the cart item is not found.
- `400 Bad Request` if the request body is invalid.

## Get Cart

### Endpoint

`GET /cart`

### Description

Retrieves the user's cart items.

### Response

```json
[
  {
    "id": "string",
    "isChecked": true,
    "userId": "string",
    "stockId": "string",
    "quantity": number,
    "isPack": boolean,
    "isDeleted": false,
    "updatedAt": "string",
    "createdAt": "string"
  }
]
```

- `200 OK` on success.
- `401 Unauthorized` if the user is not authenticated.
