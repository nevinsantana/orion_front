// Clients.jsx
import React, { useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import "./clients.css";
import AddClientModal from "../components/client-modal/addClientModal";

function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [clients, setClients] = useState([
    { id: 1, nombre: "Juan", apellido: "Pérez", fecha: "2025-09-01" },
    { id: 2, nombre: "María", apellido: "López", fecha: "2025-09-02" },
    { id: 3, nombre: "Carlos", apellido: "Ramírez", fecha: "2025-09-03" },
  ]);

  // Filtrar clientes según búsqueda
  const filteredClients = clients.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setClients(clients.filter((c) => c.id !== id));
  };

  const handleAddClient = (newClient) => {
    setClients([...clients, { ...newClient, id: Date.now() }]);
    setShowModal(false);
  };

  return (
    <div className="container-fluid clients-container">
      <h1 className="mb-4">Clientes</h1>

      {/* Fila búsqueda + botón añadir */}
      <div className="row mb-3 align-items-center">
        {/* Columna izquierda: búsqueda */}
        <div className="col-md-6 d-flex justify-content-start mb-2 mb-md-0">
          <input
            type="text"
            placeholder="Buscar cliente..."
            className="form-control w-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn ms-2 buscarClientes">Buscar</button>
        </div>

        {/* Columna derecha: botón añadir */}
        <div className="col-md-6 d-flex justify-content-md-end justify-content-start">
          <button
            className="btn d-flex align-items-center addCliente"
            onClick={() => setShowModal(true)}
          >
            Añadir Cliente
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((c) => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td>{c.apellido}</td>
                  <td>{c.fecha}</td>
                  <td>
                    <button
                      className="btn btn-sm me-2"
                      style={{ backgroundColor: "#8A2CF1", color: "#fff" }}
                    >
                      <FaPen />
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: "#e61610", color: "#fff" }}
                      onClick={() => handleDelete(c.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No se encontraron clientes</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Añadir Cliente */}
      {showModal && (
        <AddClientModal
          onClose={() => setShowModal(false)}
          onSave={handleAddClient}
        />
      )}
    </div>
  );
}

export default Clients;
