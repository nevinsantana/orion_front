import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🔹 Limpiar inputs al cargar la vista
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
    navigate("/"); // Regresa al login
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Lado izquierdo con placeholder */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center fondo-columna-izquierda order-1 order-md-1">
          <img
            src="https://placehold.co/550x550/cccccc/000000?text=Placeholder+Image"
            alt="Placeholder"
            className="img-fluid"
          />
        </div>

        {/* Lado derecho */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center back-form order-2 order-md-2">
          <div className="w-75">
            {/* Imagen mediana centrada arriba */}
            <div className="text-center mb-4 mt-4 mt-md-0">
              <img
                src="https://placehold.co/400x100/888888/ffffff?text=Imagen+Login"
                alt="Imagen Login"
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
                  autoComplete="new-password"
                  required
                />
              </div>

              <button type="submit" className="btn btn-sesion w-100">
                Guardar nueva contraseña
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
