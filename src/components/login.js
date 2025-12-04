import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios"; // 👈 CAMBIO 1: Usamos axios directo para evitar fallos de configuración
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";
import OrionLogo from '../assets/images/img-login/Orion.png';

const Login = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 👈 CAMBIO 2: Estrategia de seguridad.
      // Si el .env falla (undefined), usa automáticamente la URL de AWS.
      // Esto arregla el error 405 (Method Not Allowed) de S3.
      const API_URL = process.env.REACT_APP_API_URL || "https://192gbhh0ha.execute-api.us-east-1.amazonaws.com/dev/api";

      console.log("Intentando login en:", `${API_URL}/users/login`); // Debug para que veas en consola a dónde va

      // 👇 Petición directa con la URL completa
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      // ✅ Si la respuesta contiene un token
      if (response.data && response.data.token) {
        const token = response.data.token;

        // Guarda el token en localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("isLoggedIn", "true");

        // Muestra alerta y redirige al dashboard
        Swal.fire({
          title: "¡Bienvenido a RAK Orion!",
          text: "Has iniciado sesión correctamente",
          theme: "dark",
          icon: "success",
          confirmButtonText: "Continuar",
          confirmButtonColor: "#8b5cf6",
        }).then(() => {
          if (redirect) {
            navigate(redirect);
          } else {
            navigate("/dashboard");
          }
        });
      } else {
        Swal.fire({
          title: "Error",
          theme: "dark",
          text: "No se recibió un token válido del servidor.",
          icon: "error",
          confirmButtonText: "Intentar de nuevo",
        });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      let message = "Ocurrió un error al conectar con el servidor.";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      Swal.fire({
        title: "Error al iniciar sesión",
        theme: "dark",
        text: message,
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
    }
  };

  if (!ready) return null;

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row h-100 g-0">
        {/* Columna izquierda */}
        <div className="col-12 col-md-6 d-none d-md-flex d-dm-block login-left"></div>

        {/* Columna derecha */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center back-form">
          <div className="w-75">
            <div className="text-center mb-4 mt-4 mt-md-0">
              <img src={OrionLogo} alt="Orion" className="img-fluid" />
            </div>

            <form onSubmit={handleLogin} className="p-4">
              <div className="mb-3">
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

              <div className="mb-2">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control input-contra"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="new-password"
                  required
                />
              </div>

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