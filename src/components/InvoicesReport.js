import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPen, FaTrash, FaRobot, FaDownload } from "react-icons/fa";
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
  const [invoices, setInvoices] = useState([]);

  const token = localStorage.getItem("token");

  // Cargar datos del backend ===
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get("/api/invoiceReports/data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoices(res.data?.data || []); // Suponiendo que el backend devuelve { data: [...] }
      } catch (err) {
        console.error("Error cargando facturas:", err);

        let message = "No se pudieron cargar las facturas.";
        if (err.response?.data?.message) {
          message = err.response.data.message;
        }

        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: message,
          background: "#1e1e1e",
          color: "#fff",
        });
      }
    };

    if (token) {
      fetchInvoices();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Sesión no iniciada",
        text: "Por favor, inicia sesión para ver los reportes.",
        background: "#1e1e1e",
        color: "#fff",
      });
    }
  }, [token]);

  // === 🧠 Buscar facturas ===
  const filteredInvoices = invoices.filter(
    (i) =>
      i.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.estado?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // === ➕ Añadir factura ===
  const handleAddInvoice = (newInvoice) => {
    setInvoices([...invoices, newInvoice]);
    setShowAddModal(false);
    Swal.fire({
      icon: "success",
      title: "Factura añadida (local)",
      text: "Solo se añadió localmente. Backend no implementa POST todavía.",
      background: "#1e1e1e",
      color: "#fff",
      confirmButtonColor: "#6e23c1",
    });
  };

  // === ✏️ Editar factura ===
  const handleEditInvoice = (updatedInvoice) => {
    setInvoices(
      invoices.map((inv, index) =>
        index === updatedInvoice.index ? updatedInvoice : inv
      )
    );
    setShowEditModal(false);
    Swal.fire({
      icon: "success",
      title: "Factura actualizada (local)",
      text: "Solo se editó localmente.",
      background: "#1e1e1e",
      color: "#fff",
      confirmButtonColor: "#6e23c1",
    });
  };

  // === 🗑️ Eliminar factura ===
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
          title: "Factura eliminada (local)",
          text: "Solo se eliminó localmente.",
          background: "#1e1e1e",
          color: "#fff",
          confirmButtonColor: "#6e23c1",
        });
      }
    });
  };

  // === 📥 Descargar XLS desde el backend ===
  const handleDownloadXLS = async (invoiceId) => {
    try {
      const response = await axios.post(
        "/api/invoiceReports/xls",
        { invoiceId }, // si el backend necesita un id
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Muy importante para descargar archivos
        }
      );

      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte_factura_${invoiceId}.xls`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire({
        icon: "success",
        title: "Descarga completada",
        text: "El reporte XLS se ha descargado correctamente.",
        background: "#1e1e1e",
        color: "#fff",
        confirmButtonColor: "#6e23c1",
      });
    } catch (error) {
      console.error("Error al generar el XLS:", error);
      Swal.fire({
        icon: "error",
        title: "Error al descargar XLS",
        text:
          error.response?.data?.message ||
          "No se pudo generar o descargar el archivo.",
        background: "#1e1e1e",
        color: "#fff",
      });
    }
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
                <tr key={i._id || index}>
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
                  <td className="d-flex justify-content-center">
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
                      className="btn btn-sm me-2 deleteBtn"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrash />
                    </button>

                    {/* Botón para descargar XLS */}
                    <button
                      className="btn btn-sm downloadBtn"
                      onClick={() => handleDownloadXLS(i._id || index)}
                    >
                      <FaDownload />
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
