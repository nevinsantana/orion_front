import React from "react";
import { IoIosDownload } from "react-icons/io";
import "./HistoryModal.css";
import { IoCloseOutline } from "react-icons/io5";

// --- Corrige fechas mal formateadas tipo "2025-11-24T17-15-50-263Z"
const fixDateString = (raw) => {
  if (!raw) return null;

  // Si ya parece ISO válida
  if (raw.includes(":")) return raw;

  try {
    const [date, time] = raw.split("T");
    const cleaned = time.replace("Z", "");
    const [h, m, s, ms] = cleaned.split("-");
    return `${date}T${h}:${m}:${s}.${ms}Z`;
  } catch {
    return null;
  }
};

const HistoryModal = ({ files, onClose, onDownload }) => {
  return (
    <div className="history-overlay">
      <div className="history-content">
        <h2>Historial de Registros</h2>

        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Tamaño</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {files.length > 0 ? (
                files.map((file, idx) => {
                  // --- Obtener fecha desde file.date o desde el nombre
                  const rawDate =
                    file.date ||
                    file.createdAt ||
                    (file.key &&
                      file.key.match(/\d{4}-\d{2}-\d{2}T[\d-]+Z/)?.[0]);

                  const fixed = fixDateString(rawDate);

                  const formattedDate = fixed
                    ? new Date(fixed).toLocaleString("es-CO", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—";

                  return (
                    <tr key={idx}>
                      <td>{file.key}</td>
                      <td>{formattedDate}</td>
                      <td>{file.size}</td>
                      <td>
                        <button
                          className="btn-download"
                          onClick={() => onDownload(file.url)}
                        >
                          <IoIosDownload size={18} />
                          Descargar
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No hay archivos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="close-container">
          <button className="btn-close" onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
