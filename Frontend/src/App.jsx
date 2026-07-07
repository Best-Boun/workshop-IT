import { Routes, Route, Navigate } from "react-router-dom";

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
import MyProfile from "./pages/MyProfile";
import MyAccount from "./pages/MyAccount";
import AccountPlaceholder from "./pages/account/AccountPlaceholder";
import LoginSecurity from "./pages/account/LoginSecurity";
import MyAddresses from "./pages/account/MyAddresses";
import PaymentMethodsPanel from "./pages/account/PaymentMethodsPanel";

import {
  PrivateRoute,
  AdminRoute,
} from "./components/PrivateRoute";
import ScrollToTop from "./components/ScrollToTop";

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

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MyProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-account"
          element={
            <PrivateRoute>
              <MyAccount />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="personal-information" replace />} />
          <Route path="personal-information" element={<MyProfile embedded />} />
          <Route
            path="addresses"
            element={<MyAddresses />}
          />
          <Route
            path="payment-methods"
            element={<PaymentMethodsPanel />}
          />
          <Route path="login-security" element={<LoginSecurity embedded />} />
        </Route>

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Navigate to="/my-account" replace />
            </PrivateRoute>
          }
        />

        <Route
          path="/account/wishlist"
          element={
            <PrivateRoute>
              <AccountPlaceholder
                title="Wishlist"
                description="Save products you love and revisit them later. Wishlist management is planned for a future release and will support seamless sync across devices."
              />
            </PrivateRoute>
          }
        />

        <Route
          path="/account/returns-refunds"
          element={
            <PrivateRoute>
              <AccountPlaceholder
                title="Returns & Refunds"
                description="Track return requests and refund statuses in one place. This module is planned for an upcoming release with full order-level integration."
              />
            </PrivateRoute>
          }
        />

        <Route
          path="/account/addresses"
          element={
            <PrivateRoute>
              <Navigate to="/my-account/addresses" replace />
            </PrivateRoute>
          }
        />

        <Route
          path="/account/payment-methods"
          element={
            <PrivateRoute>
              <Navigate to="/my-account/payment-methods" replace />
            </PrivateRoute>
          }
        />

        <Route
          path="/account/login-security"
          element={
            <PrivateRoute>
              <Navigate to="/my-account/login-security" replace />
            </PrivateRoute>
          }
        />

        <Route
          path="/account/help-centre"
          element={
            <PrivateRoute>
              <AccountPlaceholder
                title="Help Centre"
                description="Find account and order support resources quickly. A full support centre with searchable content is planned for an upcoming release."
              />
            </PrivateRoute>
          }
        />

        <Route
          path="/account/about-techpulse"
          element={
            <PrivateRoute>
              <AccountPlaceholder
                title="About TechPulse"
                description="Learn more about our mission, product quality standards, and customer-first service approach. Expanded company information is planned for a future release."
              />
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
          <Route path="admin-management" element={<AdminManagementPage />} />
          <Route path="logs-security" element={<LogSecurityPage />} />
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
