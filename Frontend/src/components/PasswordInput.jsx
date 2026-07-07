import { useState } from "react";

const PasswordInput = ({
  label,
  id,
  name,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {label}
      </label>

      <div className="input-group input-group-lg shadow-sm">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          className={`form-control ${error ? "is-invalid" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          title={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <i className="bi bi-eye-fill"></i>
          ) : (
            <i className="bi bi-eye-slash-fill"></i>
          )}
        </button>
      </div>

      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default PasswordInput;
