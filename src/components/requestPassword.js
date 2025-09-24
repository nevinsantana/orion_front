import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 👈 importa Link
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

const RequestPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simula enviar correo y redirige a cambiar contraseña
    navigate("/forgot-password");
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        {/* Columna izquierda: imagen */}
        <div className="col-12 col-md-6 d-none d-md-flex login-left"></div>

        {/* Columna derecha: formulario */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center back-form">
          <div className="w-75">
            {/* Enlace regresar arriba */}
            <div className="mb-4 text-start">
              <Link to="/" className="text-decoration-none btn btn-link backTo">
                ← Regresar
              </Link>
            </div>

            {/* Título */}
            <div className="mb-4 text-center">
              <h4 className="mb-0">Recuperar Contraseña</h4>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control input-correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                  required
                />
              </div>

              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-sesion">
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPassword;
