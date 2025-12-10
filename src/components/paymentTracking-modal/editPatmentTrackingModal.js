import React, { useState } from "react";
import "./editPaymentTrackingModal.css";
import { FaTimes } from "react-icons/fa";
import { TbCalendarClock } from "react-icons/tb";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axiosInstance";

function EditPaymentTrackingModal({ tracking, onClose, onSave }) {
  const [status, setStatus] = useState("");
  const serverURL = axiosInstance.defaults.baseURL.replace("/api", "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!status) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor seleccione un estatus.",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    try {
      const body = {
        reminder_id: tracking.id,
        status: status, // <-- se envía ACEPATADO o RECHAZADO directo
      };

      console.log("tracking Id:", tracking.id);
        console.log("Objeto completo:", tracking);

      const res = await axiosInstance.post("/invoices/update-status", body);

      if (res.data.code === 1) {
        // Actualizar la fila en la tabla
        const updatedPayment = {
          ...tracking,
          status: status,
        };

        onSave(updatedPayment);

        Swal.fire({
          icon: "success",
          title: "Estatus actualizado",
          text: res.data.message,
          timer: 2000,
          showConfirmButton: false,
        });

        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.data.message || "No se pudo actualizar el estatus.",
        });
      }
    } catch (error) {
      console.error("Error WS update-status:", error);

      Swal.fire({
        icon: "error",
        title: "Error de servidor",
        text:
          error.response?.data?.message ||
          "Ocurrió un error al actualizar el estado.",
      });
    }
  };

  // Cerrar modal al hacer clic fuera
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content-clients">
        {/* Header con icono de cerrar */}
        <div className="modal-header-clients p-3 d-flex justify-content-between align-items-center">
          <h4 className="m-0">Editar Seguimiento</h4>
          <FaTimes
            className="icon-close"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="modal-body-clients p-4">
          <div className="tituloIconoClients d-flex align-items-center gap-2 mb-3">
            <TbCalendarClock className="icon" />
            <h6 className="m-0">Datos de Seguimiento</h6>
          </div>

          <form onSubmit={handleSubmit} className="form-clientes">
            <div className="row g-3">
              <div className="col-md-6 col-12 text-start">
                <label className="form-label">Estatus</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="" disabled>
                    Selecciona...
                  </option>
                  <option value="ACEPTADO">ACEPTADO</option>
                  <option value="RECHAZADO">RECHAZADO</option>
                </select>
              </div>

              <div className="col-md-6 col-12 text-start">
                <label className="form-label d-block mb-1">
                  Comprobante de pago
                </label>

                {tracking.image ? (
                  <a
                    // href={`http://localhost:9000/validation_images/${tracking.image}`}
                    href={tracking.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontWeight: "500",
                      color: "#00e676",
                      textDecoration: "none",
                      cursor: "pointer",
                      display: "inline-block",
                      marginTop: "5px",
                    }}
                  >
                    Ver comprobante
                  </a>
                ) : (
                  <p className="text-muted sinComprobante mt-1">
                    Sin comprobante
                  </p>
                )}
              </div>

              {/* <div className="col-md-6 col-12">
                <label className="form-label">Comprobante de pago</label>
                {tracking.image ? (
                  <p style={{ fontWeight: "500" }}>{tracking.image}</p>
                ) : (
                  <p className="text-muted">Sin comprobante</p>
                )}
              </div> */}
            </div>

            <div className="d-flex justify-content-center gap-2 mt-4 flex-wrap">
              <button
                type="button"
                className="btn btn-cancelar"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-guardar">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPaymentTrackingModal;
