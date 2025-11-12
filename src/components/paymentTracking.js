import React, { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";
import Swal from "sweetalert2";
import "./payments.css";
import EditPaymentTrackingModal from "./paymentTracking-modal/editPatmentTrackingModal";
import axiosInstance from "../api/axiosConfig";

function PaymentTracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [trackingToEdit, setTrackingToEdit] = useState(null);
  const [payments, setPayments] = useState([]);

  // ✅ Cargar datos reales desde el backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axiosInstance.get("/paymentFollowUp/portfolio");
        if (!response.data.error) {
          // Ajustamos el formato a lo que espera la tabla
          const formattedData = response.data.body.map((item) => ({
            id: item.id,
            client: item.client?.name || "Sin nombre",
            amount: item.total_amount,
            paymentDate: item.due_date,
            paymentMethod: item.metodo_pago,
            status: item.status,
            comments: `Saldo pendiente: $${item.saldoPendiente}`,
          }));
          setPayments(formattedData);
        }
      } catch (error) {
        console.error("Error al obtener los pagos:", error);
        Swal.fire({
          icon: "error",
          title: "Error al cargar datos",
          text: "No se pudieron obtener los registros de seguimiento de pago.",
          confirmButtonColor: "#8b5cf6",
        });
      }
    };

    fetchPayments();
  }, []);

  // Datos simulados (mock)
  // useEffect(() => {
  //   const mockData = [
  //     {
  //       id: 1,
  //       client: "Juan Pérez",
  //       amount: 1500,
  //       paymentDate: "2025-11-07",
  //       paymentMethod: "Transferencia",
  //       status: "Pendiente",
  //       comments: "Esperando confirmación bancaria",
  //     },
  //     {
  //       id: 2,
  //       client: "María López",
  //       amount: 2200,
  //       paymentDate: "2025-11-05",
  //       paymentMethod: "Tarjeta crédito",
  //       status: "Confirmado",
  //       comments: "Pago confirmado el mismo día",
  //     },
  //     {
  //       id: 3,
  //       client: "Carlos Hernández",
  //       amount: 500,
  //       paymentDate: "2025-11-03",
  //       paymentMethod: "Efectivo",
  //       status: "Rechazado",
  //       comments: "Fondos insuficientes",
  //     },
  //     {
  //       id: 4,
  //       client: "Luis Martínez",
  //       amount: 1200,
  //       paymentDate: "2025-11-09",
  //       paymentMethod: "Transferencia",
  //       status: "Por vencer",
  //       comments: "Pago próximo a vencer",
  //     },
  //   ];
  //   setPayments(mockData);
  // }, []);

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

  // 🔹 Función para obtener clase CSS según el estado
  const getStatusClass = (status) => {
    if (!status) return "status-gray";

    const normalized = status.toLowerCase().trim();

    if (
      normalized === "pagado" ||
      normalized === "pagada" ||
      normalized === "confirmado"
    ) {
      return "status-green";
    }

    if (normalized === "pendiente") {
      return "status-orange";
    }

    if (normalized === "por vencer" || normalized === "porvencer") {
      return "status-yellow";
    }

    if (
      normalized === "rechazado" ||
      normalized === "vencido" ||
      normalized === "vencida"
    ) {
      return "status-red";
    }

    return "status-gray";
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
                      <td>
                        <span
                          className={`status-badge ${getStatusClass(p.status)}`}
                        >
                          {p.status}
                        </span>
                      </td>
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
