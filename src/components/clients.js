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
    { id: 1, name: "Juan", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 2, name: "María", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 3, name: "Carlos", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 4, name: "Juan", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 5, name: "María", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 6, name: "Carlos", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 7, name: "Juan", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 8, name: "María", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 9, name: "Carlos", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 10, name: "Juan", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 11, name: "María", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 12, name: "Carlos", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 13, name: "Juan", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 14, name: "María", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 15, name: "Carlos", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 16, name: "Carlos", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 17, name: "Carlos", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 18, name: "Carlos", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 19, name: "Carlos", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 20, name: "Carlos", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 21, name: "Carlos", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 22, name: "Carlos", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 23, name: "Carlos", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    { id: 24, name: "Carlos", tax_addres: "", tax_regime: "", contact_name:"", contact_email:"", contact_phone:"" },
    // ... más clientes
  ]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tax_addres.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive clients-table-wrapper">
            <table className="table table-dark table-striped clients-table">
              <thead>
                <tr className="text-center">
                  <th>Nombre</th>
                  <th>Domicilio</th>
                  <th>Régimen Fiscal</th>
                  <th>Nombre Contacto</th>
                  <th>Correo electrónico</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedClients.length > 0 ? (
                  displayedClients.map((c) => (
                    <tr key={c.id} className="text-center">
                      <td>{c.name}</td>
                      <td>{c.tax_addres}</td>
                      <td>{c.tax_regime}</td>
                      <td>{c.contact_name}</td>
                      <td>{c.contact_email}</td>
                      <td>{c.contact_phone}</td>
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
                  <tr className="text-center">
                    <td colSpan="4">No se encontraron clientes</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
