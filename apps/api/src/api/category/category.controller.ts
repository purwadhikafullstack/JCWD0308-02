import { ICallback } from '@/types/index.js';
import { CategoryService } from './category.service.js';
import { User } from 'lucia';

export class CategoryController {
  getCategories: ICallback = async (req, res) => {
    try {
      const categories = await CategoryService.getCategories();
      return res.status(200).json({ categories });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  getCategoryById: ICallback = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await CategoryService.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      return res.status(200).json({ category });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  createCategory: ICallback = async (req, res, next) => {
    try {
      const user = res.locals.user as User;
      const category = await CategoryService.createCategory(req.body, user.id);
      return res.status(201).json({ status: "OK", message: "Category created successfully!", category });
    } catch (error) {
      next(error);
    }
  }

  updateCategory: ICallback = async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await CategoryService.updateCategory(id, req.body);
      return res.status(200).json({ status: "OK", message: "Category updated successfully!", category });
    } catch (error) {
      next(error);
    }
  }

  deleteCategory: ICallback = async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await CategoryService.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      await CategoryService.deleteCategory(id);
      return res.status(200).json({ status: "OK", message: "Category deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
