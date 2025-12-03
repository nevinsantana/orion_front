import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";
import axiosInstance from "../api/axiosInstance";

const PaymentsReceipts = () => {
  const [selectedCode, setSelectedCode] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Leer token para pruebas
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("⚠ No hay token, pero se permite continuar para pruebas.");
      // DESCOMENTAR cuando ya esté funcionando:
      /*
      const currentUrl = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;
      */
    }
  }, []);

  // Enviar comprobante
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCode.trim()) {
      return Swal.fire(
        "Código requerido",
        "Debes ingresar el código.",
        "warning"
      );
    }

    if (!image) {
      return Swal.fire("Imagen requerida", "Selecciona una imagen.", "warning");
    }

    const formData = new FormData();
    // 🔑 EL NOMBRE EXACTO QUE ESPERA MULTER
    formData.append("validationImage", image, image.name);
    formData.append("code", selectedCode.trim());

    setLoading(true);

    try {
      const res = await axiosInstance.post("/reminders/validate", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // No necesitas Content-Type: axios lo setea automáticamente
        },
      });

      Swal.fire("Éxito", res.data.message, "success").then(() => {
        setSelectedCode("");
        setImage(null);
        document.getElementById("fileInput").value = "";

        navigate("/confirm-payment");
      });
    } catch (error) {
      console.error("Error Upload:", error.response || error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "No se pudo enviar el comprobante.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get("code");

    if (codeFromUrl) {
      setSelectedCode(codeFromUrl);
    }
  }, []);

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        <div className="col-12 col-md-6 d-none d-md-flex login-left"></div>

        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center back-form">
          <div className="w-75">
            <div className="mb-4 text-center">
              <h4 className="mb-0">Subir Comprobante de Pago</h4>
            </div>

            <form onSubmit={handleSubmit}>
              {/* SELECT */}
              {/* <div className="mb-3">
                <label className="form-label">Ingresa tu código</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Escribe el código recibido por correo"
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                  required
                />
              </div> */}

              {/* Imagen */}
              <div className="mb-3 text-start">
                <label className="form-label">Sube tu comprobante</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  id="fileInput"
                  onChange={(e) => setImage(e.target.files[0])}
                  required
                />

                {image && (
                  <p className="mt-2 small">
                    Archivo seleccionado: <strong>{image.name}</strong>
                  </p>
                )}
              </div>

              {/* Botón */}
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-sesion"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar comprobante"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsReceipts;
