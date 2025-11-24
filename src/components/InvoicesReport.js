import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../api/axiosInstance";
import "./InvoicesReport.css";
import { IoIosDownload } from "react-icons/io";
import HistoryModal from "./report-modal/HistoryModal";

function InvoicesReport() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [showHistory, setShowHistory] = useState(false);
  const [historyFiles, setHistoryFiles] = useState([]);

  const [loadingExport, setLoadingExport] = useState(false);

  // === Obtener datos iniciales ===
  const fetchData = async (from = "", to = "") => {
    try {
      let url = "/invoiceReports/data";
      if (from && to) url += `?date_from=${from}&date_to=${to}`;

      const res = await api.get(url);
      const result = res.data.body || [];

      setData(result);
      setFilteredData(result);
      setCurrentPage(1);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          "No se pudo obtener la información del reporte.",
        background: "#1e1e1e",
        color: "#fff",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // === Filtrar ===
  const handleSearch = async () => {
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

    try {
      const res = await api.get("/invoiceReports/data", {
        params: {
          date_from: startDate,
          date_to: endDate,
        },
      });

      const allData = res.data.body || [];
      const filtered = allData.filter((item) => {
        const due = new Date(item.due_date);
        const from = new Date(startDate + "T00:00:00");
        const to = new Date(endDate + "T23:59:59");
        return due >= from && due <= to;
      });

      if (filtered.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Sin resultados",
          text: "No hay facturas dentro del rango de fechas seleccionado.",
          background: "#1e1e1e",
          color: "#fff",
        });
      }

      setFilteredData(filtered);
      setCurrentPage(1);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al filtrar",
        text: err.response?.data?.message || "No se pudo filtrar por fechas.",
        background: "#1e1e1e",
        color: "#fff",
      });
    }
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    fetchData();
  };

  // === Exportar XLS ===
  const handleExport = async () => {
    try {
      setLoadingExport(true);

      Swal.fire({
        title: "Generando reporte...",
        text: "Por favor espera",
        background: "#1e1e1e",
        color: "#fff",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const payload = {};
      if (startDate && endDate) {
        payload.date_from = startDate;
        payload.date_to = endDate;
      }

      const genRes = await api.post("/invoiceReports/xls", payload);

      Swal.fire({
        icon: "success",
        title: "Exportación completada",
        text: genRes.data?.message || "El reporte se generó exitosamente.",
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
    } finally {
      setLoadingExport(false);
    }
  };

  // === HISTORIAL SOLO FACTURAS ===
  const handleHistory = async () => {
    try {
      const res = await api.get("/invoiceReports/repo");
      let files = res.data.body?.files || [];

      // 🔥 FILTRO CRÍTICO: SOLO ARCHIVOS DE FACTURAS
      files = files.filter((f) => {
        const name = f.key.toLowerCase();
        return (
          name.includes("invoice") ||
          name.includes("factura") ||
          name.includes("invoices")
        );
      });

      if (!files.length) {
        Swal.fire({
          icon: "info",
          title: "Sin registros",
          text: "No se encontraron reportes de facturas.",
          background: "#1e1e1e",
          color: "#fff",
        });
        return;
      }

      setHistoryFiles(files);
      setShowHistory(true);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al obtener historial",
        text:
          err.response?.data?.message ||
          "No se pudo cargar el historial de reportes.",
        background: "#1e1e1e",
        color: "#fff",
      });
    }
  };

  const handleOpenFile = (url) => window.open(url, "_blank");

  // === PAGINACIÓN ===
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

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

          <button
            className="btn-pink"
            onClick={handleExport}
            disabled={loadingExport}
          >
            {loadingExport ? (
              "Generando..."
            ) : (
              <>
                <IoIosDownload /> Exportar
              </>
            )}
          </button>

          <button className="btn-green" onClick={handleHistory}>
            Historial
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div className="table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Fecha Vencimiento</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.id}</td>
                  <td>{item.client?.name}</td>
                  <td>
                    $
                    {Number(item.total_amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>{new Date(item.due_date).toLocaleDateString()}</td>
                  <td>{item.status}</td>
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

      {/* PAGINACIÓN */}
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
            className={`pagination-btn ${
              currentPage === i + 1 ? "active" : ""
            }`}
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

      {/* MODAL HISTORIAL */}
      {showHistory && (
        <HistoryModal
          files={historyFiles}
          onClose={() => setShowHistory(false)}
          onDownload={handleOpenFile}
        />
      )}
    </div>
  );
}

export default InvoicesReport;
