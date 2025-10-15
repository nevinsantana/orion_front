// ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null); // null = verificando
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");

      if (!isLoggedIn) {
        // Limpia token viejo si existe
        localStorage.removeItem("token");
        setIsValid(false);
      } else {
        setIsValid(true);
      }

      setLoading(false);
    };

    checkLogin();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Cargando...
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/" replace />; // Redirige al login
  }

  return children;
};

export default ProtectedRoute;
