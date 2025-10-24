import React, { useState } from "react";
import { FaPen, FaTrash, FaRobot } from "react-icons/fa";
import "./InvoicesReport.css";
import AddInvoiceModal from "../components/report-invoices-modal/AddInvoiceModal";
import EditInvoiceModal from "../components/report-invoices-modal/EditInvoiceModal";
import AiAssistantModal from "../components/report-invoices-modal/AiAssistantModal";
import Swal from "sweetalert2";

function InvoicesReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);

  const [invoices, setInvoices] = useState([
    {
      cliente: "Juan Pérez",
      monto: "$250.00",
      fecha_emision: "2025-10-01",
      estado: "Pagada",
    },
    {
      cliente: "María López",
      monto: "$450.00",
      fecha_emision: "2025-09-28",
      estado: "Pendiente",
    },
    {
      cliente: "Carlos García",
      monto: "$320.00",
      fecha_emision: "2025-09-15",
      estado: "Vencida",
    },
  ]);

  const filteredInvoices = invoices.filter(
    (i) =>
      i.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // === Añadir ===
  const handleAddInvoice = (newInvoice) => {
    setInvoices([...invoices, newInvoice]);
    setShowAddModal(false);

    Swal.fire({
      icon: "success",
      title: "Factura añadida",
      text: "La nueva factura se ha registrado correctamente.",
      background: "#1e1e1e",
      color: "#fff",
      confirmButtonColor: "#6e23c1",
    });
  };

  // === Editar ===
  const handleEditInvoice = (updatedInvoice) => {
    setInvoices(
      invoices.map((inv, index) =>
        index === updatedInvoice.index ? updatedInvoice : inv
      )
    );
    setShowEditModal(false);

    Swal.fire({
      icon: "success",
      title: "Factura actualizada",
      text: "Los cambios se guardaron correctamente.",
      background: "#1e1e1e",
      color: "#fff",
      confirmButtonColor: "#6e23c1",
    });
  };

  // === Eliminar ===
  const handleDelete = (index) => {
    const invoice = invoices[index];

    Swal.fire({
      title: "¿Eliminar factura?",
      text: `Se eliminará la factura de ${invoice.cliente}.`,
      icon: "warning",
      background: "#1e1e1e",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#e61610",
      cancelButtonColor: "#6e23c1",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setInvoices(invoices.filter((_, i) => i !== index));
        Swal.fire({
          icon: "success",
          title: "Factura eliminada",
          text: "La factura ha sido eliminada correctamente.",
          background: "#1e1e1e",
          color: "#fff",
          confirmButtonColor: "#6e23c1",
        });
      }
    });
  };

  return (
    <div className="container-fluid invoices-container">
      <h1 className="mb-4">Reporte del Estado de Facturas</h1>

      {/* === Buscador y Botones === */}
      <div className="row mb-3 align-items-center">
        <div className="col-lg-6 d-flex justify-content-start mb-2">
          <input
            type="text"
            placeholder="Buscar factura..."
            className="form-control search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn ms-2 searchBtn">Buscar</button>
        </div>
        <div className="col-lg-6 d-flex justify-content-end">
          <button
            className="btn addBtn me-2"
            onClick={() => setShowAddModal(true)}
          >
            Añadir Factura
          </button>
          <button
            className="btn aiBtn d-flex align-items-center"
            onClick={() => setShowAiModal(true)}
          >
            <FaRobot className="me-2" /> Asistente IA
          </button>
        </div>
      </div>

      {/* === Tabla de facturas === */}
      <div className="table-responsive invoices-table-wrapper">
        <table className="table table-dark table-striped text-center">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Fecha Emisión</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((i, index) => (
                <tr key={index}>
                  <td>{i.cliente}</td>
                  <td>{i.monto}</td>
                  <td>{i.fecha_emision}</td>
                  <td
                    className={
                      i.estado === "Pagada"
                        ? "estado pagada"
                        : i.estado === "Pendiente"
                        ? "estado pendiente"
                        : "estado vencida"
                    }
                  >
                    {i.estado}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm me-2 editBtn"
                      onClick={() => {
                        setInvoiceToEdit({ ...i, index });
                        setShowEditModal(true);
                      }}
                    >
                      <FaPen />
                    </button>
                    <button
                      className="btn btn-sm deleteBtn"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No se encontraron facturas</td>
              </tr>
            )}
          </tbody>
        </table>
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
      {showAiModal && (
        <AiAssistantModal
          onClose={() => setShowAiModal(false)}
          invoices={invoices}
        />
      )}
    </div>
  );
}

export default InvoicesReport;