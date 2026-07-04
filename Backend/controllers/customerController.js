import CustomerModel from "../models/customerModel.js";
import UserModel from "../models/userModel.js";

class CustomerController {
  // GET /api/users/profile
  static async getMyProfile(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const profile = await UserModel.getProfileById(userId);

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch profile",
      });
    }
  }

  // PUT /api/users/profile
  static async updateMyProfile(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const existingProfile = await UserModel.getProfileById(userId);

      if (!existingProfile) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const nextFirstName = req.body.first_name?.trim();
      const nextLastName = req.body.last_name?.trim();

      if (!nextFirstName || !nextLastName) {
        return res.status(400).json({
          success: false,
          message: "First name and last name are required",
        });
      }

      let normalizedPhone = null;
      if (req.body.phone !== undefined && req.body.phone !== null) {
        const phoneValue = String(req.body.phone).trim();

        if (phoneValue !== "") {
          if (!/^\d+$/.test(phoneValue)) {
            return res.status(400).json({
              success: false,
              message: "Phone number must contain digits only",
            });
          }

          normalizedPhone = phoneValue;
        }
      }

      const updatePayload = {
        first_name: nextFirstName,
        last_name: nextLastName,
        phone: normalizedPhone,
        address: req.body.address ?? null,
      };

      await UserModel.updateProfileById(userId, updatePayload);

      const updatedProfile = await UserModel.getProfileById(userId);

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  }

  // GET /api/customers
  static async getAllCustomers(req, res) {
    try {
      const customers = await CustomerModel.getAllCustomers();

      res.status(200).json({
        success: true,
        count: customers.length,
        data: customers,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch customers",
      });
    }
  }

  // GET /api/customers/:id
  static async getCustomerById(req, res) {
    try {
      const { id } = req.params;

      const customer = await CustomerModel.getCustomerById(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch customer",
      });
    }
  }

  // PUT /api/customers/:id
  // PUT /api/customers/:id
  static async updateCustomer(req, res) {
    try {
      const { id } = req.params;

      const existingCustomer = await CustomerModel.getCustomerById(id);

      if (!existingCustomer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      const customer = {
        ...req.body,
      };

      const result = await CustomerModel.updateCustomer(id, customer);

      res.status(200).json({
        success: true,
        message: "Customer updated successfully",
        data: result,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to update customer",
      });
    }
  }

  // DELETE /api/customers/:id
  static async deleteCustomer(req, res) {
    try {
      const { id } = req.params;

      const existingCustomer = await CustomerModel.getCustomerById(id);

      if (!existingCustomer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      await CustomerModel.deleteCustomer(id);

      res.status(200).json({
        success: true,
        message: "Customer deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to delete customer",
      });
    }
  }
}

export default CustomerController;
