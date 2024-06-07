//seed.ts
import { users } from "./user";
import { provinces } from "./province";
import { PrismaClient } from "@prisma/client";
import { cities } from "./city";
import { stores } from "./store";
import { storeadmins } from "./storeAdmin";
import { categories } from "./category";
import { products } from "./product";
import { stocks } from "./stock";


const prisma = new PrismaClient()

async function main() {
    for(let user of users){
        await prisma.user.create({
            data: user
        })
    }
    for(let province of provinces){
        await prisma.province.create({
            data: province
        })
    }
    for(let city of cities){
        await prisma.city.create({
            data: city
        })
    }
    for(let store of stores){
        await prisma.store.create({
            data: store
        })
    }
    for(let storeadmin of storeadmins){
        await prisma.storeAdmin.create({
            data: storeadmin
        })
    }
    for(let category of categories){
        await prisma.category.create({
            data: category
        })
    }
    for(let product of products){
        await prisma.product.create({
            data: product
        })
    }
    for(let stock of stocks){
        await prisma.stock.create({
            data: stock
        })
    }
}

main()