import { PrismaClient } from '@prisma/client';
import { listUsers } from '../models/user.js';
import { listCategories } from '../models/category.js';
import { listProducts } from '../models/product.js';
import { listProvinces } from '../models/province.js';
import { listCities } from '../models/city.js';
import { listStores } from '../models/store.js';

const prisma = new PrismaClient();

async function main() {
  const users = await listUsers();
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  const superAdmin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' },
  });

  const categories = listCategories(superAdmin?.id!);
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });

  const tempCategory = await prisma.category.findUnique({
    where: { name: 'ALL' },
  });

  const products = listProducts(superAdmin?.id!, tempCategory?.id!);
  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

  const provinces = listProvinces();
  await prisma.province.createMany({
    data: provinces,
    skipDuplicates: true,
  });

  const cities = listCities();
  await prisma.city.createMany({
    data: cities,
    skipDuplicates: true,
  });

  const stores = listStores(superAdmin?.id!);
  await prisma.store.createMany({
    data: stores,
    skipDuplicates: true,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
