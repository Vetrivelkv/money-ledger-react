import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "../../components/ui/TextField";
import Button from "../../components/ui/Button";
import { PATHS } from "../../routes/paths";
import "./authPages.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = useMemo(() => {
    const next = {};

    if (!form.email) next.email = "Email is required";
    else if (!emailRegex.test(form.email)) next.email = "Enter a valid email";

    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6) next.password = "Use at least 6 characters";

    if (!form.confirmPassword) next.confirmPassword = "Confirm password is required";
    else if (form.password && form.confirmPassword !== form.password)
      next.confirmPassword = "Passwords do not match";

    return next;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onBlur = (e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true, confirmPassword: true });
    if (hasErrors) return;

    try {
      setIsSubmitting(true);

      // TODO: replace with API call
      // await api.register({ email: form.email, password: form.password })
      console.log("REGISTER payload", { email: form.email, password: form.password });

      navigate(PATHS.LOGIN);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="authTitle">Sign Up</h1>
      <p className="authSubtitle">Create your Money Ledger account to track monthly expenses.</p>

      <form onSubmit={onSubmit}>
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="you@example.com"
          autoComplete="email"
          error={touched.email ? errors.email : ""}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Create a password"
          autoComplete="new-password"
          error={touched.password ? errors.password : ""}
        />

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Re-enter password"
          autoComplete="new-password"
          error={touched.confirmPassword ? errors.confirmPassword : ""}
        />

        <Button type="submit" disabled={isSubmitting || hasErrors}>
          {isSubmitting ? "Creating..." : "Sign up"}
        </Button>
      </form>

      <div className="authLinkRow">
        Already have an account? <Link to={PATHS.LOGIN}>Log in</Link>
      </div>
    </div>
  );
}
