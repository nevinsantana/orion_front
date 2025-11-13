import React from "react";
import { IoIosDownload } from "react-icons/io";
import "./HistoryModal.css";

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
                files.map((file, idx) => (
                  <tr key={idx}>
                    <td>{file.key}</td>
                    <td>
                      {new Date(file.date).toLocaleString("es-CO", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
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
                ))
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
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
