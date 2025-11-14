import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import ForgotPassword from "./components/forgotPassword";
import RequestPassword from "./components/requestPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentsReceipts from "./components/paymentsReceipts";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/request-password" element={<RequestPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* 👉 Ruta para pruebas de subir imagen */}
        <Route path="/upload-test" element={<PaymentsReceipts />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
