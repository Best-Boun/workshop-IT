import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
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
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderHistory from "./pages/OrderHistory";
import TrackOrder from "./pages/TrackOrder";
import OrderManagement from "./pages/OrderManagement";
import { PrivateRoute, AdminRoute } from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart />} />

      {/* Protected routes (login required) */}
      <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
      <Route path="/payment/:orderId" element={<PrivateRoute><Payment /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
      <Route path="/track/:id" element={<PrivateRoute><TrackOrder /></PrivateRoute>} />

      {/* Admin routes (admin/superadmin only) */}
      <Route path="/admin/orders" element={<AdminRoute><OrderManagement /></AdminRoute>} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
        <Route index element={<Navigate to="overview" replace />} />
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
    </Routes>
  );
}

export default App;
