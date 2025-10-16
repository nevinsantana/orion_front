import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "../api/axiosConfig"; // 👈 Importa tu configuración de Axios
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
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
      // 👇 Petición al backend con los datos del formulario
      const response = await axios.post("/users/login", {
        email,
        password,
      });

      // ✅ Si la respuesta contiene un token (ajusta el nombre si tu backend devuelve algo distinto)
      if (response.data && response.data.token) {
        const token = response.data.token;

        // Guarda el token en localStorage
        localStorage.setItem("token", token);

        localStorage.setItem("isLoggedIn", "true");

        // Muestra alerta y redirige al dashboard
        Swal.fire({
          title: "¡Bienvenido a RAK Orion!",
          text: "Has iniciado sesión correctamente",
          theme: 'dark',
          icon: "success",
          confirmButtonText: "Continuar",
          confirmButtonColor: "#8b5cf6",
        }).then(() => {
          navigate("/dashboard");
        });
      } else {
        Swal.fire({
          title: "Error",
          theme: 'dark',
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
        theme: 'dark',
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
