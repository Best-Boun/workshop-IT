import AuthService from "../services/authService.js";
import UserModel from "../models/userModel.js";

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

  // ==========================
  // GET /api/auth/me
  // ==========================
  static async getMe(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const { password: _pw, ...safeUser } = user;

      let parsedPermissions = {};
      if (safeUser.permissions && typeof safeUser.permissions === "string") {
        try {
          parsedPermissions = JSON.parse(safeUser.permissions);
        } catch {
          parsedPermissions = {};
        }
      } else if (safeUser.permissions && typeof safeUser.permissions === "object") {
        parsedPermissions = safeUser.permissions;
      }

      return res.status(200).json({
        success: true,
        data: {
          ...safeUser,
          permissions: parsedPermissions,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export default AuthController;
