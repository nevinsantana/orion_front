import React from "react";
import { IoIosDownload } from "react-icons/io";
import "./agingHistoryModal.css";

export default function AgingHistoryModal({ files = [], onClose, onDownload }) {
  return (
    <div className="aging-modal-overlay">
      <div className="aging-modal">

        {/* === Header === */}
        <div className="aging-modal-header">
          <h2>Historial de Reportes de Antigüedad</h2>
          <button className="aging-close-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>

        {/* === Contenido === */}
        <div className="aging-modal-content">
          {files.length === 0 ? (
            <p className="no-files">No hay archivos generados.</p>
          ) : (
            <table className="aging-history-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fecha</th>
                  <th>Tamaño</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {files.map((file, idx) => {
                  const fileName = file.fileName || file.key || "Archivo";
                  const fileDate =
                    file.date
                      ? new Date(file.date).toLocaleString()
                      : file.createdAt
                      ? new Date(file.createdAt).toLocaleString()
                      : "—";
                  const fileSize = file.size || file.fileSize || "—";

                  return (
                    <tr key={idx}>
                      <td>{fileName}</td>
                      <td>{fileDate}</td>
                      <td>{fileSize}</td>

                      <td>
                        <button
                          className="aging-download-btn"
                          onClick={() => onDownload(file)}
                        >
                          <IoIosDownload style={{ marginRight: 6 }} />
                          Descargar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
