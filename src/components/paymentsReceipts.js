import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";
import axiosInstance from "../api/axiosInstance";

const PaymentsReceipts = () => {
  const [codes, setCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Cargar códigos del backend
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const res = await axiosInstance.get("/invoices/getAllReminderCodes");
        setCodes(res.data.codes || []);
      } catch (error) {
        console.error("Error al cargar códigos", error);
        Swal.fire(
          "Error",
          "No se pudieron cargar los códigos. Verifica tu conexión.",
          "error"
        );
      }
    };

    fetchCodes();
  }, []);

  // Enviar comprobante
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCode) {
      return Swal.fire(
        "Código requerido",
        "Debes seleccionar un código.",
        "warning"
      );
    }

    if (!image) {
      return Swal.fire("Imagen requerida", "Selecciona una imagen.", "warning");
    }

    const formData = new FormData();
    formData.append("code", selectedCode);
    formData.append("image", image);

    // Debug
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    setLoading(true);

    try {
      await axiosInstance.post("/reminders/validate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      Swal.fire("Éxito", "Comprobante enviado correctamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo enviar el comprobante.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        <div className="col-12 col-md-6 d-none d-md-flex login-left"></div>

        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center back-form">
          <div className="w-75">
            <div className="mb-4 text-start">
              <Link to="/" className="text-decoration-none btn btn-link backTo">
                ← Regresar
              </Link>
            </div>

            <div className="mb-4 text-center">
              <h4 className="mb-0">Subir Comprobante de Pago</h4>
            </div>

            <form onSubmit={handleSubmit}>
              {/* SELECT */}
              <div className="mb-3">
                <label className="form-label">Selecciona tu código</label>
                <select
                  className="form-select"
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                >
                  <option value="">-- Elige una opción --</option>

                  {codes.map((item) => (
                    <option key={item.id} value={item.code}>
                      {item.code} — {item.invoice?.client?.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Imagen */}
              <div className="mb-3 text-start">
                <label className="form-label">Sube tu comprobante</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
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
