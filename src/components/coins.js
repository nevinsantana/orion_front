import React, { useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import "./coins.css";
import AddCoinsModal from "../components/coins-modal/addCoinsModal";
import EditCoinsModal from "../components/coins-modal/editCoinsModal";

function Coins() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [coinsToEdit, setCoinsToEdit] = useState(null);

  const [coins, setCoins] = useState([
    { id: 1, code: "USD",  nombre: "Dólar estadounidense", tipoCambio: "$18.39" },
    { id: 2, code: "EUR",  nombre: "Euro", tipoCambio: "$21.58" },
    { id: 3, code: "MXN",  nombre: "Peso mexicano", tipoCambio: "$1.00" },
    { id: 4, code: "USD",  nombre: "Dólar estadounidense", tipoCambio: "$18.39" },
    { id: 5, code: "EUR",  nombre: "Euro", tipoCambio: "$21.58" },
    { id: 6, code: "MXN",  nombre: "Peso mexicano", tipoCambio: "$1.00" },
    { id: 7, code: "USD",  nombre: "Dólar estadounidense", tipoCambio: "$18.39" },
    { id: 8, code: "EUR",  nombre: "Euro", tipoCambio: "$21.58" },
    { id: 9, code: "MXN",  nombre: "Peso mexicano", tipoCambio: "$1.00" },
    { id: 10, code: "USD",  nombre: "Dólar estadounidense", tipoCambio: "$18.39" },
    { id: 11, code: "EUR",  nombre: "Euro", tipoCambio: "$21.58" },
    { id: 12, code: "MXN",  nombre: "Peso mexicano", tipoCambio: "$1.00" },
    { id: 13, code: "USD",  nombre: "Dólar estadounidense", tipoCambio: "$18.39" },
    { id: 14, code: "EUR",  nombre: "Euro", tipoCambio: "$21.58" },
    { id: 15, code: "MXN",  nombre: "Peso mexicano", tipoCambio: "$1.00" },
    { id: 16, code: "USD",  nombre: "Dólar estadounidense", tipoCambio: "$18.39" },
    { id: 17, code: "EUR",  nombre: "Euro", tipoCambio: "$21.58" },
    { id: 18, code: "MXN",  nombre: "Peso mexicano", tipoCambio: "$1.00" },
    { id: 19, code: "USD",  nombre: "Dólar estadounidense", tipoCambio: "$18.39" },
    { id: 20, code: "EUR",  nombre: "Euro", tipoCambio: "$21.58" },
    { id: 21, code: "MXN",  nombre: "Peso mexicano", tipoCambio: "$1.00" },
    { id: 22, code: "USD",  nombre: "Dólar estadounidense", tipoCambio: "$18.39" },
    { id: 23, code: "EUR",  nombre: "Euro", tipoCambio: "$21.58" },
    { id: 24, code: "MXN",  nombre: "Peso mexicano", tipoCambio: "$1.00" },
    // ... más monedas
  ]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredCoins = coins.filter(
    (m) =>
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCoins.length / itemsPerPage);

  const displayedCoins = filteredCoins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id) => {
    setCoins(coins.filter((c) => c.id !== id));
  };

  const handleAddCoins = (newCoins) => {
    setCoins([...coins, { ...newCoins, id: Date.now() }]);
    setShowAddModal(false);
  };

  const handleEditCoins = (updatedCoins) => {
    setCoins(
      coins.map((m) => (m.id === updatedCoins.id ? updatedCoins : m))
    );
    setShowEditModal(false);
  };

  return (
    <div className="container-fluid clients-container">
      <h1 className="mb-4">Monedas</h1>

      <div className="row mb-3 align-items-center">
        <div className="col-lg-6 col-md-6 d-flex justify-content-start mb-2">
          <input
            type="text"
            placeholder="Buscar moneda..."
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
            Añadir Moneda
          </button>
        </div>
      </div>

      {/* Tabla responsiva */}
      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive clients-table-wrapper">
            <table className="table table-dark table-striped clients-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Tipo de cambio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedCoins.length > 0 ? (
                  displayedCoins.map((m) => (
                    <tr key={m.id}>
                      <td>{m.code}</td>
                      <td>{m.nombre}</td>
                      <td>{m.tipoCambio}</td>
                      <td>
                        <button
                          className="btn btn-sm me-2"
                          style={{ backgroundColor: "#8A2CF1", color: "#fff" }}
                          onClick={() => {
                            setCoinsToEdit(m);
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
                    <td colSpan="4">No se encontraron monedas</td>
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
