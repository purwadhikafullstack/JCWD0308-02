import { ResponseError } from "@/utils/error.response.js";
import { Validation } from "@/utils/validation.js";
import { prisma } from "@/db.js";
import { ProductFields, ProductRequest } from "@/types/product.type.js";
import { ProductValidation } from "./product.validation.js";

export class ProductService {
  static getProducts = async (page: number, limit: number, filters: any) => {
    const where: any = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        where[key] = { contains: value };
      }
    }

    const total = await prisma.product.count({ where });
    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        ...ProductFields,
        images: true, // Pastikan field ini disertakan
      },
    });

    return {
      total,
      page,
      limit,
      products,
    };
  };

  static createProduct = async (req: ProductRequest, superAdminId: string, imageUrls: string[]) => {
    const newProduct = Validation.validate(ProductValidation.createProduct, req);
    await ProductService.checkProductExists(newProduct.title);

    const product = await prisma.product.create({
      data: { ...newProduct, superAdminId },
      select: { ...ProductFields },
    });

    if (imageUrls.length) {
      for (const imageUrl of imageUrls) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            imageUrl: `http://localhost:8000${imageUrl}`,
          },
        });
      }
    }

    return await prisma.product.findUnique({
      where: { id: product.id },
      select: {
        ...ProductFields,
        images: true,
      },
    });
  };

  static updateProduct = async (id: string, req: ProductRequest, superAdminId: string, imageUrls: string[]) => {
    const updatedProduct = Validation.validate(ProductValidation.updateProduct, req);
    await ProductService.checkProductExists(updatedProduct.title);

    const product = await prisma.product.update({
      where: { id },
      data: { ...updatedProduct, superAdminId },
      select: { ...ProductFields },
    });

    if (imageUrls.length) {
      for (const imageUrl of imageUrls) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            imageUrl: `http://localhost:8000${imageUrl}`,
          },
        });
      }
    }

    return await prisma.product.findUnique({
      where: { id: product.id },
      select: {
        ...ProductFields,
        images: true,
      },
    });
  };
  

  private static checkProductExists = async (title: string) => {
    const findProduct = await prisma.product.findUnique({ where: { title } });
    if (findProduct) {
      throw new ResponseError(400, "Product with this title already exists!");
    }
  };
}
