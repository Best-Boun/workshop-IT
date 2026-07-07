import { formatCurrency, getOrderSubtotal, getShippingFee } from "../../utils/orders";

const OrderSummaryCard = ({ order }) => {
  const subtotal = getOrderSubtotal(order);
  const shippingFee = getShippingFee(order);
  const discount = 0;
  const total = Number(order.total_amount || 0);

  return (
    <div className="tp-detail-card">
      <div className="tp-detail-card__title">Order Summary</div>
      <div className="tp-summary-row">
        <span>Subtotal</span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>
      <div className="tp-summary-row">
        <span>Shipping Fee</span>
        <strong>{formatCurrency(shippingFee)}</strong>
      </div>
      <div className="tp-summary-row">
        <span>Discount</span>
        <strong>{formatCurrency(discount)}</strong>
      </div>
      <div className="tp-summary-row tp-summary-row--grand">
        <span>Grand Total</span>
        <strong>{formatCurrency(total)}</strong>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
