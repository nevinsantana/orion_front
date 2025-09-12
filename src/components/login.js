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
        {/* Lado izquierdo: placeholder */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center fondo-columna-izquierda order-1 order-md-1">
          <img
            src="https://placehold.co/550x550/cccccc/000000?text=Placeholder+Image"
            alt="Placeholder"
            className="img-fluid"
          />
        </div>

        {/* Lado derecho: formulario */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center back-form order-2 order-md-2">
          <div className="w-75">
            {/* Imagen mediana centrada arriba del formulario */}
            <div className="text-center mb-4 mt-4 mt-md-0">
              <img
                src="https://placehold.co/400x100/888888/ffffff?text=Imagen+Login"
                alt="Imagen Login"
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
                />
              </div>

              {/* Texto de Olvidaste tu contraseña */}
              <div className="text-end mb-4">
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
