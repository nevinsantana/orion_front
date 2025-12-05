import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../api/axiosInstance";
import "./InvoicesReport.css";
import { IoIosDownload } from "react-icons/io";
import { FaHistory } from "react-icons/fa"; // Icono opcional para historial
import HistoryModal from "./report-modal/HistoryModal";

function InvoicesReport() {
  const token = localStorage.getItem("token");
  
  // Estados de datos
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  // Estados de filtros
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Estados de Paginación
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Estados de Modales y Cargas
  const [showHistory, setShowHistory] = useState(false);
  const [historyFiles, setHistoryFiles] = useState([]);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false); // 👈 NUEVO: Previene doble clic

  // === Obtener datos iniciales ===
  const fetchData = async (from = "", to = "") => {
    try {
      let url = "/invoiceReports/data";
      if (from && to) url += `?date_from=${from}&date_to=${to}`;

      const res = await api.get(url);
      // Seguridad: Si body es null, usa array vacío
      const result = res.data.body || [];

      setData(result);
      setFilteredData(result);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching data:", err);
      // Opcional: No mostrar alerta en carga inicial para no ser invasivo
    }
  };

  useEffect(() => {
    if (token) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // === Filtrar en Frontend (Optimizado) ===
  const handleSearch = () => {
    if (!startDate || !endDate) {
      return Swal.fire({
        icon: "warning",
        title: "Fechas requeridas",
        text: "Por favor selecciona ambas fechas.",
        background: "#1e1e1e",
        color: "#fff",
      });
    }

    const from = new Date(startDate + "T00:00:00");
    const to = new Date(endDate + "T23:59:59");

    const filtered = data.filter((item) => {
      const due = new Date(item.due_date);
      return due >= from && due <= to;
    });

    if (filtered.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Sin resultados",
        text: "No hay facturas en ese rango.",
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
    setFilteredData(data); // Restauramos sin volver a llamar a la API
    setCurrentPage(1);
  };

  // === Exportar XLS (Con Timeout Extendido) ===
  const handleExport = async () => {
    try {
      setLoadingExport(true);
      
      // Mostrar Loading
      Swal.fire({
        title: "Generando reporte...",
        text: "Esto puede tardar unos segundos",
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

      // ⚠️ TIMEOUT EXTENDIDO A 60s PARA EVITAR ERRORES
      const genRes = await api.post("/invoiceReports/xls", payload, {
        timeout: 60000 
      });

      // Cerrar loading anterior
      Swal.close();

      // Éxito con opción de descargar
      Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: "Reporte generado. ¿Deseas descargarlo?",
        showCancelButton: true,
        confirmButtonText: "Sí, descargar",
        cancelButtonText: "Cerrar",
        confirmButtonColor: "#8b5cf6",
        background: "#1e1e1e",
        color: "#fff",
      }).then((result) => {
        if (result.isConfirmed && genRes.data?.body?.url) {
          window.open(genRes.data.body.url, "_blank");
        }
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "No se pudo generar el archivo.",
        background: "#1e1e1e",
        color: "#fff",
      });
    } finally {
      setLoadingExport(false);
    }
  };

  // === HISTORIAL (Corregido: Datos y Doble Clic) ===
  const handleHistory = async () => {
    // 1. Evitar doble clic si ya está cargando
    if (loadingHistory) return;

    try {
      setLoadingHistory(true); // Bloquear botón

      // 2. Timeout extendido por si hay muchos archivos
      const res = await api.get("/invoiceReports/repo", { timeout: 30000 });
      
      // 3. CORRECCIÓN CRÍTICA: El array viene directo en body, no en body.files
      let files = res.data.body || []; 

      // 4. Filtrado robusto (asegura que key exista)
      files = files.filter((f) => {
        const name = (f.key || "").toLowerCase();
        return (
          name.includes("invoice") ||
          name.includes("factura") ||
          name.includes("reporte-facturas") // Coincide con tu backend
        );
      });

      if (!files.length) {
        Swal.fire({
          icon: "info",
          title: "Historial vacío",
          text: "No se encontraron reportes de facturas anteriores.",
          background: "#1e1e1e",
          color: "#fff",
        });
        return;
      }

      // Ordenar por fecha (más reciente primero)
      files.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

      setHistoryFiles(files);
      setShowHistory(true);

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar el historial.",
        background: "#1e1e1e",
        color: "#fff",
      });
    } finally {
      setLoadingHistory(false); // Desbloquear botón
    }
  };

  const handleOpenFile = (url) => window.open(url, "_blank");

  // === PAGINACIÓN ===
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
            onChange={(e) => {
              setRecordsPerPage(parseInt(e.target.value));
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
            style={{ opacity: loadingExport ? 0.6 : 1 }}
          >
            {loadingExport ? (
              "Generando..."
            ) : (
              <>
                <IoIosDownload /> Exportar
              </>
            )}
          </button>

          <button 
            className="btn-green" 
            onClick={handleHistory}
            disabled={loadingHistory} // 👈 Deshabilitado mientras carga
            style={{ opacity: loadingHistory ? 0.6 : 1 }}
          >
            {loadingHistory ? "Cargando..." : (
               <>
                 <FaHistory style={{marginRight: '5px'}}/> Historial
               </>
            )}
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
                  <td>{item.client?.name || "N/A"}</td>
                  <td>
                    $
                    {Number(item.total_amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>{item.due_date ? new Date(item.due_date).toLocaleDateString() : '-'}</td>
                  <td>{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No hay registros disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Anterior
          </button>

          {/* Muestra máximo 5 botones de página para no saturar */}
          {[...Array(totalPages)].map((_, i) => {
             // Lógica simple para mostrar páginas cercanas
             if (i + 1 === 1 || i + 1 === totalPages || (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)) {
                return (
                    <button
                        key={i}
                        className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                );
             } else if (i + 1 === currentPage - 2 || i + 1 === currentPage + 2) {
                 return <span key={i} style={{color: '#666'}}>...</span>
             }
             return null;
          })}

          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Siguiente
          </button>
        </div>
      )}

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