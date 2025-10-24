import React, { useState } from "react";
import "./invoicesModals.css";
import { FaFileInvoiceDollar, FaTimes } from "react-icons/fa";

function AddInvoiceModal({ onClose, onSave }) {
  const [cliente, setCliente] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha_emision, setFechaEmision] = useState("");
  const [estado, setEstado] = useState("Pendiente");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!cliente.trim()) newErrors.cliente = true;
    if (!monto.trim()) newErrors.monto = true;
    if (!fecha_emision) newErrors.fecha_emision = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({ cliente, monto, fecha_emision, estado });
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content-clients">
        <div className="modal-header-clients p-3 d-flex justify-content-between align-items-center">
          <h4 className="m-0">Añadir Factura</h4>
          <FaTimes className="icon-close" onClick={onClose} style={{ cursor: "pointer" }} />
        </div>

        <div className="modal-body-clients p-4">
          <div className="tituloIconoClients d-flex align-items-center gap-2 mb-3">
            <FaFileInvoiceDollar className="icon" />
            <h6 className="m-0">Datos de Factura</h6>
          </div>

          <form onSubmit={handleSubmit} className="form-clientes">
            <div className="row g-2">
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label className="form-label">Cliente</label>
                  <input
                    type="text"
                    className={`form-control ${errors.cliente ? "is-invalid" : ""}`}
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label className="form-label">Monto</label>
                  <input
                    type="text"
                    className={`form-control ${errors.monto ? "is-invalid" : ""}`}
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label className="form-label">Fecha de emisión</label>
                  <input
                    type="date"
                    className={`form-control ${errors.fecha_emision ? "is-invalid" : ""}`}
                    value={fecha_emision}
                    onChange={(e) => setFechaEmision(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-control"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    <option>Pagada</option>
                    <option>Pendiente</option>
                    <option>Vencida</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
              <button type="button" className="btn btn-cancelar" onClick={onClose}>
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

export default AddInvoiceModal;
