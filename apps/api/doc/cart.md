# Cart API SPEC

## Add To Cart

Request Body (mengambil dari Tabel OrderItem):

```json
{
  "id": "aaaa",
  "isChecked": true,
  "userId": "...",
  "stockId": "aaa",
  "quantity": 12,
  "isPack": false,
  "isDeleted": false,
  "updatedAt": "...",
  "createdAt": "..."
}
```

Berarti tabel yang harus ada adalah:

1. User
2. Category
3. Product
4. City
5. Province
6. Store
7. Stock

## Update Cart

## Get Cart
