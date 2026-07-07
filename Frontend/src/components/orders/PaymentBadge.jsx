import { getPaymentMeta } from "../../utils/orders";

const PaymentBadge = ({ status, method }) => {
  const meta = getPaymentMeta(status);
  const methodSuffix = method ? ` · ${method}` : "";

  return (
    <span className={`tp-payment-badge tp-payment-badge--${meta.tone}`}>
      {meta.label}{methodSuffix}
    </span>
  );
};

export default PaymentBadge;
