import React, { useState } from "react";
import Sidebar from "../pages/sidebar";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const data = [
    { name: "Ene", value: 30 },
    { name: "Feb", value: 45 },
    { name: "Mar", value: 60 },
    { name: "Abr", value: 20 },
  ];

  return (
    <div className="container-fluid" style={{ display: "flex" }}>
      <Sidebar setActiveView={setActiveView} />

      <div className="dashboard-content" style={{ marginLeft: "280px", padding: "20px", width: "100%" }}>
        {activeView === "dashboard" && (
          <>
            <h2>Dashboard</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {activeView === "usuarios" && <h2>Usuarios (vista en construcción)</h2>}
        {activeView === "config" && <h2>Configuración (vista en construcción)</h2>}
      </div>
    </div>
  );
};

export default Dashboard;
