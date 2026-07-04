import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyProfile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const hasRequiredNames = useMemo(() => {
    return form.first_name.trim() !== "" && form.last_name.trim() !== "";
  }, [form.first_name, form.last_name]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/users/profile");
        const profile = res.data?.data || {};

        setForm({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          email: profile.email || "",
          phone: String(profile.phone || "").replace(/\D/g, "").slice(0, 10),
          address: profile.address || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!hasRequiredNames) {
      showToast("danger", "First name and last name are required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      };

      const res = await api.put("/users/profile", payload);
      const updated = res.data?.data || {};

      setForm((prev) => ({
        ...prev,
        first_name: updated.first_name || prev.first_name,
        last_name: updated.last_name || prev.last_name,
        phone: updated.phone || "",
        address: updated.address || "",
      }));

      const storageKey = localStorage.getItem("user") ? "localStorage" : "sessionStorage";
      const storage = window[storageKey];
      const rawUser = storage.getItem("user");

      if (rawUser) {
        try {
          const parsed = JSON.parse(rawUser);
          storage.setItem(
            "user",
            JSON.stringify({
              ...parsed,
              first_name: updated.first_name || parsed.first_name,
              last_name: updated.last_name || parsed.last_name,
            }),
          );
        } catch {
          // Keep backward compatibility if stored user shape is unexpected.
        }
      }

      showToast("success", "Profile updated successfully");
    } catch (err) {
      showToast("danger", err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />

      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #2563eb 60%, #0ea5e9 100%)",
          padding: "3rem 0 2.5rem",
          color: "#fff",
        }}
      >
        <div className="container">
          <div
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.72)",
              marginBottom: "0.35rem",
            }}
          >
            TechPulse · Account
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.25rem" }}>
            My Profile
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem", marginBottom: 0 }}>
            Manage your personal information
          </p>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: 900 }}>
        <button
          className="btn btn-outline-secondary btn-sm rounded-pill mb-4"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : error ? (
          <div className="alert alert-danger rounded-4">{error}</div>
        ) : (
          <div className="card border-0 rounded-4 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
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

                  <div className="col-12">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control rounded-3 bg-light"
                      value={form.email}
                      readOnly
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

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control rounded-3"
                      placeholder="Enter your address"
                      value={form.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-semibold"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />

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
    </div>
  );
};

export default MyProfile;
