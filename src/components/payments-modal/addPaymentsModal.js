import React, { useState, useEffect } from "react";
import "./addPaymentsModal.css";
import { FaTimes } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axiosConfig";

function AddPaymentsModal({ onClose, onSave }) {
  const [invoiceId, setInvoiceId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [description, setDescription] = useState("");
  const [invoices, setInvoices] = useState([]);

  // ✅ Cargar facturas al abrir el modal
  const fetchInvoices = async () => {
    try {
      const response = await axiosInstance.get("/Invoices");
      if (response.data.code === 1 && Array.isArray(response.data.invoices)) {
        setInvoices(response.data.invoices);
      } else {
        console.error("Respuesta inesperada:", response.data);
        setInvoices([]);
      }
    } catch (error) {
      console.error("Error al obtener las facturas:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cargar facturas",
        text: "No se pudieron obtener las facturas disponibles.",
      });
    }
  };

  useEffect(() => {
    if (invoices.length === 0) {
      fetchInvoices();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !invoiceId ||
      !paymentDate ||
      !amount ||
      !paymentMethod ||
      !description
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor llena todos los campos.",
      });
      return;
    }

    try {
      const response = await axiosInstance.post("/paymentHistory", {
        invoiceId: parseInt(invoiceId),
        paymentDate: new Date(paymentDate).toISOString(),
        amount: parseFloat(amount),
        paymentMethod,
        description,
      });

      if (response.data.code === 1) {
        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false,
        });

        // Refresca la tabla (si se pasa la función desde el padre)
        if (onSave) onSave(response.data.data);

        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            response.data.message || "Ocurrió un error al registrar el pago.",
        });
      }
    } catch (error) {
      console.error("Error al registrar el pago:", error);
      Swal.fire({
        icon: "error",
        title: "Error del servidor",
        text: error.response?.data?.message || "No se pudo registrar el pago.",
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
          <h4 className="m-0">Añadir Historial de Pago</h4>
          <FaTimes
            className="icon-close"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="modal-body-clients p-4">
          <div className="tituloIconoClients d-flex align-items-center gap-2 mb-3">
            <MdPayments className="icon" />
            <h6 className="m-0">Datos de Pago</h6>
          </div>

          <form onSubmit={handleSubmit} className="form-clientes">
            <div className="row g-2">
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label className="form-label">Factura</label>
                  <select
                    className="form-control"
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                  >
                    <option value="" disabled>Selecciona una factura</option>
                    {Array.isArray(invoices) &&
                      invoices.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} - {m.rfc}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label className="form-label">Fecha de Pago</label>
                  <input
                    type="date"
                    className="form-control"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row g-2">
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label className="form-label">Importe</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label className="form-label">Método de pago</label>
                  <input
                    type="text"
                    className="form-control"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row g-2">
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
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

export default AddPaymentsModal;
