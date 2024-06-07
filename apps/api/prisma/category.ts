import { Prisma } from "@prisma/client";

export const categories: Prisma.CategoryCreateManyInput[] = [
    {
    id : 1,
    name : "Makanan",
    superAdminId : 1
},
{
    id : 2,
    name : "Minuman",
    superAdminId : 1
}, 
{
    id : 3,
    name : "Produk Segar",
    superAdminId : 1
},
{
    id : 4,
    name : "Kebutuhan Ibu & Anak",
    superAdminId : 1
},
{
    id : 5,
    name : "Home and Living",
    superAdminId : 1
},
{
    id : 6,
    name : "Kecantikan",
    superAdminId : 1
},
{
    id : 7,
    name : "Kesehatan",
    superAdminId : 1
},

]