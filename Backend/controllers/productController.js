import ProductModel from "../models/productModel.js";

class ProductController {
  // GET /api/products
  static async getAllProducts(req, res) {
    try {
      const products = await ProductModel.getAllProducts();

      res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch products",
      });
    }
  }

  // GET /api/products/:id
  static async getProductById(req, res) {
    try {
      const { id } = req.params;

      const product = await ProductModel.getProductById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch product",
      });
    }
  }

  // GET /api/categories
  static async getCategories(req, res) {
    try {
      const categories = await ProductModel.getCategories();

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

  // GET /api/products/category/:id
  static async getProductsByCategory(req, res) {
    try {
      const { id } = req.params;

      const products = await ProductModel.getProductsByCategory(id);

      res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch products",
      });
    }
  }
}

export default ProductController;
