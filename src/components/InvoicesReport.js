import React, { useState, useEffect } from "react";
import { FaPen, FaTrash, FaRobot } from "react-icons/fa";
import "./invoicesReport.css";
import AddInvoiceModal from "./invoices-modal/AddInvoiceModal";
import EditInvoiceModal from "./invoices-modal/EditInvoiceModal";

function InvoicesReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  // Simulación de facturas (esto vendría de tu BD)
  const [invoices, setInvoices] = useState([
    { id: 1, customer: "Cliente 1", amount: "$120.00", date: "2025-10-01", dueDate: "2025-10-15", state: "Pagada" },
    { id: 2, customer: "Cliente 2", amount: "$250.00", date: "2025-09-20", dueDate: "2025-09-30", state: "Vencida" },
    { id: 3, customer: "Cliente 3", amount: "$89.50", date: "2025-10-10", dueDate: "2025-10-25", state: "Pendiente" },
    { id: 4, customer: "Cliente 4", amount: "$350.00", date: "2025-09-01", dueDate: "2025-09-10", state: "Vencida" },
    { id: 5, customer: "Cliente 5", amount: "$150.00", date: "2025-10-12", dueDate: "2025-10-30", state: "Pendiente" },
  ]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredInvoices = invoices.filter(
    (i) =>
      i.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const displayedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // === Funciones CRUD ===
  const handleDelete = (id) => {
    setInvoices(invoices.filter((f) => f.id !== id));
  };

  const handleAddInvoice = (newInvoice) => {
    setInvoices([...invoices, { ...newInvoice, id: Date.now() }]);
    setShowAddModal(false);
  };

  const handleEditInvoice = (updatedInvoice) => {
    setInvoices(
      invoices.map((f) => (f.id === updatedInvoice.id ? updatedInvoice : f))
    );
    setShowEditModal(false);
  };

  // === Agente IA (simulación) ===
  const handleAiQuery = () => {
    const query = aiQuery.toLowerCase();
    let response = "";

    if (query.includes("pagadas")) {
      const count = invoices.filter((f) => f.state === "Pagada").length;
      response = `Actualmente hay ${count} facturas pagadas.`;
    } else if (query.includes("pendientes")) {
      const count = invoices.filter((f) => f.state === "Pendiente").length;
      response = `Hay ${count} facturas pendientes de pago.`;
    } else if (query.includes("vencidas")) {
      const count = invoices.filter((f) => f.state === "Vencida").length;
      response = `Se detectaron ${count} facturas vencidas.`;
    } else {
      response = "No entendí tu consulta. Prueba con 'pagadas', 'pendientes' o 'vencidas'.";
    }

    setAiResponse(response);
  };

  return (
    <div className="container-fluid invoices-container">
      <h1 className="mb-4">Reporte del Estado de Facturas</h1>

      {/* === Filtros y acciones === */}
      <div className="row mb-3 align-items-center">
        <div className="col-lg-6 col-md-6 d-flex justify-content-start mb-2">
          <input
            type="text"
            placeholder="Buscar factura o cliente..."
            className="form-control search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
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

      {/* === Tabla de facturas === */}
      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive clients-table-wrapper">
            <table className="table table-dark table-striped clients-table">
              <thead>
                <tr className="text-center">
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Monto</th>
                  <th>Fecha Emisión</th>
                  <th>Fecha Vencimiento</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedInvoices.length > 0 ? (
                  displayedInvoices.map((f) => (
                    <tr key={f.id} className="text-center">
                      <td>{f.id}</td>
                      <td>{f.customer}</td>
                      <td>{f.amount}</td>
                      <td>{f.date}</td>
                      <td>{f.dueDate}</td>
                      <td
                        className={
                          f.state === "Pagada"
                            ? "text-success"
                            : f.state === "Pendiente"
                            ? "text-warning"
                            : "text-danger"
                        }
                      >
                        {f.state}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm me-2"
                          style={{ backgroundColor: "#8A2CF1", color: "#fff" }}
                          onClick={() => {
                            setInvoiceToEdit(f);
                            setShowEditModal(true);
                          }}
                        >
                          <FaPen />
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ backgroundColor: "#e61610", color: "#fff" }}
                          onClick={() => handleDelete(f.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan="7">No se encontraron facturas</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* === Paginación === */}
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

      {/* === Agente IA === */}
      <div className="ai-section mt-4 p-3">
        <h4>
          <FaRobot className="me-2" />
          Agente IA de Consultas
        </h4>
        <div className="d-flex mt-2">
          <input
            type="text"
            placeholder="Ejemplo: ¿Cuántas facturas vencidas hay?"
            className="form-control search-input"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
          />
          <button className="btn ms-2 buscarClientes" onClick={handleAiQuery}>
            Consultar
          </button>
        </div>
        {aiResponse && (
          <div className="ai-response mt-3 p-2">
            <strong>Respuesta:</strong> {aiResponse}
          </div>
        )}
      </div>

      {/* === Modales === */}
      {showAddModal && (
        <AddInvoiceModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddInvoice}
        />
      )}
      {showEditModal && invoiceToEdit && (
        <EditInvoiceModal
          invoice={invoiceToEdit}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditInvoice}
        />
      )}
    </div>
  );
}

export default InvoicesReport;
