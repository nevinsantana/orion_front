import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 👈 importa Link
import Swal from "sweetalert2";
import axiosInstance from "../api/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

const RequestPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/users/forgot-password", { email });

      if (response.data.code === 1) {
        Swal.fire({
          title: "Correo enviado",
          text: "Revisa tu bandeja de entrada para cambiar tu contraseña.",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#8b5cf6",
        }).then(() => {
          navigate("/request-password"); // redirige a la vista de cambio de contraseña
        });
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message || "No se pudo enviar el correo.",
          icon: "error",
          confirmButtonText: "Intentar de nuevo",
        });
      }
    } catch (error) {
      console.error("Error al solicitar cambio de contraseña:", error);
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Ocurrió un error al conectar con el servidor.",
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
    } finally {
      setLoading(false);
    }
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
              <h4 className="mb-0">Ingresa Correo</h4>
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
                <button type="submit" className="btn btn-sesion" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar"}
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
