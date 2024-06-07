import { Prisma } from "@prisma/client";

export const stores: Prisma.StoreCreateManyInput[] = [
  {
    name: "Grosirun Pusat",
    superAdminId: 1,
    status: "PUBLISHED",
    imageUrl: "http://example.com/avatar.jpg",
    address: "Jln. Ir. H. Djuanda No. 10",
    latitude: "-6.914744",  
    longtitude: "107.609810", 
    cityId: 23,
  },
  {
    name: "Grosirun Cabang Jakarta",
    superAdminId: 1,
    status: "PUBLISHED",
    imageUrl: "http://example.com/avatar2.jpg",
    address: "Jln. Sudirman No. 15, Jakarta",
    latitude: "-6.21462", 
    longtitude: "106.84513", 
    cityId: 151, 
  },
  {
    name: "Grosirun Cabang Cirebon",
    superAdminId: 1,
    status: "PUBLISHED",
    imageUrl: "http://example.com/avatar3.jpg",
    address: "Jln. Siliwangi No. 20, Cirebon",
    latitude: "-6.732023",  
    longtitude: "108.552316", 
    cityId: 109, 
  }
];
