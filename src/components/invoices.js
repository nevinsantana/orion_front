import React, { useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import "./invoices.css";
import AddInvoicesModal from "./invoices-modal/addInvoicesModal";
import EditInvoicesModal from "./invoices-modal/editInvoicesModal";

function Invoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [invoicesToEdit, setInvoicesToEdit] = useState(null);

//   const [payments, setPayments] = useState([
//     { id: 1, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 1", state: "Completo" },
//     { id: 2, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$100.00", date: "12-04-2025", customer: "Cliente 2", state: "Completo" },
//     { id: 3, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 3", state: "Completo" },
//     { id: 4, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 4", state: "Completo" },
//     { id: 5, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 5", state: "Completo" },
//     { id: 6, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 6", state: "Completo" },
//     { id: 7, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 7", state: "Completo" },
//     { id: 8, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 8", state: "Completo" },
//     { id: 9, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 9", state: "Completo" },
//     { id: 10, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 10", state: "Completo" },
//     { id: 11, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 11", state: "Completo" },
//     { id: 12, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 12", state: "Completo" },
//     { id: 13, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 13", state: "Completo" },
//     { id: 14, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 14", state: "Completo" },
//     { id: 15, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 15", state: "Completo" },
//     { id: 16, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 16", state: "Completo" },
//     { id: 17, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 17", state: "Completo" },
//     { id: 18, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 18", state: "Completo" },
//     { id: 19, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 19", state: "Completo" },
//     { id: 20, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 20", state: "Completo" },
//     { id: 21, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 21", state: "Completo" },
//     { id: 22, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 22", state: "Completo" },
//     { id: 23, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 23", state: "Completo" },
//     { id: 24, email: "micorreo@gmail.com",  details: "Ver los detalles del pedido", amount: "$18.39", date: "12-04-2025", customer: "Cliente 24", state: "Completo" },
//     // ... más monedas
//   ]);

  const [invoices, setInvoices] = useState([
    { id: 1, date: "12-04-2025", customer: "Cliente 1", amount: "$18.39" },
    { id: 2, date: "12-04-2025", customer: "Cliente 2", amount: "$18.39" },
    { id: 3, date: "12-04-2025", customer: "Cliente 3", amount: "$18.39" },
    { id: 4, date: "12-04-2025", customer: "Cliente 4", amount: "$18.39" },
    { id: 5, date: "12-04-2025", customer: "Cliente 5", amount: "$18.39" },
    { id: 6, date: "12-04-2025", customer: "Cliente 6", amount: "$18.39" },
    { id: 7, date: "12-04-2025", customer: "Cliente 7", amount: "$18.39" },
    { id: 8, date: "12-04-2025", customer: "Cliente 8", amount: "$18.39" },
    { id: 9, date: "12-04-2025", customer: "Cliente 9", amount: "$18.39" },
    { id: 10, date: "12-04-2025", customer: "Cliente 10", amount: "$18.39" },
    { id: 11, date: "12-04-2025", customer: "Cliente 11", amount: "$18.39" },
    { id: 12, date: "12-04-2025", customer: "Cliente 12", amount: "$18.39" },
    { id: 13, date: "12-04-2025", customer: "Cliente 13", amount: "$18.39" },
    { id: 14, date: "12-04-2025", customer: "Cliente 14", amount: "$18.39" },
    { id: 15, date: "12-04-2025", customer: "Cliente 15", amount: "$18.39" },
    { id: 16, date: "12-04-2025", customer: "Cliente 16", amount: "$18.39" },
    { id: 17, date: "12-04-2025", customer: "Cliente 17", amount: "$18.39" },
    { id: 18, date: "12-04-2025", customer: "Cliente 18", amount: "$18.39" },
    { id: 19, date: "12-04-2025", customer: "Cliente 19", amount: "$18.39" },
    { id: 20, date: "12-04-2025", customer: "Cliente 20", amount: "$18.39" },
    { id: 21, date: "12-04-2025", customer: "Cliente 21", amount: "$18.39" },
    { id: 22, date: "12-04-2025", customer: "Cliente 22", amount: "$18.39" },
    { id: 23, date: "12-04-2025", customer: "Cliente 23", amount: "$18.39" },
    { id: 24, date: "12-04-2025", customer: "Cliente 24", amount: "$18.39" },
    // ... más monedas
  ]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredInvoices = invoices.filter(
    (m) =>
      m.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const displayedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id) => {
    setInvoices(invoices.filter((c) => c.id !== id));
  };

  const handleAddInvoices = (newInvoices) => {
    setInvoices([...invoices, { ...newInvoices, id: Date.now() }]);
    setShowAddModal(false);
  };

  const handleEditInvoices = (updatedInvoices) => {
    setInvoices(
      invoices.map((m) => (m.id === updatedInvoices.id ? updatedInvoices : m))
    );
    setShowEditModal(false);
  };

  return (
    <div className="container-fluid clients-container">
      <h1 className="mb-4">Facturas</h1>

      <div className="row mb-3 align-items-center">
        <div className="col-lg-6 col-md-6 d-flex justify-content-start mb-2">
          <input
            type="text"
            placeholder="Buscar factura..."
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
            Añadir Factura
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
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Monto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedInvoices.length > 0 ? (
                  displayedInvoices.map((m) => (
                    <tr key={m.id} className="text-center">
                      <td>{m.id}</td>
                      <td>{m.date}</td>
                      <td>{m.customer}</td>
                      <td>{m.amount}</td>
                      <td>
                        <button
                          className="btn btn-sm me-2"
                          style={{ backgroundColor: "#8A2CF1", color: "#fff" }}
                          onClick={() => {
                            setInvoicesToEdit(m);
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
                    <td colSpan="5">No se encontraron facturas</td>
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
        <AddInvoicesModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddInvoices}
        />
      )}
      {showEditModal && invoicesToEdit && (
        <EditInvoicesModal
          invoices={invoicesToEdit}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditInvoices}
        />
      )}
    </div>
  );
}

export default Invoices;
