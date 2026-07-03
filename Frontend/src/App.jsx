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
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderHistory from "./pages/OrderHistory";
import TrackOrder from "./pages/TrackOrder";
import OrderManagement from "./pages/OrderManagement";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment/:orderId" element={<Payment />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/track/:id" element={<TrackOrder />} />
      <Route path="/admin/orders" element={<OrderManagement />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="sales" element={<SalesAnalyticsPage />} />
        <Route path="orders" element={<OrderManagementPage />} />
        <Route path="top-products" element={<TopProductsPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="customers" element={<CustomerAnalyticsPage />} />
        <Route path="payments" element={<PaymentPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
