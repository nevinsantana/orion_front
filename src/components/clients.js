import React, { useState, useEffect } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import "./clients.css";
import AddClientModal from "../components/client-modal/addClientModal";
import EditClientModal from "../components/client-modal/editClientModal";
import axiosInstance from "../api/axiosInstance";
import Swal from "sweetalert2";

function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado en localStorage");
        return;
      }

      const response = await axiosInstance.get("/clients", {
        // headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Datos recibidos:", response.data);

      if (Array.isArray(response.data.Clients)) {
        setClients(response.data.Clients);
      } else {
        console.error("Formato de respuesta inesperado:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filtrado seguro con optional chaining
  const filteredClients = clients.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tax_address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const displayedClients = filteredClients.slice(
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
      text: "Esta acción eliminará al cliente.",
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
          `/clients/${id}`,
          // {
          //   headers: { Authorization: `Bearer ${token}` },
          // }
        );

        if (response.data.code === 1) {
          // Actualizamos la tabla localmente
          setClients((prev) => prev.filter((c) => c.id !== id));

          Swal.fire({
            title: "¡Eliminado!",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: "#8b5cf6",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: response.data.message || "No se pudo eliminar el cliente",
            icon: "error",
            confirmButtonColor: "#8b5cf6",
          });
        }
      } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        Swal.fire({
          title: "Error",
          text: "Ocurrió un error al eliminar el cliente",
          icon: "error",
          confirmButtonColor: "#8b5cf6",
        });
      }
    }
  };

  // Agregar nuevo cliente usando la respuesta del backend
  const handleAddClient = (newClient) => {
    setClients((prev) => [...prev, newClient]); // usar el objeto completo recibido del backend
    setCurrentPage(1);
    setSearchTerm("");
    setShowAddModal(false);
    // fetchClients();
  };

  // Editar cliente existente
  const handleEditClient = (updatedClient) => {
    setClients((prev) =>
      prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    );
    setShowEditModal(false);
    // fetchClients();
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
              setCurrentPage(1); // Reset page al buscar
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
                  <th>Nombre Contacto</th>
                  <th>Correo electrónico</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedClients.length > 0 ? (
                  displayedClients.map((c) => (
                    <tr key={c.id} className="text-center">
                      <td>{c.name || "-"}</td>
                      <td>{c.contact_name || "-"}</td>
                      <td>{c.contact_email || "-"}</td>
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
                    <td colSpan="13">No se encontraron clientes</td>
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
