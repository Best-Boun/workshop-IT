import express from "express";
import AdminController from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET /api/admins → ดึงรายการแอดมินและ superadmin
router.get("/", authMiddleware, adminOnly, AdminController.getAdmins);

// DELETE /api/admins/:id → ลบแอดมิน
router.delete("/:id", authMiddleware, adminOnly, AdminController.deleteAdmin);

// PUT /api/admins/:id/permissions → อัปเดต permissions
router.put("/:id/permissions", authMiddleware, adminOnly, AdminController.updateAdminPermissions);

export default router;
