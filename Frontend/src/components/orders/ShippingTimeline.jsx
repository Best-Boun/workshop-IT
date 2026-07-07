import { normalizeStatus } from "../../utils/orders";

const steps = [
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const ShippingTimeline = ({ status }) => {
  const normalized = normalizeStatus(status);
  const currentIndex = steps.findIndex((step) => step.key === normalized);

  return (
    <div className="tp-shipping-timeline" id="shipping-timeline">
      {steps.map((step, index) => {
        const isComplete = currentIndex >= 0 && index < currentIndex;
        const isActive = index === currentIndex;
        const isFuture = currentIndex >= 0 ? index > currentIndex : true;

        return (
          <div className="tp-shipping-timeline__step" key={step.key}>
            <div className={`tp-shipping-timeline__marker ${isComplete ? "is-complete" : ""} ${isActive ? "is-active" : ""} ${isFuture ? "is-future" : ""}`}>
              {isComplete ? "✓" : index + 1}
            </div>
            <div className="tp-shipping-timeline__content">
              <div className={`tp-shipping-timeline__title ${isActive ? "is-active" : ""}`}>{step.label}</div>
              <div className="tp-shipping-timeline__caption">
                {isComplete ? "Completed" : isActive ? "Current status" : "Waiting"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShippingTimeline;
