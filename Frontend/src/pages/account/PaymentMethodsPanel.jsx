import { useNavigate } from "react-router-dom";

const cardStyle = {
  border: "1px solid #e2e8f0",
};

const integrationBlocks = [
  {
    key: "card-tokenization",
    title: "Card Tokenization",
    detail: "Prepare secure token references instead of storing raw card data.",
  },
  {
    key: "wallet-support",
    title: "Digital Wallets",
    detail: "Ready for Apple Pay, Google Pay, and regional wallet providers.",
  },
  {
    key: "default-method",
    title: "Default Payment",
    detail: "Support selecting a default method for one-click checkout.",
  },
  {
    key: "billing-profiles",
    title: "Billing Profiles",
    detail: "Structure prepared for billing address and tax metadata.",
  },
];

const PaymentMethodsPanel = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h2 className="h4 fw-bold mb-1">Payment Methods</h2>
          <p className="text-muted mb-0">
            Manage your saved payment options for faster and safer checkout.
          </p>
        </div>

        <button type="button" className="btn btn-primary rounded-pill px-4" disabled>
          + Add Payment Method
        </button>
      </div>

      <div className="card border-0 rounded-4 shadow-sm mb-3" style={cardStyle}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h3 className="h6 fw-bold mb-0">Saved Methods</h3>
            <span className="badge rounded-pill text-bg-light">0 Methods</span>
          </div>

          <div className="alert alert-light border rounded-4 mb-3" style={{ borderColor: "#e2e8f0" }}>
            <div className="d-flex align-items-start gap-3">
              <div style={{ fontSize: "1.35rem", lineHeight: 1 }}>💳</div>
              <div>
                <div className="fw-semibold text-dark">No payment methods saved yet</div>
                <div className="text-muted small">
                  Payment method management is planned for a future release. This screen is already
                  structured for add, remove, update, and set-default operations.
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-4 overflow-hidden" style={{ borderColor: "#e2e8f0" }}>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="text-nowrap">Type</th>
                    <th scope="col" className="text-nowrap">Provider</th>
                    <th scope="col" className="text-nowrap">Masked Details</th>
                    <th scope="col" className="text-nowrap">Expiry</th>
                    <th scope="col" className="text-nowrap">Default</th>
                    <th scope="col" className="text-nowrap text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      Saved payment methods will appear here once integration is enabled.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <button type="button" className="btn btn-outline-primary rounded-pill px-4" onClick={() => navigate("/products")}>
              Browse Products
            </button>
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate("/my-account/personal-information")}>
              Back to Personal Information
            </button>
          </div>
        </div>
      </div>

      <div className="card border-0 rounded-4 shadow-sm" style={cardStyle}>
        <div className="card-body p-4">
          <h3 className="h6 fw-bold mb-2">Future Integration Blueprint</h3>
          <div className="row g-2">
            {integrationBlocks.map((block) => (
              <div key={block.key} className="col-12 col-md-6">
                <div className="border rounded-3 p-3 bg-light-subtle h-100">
                  <div className="fw-semibold text-dark">{block.title}</div>
                  <div className="small text-muted mt-1">{block.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentMethodsPanel;
