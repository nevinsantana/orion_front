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
    <div className="container-fluid vh-100 p-0">
      <div className="row h-100 g-0">
        {/* Columna izquierda: imagen ORION BILLING */}
        <div className="col-12 col-md-6 d-none d-md-flex d-dm-block login-left"></div>

        {/* Columna derecha: formulario */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center back-form">
          <div className="w-75">
            {/* Imagen mediana arriba del formulario */}
            <div className="text-center mb-4 mt-4 mt-md-0">
              <img
                src="https://placehold.co/400x100/888888/ffffff?text=Imagen"
                alt=""
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
                  autoComplete="new-password"
                  required
                  placeholder="Ingresa tu contraseña"
                />
              </div>

              {/* Texto de Olvidaste tu contraseña */}
              <div className="text-end mb-4">
                <Link to="/request-password" className="forgot-link">
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
