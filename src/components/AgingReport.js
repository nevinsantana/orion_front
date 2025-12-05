import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../api/axiosInstance";
import { IoIosDownload } from "react-icons/io";
import { FaHistory } from "react-icons/fa"; // Icono opcional para consistencia
import AgingHistoryModal from "./report-modal/agingHistoryModal";
import "./AgingReport.css";

export default function AgingReport() {
  // Estados de datos
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Estados de filtros
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Paginación
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Estados de carga
  const [loading, setLoading] = useState(false); // Carga de tabla
  const [xlsLoading, setXlsLoading] = useState(false); // Carga de Excel
  const [filesLoading, setFilesLoading] = useState(false); // Carga de Historial

  // Modal Historial
  const [showHistory, setShowHistory] = useState(false);
  const [historyFiles, setHistoryFiles] = useState([]);

  // -------------------------
  // 1. Cargar datos (Optimizado)
  // -------------------------
  const fetchAging = async () => {
    try {
      setLoading(true);
      const res = await api.get("/invoiceReports/aging");
      // Validación robusta: asegurar que sea array
      const list = Array.isArray(res.data?.body) ? res.data.body : [];
      
      setData(list);
      setFilteredData(list);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      // Solo mostrar alerta si es un error crítico, no en montaje inicial silencioso
      if (err.code !== "ERR_CANCELED") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener la información del reporte.",
          background: "#1e1e1e",
          color: "#fff",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAging();
  }, []);

  // -------------------------
  // 2. Filtrado (Optimizado)
  // -------------------------
  const handleSearch = () => {
    let filtered = [...data];

    // Filtrado por Fecha
    if (startDate && endDate) {
      const from = new Date(startDate + "T00:00:00");
      const to = new Date(endDate + "T23:59:59");
      filtered = filtered.filter((item) => {
        const due = new Date(item.due_date);
        return due >= from && due <= to;
      });
    }

    // Filtrado por Término
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.client?.name || "").toLowerCase().includes(q) ||
          (item.status || "").toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Sin resultados",
        text: "No hay registros con esos criterios.",
        background: "#1e1e1e",
        color: "#fff",
        timer: 2000,
        showConfirmButton: false
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setFilteredData(data); // Restaurar original sin llamar a API
    setCurrentPage(1);
  };

  // -------------------------
  // 3. Exportar XLS (Con Timeout Extendido)
  // -------------------------
  const handleGenerateXLS = async () => {
    if (xlsLoading) return; // Prevenir doble clic

    try {
      setXlsLoading(true);
      
      Swal.fire({
        title: "Generando XLS...",
        text: "Esto puede tardar unos segundos",
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

      // ⚠️ TIMEOUT EXTENDIDO (60s) para evitar error 504/Timeout
      const res = await api.post("/invoiceReports/aging/xls", payload, {
        timeout: 60000
      });

      Swal.close();

      // UX Mejorada: Ofrecer descarga inmediata
      Swal.fire({
        icon: "success",
        title: "Reporte generado",
        text: "¿Deseas descargarlo ahora?",
        showCancelButton: true,
        confirmButtonText: "Sí, descargar",
        cancelButtonText: "Cerrar",
        confirmButtonColor: "#8b5cf6",
        background: "#1e1e1e",
        color: "#fff",
      }).then((result) => {
        if (result.isConfirmed && res.data?.body?.url) {
          window.open(res.data.body.url, "_blank");
        }
      });

    } catch (err) {
      Swal.close();
      console.error("Error generating XLS:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "No se pudo generar el archivo XLS.",
        background: "#1e1e1e",
        color: "#fff",
      });
    } finally {
      setXlsLoading(false);
    }
  };

  // -------------------------
  // 4. Historial (Corregido y Optimizado)
  // -------------------------
  const fetchRepoFiles = async () => {
    if (filesLoading) return; // Prevenir doble clic

    try {
      setFilesLoading(true);
      
      // Timeout extendido para listado
      const res = await api.get("/invoiceReports/repo", { timeout: 30000 });

      // CORRECCIÓN: El array viene en body directamente
      const rawFiles = res.data?.body || [];

      // Filtro robusto: buscar 'antiguedad' en key o name
      const agingFiles = rawFiles.filter((f) => {
        const key = (f.key || f.fileName || f.name || "").toString().toLowerCase();
        return key.includes("reporte-antiguedad") || key.includes("antiguedad");
      });

      // Normalización de datos para el modal
      const normalized = agingFiles.map((f) => ({
        key: f.key || f.fileName,
        url: f.url || `https://${process.env.REACT_APP_S3_BUCKET || 'rak-orion-reports-pd'}.s3.amazonaws.com/${f.key}`,
        size: f.size || f.Size || 0,
        date: f.date || f.lastModified || f.LastModified || new Date(),
      }));

      // Ordenar por fecha descendente
      normalized.sort((a, b) => new Date(b.date) - new Date(a.date));

      if (normalized.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Historial vacío",
          text: "No se encontraron reportes de antigüedad anteriores.",
          background: "#1e1e1e",
          color: "#fff",
        });
        return;
      }

      setHistoryFiles(normalized);
      setShowHistory(true);
    } catch (err) {
      console.error("Error fetching repo files:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar el historial.",
        background: "#1e1e1e",
        color: "#fff",
      });
    } finally {
      setFilesLoading(false);
    }
  };

  const openFile = (file) => {
    if (file.url) {
        window.open(file.url, "_blank");
    } else {
        Swal.fire({ icon: "error", title: "Error", text: "El archivo no tiene URL válida" });
    }
  };

  // -------------------------
  // Paginación
  // -------------------------
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / recordsPerPage));

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
            placeholder="Buscar cliente..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="input-dark" 
          />

          <button className="btn-purple" onClick={handleSearch}>Buscar</button>
          <button className="btn-red" onClick={handleClear}>Limpiar</button>

          <button 
            className="btn-pink" 
            onClick={handleGenerateXLS} 
            disabled={xlsLoading}
            style={{ opacity: xlsLoading ? 0.6 : 1 }}
          >
            {xlsLoading ? "Generando..." : (
                <>
                 <IoIosDownload style={{ marginRight: 6 }} /> Exportar
                </>
            )}
          </button>

          <button 
            className="btn-green" 
            onClick={fetchRepoFiles} 
            disabled={filesLoading}
            style={{ opacity: filesLoading ? 0.6 : 1 }}
          >
            {filesLoading ? "Cargando..." : (
                <>
                 <FaHistory style={{ marginRight: 6 }} /> Historial
                </>
            )}
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
              <tr><td colSpan="7" className="no-data">Cargando datos...</td></tr>
            ) : currentRecords.length === 0 ? (
              <tr><td colSpan="7" className="no-data">No hay registros</td></tr>
            ) : (
              currentRecords.map((item, idx) => {
                // Cálculo seguro de días (backend ya debería enviarlo, pero mantenemos fallback)
                const days = item.daysOverdue ?? Math.max(0, Math.floor((new Date() - new Date(item.due_date)) / (1000 * 60 * 60 * 24)));
                const range = item.agingRange ?? (days <= 30 ? "0-30 días" : days <= 60 ? "31-60 días" : days <= 90 ? "61-90 días" : "90+ días");
                
                return (
                  <tr key={item.id || idx}>
                    <td>{item.id}</td>
                    <td>{item.client?.name || "N/A"}</td>
                    <td>
                        $
                        {Number(item.total_amount ?? item.amount ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td>{item.due_date ? new Date(item.due_date).toLocaleDateString() : "-"}</td>
                    <td style={{ color: days > 0 ? '#ff6b6b' : '#fff', fontWeight: 'bold' }}>{days}</td>
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
        <button 
            className="pagination-btn" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
            Anterior
        </button>
        
        {/* Renderizado simple de páginas */}
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
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        >
            Siguiente
        </button>
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