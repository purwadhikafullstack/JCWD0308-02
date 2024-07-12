import { prisma } from '@/db.js';
import { Validation } from '@/utils/validation.js';
import { CategoryValidation } from './category.validation.js';
import { CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category.type.js';
import { Request, Response } from 'express';
import { API_URL } from '@/config.js';
import { deleteFile, getBaseUrl } from '@/utils/file.js';

export class CategoryService {
  static getCategories = async () => {
    return await prisma.category.findMany();
  }

  static getCategoryById = async (id: string) => {
    return await prisma.category.findUnique({
      where: { id },
    });
  }

  static createCategory = async (req: Request, res: Response, superAdminId: string) => {
    if (await CategoryService.categoryNameExists(req.body.name)) {
      res.status(400).json({ error: "Category name already exists" });
      return;
    }

    if (req.files && !Array.isArray(req.files)) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.imageUrl) {
        req.body.imageUrl = `${API_URL}/api/public/images/${files.imageUrl[0].filename}`;
      }
    }
    const newCategory = Validation.validate(CategoryValidation.createCategory, req.body as CreateCategoryRequest);
    return await prisma.category.create({
      data: { ...newCategory, superAdminId },
    });
  }

  static updateCategory = async (req: Request, res: Response, id: string) => {
    if (await CategoryService.categoryNameExists(req.body.name, id)) {
      res.status(400).json({ error: "Category name already exists" });
      return;
    }

    if (req.files && !Array.isArray(req.files)) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.imageUrl) {
        req.body.imageUrl = `${API_URL}/api/public/images/${files.imageUrl[0].filename}`;
      }
    }

    const updatedCategory = Validation.validate(CategoryValidation.updateCategory, req.body as UpdateCategoryRequest);

    return await prisma.category.update({
      where: { id },
      data: updatedCategory,
    });
  }

  static deleteCategory = async (id: string) => {
    return await prisma.category.delete({
      where: { id },
    });
  }

  static categoryNameExists = async (name: string, excludeId?: string): Promise<boolean> => {
    const whereClause = excludeId ? { name, NOT: { id: excludeId } } : { name };
    const category = await prisma.category.findFirst({
      where: whereClause,
    });
    return !!category;
  }
}