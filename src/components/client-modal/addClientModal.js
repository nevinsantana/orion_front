import React, { useState } from "react";
import "./addClientModal.css";
import { FaUserGroup } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

function AddClientModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [taxAddress, setTaxAddress] = useState(""); // corregido typo
  const [taxRegime, setTaxRegime] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [usoCfdi, setUsoCfdi] = useState("");
  const [regimenFiscalReceptor, setRegimenFiscalReceptor] = useState("");
  const [domicilioFiscalReceptor, setDomicilioFiscalReceptor] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [formaPago, setFormaPago] = useState("");
  const [emailRecepcionFacturas, setEmailRecepcionFacturas] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos
    if (
      !name ||
      !taxAddress ||
      !taxRegime ||
      !contactName ||
      !contactEmail ||
      !contactPhone ||
      !usoCfdi ||
      !domicilioFiscalReceptor ||
      !metodoPago ||
      !regimenFiscalReceptor ||
      !formaPago ||
      !emailRecepcionFacturas
    ) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token no encontrado. Debes iniciar sesión.");
        return;
      }

      const body = {
        name,
        tax_address: taxAddress,
        tax_regime: taxRegime,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        uso_cfdi: usoCfdi,
        domicilio_fiscal_receptor: domicilioFiscalReceptor,
        metodo_pago: metodoPago,
        regimen_fiscal_receptor: regimenFiscalReceptor,
        forma_pago: formaPago,
        email_recepcion_facturas: emailRecepcionFacturas,
      };

      // Guardar en backend
      const response = await axios.post("/api/clients", body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Usar respuesta real del backend
      if (response.data) {
        onSave(response.data); // agrega el cliente con el ID real
      }

      onClose(); // cerrar modal
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      alert("Error al agregar cliente. Revisa la consola.");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content-clients">
        <div className="modal-header-clients p-3 d-flex justify-content-between align-items-center">
          <h4 className="m-0">Añadir Cliente</h4>
          <FaTimes
            className="icon-close"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="modal-body-clients p-4">
          <div className="tituloIconoClients d-flex align-items-center gap-2 mb-3">
            <FaUserGroup className="icon" />
            <h6 className="m-0">Datos del Cliente</h6>
          </div>

          <form onSubmit={handleSubmit} className="form-clientes">
            <div className="row g-2">
              <div className="col-md-6 col-12">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="col-md-6 col-12">
                <label className="form-label">Domicilio</label>
                <input
                  type="text"
                  className="form-control"
                  value={taxAddress}
                  onChange={(e) => setTaxAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="row g-2">
              <div className="col-md-6 col-12">
                <label className="form-label">Régimen Fiscal</label>
                <input
                  type="text"
                  className="form-control"
                  value={taxRegime}
                  onChange={(e) => setTaxRegime(e.target.value)}
                />
              </div>
              <div className="col-md-6 col-12">
                <label className="form-label">Nombre Contacto</label>
                <input
                  type="text"
                  className="form-control"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>
            </div>

            <div className="row g-2">
              <div className="col-md-6 col-12">
                <label className="form-label">Correo Contacto</label>
                <input
                  type="email"
                  className="form-control"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <div className="col-md-6 col-12">
                <label className="form-label">Teléfono Contacto</label>
                <input
                  type="text"
                  className="form-control"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="row g-2">
              <div className="col-md-6 col-12">
                <label className="form-label">CFDI</label>
                <input
                  type="text"
                  className="form-control"
                  value={usoCfdi}
                  onChange={(e) => setUsoCfdi(e.target.value)}
                />
              </div>
              <div className="col-md-6 col-12">
                <label className="form-label">Régimen Fiscal Receptor</label>
                <input
                  type="text"
                  className="form-control"
                  value={regimenFiscalReceptor}
                  onChange={(e) =>
                    setRegimenFiscalReceptor(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="row g-2">
              <div className="col-md-6 col-12">
                <label className="form-label">Domicilio Fiscal Receptor</label>
                <input
                  type="text"
                  className="form-control"
                  value={domicilioFiscalReceptor}
                  onChange={(e) =>
                    setDomicilioFiscalReceptor(e.target.value)
                  }
                />
              </div>
              <div className="col-md-6 col-12">
                <label className="form-label">Método Pago</label>
                <input
                  type="text"
                  className="form-control"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                />
              </div>
            </div>

            <div className="row g-2">
              <div className="col-md-6 col-12">
                <label className="form-label">Forma Pago</label>
                <input
                  type="text"
                  className="form-control"
                  value={formaPago}
                  onChange={(e) => setFormaPago(e.target.value)}
                />
              </div>
              <div className="col-md-6 col-12">
                <label className="form-label">Email Recepción Facturas</label>
                <input
                  type="email"
                  className="form-control"
                  value={emailRecepcionFacturas}
                  onChange={(e) =>
                    setEmailRecepcionFacturas(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
              <button
                type="button"
                className="btn btn-cancelar"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-guardar">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddClientModal;
