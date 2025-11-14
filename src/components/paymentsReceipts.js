import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

const PaymentsReceipts = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 👉 Permitir solo una imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && !file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Archivo inválido",
        text: "Solo se permiten imágenes (PNG, JPG, JPEG).",
      });
      e.target.value = "";
      return;
    }

    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      Swal.fire({
        icon: "warning",
        title: "Sin archivo",
        text: "Debes seleccionar una imagen antes de enviar.",
      });
      return;
    }

    setLoading(true);

    try {
      // 👉 Preparar FormData (cuando conectes el backend)
      // const formData = new FormData();
      // formData.append("image", image);

      Swal.fire({
        icon: "success",
        title: "Imagen lista",
        text: "La imagen está lista para enviarse al backend.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al procesar la imagen.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        {/* Columna izquierda */}
        <div className="col-12 col-md-6 d-none d-md-flex login-left"></div>

        {/* Columna derecha */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center back-form">
          <div className="w-75">
            {/* Enlace regresar */}
            <div className="mb-4 text-start">
              <Link to="/" className="text-decoration-none btn btn-link backTo">
                ← Regresar
              </Link>
            </div>

            {/* Título */}
            <div className="mb-4 text-center">
              <h4 className="mb-0">Subir Comprobante</h4>
            </div>

            <form onSubmit={handleSubmit}>
              {/* subir imagen */}
              <div className="mb-3 text-start">
                <label className="form-label">Seleccionar imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleImageChange}
                  required
                />

                {/* mostrar nombre del archivo */}
                {image && (
                  <p className="mt-2 small">
                    Archivo seleccionado: <strong>{image.name}</strong>
                  </p>
                )}
              </div>

              {/* botón */}
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-sesion"
                  disabled={loading}
                >
                  {loading ? "Procesando..." : "Enviar imagen"}
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
