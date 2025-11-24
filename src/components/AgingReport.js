import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../api/axiosInstance";
import { IoIosDownload } from "react-icons/io";
import AgingHistoryModal from "./report-modal/agingHistoryModal";
import "./AgingReport.css";

export default function AgingReport() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [xlsLoading, setXlsLoading] = useState(false);

  // history modal
  const [showHistory, setShowHistory] = useState(false);
  const [historyFiles, setHistoryFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);

  // -------------------------
  // Load aging data (backend route exists at /invoiceReports/aging)
  // -------------------------
  const fetchAging = async () => {
    try {
      setLoading(true);
      const res = await api.get("/invoiceReports/aging");
      const list = Array.isArray(res.data?.body) ? res.data.body : [];
      setData(list);
      setFilteredData(list);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          "No se pudo obtener la información del reporte de antigüedad.",
        background: "#1e1e1e",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAging();
  }, []);

  // -------------------------
  // Filtering with inclusive end-date (00:00 -> 23:59:59)
  // -------------------------
  const handleSearch = () => {
    let filtered = [...data];

    if (startDate && endDate) {
      const from = new Date(startDate + "T00:00:00");
      const to = new Date(endDate + "T23:59:59");
      filtered = filtered.filter((item) => {
        const due = new Date(item.due_date);
        return due >= from && due <= to;
      });
    }

    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.client?.name || "").toLowerCase().includes(q) ||
          (item.status || "").toLowerCase().includes(q)
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
    setCurrentPage(1);
  };

  // -------------------------
  // Export: call backend route that generates xls (doesn't open history)
  // -------------------------
  const handleGenerateXLS = async () => {
    try {
      setXlsLoading(true);
      Swal.fire({
        title: "Generando XLS...",
        text: "Espere por favor",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        background: "#1e1e1e",
        color: "#fff",
      });

      const payload = {};
      if (startDate && endDate) {
        payload.date_from = startDate;
        payload.date_to = endDate;
      }

      await api.post("/invoiceReports/aging/xls", payload);

      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Reporte generado",
        text: "Puedes descargarlo desde el historial.",
        background: "#1e1e1e",
        color: "#fff",
      });
    } catch (err) {
      Swal.close();
      console.error("Error generating XLS:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          err.message ||
          "No se pudo generar el archivo XLS.",
        background: "#1e1e1e",
        color: "#fff",
      });
    } finally {
      setXlsLoading(false);
    }
  };

  // -------------------------
  // Fetch repository and FILTER only antiguedad files
  // -------------------------
  const fetchRepoFiles = async () => {
    try {
      setFilesLoading(true);
      const res = await api.get("/invoiceReports/repo");
      // backend returns { body: { repositoryName, files: [...] } }
      const rawFiles = res.data?.body?.files ?? [];
      // Keep only keys that start with 'reporte-antiguedad-' (case-insensitive)
      const agingFiles = rawFiles.filter((f) => {
        const key = (f.key || f.fileName || f.name || "").toString().toLowerCase();
        return key.startsWith("reporte-antiguedad-") || key.includes("antiguedad");
      });
      // normalize entries to { key, url, size, date }
      const normalized = agingFiles.map((f) => ({
        key: f.key || f.fileName || f.name,
        url: f.url || `https://rak-orion-invoice-reports.s3.amazonaws.com/${f.key || f.fileName || f.name}`,
        size: f.size || f.Size || f.bytes || null,
        date: f.date || f.lastModified || f.LastModified || null,
      }));
      setHistoryFiles(normalized);
      setShowHistory(true);
    } catch (err) {
      console.error("Error fetching repo files:", err);
      Swal.fire({
        icon: "error",
        title: "Error al obtener historial",
        text:
          err.response?.data?.message ||
          "No se pudo cargar el historial de reportes.",
        background: "#1e1e1e",
        color: "#fff",
      });
    } finally {
      setFilesLoading(false);
    }
  };

  const openFile = (file) => {
    const url = file.url || (file.key ? `https://rak-orion-invoice-reports.s3.amazonaws.com/${file.key}` : null);
    if (!url) {
      Swal.fire({ icon: "info", title: "Sin URL", text: "No hay URL pública disponible." });
      return;
    }
    window.open(url, "_blank");
  };

  // -------------------------
  // Pagination helpers
  // -------------------------
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = (filteredData || []).slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.max(1, Math.ceil((filteredData || []).length / recordsPerPage));

  return (
    <div className="aging-container">
      <h1 className="report-title">Reporte de Antigüedad</h1>

      <div className="report-header">
        <div className="records-control">
          <label>Mostrar</label>
          <select
            className="select-dark"
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(parseInt(e.target.value, 10));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <label>Registros</label>
        </div>

        <div className="filters-control">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-dark" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-dark" />
          <input type="text" placeholder="Buscar cliente o estado..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-dark" />

          <button className="btn-purple" onClick={handleSearch}>Buscar</button>
          <button className="btn-red" onClick={handleClear}>Limpiar</button>

          <button className="btn-pink" onClick={handleGenerateXLS} disabled={xlsLoading}>
            <IoIosDownload style={{ marginRight: 6 }} />
            {xlsLoading ? "Generando..." : "Exportar"}
          </button>

          <button className="btn-green" onClick={fetchRepoFiles} disabled={filesLoading}>
            {filesLoading ? "Cargando..." : "Historial"}
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
            {loading ? (
              <tr><td colSpan="7" className="no-data">Cargando...</td></tr>
            ) : currentRecords.length === 0 ? (
              <tr><td colSpan="7" className="no-data">No hay registros</td></tr>
            ) : (
              currentRecords.map((item) => {
                const days = item.daysOverdue ?? Math.max(0, Math.floor((new Date() - new Date(item.due_date)) / (1000 * 60 * 60 * 24)));
                const range = item.agingRange ?? (days <= 30 ? "0-30 días" : days <= 60 ? "31-60 días" : days <= 90 ? "61-90 días" : "90+ días");
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.client?.name}</td>
                    <td>${Number(item.total_amount ?? item.amount ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>{new Date(item.due_date).toLocaleDateString()}</td>
                    <td>{days}</td>
                    <td>{range}</td>
                    <td>{item.status}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Anterior</button>
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
        ))}
        <button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>Siguiente</button>
      </div>

      {showHistory && (
        <AgingHistoryModal
          files={historyFiles}
          onClose={() => setShowHistory(false)}
          onDownload={openFile}
        />
      )}
    </div>
  );
}
