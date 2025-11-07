import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../api/axiosInstance"; // 👈 Importa tu configuración de axios centralizada
import "./InvoicesReport.css";

function InvoicesReport() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // === Obtener datos del backend ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/invoiceReports/data");
        setData(res.data.body || []);
        setFilteredData(res.data.body || []);
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
  }, [token]);

  // === Filtro por fechas ===
  const handleSearch = () => {
    if (!startDate || !endDate) {
      Swal.fire({
        icon: "warning",
        title: "Fechas requeridas",
        text: "Por favor selecciona ambas fechas.",
        background: "#1e1e1e",
        color: "#fff",
      });
      return;
    }

    const filtered = data.filter((item) => {
      const fecha = new Date(item.fecha_emision);
      return fecha >= new Date(startDate) && fecha <= new Date(endDate);
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // === Limpiar filtros ===
  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setFilteredData(data);
  };

  // === Exportar XLS ===
  // === Exportar XLS ===
const handleExport = async () => {
  try {
    const genRes = await api.post("/invoiceReports/xls");

    const fileData = genRes.data.body;
    const fileUrl = fileData.url;
    const fileName = fileData.fileName;

    if (!fileUrl) {
      throw new Error("No se recibió una URL de descarga.");
    }

    // Crear un enlace temporal para descargar el archivo directamente desde la URL S3
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileName || "reporte-facturas.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    Swal.fire({
      icon: "success",
      title: "Descarga iniciada",
      text: `El archivo ${fileName} está siendo descargado.`,
      background: "#1e1e1e",
      color: "#fff",
    });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error al exportar",
      text:
        err.response?.data?.message ||
        err.message ||
        "No se pudo generar el archivo XLS.",
      background: "#1e1e1e",
      color: "#fff",
    });
  }
};


  // === Paginación ===
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  return (
    <div className="report-container">
      <h1 className="report-title">Reporte de Facturas</h1>

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
          <button className="btn-purple" onClick={handleSearch}>
            Buscar
          </button>
          <button className="btn-red" onClick={handleClear}>
            Limpiar
          </button>
          <button className="btn-pink" onClick={handleExport}>
            Exportar
          </button>
          <button className="btn-green">Historial</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Fecha Emisión</th>
              <th>Estado</th>
            </tr>
          </thead>
         <tbody>
  {currentRecords.length > 0 ? (
    currentRecords.map((item, idx) => (
      <tr key={idx}>
        <td>{item.id}</td>
        <td>{item.client?.name}</td> {/* cliente */}
        <td>${item.total_amount.toLocaleString()}</td> {/* monto */}
        <td>{new Date(item.due_date).toLocaleDateString()}</td> {/* fecha emisión */}
        <td>{item.status}</td> {/* estado */}
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="no-data">
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

export default InvoicesReport;
