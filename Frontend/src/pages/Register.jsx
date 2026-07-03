import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
        first_name: formState.first_name,
        last_name: formState.last_name,
        email: formState.email,
        password: formState.password,
      });

      alert("Register successful");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      description="Register once to unlock order tracking, saved builds, and support tools."
    >
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label fw-semibold">
            First name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
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
            {loading ? "Creating account..." : "Create account"}
          </button>

          <GoogleButton label="Continue with Google" />
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
