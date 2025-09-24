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
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminUsers from "./AdminUsers";



const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");

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
    <div className="dashboard-container">
      <Sidebar/>
    </div>
    
  );
};

export default Dashboard;
