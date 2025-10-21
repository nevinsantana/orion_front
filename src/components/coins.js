import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPen, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import "./coins.css";
import AddCoinsModal from "../components/coins-modal/addCoinsModal";
import EditCoinsModal from "../components/coins-modal/editCoinsModal";
import { Container, Row, Col, Card, InputGroup, Button, Form, Modal, Table, Pagination } from 'react-bootstrap';


// 🔹 Base API
const BASE_API_URL = "http://localhost:7777/api";
const API_ENDPOINT_COINS = `${BASE_API_URL}/coins`;

// 🔐 Obtener encabezados de autorización
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { authorization: `Bearer ${token}` } : {};
};

function Coins() {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [coinsToEdit, setCoinsToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🔹 Obtener monedas
  const getCoins = async () => {
    try {
      const res = await axios.get(API_ENDPOINT_COINS, {
        headers: getAuthHeaders(),
      });

      if (res.data.code === 1 && Array.isArray(res.data.Coins)) {
        setCoins(res.data.Coins);
      } else if (Array.isArray(res.data)) {
        setCoins(res.data);
      } else {
        setCoins([]);
      }
    } catch (error) {
      console.error("Error al obtener monedas:", error);
      Swal.fire({
        title: "Error de Carga",
        text: "No se pudieron cargar las monedas. Revisa la conexión con el backend.",
        icon: "error",
        background: "#121212",
        color: "#e0e0e0",
      });
    }
  };

  // 🔹 Crear moneda
  const addCoin = async (newCoin) => {
    try {
      const res = await axios.post(API_ENDPOINT_COINS, newCoin, {
        headers: getAuthHeaders(),
      });

      if (res.data.code === 1 || res.status === 201) {
        Swal.fire({
          title: "¡Moneda Creada!",
          text: "La moneda se ha agregado correctamente.",
          icon: "success",
          background: "#121212",
          color: "#e0e0e0",
        });
        getCoins();
        setShowAddModal(false);
      } else {
        Swal.fire({
          title: "Error",
          text: res.data.message || "No se pudo crear la moneda.",
          icon: "error",
          background: "#121212",
          color: "#e0e0e0",
        });
      }
    } catch (error) {
      console.error("Error al crear moneda:", error);
      Swal.fire({
        title: "Error de Conexión",
        text: "No se pudo conectar al servidor para crear la moneda.",
        icon: "error",
        background: "#121212",
        color: "#e0e0e0",
      });
    }
  };

  // 🔹 Actualizar moneda
  const updateCoin = async (id, updatedCoin) => {
    try {
      const res = await axios.put(`${API_ENDPOINT_COINS}/${id}`, updatedCoin, {
        headers: getAuthHeaders(),
      });

      if (res.data.code === 1 || res.status === 200) {
        Swal.fire({
          title: "¡Actualizada!",
          text: "La moneda se actualizó correctamente.",
          icon: "success",
          background: "#121212",
          color: "#e0e0e0",
        });
        getCoins();
        setShowEditModal(false);
      } else {
        Swal.fire({
          title: "Error",
          text: res.data.message || "No se pudo actualizar la moneda.",
          icon: "error",
          background: "#121212",
          color: "#e0e0e0",
        });
      }
    } catch (error) {
      console.error("Error al actualizar moneda:", error);
      Swal.fire({
        title: "Error de Conexión",
        text: "No se pudo conectar al servidor para actualizar la moneda.",
        icon: "error",
        background: "#121212",
        color: "#e0e0e0",
      });
    }
  };

  // 🔹 Eliminar moneda
  const deleteCoin = async (id) => {
    try {
      const res = await axios.delete(`${API_ENDPOINT_COINS}/${id}`, {
        headers: getAuthHeaders(),
      });

      if (res.data.code === 1 || res.status === 200) {
        Swal.fire({
          title: "¡Eliminada!",
          text: "La moneda se ha eliminado correctamente.",
          icon: "success",
          background: "#121212",
          color: "#e0e0e0",
        });
        getCoins();
      } else {
        Swal.fire({
          title: "Error",
          text: res.data.message || "No se pudo eliminar la moneda.",
          icon: "error",
          background: "#121212",
          color: "#e0e0e0",
        });
      }
    } catch (error) {
      console.error("Error al eliminar moneda:", error);
      Swal.fire({
        title: "Error de Conexión",
        text: "No se pudo conectar al servidor para eliminar la moneda.",
        icon: "error",
        background: "#121212",
        color: "#e0e0e0",
      });
    }
  };

  // 🔹 Confirmar eliminación
  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e61610",
      cancelButtonColor: "#8a2cf1",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#121212",
      color: "#e0e0e0",
    }).then((result) => {
      if (result.isConfirmed) deleteCoin(id);
    });
  };

  // 🔹 Mostrar modal de edición
  const handleEdit = (id) => {
    const coin = coins.find((c) => c.id === id);
    setCoinsToEdit(coin);
    setShowEditModal(true);
  };

  useEffect(() => {
    getCoins();
  }, []);

  // 🔹 Filtrado
  const filteredCoins = coins.filter(
    (coin) =>
      coin.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Paginación
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const displayedCoins = filteredCoins.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCoins.length / itemsPerPage);

  // 🔹 Guardar desde modales
  const handleAddCoins = (newCoin) => addCoin(newCoin);
  const handleEditCoins = (updatedCoin) =>
    updateCoin(coinsToEdit.id, updatedCoin);

  return (
    <div className="container-fluid clients-container">
      <h1 className="mb-4">Monedas</h1>

      <div className="row mb-3 align-items-center">
        <div className="col-lg-6 d-flex">
          <input
            type="text"
            placeholder="Buscar moneda..."
            className="form-control search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Button variant="btn" className="btn ms-2 buscarClientes">Buscar</Button>
        </div>

        <div className="col-lg-6 d-flex justify-content-end">
          <button
            className="btn addCoin addCliente"
            onClick={() => setShowAddModal(true)}
          >
            Añadir Moneda
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-striped text-center">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {displayedCoins.length > 0 ? (
              displayedCoins.map((m) => (
                <tr key={m.id}>
                  <td>{m.code}</td>
                  <td>{m.name}</td>
                  <td>
    
                    <button
                      className="btn btn-sm btn-warning me-2 edit-button"
                      onClick={() => handleEdit(m.id)}
                    >
                      <FaPen />
                    </button>
                    <button
                      className="btn btn-sm btn-danger delete-button"
                      onClick={() => handleDelete(m.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No se encontraron monedas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <ul className="pagination justify-content-center mt-3">
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
        </ul>
      )}

      {showAddModal && (
        <AddCoinsModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddCoins}
        />
      )}
      {showEditModal && coinsToEdit && (
        <EditCoinsModal
          coins={coinsToEdit}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditCoins}
        />
      )}
    </div>
  );
}

export default Coins;
