import React, { useState, useEffect } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import "./invoices.css";
import AddInvoicesModal from "./invoices-modal/addInvoicesModal";
import EditInvoicesModal from "./invoices-modal/editInvoicesModal";
import Swal from "sweetalert2";
import axiosInstance from "../api/axiosConfig";

function Invoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [invoicesToEdit, setInvoicesToEdit] = useState(null);
  const [invoices, setInvoices] = useState([]);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado en localStorage");
        return;
      }

      const response = await axiosInstance.get("/Invoices", {
        // headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Datos recibidos:", response.data);

      if (Array.isArray(response.data.invoices)) {
        setInvoices(response.data.invoices);
      } else {
        console.error("Formato de respuesta inesperado:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filtrado seguro con optional chaining
  const filteredInvoices = invoices.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.tax_address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const displayedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Función para eliminar cliente desde el backend
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado en localStorage");
      return;
    }

    // Confirmación antes de eliminar
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la factura.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#e61610",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          `/invoices/${id}`,
          // {
          //   headers: { Authorization: `Bearer ${token}` },
          // }
        );

        if (response.data.code === 1) {
          // Actualizamos la tabla localmente
          setInvoices((prev) => prev.filter((m) => m.id !== id));

          Swal.fire({
            title: "¡Eliminado!",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: "#8b5cf6",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: response.data.message || "No se pudo eliminar la factura",
            icon: "error",
            confirmButtonColor: "#8b5cf6",
          });
        }
      } catch (error) {
        console.error("Error al eliminar la factura:", error);
        Swal.fire({
          title: "Error",
          text: "Ocurrió un error al eliminar la factura",
          icon: "error",
          confirmButtonColor: "#8b5cf6",
        });
      }
    }
  };

  // Agregar nuevo cliente usando la respuesta del backend
  const handleAddInvoices = (newInvoices) => {
    setInvoices((prev) => [...prev, newInvoices]);
    setCurrentPage(1);
    setSearchTerm("");
    setShowAddModal(false);
  };

  // Editar cliente existente
  const handleEditInvoices = (updatedInvoices) => {
    setInvoices((prev) =>
      prev.map((m) => (m.id === updatedInvoices.id ? updatedInvoices : m))
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
                  <th>Nombre</th>
                  <th>Nombre Contacto</th>
                  <th>RFC</th>
                  <th>Correo electrónico</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedInvoices.length > 0 ? (
                  displayedInvoices.map((m) => (
                    <tr key={m.id} className="text-center">
                      <td>{m.name}</td>
                      <td>{m.contact_name}</td>
                      <td>{m.rfc}</td>
                      <td>{m.contact_email}</td>
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
