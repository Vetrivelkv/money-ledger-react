import React from "react";
import "./formControls.css";

export default function TextField({
  label,
  type = "text",
  value,
  onChange,
  name,
  placeholder,
  error,
  autoComplete,
  ...rest
}) {
  return (
    <div className="mlField">
      {label ? (
        <label className="mlLabel" htmlFor={name}>
          {label}
        </label>
      ) : null}
      <input
        id={name}
        name={name}
        className={`mlInput ${error ? "mlInputError" : ""}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...rest}
      />
      {error ? <div className="mlError">{error}</div> : null}
    </div>
  );
}
