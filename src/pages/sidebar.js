import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaCog, FaUser, FaSignOutAlt, FaUsers, FaBars, FaTimes } from "react-icons/fa";
import "./sidebar.css";

const Sidebar = ({ setActiveView }) => {
  const [active, setActive] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (view) => {
    setActive(view);
    setActiveView(view);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <>
      {/* Topbar para tablet/móvil */}
      <div className="topbar">
        <div className="topbar-left">
          <img src="https://placehold.co/150x50/888888/ffffff?text=Logo" alt="Logo" className="logo-topbar" />
        </div>
        <div className="topbar-right">
          <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Sidebar / menú */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo escritorio */}
        <img
          src="https://placehold.co/150x50/888888/ffffff?text=Logo"
          alt="Logo"
          className="sidebar-logo"
        />

        <nav className="sidebar-menu">
          <ul>
            <li className={active === "dashboard" ? "active" : ""} onClick={() => handleClick("dashboard")}>
              <FaHome className="icon" /> <span>Dashboard</span>
            </li>
            <li className={active === "usuarios" ? "active" : ""} onClick={() => handleClick("usuarios")}>
              <FaUsers className="icon" /> <span>Usuarios</span>
            </li>
            <li className={active === "config" ? "active" : ""} onClick={() => handleClick("config")}>
              <FaCog className="icon" /> <span>Configuración</span>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className={active === "profile" ? "active" : ""} onClick={() => handleClick("profile")}>
            <FaUser className="icon-footer" /> <span>Perfil</span>
          </div>
          <div className="sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt className="icon-footer" /> <span>Cerrar Sesión</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
