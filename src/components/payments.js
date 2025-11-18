import React, { useState, useEffect } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import "./payments.css";
import AddPaymentsModal from "./payments-modal/addPaymentsModal";
import EditPaymentsModal from "./payments-modal/editPaymentsModal";
import Swal from "sweetalert2";
import axiosInstance from "../api/axiosInstance";

function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [paymentsToEdit, setPaymentsToEdit] = useState(null);
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado en localStorage");
        return;
      }

      const response = await axiosInstance.get("/paymentHistory", {
        // headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Pagos recibidos:", response.data);

      if (response.data.code === 1 && Array.isArray(response.data.data)) {
        setPayments(response.data.data);
      } else {
        console.error("Formato de respuesta inesperado:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener los pagos:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filtrado seguro con optional chaining
  const filteredPayments = payments.filter(
    (m) =>
      (m.paymentDate?.toLowerCase?.() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (m.paymentMethod?.toLowerCase?.() || "").includes(
        searchTerm.toLowerCase()
      )
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const displayedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Función para eliminar pago desde el backend
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado en localStorage");
      return;
    }

    // Confirmación antes de eliminar
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el Historial de pago.",
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
          `/paymentHistory/${id}`,
          // {
          //   headers: { Authorization: `Bearer ${token}` },
          // }
        );

        if (response.data.code === 1) {
          // Actualizamos la tabla localmente
          // setPayments((prev) => prev.filter((m) => m.id !== id));
          await fetchPayments();

          Swal.fire({
            title: "¡Eliminado!",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: "#8b5cf6",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: response.data.message || "No se pudo eliminar el Histrorial de pago",
            icon: "error",
            confirmButtonColor: "#8b5cf6",
          });
        }
      } catch (error) {
        console.error("Error al eliminar el historial de pago:", error);
        Swal.fire({
          title: "Error",
          text: "Ocurrió un error al eliminar el historial de pago",
          icon: "error",
          confirmButtonColor: "#8b5cf6",
        });
      }
    }
  };

  // Agregar nuevo pago usando la respuesta del backend
  const handleAddPayments = (newPayments) => {
    setPayments((prev) => [...prev, newPayments]);
    // setPayments([...payments, { ...newPayments, id: Date.now() }]);
    setShowAddModal(false);
  };

  // Editar pago existente
  const handleEditPayments = (updatedPayments) => {
  if (!updatedPayments || !updatedPayments.id) {
    console.error("Error: el pago actualizado no tiene ID", updatedPayments);
    return;
  }

  setPayments((prev) =>
    prev.map((m) => (m.id === updatedPayments.id ? updatedPayments : m))
  );

  setShowEditModal(false);
};

  // const handleEditPayments = (updatedPayments) => {
  //   setPayments(
  //     payments.map((m) => (m.id === updatedPayments.id ? updatedPayments : m))
  //   );
  //   setShowEditModal(false);
  // };

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
            Añadir Pago
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
                  <th>Fecha Pago</th>
                  <th>Importe</th>
                  <th>Método Pago</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedPayments.length > 0 ? (
                  displayedPayments.map((m) => (
                    <tr key={m.id} className="text-center">
                      <td>{m.id}</td>
                      <td>{new Date(m.paymentDate).toLocaleDateString()}</td>
                      <td>{m.amount}</td>
                      <td>{m.paymentMethod}</td>
                      <td>{m.description}</td>
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
                    <td colSpan="8">No se encontraron historiales</td>
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
