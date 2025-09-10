import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Por ahora, asumimos login exitoso
    navigate("/dashboard");
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
    {/* Lado izquierdo: Placeholder de imagen */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#87ceeb", // color de ejemplo
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "2rem",
        }}
      >
        Imagen aquí
      </div>

      {/* Lado derecho: Login */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "300px",
            gap: "15px",
          }}
        >
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>
      </div>
      
    </div>
  );
};

export default Login;
