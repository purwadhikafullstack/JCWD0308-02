import { Status } from '@prisma/client';

export function listStores(id: string) {
  return [
    {
      name: 'Grosirun Pusat',
      slug: 'grosirun-pusat',
      superAdminId: id,
      status: Status.PUBLISHED,
      imageUrl: 'http://localhost:3000/public/indomie.jpg',
      address: 'Jln. Ir. H. Djuanda No. 10',
      coordinate: '-6.914744 107.609810',
      cityId: 23,
    },
    {
      name: 'Grosirun Cabang Jakarta',
      slug: 'grosirun-cabang-jakarta',
      superAdminId: id,
      status: Status.PUBLISHED,
      imageUrl: 'http://localhost:3000/public/indomie.jpg',
      address: 'Jln. Sudirman No. 15, Jakarta',
      coordinate: '-6.21462 106.84513',
      cityId: 151,
    },
    {
      name: 'Grosirun Cabang Cirebon',
      slug: 'grosirun-cabang-cirebon',
      superAdminId: id,
      status: Status.PUBLISHED,
      imageUrl: 'http://localhost:3000/public/indomie.jpg',
      address: 'Jln. Siliwangi No. 20, Cirebon',
      coordinate: '-6.732023 108.552316',
      cityId: 109,
    },
  ];
}
