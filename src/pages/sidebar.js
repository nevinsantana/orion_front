import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaCog,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import "./sidebar.css";

const Sidebar = ({ setActiveView }) => {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();

  const handleClick = (view) => {
    setActive(view);
    setActiveView(view);
  };

  const handleLogout = () => {
    // Aquí puedes limpiar localStorage/sessionStorage si lo usas
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img
          src="https://placehold.co/500x150/888888/ffffff?text=Imagen"
          alt=""
          className="img-fluid"
        />
      </div>

      {/* Menú principal */}
      <nav className="sidebar-menu">
        <ul>
          <li
            className={`option ${active === "dashboard" ? "active" : ""}`}
            onClick={() => handleClick("dashboard")}
          >
            <div className="icon-bg">
              <FaHome className="icon" />
            </div>
            <span>Dashboard</span>
          </li>
          <li
            className={`option ${active === "usuarios" ? "active" : ""}`}
            onClick={() => handleClick("usuarios")}
          >
            <div className="icon-bg">
              <FaChartBar className="icon" />
            </div>
            <span>Usuarios</span>
          </li>
          <li
            className={`option ${active === "config" ? "active" : ""}`}
            onClick={() => handleClick("config")}
          >
            <div className="icon-bg">
              <FaCog className="icon" />
            </div>
            <span>Configuración</span>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div
          className={`sidebar-profile ${active === "profile" ? "active" : ""}`}
          onClick={() => handleClick("profile")}
        >
          <FaUser className="icon-footer" />
          <span>Mi Perfil</span>
        </div>
        <div className="sidebar-logout" onClick={handleLogout}>
          <FaSignOutAlt className="icon-footer" />
          <span>Cerrar Sesión</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
