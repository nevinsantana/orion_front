import React, { useState } from "react";
import "./addPaymentsModal.css";
import { FaUserGroup } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axiosConfig";

function EditPaymentsModal({ payments, onClose, onSave }) {
  const [amount, setAmount] = useState(payments.amount || "");
  const [description, setDescription] = useState(payments.description || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!payments || !payments.id) {
    Swal.fire({
      icon: "error",
      title: "Error interno",
      theme: "dark",
      text: "No se encontró el ID del pago a editar.",
    });
    return;
  }

    if (!amount || !description) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        theme: "dark",
        text: "Por favor llena todos los campos requeridos.",
      });
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/paymentHistory/${payments.id}`,
        {
          amount: parseFloat(amount),
          description,
        }
      );

      if (response.data.code === 1) {
        Swal.fire({
          icon: "success",
          title: "Pago actualizado",
          theme: "dark",
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false,
        });

        // Refresca la tabla
        onSave(response.data.data);
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          theme: "dark",
          text: response.data.message || "No se pudo actualizar el pago.",
        });
      }
    } catch (error) {
      console.error("Error al actualizar pago:", error);
      Swal.fire({
        icon: "error",
        theme: "dark",
        title: "Error en la solicitud",
        text: "Hubo un problema al actualizar el registro.",
      });
    }
  };

  // Función para cerrar al hacer clic fuera del modal
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
          <h4 className="m-0">Editar Historial</h4>
          <FaTimes
            className="icon-close"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="modal-body-clients p-4">
          <div className="tituloIconoClients d-flex align-items-center gap-2 mb-3">
            <FaUserGroup className="icon" />
            <h6 className="m-0">Datos de Historial</h6>
          </div>

          <form onSubmit={handleSubmit} className="form-clientes">
            <div className="row g-2">
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label className="form-label">Detalles</label>
                  <input
                    type="text"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label className="form-label">Importe</label>
                  <input
                    type="text"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
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

export default EditPaymentsModal;
