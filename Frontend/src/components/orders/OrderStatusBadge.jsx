import { formatStatusLabel, normalizeStatus } from "../../utils/orders";

const statusToneMap = {
  pending: "pending",
  processing: "processing",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
};

const OrderStatusBadge = ({ status }) => {
  const normalized = normalizeStatus(status);
  const tone = statusToneMap[normalized] || "neutral";

  return (
    <span className={`tp-order-badge tp-order-badge--${tone}`}>
      {formatStatusLabel(status)}
    </span>
  );
};

export default OrderStatusBadge;
