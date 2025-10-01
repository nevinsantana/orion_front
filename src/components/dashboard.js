import React, { useState } from "react";
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
import AdminUsers from "../components/AdminUsers";
import Clients from "../components/clients";
import Coins from "../components/coins";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const userName = "Nevin Santana";

  // Datos de ejemplo
  const lineData = [
    { name: "Ene", value: 30 },
    { name: "Feb", value: 45 },
    { name: "Mar", value: 60 },
    { name: "Abr", value: 20 },
  ];

  const pieData = [
    { name: "Alquiler", value: 400 },
    { name: "Servicios", value: 300 },
    { name: "Compras", value: 300 },
    { name: "Otros", value: 200 },
  ];

  const COLORS = ["#8B5CF6", "#6B7280", "#10B981", "#F59E0B"];

  return (
    <div className="container-fluid contenedor-padre">
      <Sidebar setActiveView={setActiveView} />

      <div className="dashboard-content">
        {activeView === "dashboard" && (
          <div className="container-fluid">
            {/* ========== HEADER USUARIO ========== */}
            <div className="row align-items-center mb-4">
              <div className="col-12 d-flex header-usuario">
                <span className="text-white fw-bold">{userName}</span>
              </div>
            </div>

            {/* ========== FILA 1 ========== */}
            <div className="row align-items-center mb-4 cont-fila1">
              <div className="col-md-6">
                <h2 className="titulo-dashboard">Dashboard</h2>
              </div>
              <div className="col-md-6 d-flex flex-column align-items-center">
                <div className="d-flex gap-3 mb-3">
                  <input type="date" className="form-control input-dark" />
                  <input type="date" className="form-control input-dark" />
                </div>
                <button className="btn btn-filtrar">Filtrar</button>
              </div>
            </div>

            {/* ========== FILA 2 ========== */}
            <div className="row mb-4">
              {/* Resumen Saldo */}
              <div className="col-lg-4 col-md-12 mb-3 cont-fila2">
                <div className="card-dark p-3 h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="text-white mb-0">Resumen Saldo</h5>
                    <button className="btn btn-vermas">Ver más</button>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={lineData}>
                      <XAxis dataKey="name" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#8B5CF6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gastos Pie */}
              <div className="col-lg-4 col-md-12 mb-3 cont-fila2">
                <div className="card-dark p-3 h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="text-white mb-0">Gastos</h5>
                    <button className="btn btn-vermas">Ver más</button>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gastos Detallados (Tabla) */}
              <div className="col-lg-4 col-md-12 mb-3 cont-fila2">
                <div className="card-dark p-3 h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="text-white mb-0">Próximos pagos</h5>
                    <button className="btn btn-vermas">Ver todo</button>
                  </div>
                  <div className="table-responsive mt-2">
                    <table className="table table-dark table-striped mb-0">
                      <thead>
                        <tr>
                          <th>Descripción</th>
                          <th>Cantidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Alquiler</td>
                          <td>$400</td>
                        </tr>
                        <tr>
                          <td>Luz</td>
                          <td>$50</td>
                        </tr>
                        <tr>
                          <td>Supermercado</td>
                          <td>$200</td>
                        </tr>
                        <tr>
                          <td>Transporte</td>
                          <td>$30</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* ========== FILA 3 ========== */}
            <div className="row">
              <div className="col-md-8 mb-3 cont-fila3">
                <div className="card-dark p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="text-white mb-0">Transacciones Recientes</h5>
                    <button className="btn btn-vermas">Ver todo</button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-dark table-striped mb-0">
                      <thead>
                        <tr>
                          <th>Descripción</th>
                          <th>Fecha</th>
                          <th>Categoría</th>
                          <th>Cantidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Dato 1</td>
                          <td>Dato 2</td>
                          <td>Dato 3</td>
                          <td>Dato 4</td>
                        </tr>
                        <tr>
                          <td>Dato A</td>
                          <td>Dato B</td>
                          <td>Dato C</td>
                          <td>Dato D</td>
                        </tr>
                        <tr>
                          <td>Dato 5</td>
                          <td>Dato 6</td>
                          <td>Dato 7</td>
                          <td>Dato 8</td>
                        </tr>
                        <tr>
                          <td>Dato E</td>
                          <td>Dato F</td>
                          <td>Dato G</td>
                          <td>Dato H</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3 cont-fila3">
                <div className="card-dark p-3 d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="text-white">Ahorros</h5>
                    <button className="btn btn-vermas">Ver más</button>
                  </div>
                  <p className="text-white mt-4">
                    $1.725 <span className="text-white-50">de $5,000</span>
                  </p>
                  <p className="text-white-50 mt-3">
                    Aquí puedes agregar más contenido...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "AdminUsers" && <AdminUsers />}
        {activeView === "Clients" && <Clients />}
        {activeView === "Coins" && <Coins />}
      </div>
    </div>
  );
};

export default Dashboard;
