import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { PATHS } from "../../routes/paths";
import { api } from "../../services/api";
import "./authPages.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mirrors backend rules (recommended)
function validateRegister({ userName, email, password, confirmPassword }) {
  const errors = {};

  const name = (userName || "").trim();
  const mail = (email || "").trim();

  if (!name) errors.userName = "Username is required.";
  else if (name.length < 2)
    errors.userName = "Username must be at least 2 characters.";
  else if (name.length > 50)
    errors.userName = "Username must be 50 characters or less.";

  if (!mail) errors.email = "Email is required.";
  else if (!emailRegex.test(mail))
    errors.email = "Enter a valid email address.";
  else if (mail.length > 255)
    errors.email = "Email must be 255 characters or less.";

  if (!password) errors.password = "Password is required.";
  else if (password.length < 6)
    errors.password = "Password must be at least 6 characters.";
  else if (password.length > 72)
    errors.password = "Password must be 72 characters or less.";

  if (!confirmPassword)
    errors.confirmPassword = "Confirm password is required.";
  else if (password !== confirmPassword)
    errors.confirmPassword = "Passwords do not match.";

  return errors;
}

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const errors = useMemo(() => validateRegister(form), [form]);
  const canSubmit = Object.keys(errors).length === 0 && !submitting;

  const onChange = (key) => (e) => {
    setServerError("");
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onBlur = (key) => () => setTouched((p) => ({ ...p, [key]: true }));

  const submit = async (e) => {
    e.preventDefault();
    setTouched({
      userName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const currentErrors = validateRegister(form);
    if (Object.keys(currentErrors).length > 0) return;

    try {
      setSubmitting(true);
      setServerError("");

      // backend expects userName/email/password (confirm is client-side only)
      await api.post("/users", {
        userName: form.userName.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      // After successful registration: go to login (or auto-login later)
      navigate(PATHS.REGISTER_SUCCESS);
    } catch (err) {
      setServerError(err?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (key) => (touched[key] ? errors[key] : "");

  return (
    <div>
      <h1 className="authTitle">Create your account</h1>
      <p className="authSubtitle">Add your details to get started</p>

      <form className="authForm" onSubmit={submit}>
        <div className="authField">
          <label htmlFor="userName">Username</label>
          <input
            id="userName"
            type="text"
            placeholder="Your name"
            value={form.userName}
            onChange={onChange("userName")}
            onBlur={onBlur("userName")}
            autoComplete="name"
          />
          {fieldError("userName") ? (
            <div className="authError">{fieldError("userName")}</div>
          ) : null}
        </div>

        <div className="authField">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={onChange("email")}
            onBlur={onBlur("email")}
            autoComplete="email"
          />
          {fieldError("email") ? (
            <div className="authError">{fieldError("email")}</div>
          ) : null}
        </div>

        <div className="authField">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={onChange("password")}
            onBlur={onBlur("password")}
            autoComplete="new-password"
          />
          {fieldError("password") ? (
            <div className="authError">{fieldError("password")}</div>
          ) : null}
        </div>

        <div className="authField">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={onChange("confirmPassword")}
            onBlur={onBlur("confirmPassword")}
            autoComplete="new-password"
          />
          {fieldError("confirmPassword") ? (
            <div className="authError">{fieldError("confirmPassword")}</div>
          ) : null}
        </div>

        {serverError ? (
          <div className="authServerError">{serverError}</div>
        ) : null}

        <Button type="submit" disabled={!canSubmit}>
          {submitting ? "Creating..." : "Create account"}
        </Button>
      </form>

      <div className="authLinkRow">
        Already have an account? <Link to={PATHS.LOGIN}>Log in</Link>
      </div>
    </div>
  );
}
