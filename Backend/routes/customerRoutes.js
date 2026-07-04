import express from "express";
import CustomerController from "../controllers/customerController.js";

const router = express.Router();

// ดึงลูกค้าทั้งหมด
router.get("/", CustomerController.getAllCustomers);

// ดึงรายละเอียดลูกค้า
router.get("/:id", CustomerController.getCustomerById);

// แก้ไขลูกค้า
router.put("/:id", CustomerController.updateCustomer);

// ลบลูกค้า
router.delete("/:id", CustomerController.deleteCustomer);

export default router;
