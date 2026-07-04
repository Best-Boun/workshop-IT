import CategoryModel from "../models/categoryModel.js";

class CategoryController {
  // GET /api/categories
  static async getAllCategories(req, res) {
    try {
      const categories = await CategoryModel.getAllCategories();

      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch categories",
      });
    }
  }

  // GET /api/categories/:id
  static async getCategoryById(req, res) {
    try {
      const { id } = req.params;

      const category = await CategoryModel.getCategoryById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch category",
      });
    }
  }

  // POST /api/categories
  static async createCategory(req, res) {
    try {
      const category = {
        ...req.body,
        image: req.file ? req.file.filename : "",
      };

      const result = await CategoryModel.createCategory(category);

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: result,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to create category",
      });
    }
  }

  // PUT /api/categories/:id
  static async updateCategory(req, res) {
    try {
      const { id } = req.params;

      const category = {
        ...req.body,
      };

      if (req.file) {
        category.image = req.file.filename;
      }

      const result = await CategoryModel.updateCategory(id, category);

      res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: result,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to update category",
      });
    }
  }

  // DELETE /api/categories/:id
  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      await CategoryModel.deleteCategory(id);

      res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to delete category",
      });
    }
  }
}

export default CategoryController;
