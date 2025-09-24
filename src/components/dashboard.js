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
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminUsers from "./AdminUsers";



const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const data = [
    { name: "Ene", value: 30 },
    { name: "Feb", value: 45 },
    { name: "Mar", value: 60 },
    { name: "Abr", value: 20 },
  ];

  return (
    <div className="dashboard-container">
      <AdminUsers/>
      <Sidebar/>
    </div>
    
  );
};

export default Dashboard;
