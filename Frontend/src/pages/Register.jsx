import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";
import GoogleButton from "../components/GoogleButton";
import PasswordInput from "../components/PasswordInput";
import "../css/Auth.css";
import "../css/Register.css";

const Register = () => {
  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!formState.first_name.trim()) {
      validationErrors.first_name = "Please enter your first name.";
    }

    if (!formState.last_name.trim()) {
      validationErrors.last_name = "Please enter your last name.";
    }

    if (!formState.email.trim()) {
      validationErrors.email = "Please provide a valid email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      validationErrors.email = "Please enter a valid email address.";
    }

    if (!formState.password) {
      validationErrors.password = "Create a strong password.";
    } else if (formState.password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters.";
    }

    if (!formState.confirmPassword) {
      validationErrors.confirmPassword = "Please confirm your password.";
    } else if (formState.confirmPassword !== formState.password) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    return validationErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        first_name: formState.first_name.trim(),
        last_name: formState.last_name.trim(),
        email: formState.email.trim(),
        password: formState.password,
      });

      await Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Your account has been created successfully.",
        confirmButtonColor: "#0d6efd",
      });

      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || "Register failed",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      description="Register once to unlock order tracking, saved builds, and support tools."
    >
      <div className="mb-3">
        <Link to="/" className="btn btn-outline-secondary rounded-pill px-3">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Home
        </Link>
      </div>

      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label fw-semibold">
            First name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            autoFocus
            autoComplete="given-name"
            className={`form-control form-control-lg rounded-pill shadow-sm ${
              errors.first_name ? "is-invalid" : ""
            }`}
            placeholder="Enter your first name"
            value={formState.first_name}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.first_name}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="last_name" className="form-label fw-semibold">
            Last name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            className={`form-control form-control-lg rounded-pill shadow-sm ${
              errors.last_name ? "is-invalid" : ""
            }`}
            placeholder="Enter your last name"
            value={formState.last_name}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.last_name}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`form-control form-control-lg rounded-pill shadow-sm ${
              errors.email ? "is-invalid" : ""
            }`}
            placeholder="you@example.com"
            value={formState.email}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.email}</div>
        </div>

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          value={formState.password}
          onChange={(e) =>
            handleChange({
              target: {
                name: "password",
                value: e.target.value,
              },
            })
          }
          error={errors.password}
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          value={formState.confirmPassword}
          onChange={(e) =>
            handleChange({
              target: {
                name: "confirmPassword",
                value: e.target.value,
              },
            })
          }
          error={errors.confirmPassword}
        />

        <p className="password-policy small mb-4">
          Use at least 8 characters, including uppercase, lowercase, numbers,
          and a special character.
        </p>

        <div className="d-grid gap-3 register-cta mb-3">
          <button
            type="submit"
            className="btn btn-primary btn-lg rounded-pill"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>

          <GoogleButton label="Continue with Google" disabled={loading} />
        </div>

        <div className="text-center text-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary fw-semibold text-decoration-none"
          >
            Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
