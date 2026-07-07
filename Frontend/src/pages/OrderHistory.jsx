import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderCard from "../components/orders/OrderCard";
import "../css/OrderHistory.css";
import "../css/OrdersModule.css";
import {
  getItemDisplayName,
  getPrimaryOrderItem,
  normalizeStatus,
} from "../utils/orders";

const STATUS_TABS = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];
const PAGE_SIZE = 6;

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/orders/my");
        const summaries = res.data?.data || [];
        const detailResults = await Promise.allSettled(
          summaries.map((order) => api.get(`/orders/${order.id}`)),
        );

        const enrichedOrders = summaries.map((order, index) => {
          const detail =
            detailResults[index]?.status === "fulfilled"
              ? detailResults[index].value.data?.data
              : null;

          return {
            ...order,
            items: detail?.items || [],
            payment: detail?.payment || null,
            shipping_name: detail?.shipping_name || order.shipping_name,
            shipping_phone: detail?.shipping_phone || order.shipping_phone,
            shipping_address: detail?.shipping_address || order.shipping_address,
          };
        });

        setOrders(enrichedOrders);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    let nextOrders = orders.filter((order) => {
      if (statusFilter === "all") return true;
      return normalizeStatus(order.status) === statusFilter;
    });

    if (query) {
      nextOrders = nextOrders.filter((order) => {
        const itemNames = (order.items || []).map((item) => getItemDisplayName(item).toLowerCase());
        const searchable = [
          String(order.id),
          order.transaction_id || "",
          order.shipping_name || "",
          order.payment_method || "",
          ...itemNames,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(query);
      });
    }

    nextOrders.sort((left, right) => {
      if (sortBy === "oldest") {
        return new Date(left.created_at) - new Date(right.created_at);
      }

      if (sortBy === "highest") {
        return Number(right.total_amount || 0) - Number(left.total_amount || 0);
      }

      if (sortBy === "lowest") {
        return Number(left.total_amount || 0) - Number(right.total_amount || 0);
      }

      return new Date(right.created_at) - new Date(left.created_at);
    });

    return nextOrders;
  }, [orders, searchTerm, sortBy, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [searchTerm, sortBy, statusFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleBuyAgain = (order) => {
    const primaryItem = getPrimaryOrderItem(order.items);

    if (primaryItem?.product_id) {
      navigate(`/products/${primaryItem.product_id}`);
      return;
    }

    navigate("/products");
  };

  return (
    <div className="history-page">
      <Navbar />

      <div className="history-hero">
        <div className="container">
          <div className="history-hero-label">TechPulse · Account</div>
          <h1>My Orders</h1>
          {!loading && !error && (
            <p className="mb-0 mt-1" style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem" }}>
              {orders.length} total order{orders.length !== 1 ? "s" : ""} · Manage and track your purchases.
            </p>
          )}
        </div>
      </div>

      <div className="history-main">
        <div className="container" style={{ maxWidth: 1180 }}>
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : error ? (
            <div className="alert alert-danger rounded-3">{error}</div>
          ) : (
            <>
              <div className="tp-orders-toolbar">
                <div className="tp-orders-toolbar__search">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search orders"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>

                <div className="tp-orders-toolbar__tabs" role="tablist" aria-label="Order status filters">
                  {STATUS_TABS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`tp-orders-toolbar__tab ${statusFilter === status ? "is-active" : ""}`}
                      onClick={() => setStatusFilter(status)}
                    >
                      {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="tp-orders-toolbar__sort">
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Price</option>
                    <option value="lowest">Lowest Price</option>
                  </select>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="tp-orders-empty">
                  <div className="tp-orders-empty__icon">📦</div>
                  <h4 className="fw-bold text-dark mb-2">No Orders Yet</h4>
                  <p className="text-muted mb-4">
                    When you place your first order, it will appear here for tracking and follow-up.
                  </p>
                  <button
                    className="btn btn-primary rounded-pill px-5"
                    onClick={() => navigate("/products")}
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <>
                  {paginatedOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onViewDetails={() => navigate(`/track/${order.id}`)}
                      onBuyAgain={() => handleBuyAgain(order)}
                    />
                  ))}

                  {totalPages > 1 && (
                    <div className="tp-pagination">
                      <button
                        type="button"
                        className="tp-pagination__btn"
                        disabled={page === 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      >
                        Prev
                      </button>
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          type="button"
                          className={`tp-pagination__btn ${page === pageNumber ? "is-active" : ""}`}
                          onClick={() => setPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="tp-pagination__btn"
                        disabled={page === totalPages}
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderHistory;
