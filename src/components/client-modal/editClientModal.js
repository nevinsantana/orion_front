import React, { useState } from "react";
import "./addClientModal.css";
import { FaUserGroup } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

function EditClientModal({ client, onClose, onSave }) {
  const [name, setName] = useState(client.name);
  const [taxAddress, setTaxAddress] = useState(client.tax_address);
  const [taxRegime, setTaxRegime] = useState(client.tax_regime);
  const [contactName, setContactName] = useState(client.contact_name);
  const [contactEmail, setContactEmail] = useState(client.contact_email);
  const [contactPhone, setContactPhone] = useState(client.contact_phone);
  const [usoCfdi, setUsoCfdi] = useState(client.uso_cfdi);
  const [regimenFiscalReceptor, setRegimenFiscalReceptor] = useState(
    client.regimen_fiscal_receptor
  );
  const [domicilioFiscalReceptor, setDomicilioFiscalReceptor] = useState(
    client.domicilio_fiscal_receptor
  );
  const [metodoPago, setMetodoPago] = useState(client.metodo_pago);
  const [formaPago, setFormaPago] = useState(client.forma_pago);
  const [emailRecepcionFacturas, setEmailRecepcionFacturas] = useState(
    client.email_recepcion_facturas
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos antes de guardar.",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Token no encontrado. Debes iniciar sesión.",
          confirmButtonColor: "#8b5cf6",
        });
        return;
      }

      const response = await axios.put(
        `/api/clients/${client.id}`,
        {
          name,
          tax_address: taxAddress,
          tax_regime: taxRegime,
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          uso_cfdi: usoCfdi,
          regimen_fiscal_receptor: regimenFiscalReceptor,
          domicilio_fiscal_receptor: domicilioFiscalReceptor,
          metodo_pago: metodoPago,
          forma_pago: formaPago,
          email_recepcion_facturas: emailRecepcionFacturas,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          "Content-Type": "application/json",
        }
      );

      // Actualizamos el estado del cliente en la tabla
      if (response.data) {
        await Swal.fire({
          icon: "success",
          title: "¡Cliente actualizado!",
          text: `El cliente "${response.data.client.name}" se actualizó correctamente.`,
          confirmButtonColor: "#8b5cf6",
        });

        onSave(response.data.client);
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el cliente.",
          confirmButtonColor: "#8b5cf6",
        });
      }
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al actualizar el cliente. Revisa la consola.",
        confirmButtonColor: "#8b5cf6",
      });
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
          <h4 className="m-0">Editar Cliente</h4>
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

            <div className="row g-2 mt-2">
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

            <div className="row g-2 mt-2">
              <div className="col-md-6 col-12">
                <label className="form-label">Correo Contacto</label>
                <input
                  type="text"
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

            <div className="row g-2 mt-2">
              <div className="col-md-6 col-12">
                <label className="form-label">Uso CFDI</label>
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
                  onChange={(e) => setRegimenFiscalReceptor(e.target.value)}
                />
              </div>
            </div>

            <div className="row g-2 mt-2">
              <div className="col-md-6 col-12">
                <label className="form-label">Domicilio Fiscal Receptor</label>
                <input
                  type="text"
                  className="form-control"
                  value={domicilioFiscalReceptor}
                  onChange={(e) => setDomicilioFiscalReceptor(e.target.value)}
                />
              </div>
              <div className="col-md-6 col-12">
                <label className="form-label">Método de Pago</label>
                <input
                  type="text"
                  className="form-control"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                />
              </div>
            </div>

            <div className="row g-2 mt-2">
              <div className="col-md-6 col-12">
                <label className="form-label">Forma de Pago</label>
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
                  type="text"
                  className="form-control"
                  value={emailRecepcionFacturas}
                  onChange={(e) => setEmailRecepcionFacturas(e.target.value)}
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

export default EditClientModal;
