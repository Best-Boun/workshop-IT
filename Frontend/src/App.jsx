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

import {
  PrivateRoute,
  AdminRoute,
  SuperAdminRoute,
} from "./components/PrivateRoute";
import ScrollToTop from "./components/ScrollToTop";

// ===== เพื่อน =====
import AdminDashboard from "./pages/admin/AdminDashboard";
import OverviewPage from "./pages/admin/OverviewPage";
import SalesAnalyticsPage from "./pages/admin/SalesAnalyticsPage";
import OrderManagementPage from "./pages/admin/OrderManagementPage";
import TopProductsPage from "./pages/admin/TopProductsPage";
import InventoryPage from "./pages/admin/InventoryPage";
import CustomerAnalyticsPage from "./pages/admin/CustomerAnalyticsPage";
import PaymentPage from "./pages/admin/PaymentPage";
import ReportsPage from "./pages/admin/ReportsPage";
import AdminManagementPage from "./pages/admin/AdminManagementPage";

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

function App() {
  return (
    <>
      <ScrollToTop />

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
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="products" element={<ProductsAdmin />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />

          <Route path="categories" element={<Categories />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />

          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />

          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<CustomerDetail />} />

          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Dashboard เดิมของเพื่อน (เก็บไว้ก่อน) */}
        <Route
          path="/superadmin"
          element={
            <SuperAdminRoute>
              <AdminDashboard />
            </SuperAdminRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="sales" element={<SalesAnalyticsPage />} />
          <Route path="orders" element={<OrderManagementPage />} />
          <Route path="top-products" element={<TopProductsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="customers" element={<CustomerAnalyticsPage />} />
          <Route path="payments" element={<PaymentPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="admin-management" element={<AdminManagementPage />} />
        </Route>

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
    </>
  );
}

export default App;
