import React, { useState } from "react";
import "./addInvoicesModal.css";
import { FaTimes } from "react-icons/fa";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import axiosInstance from "../../api/axiosConfig";
import Swal from "sweetalert2";

function EditInvoicesModal({ invoices, onClose, onSave }) {
  const [name, setName] = useState(invoices.name);
  const [rfc, setRfc] = useState(invoices.rfc);
  const [taxAddress, setTaxAddress] = useState(invoices.tax_address);
  const [taxRegime, setTaxRegime] = useState(invoices.tax_regime);
  const [contactName, setContactName] = useState(invoices.contact_name);
  const [contactEmail, setContactEmail] = useState(invoices.contact_email);
  const [contactPhone, setContactPhone] = useState(invoices.contact_phone);
  const [usoCfdi, setUsoCfdi] = useState(invoices.uso_cfdi);
  const [regimenFiscalReceptor, setRegimenFiscalReceptor] = useState(
    invoices.regimen_fiscal_receptor
  );
  const [domicilioFiscalReceptor, setDomicilioFiscalReceptor] = useState(
    invoices.domicilio_fiscal_receptor
  );
  const [metodoPago, setMetodoPago] = useState(invoices.metodo_pago);
  const [formaPago, setFormaPago] = useState(invoices.forma_pago);
  const [emailRecepcionFacturas, setEmailRecepcionFacturas] = useState(
    invoices.email_recepcion_facturas
  );

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validación de campos vacíos
  if (
    !name ||
    !rfc ||
    !taxAddress ||
    !taxRegime ||
    !contactName ||
    !contactEmail ||
    !contactPhone ||
    !usoCfdi ||
    !regimenFiscalReceptor ||
    !domicilioFiscalReceptor ||
    !metodoPago ||
    !formaPago ||
    !emailRecepcionFacturas
  ) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      theme: "dark",
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
        theme: "dark",
        text: "Token no encontrado. Debes iniciar sesión.",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    // Armar el cuerpo del request
    const updatedData = {
      name,
      rfc,
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
    };

    // Enviar actualización
    const response = await axiosInstance.put(`/invoices/${invoices.id}`, updatedData);

    if (response.data && response.data.code === 1) {
      await Swal.fire({
        icon: "success",
        theme: "dark",
        title: "¡Factura actualizada!",
        text: response.data.message || "La factura se actualizó correctamente.",
        confirmButtonColor: "#8b5cf6",
      });

      // ✅ Aquí está el cambio importante:
      if (response.data.invoice) {
        // Si el backend devuelve la factura actualizada
        onSave(response.data.invoice);
      } else {
        // Si no la devuelve, actualizamos la tabla con los valores actuales del formulario
        onSave({ ...invoices, ...updatedData });
      }

      onClose();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        theme: "dark",
        text: response.data.message || "No se pudo actualizar la factura.",
        confirmButtonColor: "#8b5cf6",
      });
    }
  } catch (error) {
    console.error("Error al actualizar la factura:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      theme: "dark",
      text: "Ocurrió un error al actualizar la factura. Revisa la consola.",
      confirmButtonColor: "#8b5cf6",
    });
  }
};


  // Función para cerrar al hacer clic fuera del modal
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content-clients">
        {/* Header con icono de cerrar */}
        <div className="modal-header-clients p-3 d-flex justify-content-between align-items-center">
          <h4 className="m-0">Editar Facturas</h4>
          <FaTimes
            className="icon-close"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="modal-body-clients p-4">
          <div className="tituloIconoClients d-flex align-items-center gap-2 mb-3">
            <LiaFileInvoiceSolid className="icon" />
            <h6 className="m-0">Datos de Factura</h6>
          </div>

          <form onSubmit={handleSubmit} className="form-clientes">
            <div className="row g-2">
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label className="form-label">RFC</label>
                  <input
                    type="text"
                    className="form-control"
                    value={rfc}
                    onChange={(e) => setRfc(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label className="form-label">Domicilio</label>
                  <input
                    type="text"
                    className="form-control"
                    value={taxAddress}
                    onChange={(e) => setTaxAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label className="form-label">Régimen Fiscal</label>
                  <input
                    type="text"
                    className="form-control"
                    value={taxRegime}
                    onChange={(e) => setTaxRegime(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="row g-2">
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label className="form-label">Nombre Contacto</label>
                  <input
                    type="text"
                    className="form-control"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label className="form-label">Correo Contacto</label>
                  <input
                    type="text"
                    className="form-control"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label className="form-label">Teléfono Contacto</label>
                  <input
                    type="text"
                    className="form-control"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label className="form-label">CFDI</label>
                  <input
                    type="text"
                    className="form-control"
                    value={usoCfdi}
                    onChange={(e) => setUsoCfdi(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row g-2">
              <div className="col-md-4 col-12">
                <div className="mb-3">
                  <label className="form-label">Régimen Fiscal Receptor</label>
                  <input
                    type="text"
                    className="form-control"
                    value={regimenFiscalReceptor}
                    onChange={(e) => setRegimenFiscalReceptor(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4 col-12">
                <div className="mb-3">
                  <label className="form-label">Domicilio Fiscal Receptor</label>
                  <input
                    type="text"
                    className="form-control"
                    value={domicilioFiscalReceptor}
                    onChange={(e) => setDomicilioFiscalReceptor(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4 col-12">
                <div className="mb-3">
                  <label className="form-label">Método Pago</label>
                  <input
                    type="text"
                    className="form-control"
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row g-2">
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label className="form-label">Forma Pago</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formaPago}
                    onChange={(e) => setFormaPago(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label className="form-label">Email Recepción Facturas</label>
                  <input
                    type="text"
                    className="form-control"
                    value={emailRecepcionFacturas}
                    onChange={(e) => setEmailRecepcionFacturas(e.target.value)}
                  />
                </div>
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

export default EditInvoicesModal;
