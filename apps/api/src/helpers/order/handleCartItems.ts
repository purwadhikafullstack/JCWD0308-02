import { prisma } from '@/db.js';
import { ResponseError } from '@/utils/error.response.js';

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

const findStockInStore = async (item: any, storeId: any) => {
  return prisma.stock.findFirst({
    where: { productId: item.stock.productId, storeId },
  });
};

const findStockInCentralStore = async (item: any) => {
  const centralStore = await prisma.store.findUnique({
    where: { slug: 'grosirun-pusat' },
  });

  if (centralStore) {
    return prisma.stock.findFirst({
      where: { productId: item.stock.productId, storeId: centralStore.id },
    });
  }
  return null;
};

export const handleCartItems = async (userId: any, storeId: any) => {
  const cartItems = await getCartItems(userId);
  if (!cartItems.length) throw new ResponseError(400, 'Cart is empty');

  const updatedCartItem = [];

  for (const item of cartItems) {
    let stock = (await findStockInStore(item, storeId)) || (await findStockInCentralStore(item));

    if (!stock || stock.amount < item.quantity) throw new ResponseError(400, `Stock unavailable for item ${item.stock.productId}. Please search in other stores.`);

    updatedCartItem.push({ ...item, stockId: stock.id });
  }
  return { updatedCartItem };
};
