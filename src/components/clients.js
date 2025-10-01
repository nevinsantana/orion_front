import React, { useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import "./clients.css";
import AddClientModal from "../components/client-modal/addClientModal";
import EditClientModal from "../components/client-modal/editClientModal";

function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);

  const [clients, setClients] = useState([
    { id: 1, nombre: "Juan", apellido: "Pérez", fecha: "2025-09-01" },
    { id: 2, nombre: "María", apellido: "López", fecha: "2025-09-02" },
    { id: 3, nombre: "Carlos", apellido: "Ramírez", fecha: "2025-09-03" },
    { id: 4, nombre: "Juan", apellido: "Pérez", fecha: "2025-09-01" },
    { id: 5, nombre: "María", apellido: "López", fecha: "2025-09-02" },
    { id: 6, nombre: "Carlos", apellido: "Ramírez", fecha: "2025-09-03" },
    { id: 7, nombre: "Juan", apellido: "Pérez", fecha: "2025-09-01" },
    { id: 8, nombre: "María", apellido: "López", fecha: "2025-09-02" },
    { id: 9, nombre: "Carlos", apellido: "Ramírez", fecha: "2025-09-03" },
    { id: 10, nombre: "Juan", apellido: "Pérez", fecha: "2025-09-01" },
    { id: 11, nombre: "María", apellido: "López", fecha: "2025-09-02" },
    { id: 12, nombre: "Carlos", apellido: "Ramírez", fecha: "2025-09-03" },
    { id: 13, nombre: "Juan", apellido: "Pérez", fecha: "2025-09-01" },
    { id: 14, nombre: "María", apellido: "López", fecha: "2025-09-02" },
    { id: 15, nombre: "Carlos", apellido: "Ramírez", fecha: "2025-09-03" },
    { id: 16, nombre: "Carlos", apellido: "Ramírez", fecha: "2025-09-03" },
    { id: 17, nombre: "Carlos", apellido: "Ramírez", fecha: "2025-09-03" },
    { id: 18, nombre: "Carlos", apellido: "Ramírez", fecha: "2025-09-03" },
    { id: 19, nombre: "Carlos", apellido: "Ramírez", fecha: "2025-09-03" },
    { id: 20, nombre: "Carlos", apellido: "Ramírez", fecha: "2025-09-03" },
    { id: 21, nombre: "Carlos", apellido: "Ramírez", fecha: "2025-09-03" },
    { id: 22, nombre: "Carlos", apellido: "Ramírez", fecha: "2025-09-03" },
    { id: 23, nombre: "Carlos", apellido: "Ramírez", fecha: "2025-09-03" },
    { id: 24, nombre: "Carlos", apellido: "Ramírez", fecha: "2025-09-03" },
    // ... más clientes
  ]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredClients = clients.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const displayedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id) => {
    setClients(clients.filter((c) => c.id !== id));
  };

  const handleAddClient = (newClient) => {
    setClients([...clients, { ...newClient, id: Date.now() }]);
    setShowAddModal(false);
  };

  const handleEditClient = (updatedClient) => {
    setClients(
      clients.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    );
    setShowEditModal(false);
  };

  return (
    <div className="container-fluid clients-container">
      <h1 className="mb-4">Clientes</h1>

      <div className="row mb-3 align-items-center">
        <div className="col-lg-6 col-md-6 d-flex justify-content-start mb-2">
          <input
            type="text"
            placeholder="Buscar cliente..."
            className="form-control search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset page al buscar
            }}
          />
          <button className="btn ms-2 buscarClientes">Buscar</button>
        </div>

        <div className="col-lg-6 col-md-6 d-flex justify-content-md-end justify-content-start">
          <button
            className="btn d-flex align-items-center addCliente"
            onClick={() => setShowAddModal(true)}
          >
            Añadir Cliente
          </button>
        </div>
      </div>

      {/* Tabla responsiva */}
      <div className="table-responsive clients-table-wrapper">
        <table className="table table-dark table-striped clients-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {displayedClients.length > 0 ? (
              displayedClients.map((c) => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td>{c.apellido}</td>
                  <td>{c.fecha}</td>
                  <td>
                    <button
                      className="btn btn-sm me-2"
                      style={{ backgroundColor: "#8A2CF1", color: "#fff" }}
                      onClick={() => {
                        setClientToEdit(c);
                        setShowEditModal(true);
                      }}
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

      {/* Paginación */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center mt-3">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </button>
            </li>
            {[...Array(totalPages)].map((_, idx) => (
              <li
                key={idx}
                className={`page-item ${
                  currentPage === idx + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Modales */}
      {showAddModal && (
        <AddClientModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddClient}
        />
      )}
      {showEditModal && clientToEdit && (
        <EditClientModal
          client={clientToEdit}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditClient}
        />
      )}
    </div>
  );
}

export default Clients;
