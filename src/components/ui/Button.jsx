import React from "react";
import "./formControls.css";

export default function Button({
  children,
  variant = "primary",
  type = "button",
  disabled,
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`mlButton ${variant === "secondary" ? "mlButtonSecondary" : "mlButtonPrimary"}`}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
