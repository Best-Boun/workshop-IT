const ShippingCard = ({ order }) => {
  const recipient = order.shipping_name || order.customer_name || `${order.first_name || ""} ${order.last_name || ""}`.trim() || "-";

  return (
    <div className="tp-detail-card">
      <div className="tp-detail-card__title">Shipping Information</div>
      <div className="tp-detail-grid">
        <div>
          <div className="tp-detail-label">Recipient</div>
          <div className="tp-detail-value">{recipient}</div>
        </div>
        <div>
          <div className="tp-detail-label">Phone Number</div>
          <div className="tp-detail-value">{order.shipping_phone || "-"}</div>
        </div>
        <div className="tp-detail-grid__full">
          <div className="tp-detail-label">Shipping Address</div>
          <div className="tp-detail-value" style={{ whiteSpace: "pre-line" }}>{order.shipping_address || "-"}</div>
        </div>
        <div>
          <div className="tp-detail-label">Country</div>
          <div className="tp-detail-value">{order.shipping_country || "-"}</div>
        </div>
      </div>
    </div>
  );
};

export default ShippingCard;
