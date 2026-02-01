import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useAuth } from "../../auth/AuthContext";
import { PATHS } from "../../routes/paths";
import "./authPages.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const errors = useMemo(() => {
    const e = {};
    const email = (form.email || "").trim();
    if (!email) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email.";

    if (!form.password) e.password = "Password is required.";
    return e;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0 && !submitting;

  const onChange = (key) => (e) => {
    setServerError("");
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const onBlur = (key) => () => setTouched((p) => ({ ...p, [key]: true }));

  const fieldError = (key) => (touched[key] ? errors[key] : "");

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (Object.keys(errors).length) return;

    try {
      setSubmitting(true);
      await login({ email: form.email.trim(), password: form.password });
      // if cookie is set correctly, /app will stay accessible
      navigate(PATHS.APP, { replace: true });
    } catch (err) {
      setServerError(err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="authTitle">Log in to your account</h1>
      <p className="authSubtitle">Enter your email and password to continue</p>

      <form className="authForm" onSubmit={onSubmit}>
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
          {fieldError("email") ? <div className="authError">{fieldError("email")}</div> : null}
        </div>

        <div className="authField">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={onChange("password")}
            onBlur={onBlur("password")}
            autoComplete="current-password"
          />
          {fieldError("password") ? <div className="authError">{fieldError("password")}</div> : null}
        </div>

        {serverError ? <div className="authServerError">{serverError}</div> : null}

        <Button type="submit" disabled={!canSubmit}>
          {submitting ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <div className="authLinkRow">
        Don’t have an account? <Link to={PATHS.REGISTER}>Sign up</Link>
      </div>
    </div>
  );
}
