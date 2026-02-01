import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import { PATHS } from "../../routes/paths";
import "./authPages.css";

export default function Login() {
  return (
    <div>
      <h1 className="authTitle">Log in to your account</h1>
      <p className="authSubtitle">Enter your email and password to continue</p>

      <form className="authForm" onSubmit={(e) => e.preventDefault()}>
        <div className="authField">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="authField">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <Button type="submit">Log in</Button>
      </form>

      <div className="authLinkRow">
        Don’t have an account? <Link to={PATHS.REGISTER}>Sign up</Link>
      </div>
    </div>
  );
}
