import express from "express";
import AuthController from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  registerValidation,
  loginValidation,
} from "../validations/authValidation.js";
import validationMiddleware from "../middleware/validationMiddleware.js";

const router = express.Router();

// Register
router.post(
  "/register",
  registerValidation,
  validationMiddleware,
  AuthController.register,
);

// Login
router.post(
  "/login",
  loginValidation,
  validationMiddleware,
  AuthController.login,
);

// Google Login
router.post("/google", AuthController.googleLogin);

// Get current user (protected)
router.get("/me", authMiddleware, AuthController.getMe);

export default router;
