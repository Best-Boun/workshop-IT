export const normalizeStatus = (status) => String(status || "").toLowerCase();

export const formatStatusLabel = (status) => {
  const normalized = normalizeStatus(status);

  if (!normalized) return "Unknown";

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export const formatCurrency = (amount) => {
  return `฿${Number(amount || 0).toLocaleString()}`;
};

export const formatOrderDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("th-TH");
};

export const getPaymentMeta = (status) => {
  const normalized = normalizeStatus(status);

  if (normalized === "completed") {
    return { label: "Paid", tone: "success" };
  }

  if (normalized === "refunded") {
    return { label: "Refunded", tone: "info" };
  }

  if (normalized === "failed") {
    return { label: "Payment Failed", tone: "danger" };
  }

  return { label: "Pending Payment", tone: "warning" };
};

export const getPrimaryOrderItem = (items = []) => {
  return Array.isArray(items) && items.length > 0 ? items[0] : null;
};

export const getAdditionalItemCount = (items = []) => {
  return Math.max((Array.isArray(items) ? items.length : 0) - 1, 0);
};

export const getItemDisplayName = (item) => {
  return item?.product_name || item?.name || "Product";
};

export const getItemImageUrl = (item) => {
  const image = item?.product_image || item?.image;
  return image ? `http://localhost:5000/uploads/${image}` : "";
};

export const getOrderSubtotal = (order) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  return items.reduce((sum, item) => sum + Number(item.subtotal || (item.price * item.quantity) || 0), 0);
};

export const getShippingFee = (order) => {
  const total = Number(order?.total_amount || 0);
  const subtotal = getOrderSubtotal(order);
  return Math.max(total - subtotal, 0);
};

export const getEstimatedDeliveryLabel = (status) => {
  const normalized = normalizeStatus(status);

  if (normalized === "delivered") return "Delivered";
  if (normalized === "shipped") return "Arriving soon";
  if (normalized === "processing") return "Preparing shipment";
  if (normalized === "cancelled") return "Unavailable";

  return "To be confirmed";
};
