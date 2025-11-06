import React, { useState } from "react";
import "./addInvoicesModal.css";
import { FaTimes, FaFileUpload } from "react-icons/fa";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import axiosInstance from "../../api/axiosConfig";
import { axiosAI } from "../../api/axiosAI";
import Swal from "sweetalert2";

function AddInvoicesModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [rfc, setRfc] = useState("");
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
  const [totalAmount, setTotalAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  // Selección del PDF
  const handlePdfSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  };

  // Enviar PDF manualmente
  const handleAnalyzePdf = async () => {
    if (!pdfFile) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona un PDF",
        text: "Debes elegir un archivo antes de analizarlo.",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    setLoadingPdf(true);

    Swal.fire({
      title: "Analizando PDF...",
      text: "Por favor espera...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const formData = new FormData();
      formData.append("pdfFile", pdfFile);
      formData.append(
        "question",
        `Analiza el documento PDF proporcionado. Extrae únicamente los siguientes dos datos: el nombre completo del cliente y el monto total de la factura.
Devuelve tu respuesta EXCLUSIVAMENTE en formato JSON.`
      );

      // Log para debug
    for (let pair of formData.entries()) {
      console.log("FormData:", pair[0], pair[1]);
    }

      // Usar axiosAI con baseURL correcto
      const pdfResponse = await axiosAI.post("/ai/analyze-pdf", formData);

      Swal.close();
      setLoadingPdf(false);

      if (pdfResponse.data.code === 1 && pdfResponse.data.client) {
        const client = pdfResponse.data.client;

        // Parsear JSON de la respuesta del AI
        let parsedResponse = {};
        if (pdfResponse.data.response) {
          const cleanedJson = pdfResponse.data.response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
          parsedResponse = JSON.parse(cleanedJson);
        }

        // Actualizar inputs con los datos extraídos
        setName(parsedResponse.cliente || client.name || "");
        setTotalAmount(parsedResponse.total_monto || client.total_amount || "");
        setRfc(client.rfc || "");
        setTaxAddress(client.tax_address || "");
        setTaxRegime(client.tax_regime || "");
        setContactName(client.contact_name || "");
        setContactEmail(client.contact_email || "");
        setContactPhone(client.contact_phone || "");
        setUsoCfdi(client.uso_cfdi || "");
        setRegimenFiscalReceptor(client.regimen_fiscal_receptor || "");
        setDomicilioFiscalReceptor(client.domicilio_fiscal_receptor || "");
        setMetodoPago(client.metodo_pago || "");
        setFormaPago(client.forma_pago || "");
        setEmailRecepcionFacturas(client.email_recepcion_facturas || "");
        setDueDate(client.due_date || "");

        Swal.fire({
          icon: "success",
          title: "Datos cargados",
          html: `<b>Cliente:</b> ${
            parsedResponse.cliente || client.name
          }<br/><b>Total:</b> ${
            parsedResponse.total_monto || client.total_amount
          }`,
          confirmButtonColor: "#8b5cf6",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al analizar PDF",
          text: "No se pudieron obtener los datos del cliente.",
          confirmButtonColor: "#8b5cf6",
        });
      }
    } catch (err) {
      console.error("Error al analizar PDF:", err);
      setLoadingPdf(false);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al analizar el PDF.",
        confirmButtonColor: "#8b5cf6",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos obligatorios
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
      !emailRecepcionFacturas ||
      !totalAmount ||
      !dueDate
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        theme: "dark",
        text: "Por favor completa todos los campos requeridos.",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

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

    const body = {
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
      total_amount: totalAmount,
      due_date: dueDate,
    };

    try {
      Swal.fire({
        title: "Guardando factura...",
        theme: "dark",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // Guardar factura
      const response = await axiosInstance.post("/invoices", body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Swal.close();

      if (response.data?.code === 1 && response.data.invoice) {
        Swal.fire({
          icon: "success",
          title: "Factura agregada",
          theme: "dark",
          text: response.data.message,
          confirmButtonColor: "#8b5cf6",
        });

        onSave(response.data.invoice);
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          theme: "dark",
          text: "No se pudo agregar la factura.",
          confirmButtonColor: "#8b5cf6",
        });
      }
    } catch (error) {
      console.error("Error al guardar factura:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        theme: "dark",
        text: "Ocurrió un error al guardar la factura. Revisa la consola.",
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
          <h4 className="m-0">Añadir Factura</h4>
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
                  <label className="form-label">
                    Domicilio Fiscal Receptor
                  </label>
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
              <div className="col-md-4 col-12">
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
              <div className="col-md-4 col-12">
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
              <div className="col-md-4 col-12">
                <div className="mb-3">
                  <label className="form-label">Cantidad total</label>
                  <input
                    type="text"
                    className="form-control"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row g-2">
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label className="form-label">Fecha Vencimiento</label>
                  <input
                    type="text"
                    className="form-control"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 col-12">
                <label className="form-label">Archivo PDF</label>
                <div className="d-flex align-items-center gap-2">
                  <label
                    htmlFor="pdf-upload"
                    className="btn addCliente"
                    style={{ cursor: "pointer" }}
                  >
                    <FaFileUpload /> Seleccionar PDF
                  </label>
                  <input
                    type="file"
                    id="pdf-upload"
                    accept="application/pdf"
                    onChange={handlePdfSelect}
                    style={{ display: "none" }}
                  />
                  {pdfFile && <span>{pdfFile.name}</span>}
                </div>
                {pdfFile && (
                  <button
                    type="button"
                    className="btn btn-analizar"
                    onClick={handleAnalyzePdf}
                  >
                    Analizar PDF
                  </button>
                )}
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

export default AddInvoicesModal;
