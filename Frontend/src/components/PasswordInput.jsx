import { useState } from "react";

const PasswordInput = ({
  label,
  id,
  name,
  value,
  onChange,
  error,
  placeholder,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {label}
      </label>

      <div className="input-group input-group-lg shadow-sm">
        <input
          type={visible ? "text" : "password"}
          className={`form-control ${error ? "is-invalid" : ""}`}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <i
            className={visible ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}
          ></i>
        </button>

        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
};

export default PasswordInput;
