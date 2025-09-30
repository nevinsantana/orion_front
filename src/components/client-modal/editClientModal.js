// components/client-modal/editClientModal.jsx
import React, { useState } from "react";
import "./addClientModal.css";

function EditClientModal({ client, onClose, onSave }) {
  const [nombre, setNombre] = useState(client.nombre);
  const [apellido, setApellido] = useState(client.apellido);
  const [fecha, setFecha] = useState(client.fecha);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...client, nombre, apellido, fecha });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-4">
        <h4>Editar Cliente</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Apellido</label>
            <input
              type="text"
              className="form-control"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-success">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditClientModal;
