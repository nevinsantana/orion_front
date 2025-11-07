import React, { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";
import Swal from "sweetalert2";
import "./payments.css";
import EditPaymentTrackingModal from "./paymentTracking-modal/editPatmentTrackingModal";

function PaymentTracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [trackingToEdit, setTrackingToEdit] = useState(null);
  const [payments, setPayments] = useState([]);

  // Datos simulados (mock)
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        client: "Juan Pérez",
        amount: 1500,
        paymentDate: "2025-11-07",
        paymentMethod: "Transferencia",
        status: "Pendiente",
        comments: "Esperando confirmación bancaria",
      },
      {
        id: 2,
        client: "María López",
        amount: 2200,
        paymentDate: "2025-11-05",
        paymentMethod: "Tarjeta crédito",
        status: "Confirmado",
        comments: "Pago confirmado el mismo día",
      },
      {
        id: 3,
        client: "Carlos Hernández",
        amount: 500,
        paymentDate: "2025-11-03",
        paymentMethod: "Efectivo",
        status: "Rechazado",
        comments: "Fondos insuficientes",
      },
    ];
    setPayments(mockData);
  }, []);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPayments = payments.filter(
    (p) =>
      p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const displayedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Editar
  const handleEdit = (payment) => {
    setTrackingToEdit(payment);
    setShowEditModal(true);
  };

  // Guardar cambios
  const handleEditSave = (updatedPayment) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === updatedPayment.id ? updatedPayment : p))
    );

    Swal.fire({
      icon: "success",
      title: "Actualizado",
      text: "El seguimiento del pago ha sido actualizado correctamente.",
      confirmButtonColor: "#8b5cf6",
    });

    setShowEditModal(false);
  };

  return (
    <div className="container-fluid clients-container">
      <h1 className="mb-4">Seguimiento / Notificaciones de Pago</h1>

      {/* Filtro de búsqueda */}
      <div className="row mb-3 align-items-center">
        <div className="col-lg-6 col-md-6 d-flex justify-content-start mb-2">
          <input
            type="text"
            placeholder="Buscar por cliente o estatus..."
            className="form-control search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button className="btn ms-2 buscarClientes">Buscar</button>
        </div>
      </div>

      {/* Tabla */}
      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive clients-table-wrapper">
            <table className="table table-dark table-striped clients-table">
              <thead>
                <tr className="text-center">
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Fecha Pago</th>
                  <th>Importe</th>
                  <th>Método</th>
                  <th>Estatus</th>
                  <th>Comentarios</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedPayments.length > 0 ? (
                  displayedPayments.map((p) => (
                    <tr key={p.id} className="text-center">
                      <td>{p.id}</td>
                      <td>{p.client}</td>
                      <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                      <td>${p.amount}</td>
                      <td>{p.paymentMethod}</td>
                      <td>{p.status}</td>
                      <td>{p.comments}</td>
                      <td>
                        <button
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#8A2CF1",
                            color: "#fff",
                          }}
                          onClick={() => handleEdit(p)}
                        >
                          <FaPen />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan="8">No se encontraron registros</td>
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


      {/* Modal de edición */}
      {showEditModal && trackingToEdit && (
        <EditPaymentTrackingModal
          tracking={trackingToEdit}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

export default PaymentTracking;
