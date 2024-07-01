import { prisma } from '@/db.js';
import { Validation } from '@/utils/validation.js';
import { CategoryValidation } from './category.validation.js';
import { CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category.type.js';

export class CategoryService {
  static getCategories = async () => {
    return await prisma.category.findMany();
  }

  static getCategoryById = async (id: string) => {
    return await prisma.category.findUnique({
      where: { id },
    });
  }

  static createCategory = async (req: CreateCategoryRequest, superAdminId: string) => {
    const newCategory = Validation.validate(CategoryValidation.createCategory, req);
    return await prisma.category.create({
      data: { ...newCategory, superAdminId },
    });
  }

  static updateCategory = async (id: string, req: UpdateCategoryRequest) => {
    const updatedCategory = Validation.validate(CategoryValidation.updateCategory, req);
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
}
