import React from "react";
import { IoIosDownload } from "react-icons/io";
import './agingHistoryModal.css';

export default function AgingHistoryModal({ files = [], onClose, onDownload }) {
  return (
    <div className="aging-modal-overlay">
      <div className="aging-modal">

        <div className="aging-modal-header">
          <h2>Historial de Reportes de Antigüedad</h2>
        </div>

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
                {files.map((file, idx) => (
                  <tr key={idx}>
                    <td>{file.fileName || file.key || "Archivo"}</td>
                    <td>
                      {file.date
                        ? new Date(file.date).toLocaleString()
                        : file.createdAt
                        ? new Date(file.createdAt).toLocaleString()
                        : "—"}
                    </td>
                    <td>{file.size || "—"}</td>
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
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 🔥 Botón abajo a la derecha */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "15px 20px",
          }}
        >
          <button className="aging-close-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
