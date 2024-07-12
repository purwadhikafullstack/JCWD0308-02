import { ResponseError } from "@/utils/error.response.js";
import { Validation } from "@/utils/validation.js";
import { prisma } from "@/db.js";
import { ProductFields, ProductRequest, ProductUpdateRequest } from "@/types/product.type.js";
import { ProductValidation } from "./product.validation.js";
import { API_URL } from "@/config.js";

export class ProductService {
  static getProducts = async (page: number, limit?: number, filters: any = {}) => {
    const where: any = {};
    if (filters.search) {
      where.title = {
        contains: filters.search.toLowerCase(),
      };
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
      orderBy: {
        createdAt: 'desc',
      },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit ?? undefined,
      select: {
        ...ProductFields,
        images: true,
      },
    });

    return {
      total,
      page,
      limit: limit || total,
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
            imageUrl: `${API_URL}${imageUrl}`,
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
    const existingProduct = await this.checkProductExists(id);
    const updatedProductData = this.prepareUpdatedProductData(req);
    const validatedProduct = this.validateProductData(updatedProductData);

    const product = await this.updateProductInDB(id, validatedProduct, superAdminId);
    await this.addProductImages(product.id, imageUrls);
    await this.deleteProductImages(imagesToDelete);

    return await this.getProductWithImages(product.id);
  };

  private static prepareUpdatedProductData = (req: ProductUpdateRequest) => {
    const updatedProductData: Partial<ProductUpdateRequest> = {};
    Object.keys(req).forEach((key) => {
      const value = req[key as keyof ProductUpdateRequest];
      if (value !== undefined) {
        (updatedProductData as any)[key] = value;
      }
    });
    return updatedProductData;
  };

  private static validateProductData = (updatedProductData: Partial<ProductUpdateRequest>) => {
    return Validation.validate(ProductValidation.updateProduct, updatedProductData);
  };

  private static updateProductInDB = async (id: string, updatedProduct: Partial<ProductUpdateRequest>, superAdminId: string) => {
    return await prisma.product.update({
      where: { id },
      data: { ...updatedProduct, superAdminId },
      select: { ...ProductFields },
    });
  };

  private static addProductImages = async (productId: string, imageUrls: string[]) => {
    if (imageUrls.length > 0) {
      for (const imageUrl of imageUrls) {
        await prisma.productImage.create({
          data: {
            productId,
            imageUrl: `${API_URL}${imageUrl}`,
          },
        });
      }
    }
  };

  private static deleteProductImages = async (imagesToDelete: string[]) => {
    if (imagesToDelete.length > 0) {
      for (const imageId of imagesToDelete) {
        const imageExists = await prisma.productImage.findUnique({
          where: { id: imageId },
        });
        if (imageExists) {
          await prisma.productImage.delete({
            where: { id: imageId },
          });
        }
      }
    }
  };

  private static getProductWithImages = async (productId: string) => {
    return await prisma.product.findUnique({
      where: { id: productId },
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
  static getProductBySlug = async (slug: string) => {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: {
        ...ProductFields,
        images: true,
        stock: {
          select: {
            id: true,
            amount: true,
            store: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  };
}