import { ICallback } from '@/types/index.js';
import { prisma } from '@/db.js';
import { ProductFields, ProductUpdateRequest } from '@/types/product.type.js';
import { ProductService } from './product.service.js';
import { User } from 'lucia';

export class ProductController {
  getProducts: ICallback = async (req, res, next) => {
    try {
      const { page = 1, limit, search, ...filters } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = limit ? parseInt(limit as string, 10) : undefined;

      const products = await ProductService.getProducts(pageNumber, limitNumber, { ...filters, search });
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  getProductById: ICallback = async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id },
        select: ProductFields,
      });

      if (!product) {
        return res.status(404).json({ status: "ERROR", message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };

  createProduct: ICallback = async (req, res, next) => {
    try {
      const user = res.locals.user as User;
      const productData = { ...req.body, superAdminId: user.id };

      const files = req.files as Express.Multer.File[] | undefined;
      const imageUrls = files ? files.map((file) => `/public/images/${file.filename}`) : [];

      const product = await ProductService.createProduct(productData, user.id, imageUrls);

      res.status(201).json({ status: "OK", message: "Good Job Admin! New Product Created!", product });
    } catch (error) {
      console.error('Error creating product:', error);
      next(error);
    }
  };

  updateProduct: ICallback = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = res.locals.user as User;
      const productData: ProductUpdateRequest = { ...req.body, superAdminId: user.id };

      const files = req.files as Express.Multer.File[] | undefined;
      const imageUrls = files ? files.map((file) => `/public/images/${file.filename}`) : [];
      const imagesToDelete = req.body.imagesToDelete || [];

      const product = await ProductService.updateProduct(id, productData, user.id, imageUrls, imagesToDelete);

      res.status(200).json({ status: "OK", message: "Product Updated Successfully!", product });
    } catch (error) {
      console.error('Error updating product:', error);
      next(error);
    }
  };

  deleteProduct: ICallback = async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await prisma.product.findUnique({ where: { id } });

      if (!product) {
        return res.status(404).json({ status: "ERROR", message: "Product not found!" });
      }
      await prisma.product.delete({ where: { id } });
      res.status(200).json({ status: "OK", message: "Product Deleted Successfully!" });
    } catch (error) {
      console.error('Error deleting product:', error);
      next(error);
    }
  };
}
