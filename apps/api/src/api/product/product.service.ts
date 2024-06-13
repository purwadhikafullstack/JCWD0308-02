import { ResponseError } from "@/utils/error.response.js";
import { Validation } from "@/utils/validation.js";
import { prisma } from "@/db.js";
import { ProductFields, ProductRequest } from "@/types/product.type.js";
import { ProductValidation } from "./product.validation.js";

export class ProductService {
  static createProduct = async (req: ProductRequest, superAdminId: string) => {
    const newProduct = Validation.validate(ProductValidation.createProduct, req);
    await ProductService.checkProductExists(newProduct.title);

    return await prisma.product.create({
      data: { ...newProduct, superAdminId },
      select: { ...ProductFields },
    });
  };

  static updateProduct = async (id: string, req: ProductRequest, superAdminId: string) => {
    const updatedProduct = Validation.validate(ProductValidation.updateProduct, req);
    await ProductService.checkProductExists(updatedProduct.title);

    return await prisma.product.update({
      where: { id },
      data: { ...updatedProduct, superAdminId },
      select: { ...ProductFields },
    });
  };

  private static checkProductExists = async (title: string) => {
    const findProduct = await prisma.product.findUnique({ where: { title } });
    if (findProduct) {
      throw new ResponseError(400, "Product with this title already exist!");
    }
  };
}
