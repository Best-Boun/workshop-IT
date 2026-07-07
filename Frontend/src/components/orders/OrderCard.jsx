import OrderStatusBadge from "./OrderStatusBadge";
import PaymentBadge from "./PaymentBadge";
import {
  formatCurrency,
  formatOrderDate,
  getAdditionalItemCount,
  getItemDisplayName,
  getItemImageUrl,
  getPrimaryOrderItem,
} from "../../utils/orders";

const OrderCard = ({ order, onViewDetails, onBuyAgain }) => {
  const primaryItem = getPrimaryOrderItem(order.items);
  const extraCount = getAdditionalItemCount(order.items);
  const imageUrl = getItemImageUrl(primaryItem);

  return (
    <article className="tp-order-card">
      <div className="tp-order-card__left">
        <div className="tp-order-card__meta">
          <div className="tp-order-card__number">Order #{order.id}</div>
          <div className="tp-order-card__date">{formatOrderDate(order.created_at)}</div>
        </div>

        <div className="tp-order-card__item">
          <div className="tp-order-card__thumb-wrap">
            {imageUrl ? (
              <img src={imageUrl} alt={getItemDisplayName(primaryItem)} className="tp-order-card__thumb" />
            ) : (
              <div className="tp-order-card__thumb tp-order-card__thumb--placeholder">No Image</div>
            )}
          </div>

          <div className="tp-order-card__item-copy">
            <div className="tp-order-card__item-name">{getItemDisplayName(primaryItem)}</div>
            <div className="tp-order-card__item-qty">
              Qty {primaryItem?.quantity || 0}
              {extraCount > 0 ? ` · +${extraCount} more item${extraCount > 1 ? "s" : ""}` : ""}
            </div>
          </div>
        </div>
      </div>

      <div className="tp-order-card__center">
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="tp-order-card__right">
        <div className="tp-order-card__total">{formatCurrency(order.total_amount)}</div>
        <PaymentBadge status={order.payment?.status || order.payment_status} method={order.payment?.payment_method || order.payment_method} />

        <div className="tp-order-card__actions">
          <button type="button" className="btn btn-primary rounded-pill px-4" onClick={onViewDetails}>
            View Details
          </button>
          {String(order.status || "").toLowerCase() === "delivered" && (
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onBuyAgain}>
              Buy Again
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default OrderCard;
