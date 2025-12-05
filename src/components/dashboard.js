import React, { useState, useEffect } from "react";
import Sidebar from "../pages/sidebar";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import "./dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import AdminUsers from "../components/AdminUsers";
import Clients from "../components/clients";
import Coins from "../components/coins";
import Payments from "../components/payments";
import Invoices from "./invoices";
import axiosInstance from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";
import InvoicesReport from "./InvoicesReport";
import AgingReport from "./AgingReport";
import PaymentTracking from "./paymentTracking";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [user, setUser] = useState(null);
  // const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(0);
  const [dpcData, setDpcData] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [collectionRateData, setCollectionRateData] = useState(null);
  const [clients, setClients] = useState([]);
  const [loadingDpc, setLoadingDpc] = useState(false);
  const [loadingCollection, setLoadingCollection] = useState(false);

  /* ===========================
     Utilidades
  ============================ */
  const getRiskColor = (risk) => {
    if (!risk) return "#9e9e9e";
    const r = risk.toLowerCase();
    if (r.includes("bajo")) return "#4caf50"; // verde
    if (r.includes("medio")) return "#ffeb3b"; // amarillo
    if (r.includes("alto")) return "#ff9800"; // naranja
    if (r.includes("crítico") || r.includes("critico")) return "#f44336"; // rojo fuerte
    return "#9e9e9e";
  };

  // Normaliza los datos de historicalData para charts DPC
  const mapDpcChartData = (historical = []) =>
    historical.map((h) => ({
      month: h.month,
      value:
        typeof h.average_days_to_collect === "number"
          ? h.average_days_to_collect
          : h.average_days_to_collect ?? null,
      risk: h.risk_category,
    }));

  // Normaliza los datos de historicalData para collectionRate (barras)
  const mapCollectionChartData = (historical = []) =>
    historical.map((h) => ({
      month: h.month,
      total_invoices: h.total_invoices ?? 0,
      paid_on_time: h.paid_on_time ?? 0,
      risk: h.risk_category,
    }));

  /* ============================================
     OBTENER USUARIO LOGGEADO
  ============================================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.id || decoded.user_id;

        const response = await axiosInstance.get(`/users/${userId}`, {
          // 👈 reemplaza 2 por el ID dinámico si lo tienes
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.code === 1) {
          setUser(response.data.user);
        } else {
          console.error("Usuario no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };

    fetchUser();
  }, []);

  /* ============================================
     OBTENER LISTA DE CLIENTES (DINÁMICO)
  ============================================= */
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axiosInstance.get("/clients"); // ajusta ruta si es diferente
        // asumo respuesta { code: 1, clients: [...] } — adapta si es distinto
        if (res.data?.code === 1 && Array.isArray(res.data.Clients)) {
          setClients(res.data.Clients);
        } else {
          // si estructura distinta, intenta leer res.data.data o res.data
          setClients([]);
          // const fallback = res.data?.data || res.data;
          // if (Array.isArray(fallback)) setClients(fallback);
        }
      } catch (err) {
        console.error("No se pudieron cargar los clientes:", err);
        setClients([]);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    fetchAverageCollectionDays();

    if (selectedClientId === 0) {
      fetchCollectionRate();
    } else {
      fetchClientRate();
    }
  }, [selectedClientId, startDate, endDate]);

  /* ============================================
      WS DPC — GLOBAL, CLIENTE Y POR FECHAS
  ============================================= */
  const fetchAverageCollectionDays = async () => {
    try {
      setLoadingDpc(true);
      let url = "/analytics/average-collection-days";
      const params = [];

      if (selectedClientId !== 0) {
        params.push(`clientId=${selectedClientId}`);
      }

      if (startDate && endDate) {
        params.push(`startDate=${startDate}`);
        params.push(`endDate=${endDate}`);
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const response = await axiosInstance.get(url);

      if (response.data.code === 1) {
        setDpcData(response.data.data);
      } else {
        console.error("No se pudo obtener la información del DPC");
      }
    } catch (error) {
      console.error("Error al obtener DPC:", error);
    } finally {
      setLoadingDpc(false);
    }
  };

  /* ============================================
      WS COLLECTION RATE — SOLO GLOBAL
  ============================================= */
  const fetchCollectionRate = async () => {
    try {
      // Si seleccionan un cliente distinto de 0, este WS NO debe ejecutarse
      if (selectedClientId !== 0) return;

      setLoadingCollection(true);

      let url = "/analytics/collection-rate";
      const params = [];

      if (startDate && endDate) {
        params.push(`startDate=${startDate}`);
        params.push(`endDate=${endDate}`);
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const response = await axiosInstance.get(url);
      console.log("📘 GLOBAL COLLECTION RATE RESPONSE:", response.data);

      if (response.data.code === 1) {
        setCollectionRateData(response.data.data);
      } else {
        setCollectionRateData(null);
        console.error("No se pudo obtener la Tasa de Cobranza global");
      }
    } catch (error) {
      console.error("Error:", error);
      setCollectionRateData(null);
    } finally {
      setLoadingCollection(false);
    }
  };

  /* ============================================
      WS COLLECTION RATE — POR CLIENTE
  ============================================= */
  const fetchClientRate = async () => {
    try {
      if (!selectedClientId || selectedClientId === 0) return;

      setLoadingCollection(true);

      let url = `/analytics/client-rate/${selectedClientId}`;
      const params = [];

      if (startDate && endDate) {
        params.push(`startDate=${startDate}`);
        params.push(`endDate=${endDate}`);
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const response = await axiosInstance.get(url);
      console.log("📗 CLIENT COLLECTION RATE RESPONSE:", response.data);

      if (response.data.code === 1) {
        setCollectionRateData(response.data.data);
      } else {
        setCollectionRateData(null);
        console.error("No se pudo obtener la Tasa de Cobranza del cliente");
      }
    } catch (error) {
      console.error("Error al obtener Client Rate:", error);
      setCollectionRateData(null);
    } finally {
      setLoadingCollection(false);
    }
  };

  /* ============================================
      FILTRAR POR FECHAS
  ============================================= */
  const handleFilter = () => {
    if ((startDate && !endDate) || (!startDate && endDate)) {
      Swal.fire("Error", "Debes seleccionar ambas fechas.", "warning");
      return;
    }

    fetchAverageCollectionDays();

    if (selectedClientId === 0) {
      fetchCollectionRate();
    } else {
      fetchClientRate();
    }
  };

  /* ============================================
      LIMPIAR FILTROS
  ============================================= */
  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setSelectedClientId(0);
  };

  /* ============================================
      Gráficas - preparaciones
  ============================================= */
  const dpcChartData = mapDpcChartData(dpcData?.historicalData || []);
  const collectionChartData = mapCollectionChartData(
    collectionRateData?.historicalData || []
  );

  return (
    <div className="container-fluid contenedor-padre">
      <Sidebar setActiveView={setActiveView} />

      <div className="dashboard-content">
        {activeView === "dashboard" && (
          <div className="container-fluid">
            {/* ========== HEADER USUARIO ========== */}
            <div className="row align-items-center mb-4 cont-header-usuario">
              <div className="col-12">
                <div className="header-usuario">
                  {user ? (
                    <span className="text-white fw-bold">
                      {user.first_name} {user.last_name}
                    </span>
                  ) : (
                    <span className="text-white fw-bold">Cargando...</span>
                  )}
                </div>
              </div>
            </div>

            {/* ========== FILA 1 ========== */}
            <div className="row align-items-center mb-4 cont-fila1">
              <div className="col-md-6">
                <h2 className="titulo-dashboard">Dashboard</h2>
              </div>
              <div className="col-md-6 d-flex flex-column align-items-center">
                <div className="d-flex gap-3 mb-3">
                  <input
                    type="date"
                    className="form-control input-dark"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <input
                    type="date"
                    className="form-control input-dark"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="d-flex gap-3">
                  <button className="btn btn-filtrar" onClick={handleFilter}>
                    Filtrar
                  </button>

                  <button
                    type="button"
                    className="btn btn-limpiar"
                    onClick={handleClear}
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>

            {/* SELECT CLIENTE */}
            <div className="row">
              <div className="col-md-12">
                <select
                  className="form-control input-dark mb-3"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(Number(e.target.value))}
                >
                  <option value="" disabled>
                    Selecciona...
                  </option>
                  <option value={0}>Todos los clientes</option>
                  {clients.length > 0 &&
                    clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* loader global DPC */}
            {loadingDpc && (
              <div className="loader-container mb-3">
                <div className="spinner" />
              </div>
            )}

            {/* ========== DPC ========== */}
            <div className="row">
              <div className="col-md-12">
                {dpcData && (
                  <div className="card-dark p-3 text-white mb-3">
                    <h5>Días Promedio de Cobro (DPC)</h5>
                    <div
                      className="risk-indicator"
                      title={
                        dpcData.historicalData?.[0]?.risk_category ||
                        "Sin datos"
                      }
                      style={{
                        background: getRiskColor(
                          dpcData.historicalData?.[0]?.risk_category
                        ),
                      }}
                    />
                    <p>
                      <strong>Días promedio de pago:</strong>{" "}
                      {dpcData.currentDPC} días
                    </p>

                    <p>
                      <strong>Riesgo:</strong>{" "}
                      <span
                        style={{
                          color: getRiskColor(
                            dpcData.historicalData?.[0]?.risk_category
                          ),
                        }}
                      >
                        {dpcData.historicalData?.[0]?.risk_category ||
                          "Sin datos"}
                      </span>
                    </p>

                    <p>
                      <strong>Predicción próximo mes:</strong>{" "}
                      {dpcData.prediction?.nextMonthDPC ?? "N/A"}
                    </p>

                    <p>
                      <strong>Predicción próximo trimestre:</strong>{" "}
                      {dpcData.prediction?.nextQuarterDPC ?? "N/A"}
                    </p>

                    {/* HISTÓRICO */}
                    {dpcChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={dpcChartData}>
                          <XAxis dataKey="month" stroke="#fff" />
                          <YAxis stroke="#fff" />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8B5CF6"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-white-50 small">
                        No hay histórico para mostrar.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* loader collection */}
            {loadingCollection && (
              <div className="loader-container mb-3">
                <div className="spinner" />
              </div>
            )}

            {/* COLLECTION RATE */}
            <div className="row">
              <div className="col-md-12">
                {collectionRateData && (
                  <div className="card-dark p-3 text-white mb-3">
                    <h5>Tasa de Cobranza</h5>
                    <div
                      className="risk-indicator"
                      title={
                        collectionRateData.historicalData?.[0]?.risk_category ||
                        "Sin datos"
                      }
                      style={{
                        background: getRiskColor(
                          collectionRateData.historicalData?.[0]?.risk_category
                        ),
                      }}
                    />

                    <p>
                      <strong>Actual:</strong>{" "}
                      {collectionRateData.currentRate !== undefined
                        ? collectionRateData.currentRate.toFixed(2) + "%"
                        : "0%"}
                    </p>

                    <p>
                      <strong>Riesgo:</strong>{" "}
                      <span
                        style={{
                          color: getRiskColor(
                            collectionRateData.historicalData?.[0]
                              ?.risk_category
                          ),
                        }}
                      >
                        {collectionRateData.historicalData?.[0]
                          ?.risk_category || "Sin datos"}
                      </span>
                    </p>

                    <p>
                      <strong>Predicción próximo mes:</strong>{" "}
                      {collectionRateData.prediction?.nextMonth
                        ? collectionRateData.prediction.nextMonth.toFixed(2) +
                          "%"
                        : "N/A"}
                    </p>

                    <p>
                      <strong>Predicción próximo trimestre:</strong>{" "}
                      {collectionRateData.prediction?.nextQuarter
                        ? collectionRateData.prediction.nextQuarter.toFixed(2) +
                          "%"
                        : "N/A"}
                    </p>

                    {/* HISTÓRICO (barras) */}
                    {collectionChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={collectionChartData}>
                          <XAxis dataKey="month" stroke="#fff" />
                          <YAxis stroke="#fff" />
                          <Tooltip />
                          <Bar
                            dataKey="total_invoices"
                            name="Total facturas"
                            barSize={12}
                            fill="#4F46E5"
                          />
                          <Bar
                            dataKey="paid_on_time"
                            name="Pagadas a tiempo"
                            barSize={12}
                            fill="#22C55E"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-white-50 small">
                        No hay histórico para mostrar.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========== Vistas de los módulos del sidebar ========== */}
        {activeView === "AdminUsers" && <AdminUsers />}
        {activeView === "Clients" && <Clients />}
        {activeView === "Coins" && <Coins />}
        {activeView === "Payments" && <Payments />}
        {activeView === "Invoices" && <Invoices />}
        {activeView === "InvoicesReport" && <InvoicesReport />}
        {activeView === "AgingReport" && <AgingReport />}
        {activeView === "PaymentTracking" && <PaymentTracking />}
      </div>
    </div>
  );
};

export default Dashboard;
