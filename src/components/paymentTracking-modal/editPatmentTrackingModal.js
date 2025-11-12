import React, { useState } from "react";
import "./editPaymentTrackingModal.css";
import { FaTimes } from "react-icons/fa";
import { TbCalendarClock } from "react-icons/tb";
import Swal from "sweetalert2";

function EditPaymentTrackingModal({ tracking, onClose, onSave }) {
  const [status, setStatus] = useState(tracking.status || "Pendiente");
  const [comments, setComments] = useState(tracking.comments || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!status || !comments.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos antes de guardar.",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    const updatedTracking = {
      ...tracking,
      status,
      comments,
    };

    onSave(updatedTracking);

    Swal.fire({
      icon: "success",
      title: "Seguimiento actualizado",
      text: "Los datos se guardaron correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });

    onClose();
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
              <div className="col-md-6 col-12">
                <label className="form-label">Estatus</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pagada">Confirmado</option>
                  <option value="Pendiente">Por vencer</option>
                  <option value="Vencida">Vencida</option>
                  <option value="Rechazada">Rechazado</option>
                </select>
              </div>

              <div className="col-md-6 col-12">
                <label className="form-label">Comentarios</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              </div>
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
