import AuthService from "../services/authService.js";

class AuthController {
  // ==========================
  // Register
  // ==========================
  static async register(req, res) {
    try {
      const user = await AuthService.register(req.body);

      return res.status(201).json({
        success: true,
        message: "Register successful",
        data: user,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ==========================
  // Login
  // ==========================
  static async login(req, res) {
    try {
      const result = await AuthService.login(req.body);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        ...result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async googleLogin(req, res) {
    try {
      const result = await AuthService.googleLogin(req.body.credential);

      res.json({
        success: true,
        ...result,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
}

export default AuthController;
