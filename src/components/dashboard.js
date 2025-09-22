import React from "react";
import Sidebar from "../pages/sidebar";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
    <Sidebar />
      
      <main className="dashboard-content">
        <h1>Bienvenido al dashboard</h1>
        <p>Aqui ira el contenido de tu aplicacion</p>
      </main>
    </div>
  );
};

export default Dashboard;
