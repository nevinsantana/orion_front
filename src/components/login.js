import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Lado izquierdo: imagen o placeholder */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light">
          <img
            src="https://via.placeholder.com/300x300?text=Logo"
            alt="Logo"
            className="img-fluid"
          />
        </div>

        {/* Lado derecho: formulario */}
        <div className="col-md-6 d-flex align-items-center justify-content-center back-form">
          <div className="w-75">
            {/* Logo arriba del formulario en pantallas pequeñas */}
            <div className="text-center mb-4 d-md-none">
              <img
                src="https://via.placeholder.com/150x50?text=Logo"
                alt="Logo"
                className="img-fluid"
              />
            </div>

            <form onSubmit={handleLogin} className="p-4">
              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control input-correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control input-contra"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Texto de Olvidaste tu contraseña */}
              <div className="text-end mb-3">
                <Link to="/forgot-password" className="forgot-link">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button type="submit" className="btn btn-sesion w-100">
                Iniciar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

