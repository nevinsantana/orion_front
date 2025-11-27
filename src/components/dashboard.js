import React, { useState, useEffect } from "react";
import Sidebar from "../pages/sidebar";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
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
  const [selectedClientId, setSelectedClientId] = useState(0);
  const [dpcData, setDpcData] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [collectionRateData, setCollectionRateData] = useState(null);

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
      WS DPC — GLOBAL, CLIENTE Y POR FECHAS
  ============================================= */
  const fetchAverageCollectionDays = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  /* ============================================
      WS COLLECTION RATE — SOLO GLOBAL
  ============================================= */
  const fetchCollectionRate = async () => {
    try {
      // Si seleccionan un cliente distinto de 0, este WS NO debe ejecutarse
      if (selectedClientId !== 0) return;

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

      if (response.data.code === 1) {
        setCollectionRateData(response.data.data);
      } else {
        console.error("No se pudo obtener la Tasa de Cobranza global");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  /* ============================================
      WS COLLECTION RATE — POR CLIENTE
  ============================================= */
  const fetchClientRate = async () => {
    try {
      // Si selecciona "Todos los clientes", no llamar este WS
      if (!selectedClientId || selectedClientId === 0) return;

      const response = await axiosInstance.get(
        `/analytics/client-rate/${selectedClientId}`
      );

      if (response.data.code === 1) {
        setCollectionRateData(response.data.data);
      } else {
        console.error("No se pudo obtener la Tasa de Cobranza del cliente");
      }
    } catch (error) {
      console.error("Error al obtener Client Rate:", error);
    }
  };

  /* ============================================
      ACTUALIZA AL CAMBIAR CLIENTE
  ============================================= */
  useEffect(() => {
    fetchAverageCollectionDays();
    setCollectionRateData(null);

    if (selectedClientId === 0) {
      fetchCollectionRate();
    } else {
      fetchClientRate();
    }
  }, [selectedClientId]);

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
      fetchCollectionRate(); // global filtrado
    } else {
      fetchClientRate(); // cliente (sin filtros)
    }
  };

  /* ============================================
      LIMPIAR FILTROS
  ============================================= */
  const handleClear = () => {
    setStartDate("");
    setEndDate("");

    fetchAverageCollectionDays();

    if (selectedClientId === 0) fetchCollectionRate();
    else fetchClientRate();
  };

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

                  <button className="btn btn-limpiar" onClick={handleClear}>
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
                  <option value="0">Todos los clientes</option>
                  <option value="1">Cliente 1</option>
                  <option value="2">Cliente 2</option>
                </select>
              </div>
            </div>

            {/* ========== DPC ========== */}
            <div className="row">
              <div className="col-md-12">
                {dpcData && (
                  <div className="card-dark p-3 text-white mb-3">
                    <h5>Días Promedio de Cobro (DPC)</h5>

                    <p>
                      <strong>Actual:</strong> {dpcData.currentDPC} días
                    </p>

                    <p>
                      <strong>Riesgo:</strong>{" "}
                      {dpcData.historicalData?.length > 0
                        ? dpcData.historicalData[0].risk_category
                        : "Sin datos"}
                    </p>

                    <p>
                      <strong>Predicción próximo mes:</strong>{" "}
                      {dpcData.prediction?.nextMonthDPC ?? "N/A"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* COLLECTION RATE */}
            <div className="row">
              <div className="col-md-12">
                {collectionRateData && (
                  <div className="card-dark p-3 text-white mb-3">
                    <h5>Tasa de Cobranza</h5>

                    <p>
                      <strong>Actual:</strong>{" "}
                      {collectionRateData.currentRate
                        ? collectionRateData.currentRate.toFixed(2) + "%"
                        : "0%"}
                    </p>

                    <p>
                      <strong>Riesgo:</strong>{" "}
                      {collectionRateData.historicalData?.length > 0
                        ? collectionRateData.historicalData[0].risk_category
                        : "Sin datos"}
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
