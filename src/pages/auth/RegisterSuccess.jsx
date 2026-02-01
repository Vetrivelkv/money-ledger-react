import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { PATHS } from "../../routes/paths";
import "./authPages.css";

export default function RegisterSuccess() {
  const navigate = useNavigate();

  // Auto-redirect after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(PATHS.LOGIN);
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="authSuccess">
      <div className="authSuccessIcon">✓</div>

      <h1 className="authTitle">Registration successful</h1>

      <p className="authSubtitle">
        Your account has been created successfully. You will be redirected to
        the login page shortly.
      </p>

      <Button onClick={() => navigate(PATHS.LOGIN)}>Go to Login</Button>
    </div>
  );
}
