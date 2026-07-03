import UserModel from "../models/userModel.js";

class AdminController {
  static async getAdmins(req, res) {
    try {
      const admins = await UserModel.getAdmins();

      const response = admins.map((admin) => ({
        ...admin,
        permissions: admin.permissions ? JSON.parse(admin.permissions) : {},
      }));

      return res.status(200).json({ success: true, data: response });
    } catch (error) {
      console.error("getAdmins error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch admin users" });
    }
  }

  static async deleteAdmin(req, res) {
    try {
      const { id } = req.params;

      if (req.user.id === Number(id)) {
        return res
          .status(400)
          .json({ success: false, message: "You cannot delete yourself" });
      }

      const affectedRows = await UserModel.deleteById(id);

      if (!affectedRows) {
        return res.status(404).json({ success: false, message: "Admin not found" });
      }

      return res.status(200).json({ success: true, message: "Admin deleted" });
    } catch (error) {
      console.error("deleteAdmin error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete admin" });
    }
  }

  static async updateAdminPermissions(req, res) {
    try {
      const { id } = req.params;
      const { permissions } = req.body;

      if (!permissions || typeof permissions !== "object") {
        return res
          .status(400)
          .json({ success: false, message: "Invalid permissions payload" });
      }

      const affectedRows = await UserModel.updatePermissions(id, permissions);

      if (!affectedRows) {
        return res.status(404).json({ success: false, message: "Admin not found" });
      }

      return res.status(200).json({ success: true, message: "Permissions updated" });
    } catch (error) {
      console.error("updateAdminPermissions error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update permissions" });
    }
  }
}

export default AdminController;
