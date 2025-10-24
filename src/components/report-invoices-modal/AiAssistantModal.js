import React, { useState } from "react";
import "./invoicesModals.css";
import { FaRobot, FaTimes } from "react-icons/fa";

function AiAssistantModal({ invoices, onClose }) {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const handleAsk = (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Simulación de IA:
    const total = invoices.length;
    const pagadas = invoices.filter((i) => i.estado === "Pagada").length;
    const pendientes = invoices.filter((i) => i.estado === "Pendiente").length;
    const vencidas = invoices.filter((i) => i.estado === "Vencida").length;

    setResponse(
      `Actualmente tienes ${total} facturas: ${pagadas} pagadas, ${pendientes} pendientes y ${vencidas} vencidas.`
    );
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.classList.contains("modal-overlay") && onClose()}>
      <div className="modal-content-clients">
        <div className="modal-header-clients p-3 d-flex justify-content-between align-items-center">
          <h4 className="m-0">Asistente IA</h4>
          <FaTimes className="icon-close" onClick={onClose} style={{ cursor: "pointer" }} />
        </div>

        <div className="modal-body-clients p-4">
          <div className="tituloIconoClients d-flex align-items-center gap-2 mb-3">
            <FaRobot />
            <h6 className="m-0">Consulta inteligente</h6>
          </div>

          <form onSubmit={handleAsk}>
            <textarea
              className="form-control mb-3"
              placeholder="Haz una pregunta sobre las facturas..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
            ></textarea>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <button type="button" className="btn btn-cancelar" onClick={onClose}>
                Cerrar
              </button>
              <button type="submit" className="btn btn-guardar">
                Consultar
              </button>
            </div>
          </form>

          {response && <div className="ai-response mt-3">{response}</div>}
        </div>
      </div>
    </div>
  );
}

export default AiAssistantModal;
