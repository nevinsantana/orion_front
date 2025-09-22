import React, { useState } from "react";
import { FaHome, FaChartBar, FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";
import "./sidebar.css";

const Sidebar = ({ setActiveView }) => {
  const [active, setActive] = useState("dashboard");

  const handleClick = (view) => {
    setActive(view);
    setActiveView(view); // esto cambiará el contenido en dashboard-content
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <h2>LOGO</h2>
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
        <div className="sidebar-profile">
          <div className="icon-bg">
            <FaUser className="icon" />
          </div>
          <span>Mi Perfil</span>
        </div>
        <div className="sidebar-logout">
          <div className="icon-bg">
            <FaSignOutAlt className="icon" />
          </div>
          <span>Cerrar Sesión</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
