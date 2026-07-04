import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderHistory from "./pages/OrderHistory";
import TrackOrder from "./pages/TrackOrder";
import OrderManagement from "./pages/OrderManagement";

import { PrivateRoute, AdminRoute, AdminPageRoute } from "./components/PrivateRoute";

// ===== ของมึง =====
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";

import ProductsAdmin from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";

import Categories from "./pages/admin/Categories";
import AddCategory from "./pages/admin/AddCategory";
import EditCategory from "./pages/admin/EditCategory";

import Orders from "./pages/admin/Orders";
import OrderDetail from "./pages/admin/OrderDetail";

import Customers from "./pages/admin/Customers";
import CustomerDetail from "./pages/admin/CustomerDetail";

import Reports from "./pages/admin/Reports";
import LogSecurityPage from "./pages/admin/LogSecurityPage";
import AdminManagementPage from "./pages/admin/AdminManagementPage";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />

      {/* User */}
      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        }
      />

      <Route
        path="/payment/:orderId"
        element={
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <OrderHistory />
          </PrivateRoute>
        }
      />

      <Route
        path="/track/:id"
        element={
          <PrivateRoute>
            <TrackOrder />
          </PrivateRoute>
        }
      />

      {/* Admin CRUD ของมึง */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route
          path="dashboard"
          element={
            <AdminPageRoute pageKey="dashboard">
              <Dashboard />
            </AdminPageRoute>
          }
        />

        <Route
          path="products"
          element={
            <AdminPageRoute pageKey="products">
              <ProductsAdmin />
            </AdminPageRoute>
          }
        />
        <Route
          path="products/add"
          element={
            <AdminPageRoute pageKey="products" mode="manage">
              <AddProduct />
            </AdminPageRoute>
          }
        />
        <Route
          path="products/edit/:id"
          element={
            <AdminPageRoute pageKey="products" mode="manage">
              <EditProduct />
            </AdminPageRoute>
          }
        />

        <Route
          path="categories"
          element={
            <AdminPageRoute pageKey="categories">
              <Categories />
            </AdminPageRoute>
          }
        />
        <Route
          path="categories/add"
          element={
            <AdminPageRoute pageKey="categories" mode="manage">
              <AddCategory />
            </AdminPageRoute>
          }
        />
        <Route
          path="categories/edit/:id"
          element={
            <AdminPageRoute pageKey="categories" mode="manage">
              <EditCategory />
            </AdminPageRoute>
          }
        />

        <Route
          path="orders"
          element={
            <AdminPageRoute pageKey="orders">
              <Orders />
            </AdminPageRoute>
          }
        />
        <Route
          path="orders/:id"
          element={
            <AdminPageRoute pageKey="orders">
              <OrderDetail />
            </AdminPageRoute>
          }
        />

        <Route
          path="customers"
          element={
            <AdminPageRoute pageKey="customers">
              <Customers />
            </AdminPageRoute>
          }
        />
        <Route
          path="customers/:id"
          element={
            <AdminPageRoute pageKey="customers">
              <CustomerDetail />
            </AdminPageRoute>
          }
        />

        <Route
          path="reports"
          element={
            <AdminPageRoute pageKey="reports">
              <Reports />
            </AdminPageRoute>
          }
        />
        <Route
          path="admin-management"
          element={
            <AdminPageRoute pageKey="adminManagement">
              <AdminManagementPage />
            </AdminPageRoute>
          }
        />
        <Route
          path="reports/admin-management"
          element={
            <AdminPageRoute pageKey="adminManagement">
              <AdminManagementPage />
            </AdminPageRoute>
          }
        />
        <Route
          path="logs-security"
          element={
            <AdminPageRoute pageKey="logsSecurity">
              <LogSecurityPage />
            </AdminPageRoute>
          }
        />
      </Route>

      {/* Legacy super-admin routes removed; all admin access now uses /admin */}
      {/* Route เดิมของเพื่อน */}
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <OrderManagement />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
