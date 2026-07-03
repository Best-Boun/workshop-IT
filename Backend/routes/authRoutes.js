import express from "express";
import AuthController from "../controllers/authController.js";
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

router.post("/google", AuthController.googleLogin);

export default router;
