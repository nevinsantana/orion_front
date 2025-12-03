import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import OrionLogo from "../assets/images/img-login/Orion.png";

import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaUsers,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import { FaUserGroup, FaDollarSign } from "react-icons/fa6";
import { MdPayments } from "react-icons/md";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import "./sidebar.css";
import { TbReportSearch } from "react-icons/tb";
import { TbCalendarClock } from "react-icons/tb";

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
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    navigate("/");
    setIsOpen(false);
  };

  return (
    <>
      {/* Topbar para tablet/móvil */}
      <div className="topbar">
        <div className="sidebar-logo text-center p-4">
          <img
            src={OrionLogo}
            alt="Orion Logo"
            className="img-fluid sidebar-img"
          />
        </div>
        <div className="topbar-right">
          <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Sidebar / menú */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo escritorio */}
        {/* Logo escritorio */}
        <div className="sidebar-logo">
          <img src={OrionLogo} alt="Orion Logo" className="sidebar-img" />
        </div>

        <nav className="sidebar-menu">
          <ul>
            <li
              className={active === "dashboard" ? "active" : ""}
              onClick={() => handleClick("dashboard")}
            >
              <FaHome className="icon" /> <span>Dashboard</span>
            </li>
            <li
              className={active === "AdminUsers" ? "active" : ""}
              onClick={() => handleClick("AdminUsers")}
            >
              <FaUsers className="icon" /> <span>Admin. Usuarios</span>
            </li>
            <li
              className={active === "Clients" ? "active" : ""}
              onClick={() => handleClick("Clients")}
            >
              <FaUserGroup className="icon" /> <span>Clientes</span>
            </li>
            <li
              className={active === "Coins" ? "active" : ""}
              onClick={() => handleClick("Coins")}
            >
              <FaDollarSign className="icon" /> <span>Monedas</span>
            </li>
            <li
              className={active === "Payments" ? "active" : ""}
              onClick={() => handleClick("Payments")}
            >
              <MdPayments className="icon" /> <span>Historial de pagos</span>
            </li>
            <li
              className={active === "Invoices" ? "active" : ""}
              onClick={() => handleClick("Invoices")}
            >
              <LiaFileInvoiceSolid className="icon" /> <span>Facturas</span>
            </li>
            <li
              className={active === "InvoicesReport" ? "active" : ""}
              onClick={() => handleClick("InvoicesReport")}
            >
              <TbReportSearch className="icon" /> <span>Reporte Facturas</span>
            </li>
            <li
              className={active === "AgingReport" ? "active" : ""}
              onClick={() => handleClick("AgingReport")}
            >
              <LiaFileInvoiceDollarSolid className="icon" />{" "}
              <span>Reporte Antigüedad</span>
            </li>
            <li
              className={active === "PaymentTracking" ? "active" : ""}
              onClick={() => handleClick("PaymentTracking")}
            >
              <TbCalendarClock className="icon" />{" "}
              <span>Seguimiento de Pago</span>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div
            className={active === "profile" ? "active" : ""}
            onClick={() => handleClick("profile")}
          >
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
