import { prisma } from "@/db.js";
import { findNearestStore, findStoresInRange } from "@/api/distance/distance.service.js";
import { ResponseError } from "@/utils/error.response.js";

const getCartItems = async (userId: any) => {
  return prisma.orderItem.findMany({
    where: { userId, orderItemType: "CART_ITEM", isChecked: true, isDeleted: false },
    include: { stock: { include: { product: true } } },
  });
};

const findStockInStore = async (item: any, storeId: any) => {
  return prisma.stock.findFirst({
    where: { productId: item.stock.productId, storeId },
  });
};

const findStockInNearbyStores = async (item: any, coordinate: string) => {
  const range = 100000; // 100KM
  const otherStores = await findStoresInRange(coordinate, range);

  for (const store of otherStores) {
    const stock = await prisma.stock.findFirst({
      where: { productId: item.stock.productId, storeId: store.id },
    });
    if (stock && stock.amount >= item.quantity) return stock;
  }
  return null;
};

const findStockInCentralStore = async (item: any) => {
  const centralStore = await prisma.store.findUnique({
    where: { slug: "grosirun-pusat" },
  });

  if (centralStore) {
    return prisma.stock.findFirst({
      where: { productId: item.stock.productId, storeId: centralStore.id },
    });
  }
  return null;
};

const findStock = async (item: any, coordinate: string) => {
  const stock = await findStockInNearbyStores(item, coordinate);
  return stock || findStockInCentralStore(item);
};

export const handleCartItems = async (userId: any, addressId: any) => {
  const cartItems = await getCartItems(userId);
  if (!cartItems.length) throw new ResponseError(400, "Cart is empty");
  const updatedCartItem = [];
  let { nearestStore, isServiceAvailable } = await findNearestStore(addressId);
  const userAddress = await prisma.userAddress.findUnique({ where: { id: addressId } });
  for (const item of cartItems) {
    let stock = (await findStockInStore(item, nearestStore?.id)) || (await findStock(item, userAddress?.coordinate!));

    if (!stock || stock.amount < item.quantity) throw new ResponseError(400, `Stock unavailable for item ${item.stock.productId}. Please search in other stores.`);

    updatedCartItem.push({ ...item, stockId: stock.id });
  }
  return { updatedCartItem, nearestStore };
};
