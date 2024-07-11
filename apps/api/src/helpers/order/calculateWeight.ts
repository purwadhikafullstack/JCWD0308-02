import { ResponseError } from "@/utils/error.response.js";

export const calculateProductPriceAndWeight = (item: any) => {
  let productPrice = 0,
    productWeight = 0;
  if (item.isPack && item.stock.product.packPrice) {
    productPrice = item.stock.product.packPrice;
    productWeight = item.stock.product.weightPack;
  } else if (!item.isPack && item.stock.product.price) {
    productPrice = item.stock.product.price;
    productWeight = item.stock.product.weight;
  } else {
    throw new ResponseError(400, `Price not available for item ${item.stock.productId}`);
  }
  return { productPrice, productWeight };
};
