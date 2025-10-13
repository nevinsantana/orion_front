// src/pages/ForgotPassword.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";
import axios from "../api/axiosConfig";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNewPassword("");
    setConfirmPassword("");
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!code) {
      Swal.fire({
        title: "Error",
        text: "Token inválido o faltante",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    setLoading(true);

    try {
      // 🔹 Petición POST al backend sin enviar el token de login
      const response = await axios.post(
        "/users/reset-password",
        {
          code: code,
          password: newPassword,
          password_confirm: confirmPassword,
        },
        {
          headers: { Authorization: "" }, // ⚡ importante: evita enviar token
        }
      );

      if (response.data.code === 1) {
        Swal.fire({
          title: "Éxito",
          text: "Contraseña actualizada correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#8b5cf6",
        }).then(() => {
          navigate("/"); // redirige al login
        });
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message || "No se pudo actualizar la contraseña",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);

      // 🔹 Captura mensajes del backend o muestra genérico
      let message =
        error.response?.data?.message ||
        "Ocurrió un error al conectar con el servidor";

      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
    }
  };

  // const handleReset = (e) => {
  //   e.preventDefault();
  //   if (newPassword !== confirmPassword) {
  //     alert("Las contraseñas no coinciden");
  //     return;
  //   }
  //   alert("Contraseña actualizada con éxito");
  //   navigate("/");
  // };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        {/* Lado izquierdo con placeholder */}
        <div className="col-12 col-md-6 d-none d-md-flex login-left"></div>

        {/* Lado derecho */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center back-form position-relative">
          <div className="w-75">
            {/* Enlace regresar arriba */}
            <div className="mb-2 text-start">
              <Link to="/" className="text-decoration-none btn btn-link backTo">
                ← Regresar
              </Link>
            </div>

            {/* Imagen centrada */}
            <div className="text-center mb-4 mt-3">
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
                <button
                  type="submit"
                  className="btn btn-sesion"
                  disabled={loading}
                >
                  {loading ? "Actualizando..." : "Guardar"}
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
