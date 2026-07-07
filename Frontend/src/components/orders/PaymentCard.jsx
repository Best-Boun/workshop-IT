import PaymentBadge from "./PaymentBadge";

const PaymentCard = ({ payment }) => {
  return (
    <div className="tp-detail-card">
      <div className="tp-detail-card__title">Payment Information</div>
      {payment ? (
        <div className="tp-detail-grid">
          <div>
            <div className="tp-detail-label">Payment Method</div>
            <div className="tp-detail-value">{payment.payment_method || "-"}</div>
          </div>
          <div>
            <div className="tp-detail-label">Payment Status</div>
            <div className="tp-detail-value"><PaymentBadge status={payment.status} /></div>
          </div>
          <div className="tp-detail-grid__full">
            <div className="tp-detail-label">Transaction ID</div>
            <div className="tp-detail-value tp-detail-value--wrap">{payment.transaction_id || "-"}</div>
          </div>
          <div>
            <div className="tp-detail-label">Payment Date</div>
            <div className="tp-detail-value">{payment.paid_at ? new Date(payment.paid_at).toLocaleString("th-TH") : "-"}</div>
          </div>
        </div>
      ) : (
        <div className="text-muted small">No payment record</div>
      )}
    </div>
  );
};

export default PaymentCard;
