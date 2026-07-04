import { useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import GoogleButton from "../components/GoogleButton";
import "../css/Login.css";

const Login = () => {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.identifier.trim()) {
      next.identifier = "Email or username is required";
    } else if (
      !/^\S+@\S+\.\S+$/.test(form.identifier) &&
      form.identifier.includes("@")
    ) {
      next.identifier = "Please enter a valid email address";
    }

    if (!form.password) {
      next.password = "Password is required";
    } else if (form.password.length < 8) {
      next.password = "Password must be at least 8 characters";
    }

    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validate();
    setErrors(validation);

    if (Object.keys(validation).length !== 0) return;

    try {
      setLoading(true);
      setStatus(null);

      const res = await api.post("/auth/login", {
        email: form.identifier,
        password: form.password,
      });

      // เก็บข้อมูล Login
      if (form.remember) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
      }

      setStatus({
        type: "success",
        message: "Login successful!",
      });

      setTimeout(() => {
        const role = res.data.user.role;

        if (role === "superadmin") {
          window.location.href = "/superadmin";
        } else if (role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/";
        }
      }, 800);
    } catch (err) {
      setStatus({
        type: "danger",
        message: err.response?.data?.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      description="Sign in to manage your orders, saved builds, and warranty information."
    >
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="identifier" className="form-label fw-semibold">
            Email
          </label>
          <input
            type="text"
            className={`form-control form-control-lg rounded-pill shadow-sm ${errors.identifier ? "is-invalid" : ""}`}
            id="identifier"
            placeholder="Enter your Email"
            value={form.identifier}
            onChange={(e) => setForm({ ...form, identifier: e.target.value })}
          />
          <div className="invalid-feedback">{errors.identifier}</div>
        </div>

        <PasswordInput
          label="Password"
          id="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4 gap-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="remember"
              checked={form.remember}
              onChange={(e) => setForm({ ...form, remember: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="remember">
              Remember me
            </label>
          </div>
          <a href="#" className="text-primary fw-semibold text-decoration-none">
            Forgot password?
          </a>
        </div>

        {status && (
          <div
            className={`alert ${status.type === "success" ? "alert-success" : "alert-danger"} rounded-4`}
          >
            {status.message}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-lg w-100 rounded-pill mb-3"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="divider mb-3">
          <center>OR</center>
        </div>

        <GoogleButton label="Continue with Google" />
      </form>

      <div className="text-center text-muted">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="text-primary fw-semibold text-decoration-none"
        >
          Register
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
