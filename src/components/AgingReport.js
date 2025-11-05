import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../api/axiosInstance";
import "./AgingReport.css";

function AgingReport() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // === Obtener datos ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/invoiceReports/data");
        const invoices = res.data.body || [];
        const pending = invoices.filter(
          (inv) => inv.status !== "Pagada" && inv.status !== "Cancelada"
        );
        setData(pending);
        setFilteredData(pending);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "No se pudo obtener la información del reporte.",
          background: "#1e1e1e",
          color: "#fff",
        });
      }
    };
    fetchData();
  }, []);

  // === Filtrado ===
  const handleSearch = () => {
    let filtered = [...data];

    // Filtro por fecha
    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const fecha = new Date(item.due_date);
        return fecha >= new Date(startDate) && fecha <= new Date(endDate);
      });
    }

    // Filtro por texto (cliente o estado)
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (item) =>
          item.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setFilteredData(data);
  };

  // === Cálculo de antigüedad ===
  const getAgingDays = (dueDate) => {
    const hoy = new Date();
    const vencimiento = new Date(dueDate);
    const diff = Math.floor((hoy - vencimiento) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const getAgingCategory = (days) => {
    if (days <= 30) return "0-30 días";
    if (days <= 60) return "31-60 días";
    if (days <= 90) return "61-90 días";
    return "90+ días";
  };

  // === Paginación ===
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  return (
    <div className="aging-container">
      <h1 className="report-title">Reporte de Antigüedad de Cuentas por Cobrar</h1>

      <div className="report-header">
        <div className="records-control">
          <label>Mostrar</label>
          <select
            className="select-dark"
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(parseInt(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <label>Registros</label>
        </div>

        <div className="filters-control">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input-dark"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input-dark"
          />
          <input
            type="text"
            placeholder="Buscar por cliente o estado"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-dark"
          />
          <button className="btn-purple" onClick={handleSearch}>
            Buscar
          </button>
          <button className="btn-red" onClick={handleClear}>
            Limpiar
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Fecha Vencimiento</th>
              <th>Días Vencidos</th>
              <th>Rango</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((item, idx) => {
                const days = getAgingDays(item.due_date);
                const range = getAgingCategory(days);
                return (
                  <tr key={idx}>
                    <td>{item.id}</td>
                    <td>{item.client?.name}</td>
                    <td>${item.total_amount.toLocaleString()}</td>
                    <td>{new Date(item.due_date).toLocaleDateString()}</td>
                    <td>{days}</td>
                    <td>{range}</td>
                    <td>{item.status}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No hay registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Anterior
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default AgingReport;
