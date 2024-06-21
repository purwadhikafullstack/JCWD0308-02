import { ResponseError } from "@/utils/error.response.js";
import { Validation } from "@/utils/validation.js";
import { prisma } from "@/db.js";
import { ProductFields, ProductRequest, ProductUpdateRequest } from "@/types/product.type.js";
import { ProductValidation } from "./product.validation.js";

export class ProductService {
  static getProducts = async (page: number, limit: number, filters: any) => {
    const where: any = {};
    if (filters.search) {
      where.title = { contains: filters.search };
      delete filters.search;
    }
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        where[key] = value;
      }
    }
    const total = await prisma.product.count({ where });
    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        ...ProductFields,
        images: true,
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

    if (imageUrls.length > 0) {
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

  static updateProduct = async (id: string, req: ProductUpdateRequest, superAdminId: string, imageUrls: string[] = [], imagesToDelete: string[] = []) => {
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      throw new ResponseError(404, "Product not found");
    }

    const updatedProductData: Partial<ProductUpdateRequest> = {};
    for (const key in req) {
      if (req.hasOwnProperty(key) && req[key as keyof ProductUpdateRequest] !== undefined) {
        updatedProductData[key as keyof ProductUpdateRequest] = req[key as keyof ProductUpdateRequest];
      }
    }

    const updatedProduct = Validation.validate(ProductValidation.updateProduct, updatedProductData);

    const product = await prisma.product.update({
      where: { id },
      data: { ...updatedProduct, superAdminId },
      select: { ...ProductFields },
    });

    if (imageUrls.length > 0) {
      for (const imageUrl of imageUrls) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            imageUrl: `http://localhost:8000${imageUrl}`,
          },
        });
      }
    }

    if (imagesToDelete.length > 0) {
      for (const imageId of imagesToDelete) {
        await prisma.productImage.delete({
          where: { id: imageId },
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
