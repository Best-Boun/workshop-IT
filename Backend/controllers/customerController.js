import CustomerModel from "../models/customerModel.js";

class CustomerController {
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
