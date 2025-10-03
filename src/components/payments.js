import React, { useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import "./payments.css";
import AddPaymentsModal from "./payments-modal/addPaymentsModal";
import EditPaymentsModal from "./payments-modal/editPaymentsModal";

function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [paymentsToEdit, setPaymentsToEdit] = useState(null);

  const [payments, setPayments] = useState([
    { id: 1, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 1", state: "Completo" },
    { id: 2, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$100.00", date: "12-04-2025", customer: "Cliente 2", state: "Completo" },
    { id: 3, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 3", state: "Completo" },
    { id: 4, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 4", state: "Completo" },
    { id: 5, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 5", state: "Completo" },
    { id: 6, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 6", state: "Completo" },
    { id: 7, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 7", state: "Completo" },
    { id: 8, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 8", state: "Completo" },
    { id: 9, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 9", state: "Completo" },
    { id: 10, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 10", state: "Completo" },
    { id: 11, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 11", state: "Completo" },
    { id: 12, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 12", state: "Completo" },
    { id: 13, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 13", state: "Completo" },
    { id: 14, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 14", state: "Completo" },
    { id: 15, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 15", state: "Completo" },
    { id: 16, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 16", state: "Completo" },
    { id: 17, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 17", state: "Completo" },
    { id: 18, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 18", state: "Completo" },
    { id: 19, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 19", state: "Completo" },
    { id: 20, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 20", state: "Completo" },
    { id: 21, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 21", state: "Completo" },
    { id: 22, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 22", state: "Completo" },
    { id: 23, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 23", state: "Completo" },
    { id: 24, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 24", state: "Completo" },
    // ... más monedas
  ]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredPayments = payments.filter(
    (m) =>
      m.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const displayedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id) => {
    setPayments(payments.filter((c) => c.id !== id));
  };

  const handleAddPayments = (newPayments) => {
    setPayments([...payments, { ...newPayments, id: Date.now() }]);
    setShowAddModal(false);
  };

  const handleEditPayments = (updatedPayments) => {
    setPayments(
      payments.map((m) => (m.id === updatedPayments.id ? updatedPayments : m))
    );
    setShowEditModal(false);
  };

  return (
    <div className="container-fluid clients-container">
      <h1 className="mb-4">Historial de Pagos</h1>

      <div className="row mb-3 align-items-center">
        <div className="col-lg-6 col-md-6 d-flex justify-content-start mb-2">
          <input
            type="text"
            placeholder="Buscar historial..."
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
            Añadir Historial
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
                  <th>ID</th>
                  <th>Correo electrónico</th>
                  <th>Detalles</th>
                  <th>Importe</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedPayments.length > 0 ? (
                  displayedPayments.map((m) => (
                    <tr key={m.id}>
                      <td>{m.id}</td>
                      <td>{m.email}</td>
                      <td>{m.details}</td>
                      <td>{m.amount}</td>
                      <td>{m.date}</td>
                      <td>{m.customer}</td>
                      <td>{m.state}</td>
                      <td>
                        <button
                          className="btn btn-sm me-2"
                          style={{ backgroundColor: "#8A2CF1", color: "#fff" }}
                          onClick={() => {
                            setPaymentsToEdit(m);
                            setShowEditModal(true);
                          }}
                        >
                          <FaPen />
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ backgroundColor: "#e61610", color: "#fff" }}
                          onClick={() => handleDelete(m.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan="4">No se encontraron historiales</td>
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
        <AddPaymentsModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddPayments}
        />
      )}
      {showEditModal && paymentsToEdit && (
        <EditPaymentsModal
          payments={paymentsToEdit}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditPayments}
        />
      )}
    </div>
  );
}

export default Payments;
