import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

const cardStyle = {
  border: "1px solid #e2e8f0",
};

const MyAddresses = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
  });
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const hasAddress = useMemo(() => {
    return profile.address.trim() !== "";
  }, [profile.address]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/users/profile");
        const data = res.data?.data || {};

        const nextProfile = {
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone: data.phone ? String(data.phone) : "",
          address: data.address || "",
        };

        setProfile(nextProfile);
        setForm(nextProfile);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load addresses");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "phone") {
      const nextPhone = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, phone: nextPhone }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartEdit = () => {
    setForm(profile);
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setForm(profile);
    setEditing(false);
  };

  const handleSave = async () => {
    if (!form.first_name.trim() || !form.last_name.trim()) {
      showToast("danger", "First name and last name are required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: String(form.phone || "").trim(),
        address: form.address.trim(),
      };

      const res = await api.put("/users/profile", payload);
      const updated = res.data?.data || {};

      const nextProfile = {
        first_name: updated.first_name || payload.first_name,
        last_name: updated.last_name || payload.last_name,
        phone: updated.phone ? String(updated.phone) : payload.phone,
        address: updated.address || "",
      };

      setProfile(nextProfile);
      setForm(nextProfile);
      setEditing(false);
      showToast("success", res.data?.message || "Profile updated successfully");
    } catch (err) {
      showToast("danger", err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h2 className="h4 fw-bold mb-1">My Addresses</h2>
          <p className="text-muted mb-0">
            Manage your default shipping address.
          </p>
        </div>
      </div>

      <p className="text-muted mb-4" style={{ maxWidth: 720 }}>
        Your default shipping address will automatically be used during checkout.
        You can update it at any time before placing a new order.
      </p>

      <div className="card border-0 rounded-4 shadow-sm" style={cardStyle}>
        <div className="card-body p-4">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : error ? (
            <div className="alert alert-danger rounded-4 mb-0">{error}</div>
          ) : !hasAddress && !editing ? (
            <div className="text-center py-4 py-md-5">
              <div style={{ fontSize: "2.75rem", marginBottom: "0.75rem" }}>📍</div>
              <h3 className="h5 fw-bold text-dark mb-2">No shipping address added yet</h3>
              <p className="text-muted mb-4" style={{ maxWidth: 540, margin: "0 auto" }}>
                Add your default shipping address to speed up checkout and keep your delivery details ready for your next order.
              </p>
              <button
                type="button"
                className="btn btn-primary rounded-pill px-4"
                onClick={handleStartEdit}
              >
                Add Address
              </button>
            </div>
          ) : editing ? (
            <>
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                <div>
                  <h3 className="h5 fw-bold mb-1">Edit Shipping Address</h3>
                  <p className="text-muted mb-0">Update your delivery details for future orders.</p>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    className="form-control rounded-3"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    className="form-control rounded-3"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control rounded-3"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={handleChange}
                    inputMode="numeric"
                    maxLength={10}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Shipping Address</label>
                  <textarea
                    name="address"
                    className="form-control rounded-3"
                    rows={4}
                    placeholder="Enter your shipping address"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 flex-wrap">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                <div>
                  <h3 className="h5 fw-bold mb-1">Default Shipping Address</h3>
                  <p className="text-muted mb-0">This address will be used automatically during checkout.</p>
                </div>
              </div>

              <div className="rounded-4 p-4" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <div className="small text-uppercase fw-semibold text-muted mb-2" style={{ letterSpacing: "0.08em" }}>
                      Recipient
                    </div>
                    <div className="fw-bold text-dark">
                      {profile.first_name} {profile.last_name}
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="small text-uppercase fw-semibold text-muted mb-2" style={{ letterSpacing: "0.08em" }}>
                      Phone Number
                    </div>
                    <div className="text-dark">{profile.phone || "-"}</div>
                  </div>

                  <div className="col-12">
                    <div className="small text-uppercase fw-semibold text-muted mb-2" style={{ letterSpacing: "0.08em" }}>
                      Shipping Address
                    </div>
                    <div className="text-dark" style={{ whiteSpace: "pre-line" }}>
                      {profile.address}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="btn btn-outline-primary rounded-pill px-4"
                  onClick={handleStartEdit}
                >
                  Edit Address
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {toast && (
        <div
          className={`alert ${toast.type === "success" ? "alert-success" : "alert-danger"} rounded-3 shadow-sm`}
          style={{
            position: "fixed",
            right: "1rem",
            bottom: "1rem",
            zIndex: 9999,
            minWidth: 260,
            margin: 0,
          }}
          role="alert"
        >
          {toast.message}
        </div>
      )}
    </>
  );
};

export default MyAddresses;
