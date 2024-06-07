import { Prisma } from "@prisma/client";

export const storeadmins: Prisma.StoreAdminCreateManyInput[] = [{
    storeId: 1,
    storeAdminId: 4
},
{
    storeId: 2,
    storeAdminId: 5
},
{
    storeId : 3,
    storeAdminId : 6
},
{
    storeId : 1,
    storeAdminId : 2
}
]