// src/pages/ForgotPassword.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setNewPassword("");
    setConfirmPassword("");
  }, []);

  const handleReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    alert("Contraseña actualizada con éxito");
    navigate("/");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        {/* Lado izquierdo con placeholder */}
        <div className="col-12 col-md-6 d-none d-md-flex login-left"></div>

        {/* Lado derecho */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center back-form position-relative">
          <div className="w-75">
            {/* 🔹 Botón regresar arriba a la izquierda */}
            <div className="position-absolute" style={{ top: "20px", left: "20px" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBack}
              >
                Regresar
              </button>
            </div>

            {/* Imagen centrada */}
            <div className="text-center mb-4 mt-5">
              <img
                src="https://placehold.co/300x100/888888/ffffff?text=Imagen"
                alt="Imagen"
                className="img-fluid"
              />
            </div>

            <form onSubmit={handleReset} className="p-4">
              <h4 className="text-center mb-4">Recuperar Contraseña</h4>

              <div className="mb-3">
                <label className="form-label">Nueva contraseña</label>
                <input
                  type="password"
                  className="form-control input-contra"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Ingresa tu nueva contraseña"
                  required
                />
              </div>

              <div className="mb-5">
                <label className="form-label">Confirmar contraseña</label>
                <input
                  type="password"
                  className="form-control input-contra"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma contraseña"
                  autoComplete="new-password"
                  required
                />
              </div>

              {/* 🔹 Botón guardar centrado */}
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-sesion">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
