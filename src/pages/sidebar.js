import React from "react";
import { FaHome, FaChartBar, FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";
import "./sidebar.css"; // si quieres separar estilos también

const Sidebar = () => {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <h2>LOGO</h2>
      </div>

      {/* Menú principal */}
      <nav className="sidebar-menu">
        <ul>
          <li className="active">
            <FaHome className="icon" />
            <span>Inicio</span>
          </li>
          <li>
            <FaChartBar className="icon" />
            <span>Reportes</span>
          </li>
          <li>
            <FaCog className="icon" />
            <span>Configuración</span>
          </li>
        </ul>
      </nav>

      {/* Perfil y cerrar sesión */}
      <div className="sidebar-footer">
        <div className="sidebar-profile">
          <FaUser className="icon" />
          <span>Mi Perfil</span>
        </div>
        <div className="sidebar-logout">
          <FaSignOutAlt className="icon" />
          <span>Cerrar Sesión</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
