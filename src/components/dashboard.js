import React, { useState } from "react";
import Sidebar from "../pages/sidebar";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import "./dashboard.css";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const data = [
    { name: "Ene", value: 30 },
    { name: "Feb", value: 45 },
    { name: "Mar", value: 60 },
    { name: "Abr", value: 20 },
  ];

  return (
    <div className="container-fluid contenedor-padre">
      <Sidebar setActiveView={setActiveView} />

      <div className="dashboard-content">
        {activeView === "dashboard" && (
          <div className="container-fluid">
            {/* ========== FILA 1 ========== */}
            <div className="row align-items-center mb-4">
              {/* Columna izquierda */}
              <div className="col-md-6">
                <h2 className="titulo-dashboard">Dashboard</h2>
              </div>

              {/* Columna derecha */}
              <div className="col-md-6 d-flex flex-column align-items-center">
                <div className="d-flex gap-3 mb-3 w-100 justify-content-end">
                  <input type="date" className="form-control input-dark" />
                  <input type="date" className="form-control input-dark" />
                </div>
                <button className="btn btn-filtrar">Filtrar</button>
              </div>
            </div>

            {/* ========== FILA 2 ========== */}
            <div className="row mb-4">
              {/* Columna 1 (Gráfica) */}
              <div className="col-lg-4 col-md-12 mb-3">
                <div className="card-dark p-3 h-100">
                  <h5 className="text-white mb-3">Gráfica</h5>
                  <ResponsiveContainer width="95%" height={150}>
                    <BarChart data={data}>
                      <XAxis dataKey="name" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#8B5CF6"
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Columna 2 */}
              <div className="col-lg-4 col-md-12 mb-3">
                <div className="card-dark p-3 h-100">
                  <h5 className="text-white">Columna 2</h5>
                </div>
              </div>

              {/* Columna 3 */}
              <div className="col-lg-4 col-md-12 mb-3">
                <div className="card-dark p-3 h-100">
                  <h5 className="text-white">Columna 3</h5>
                </div>
              </div>
            </div>

            {/* ========== FILA 3 ========== */}
            <div className="row">
              {/* Columna izquierda (Tabla) */}
              <div className="col-md-8 mb-3">
                <div className="card-dark p-3">
                  <h5 className="text-white mb-3">Tabla</h5>
                  <table className="table table-dark table-striped">
                    <thead>
                      <tr>
                        <th>Columna 1</th>
                        <th>Columna 2</th>
                        <th>Columna 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Dato 1</td>
                        <td>Dato 2</td>
                        <td>Dato 3</td>
                      </tr>
                      <tr>
                        <td>Dato A</td>
                        <td>Dato B</td>
                        <td>Dato C</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Columna derecha (Título + Botón) */}
              <div className="col-md-4 mb-3">
                <div className="card-dark p-3 d-flex flex-column h-100 justify-content-between">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="text-white">Título</h5>
                    <button className="btn btn-vermas">Ver más</button>
                  </div>
                  <p className="text-white-50 mt-3">
                    Aquí puedes agregar más contenido...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "usuarios" && (
          <h2 className="text-white">Usuarios (vista en construcción)</h2>
        )}
        {activeView === "config" && (
          <h2 className="text-white">Configuración (vista en construcción)</h2>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
