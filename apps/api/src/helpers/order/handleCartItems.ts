import { prisma } from '@/db.js';
import { ResponseError } from '@/utils/error.response.js';

const findStockInStore = async (item: any, storeId: any) => {
  return prisma.stock.findFirst({
    where: { productId: item.stock.productId, storeId },
    select: {
      id: true,
      amount: true,
      product: { select: { packQuantity: true } },
    },
  });
};

const findStockInCentralStore = async (item: any) => {
  const centralStore = await prisma.store.findUnique({
    where: { slug: 'grosirun-pusat' },
  });

  if (centralStore) {
    return prisma.stock.findFirst({
      where: { productId: item.stock.productId, storeId: centralStore.id },
      select: {
        id: true,
        amount: true,
        product: { select: { packQuantity: true } },
      },
    });
  }
  return null;
};

const getCartItems = async (userId: any) => {
  return prisma.orderItem.findMany({
    where: {
      userId,
      orderItemType: 'CART_ITEM',
      isChecked: true,
      isDeleted: false,
    },
    include: { stock: { include: { product: true } } },
  });
};

export const handleCartItems = async (userId: any, storeId: any) => {
  const cartItems = await getCartItems(userId);
  if (!cartItems.length) throw new ResponseError(400, 'Cart is empty');

  return await prisma.$transaction(async (tx) => {
    const updatedCartItem = [];

    for (const item of cartItems) {
      let stock = await findStockInStore(item, storeId);
      if (!stock) {
        stock = await findStockInCentralStore(item);
      }

      if (!stock) throw new ResponseError(400, `Stock unavailable for item ${item.stock.productId}. Please search in other stores.`);

      const requiredStock = item.quantity / stock.product.packQuantity;

      if (stock.amount < requiredStock) {
        throw new ResponseError(400, `Insufficient stock for item ${item.stock.productId}. Available stock: ${stock.amount}, Required: ${requiredStock}`);
      }
      updatedCartItem.push({ ...item, stockId: stock.id });
    }

    return { updatedCartItem };
  });
};
