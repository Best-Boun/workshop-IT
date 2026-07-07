import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PasswordInput from "../../components/PasswordInput";

const LoginSecurity = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      form.currentPassword.length >= 8 &&
      form.newPassword.length >= 8 &&
      form.confirmPassword.length >= 8
    );
  }, [form.currentPassword, form.newPassword, form.confirmPassword]);

  const validate = () => {
    const next = {};

    if (!form.currentPassword) {
      next.currentPassword = "Current password is required";
    }

    if (!form.newPassword) {
      next.newPassword = "New password is required";
    } else if (form.newPassword.length < 8) {
      next.newPassword = "New password must be at least 8 characters";
    } else if (form.newPassword === form.currentPassword) {
      next.newPassword = "New password must be different from current password";
    }

    if (!form.confirmPassword) {
      next.confirmPassword = "Please confirm your new password";
    } else if (form.confirmPassword !== form.newPassword) {
      next.confirmPassword = "Confirm password does not match new password";
    }

    return next;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validate();
    setErrors(validation);
    setStatus(null);

    if (Object.keys(validation).length !== 0) {
      return;
    }

    try {
      setSaving(true);

      const res = await api.put("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      setStatus({
        type: "success",
        message: res.data?.message || "Password updated successfully",
      });

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      const validationErrors = err.response?.data?.errors;

      if (Array.isArray(validationErrors)) {
        const mapped = {};

        validationErrors.forEach((item) => {
          if (item.path && !mapped[item.path]) {
            mapped[item.path] = item.msg;
          }
        });

        setErrors(mapped);
      }

      setStatus({
        type: "danger",
        message: err.response?.data?.message || "Unable to update password",
      });
    } finally {
      setSaving(false);
    }
  };

  const content = (
    <>
      {embedded && (
        <div className="mb-3">
          <h2 className="h4 fw-bold mb-1">Login & Security</h2>
          <p className="text-muted mb-0">Update your password to keep your account secure.</p>
        </div>
      )}

      <div className="card border-0 rounded-4 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
        <div className="card-body p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
            <div>
              <h2 className="h4 fw-bold mb-1">Password Settings</h2>
              <p className="text-muted mb-0">Use at least 8 characters and avoid reusing old passwords.</p>
            </div>
            {!embedded && (
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill"
                onClick={() => navigate("/my-account")}
              >
                Back to My Account
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate>
              <PasswordInput
                label="Current Password"
                id="currentPassword"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                error={errors.currentPassword}
                placeholder="Enter your current password"
                autoComplete="current-password"
              />

              <PasswordInput
                label="New Password"
                id="newPassword"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
                placeholder="Enter a new password"
                autoComplete="new-password"
              />

              <PasswordInput
                label="Confirm New Password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="Re-enter your new password"
                autoComplete="new-password"
              />

              {status && (
                <div
                  className={`alert ${status.type === "success" ? "alert-success" : "alert-danger"} rounded-4`}
                >
                  {status.message}
                </div>
              )}

            <div className="d-flex flex-wrap gap-2 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-4"
                  disabled={saving || !canSubmit}
                >
                  {saving ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary rounded-pill px-4"
                  onClick={() => navigate("/products")}
                >
                  Browse Products
                </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );

  if (embedded) {
    return content;
  }

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
            TechPulse · My Account
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.25rem" }}>
            Login & Security
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem", marginBottom: 0 }}>
            Update your password to keep your account secure
          </p>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: 860 }}>
        {content}
      </div>

      <Footer />
    </div>
  );
};

export default LoginSecurity;
