import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { Form, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserForm.css"; // Mantenemos el archivo CSS para estilos personalizados
import axios from "axios"; // Importar axios

// Definimos el endpoint de la API
const BASE_API_URL = "http://localhost:7777/api";
const API_ENDPOINT_USERS = `${BASE_API_URL}/users`;

// Función de utilidad para obtener los encabezados de autorización
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {}; // Devuelve un objeto vacío si no hay token
};

const UserForm = ({ user, onClose, onUserSaved }) => {
  // Agregamos onUserSaved para notificar al componente padre
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        password: "",
        confirmPassword: "",
      });
    } else {
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre) {
      newErrors.nombre = "El nombre es obligatorio.";
    }
    if (!formData.apellido) {
      newErrors.apellido = "El apellido es obligatorio.";
    }
    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato del correo electrónico es inválido.";
    }

    if (formData.password.length > 0 && formData.password.length < 8) {
      newErrors.password = "La contraseña debe de tener al menos 8 caracteres";
    }

    if (!user && !formData.password) {
      newErrors.password =
        "La contraseña es obligatoria para la creación de un nuevo usuario.";
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    if (formData.confirmPassword && !formData.password) {
      newErrors.password = "Debes ingresar una contraseña para confirmarla.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // FUNCIÓN CENTRAL: Crea o actualiza el usuario en el backend
  const saveUser = async (data) => {
    // Construimos los encabezados de autenticación
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeaders(), // Incluye Authorization si el token existe
    };

    const payload = {
      // Mapeo de campos del frontend al backend:
      first_name: data.nombre,
      last_name: data.apellido,
      email: data.email,
      ...(data.password && { password: data.password }),
      ...(data.confirmPassword && { password_confirm: data.confirmPassword }),
      admin_permission: false,
    };

    const method = user ? "put" : "post";
    const url = user ? `${API_ENDPOINT_USERS}/${user.id}` : API_ENDPOINT_USERS;

    try {
      const res = await axios({
        method: method,
        url: url,
        data: payload,
        headers: headers,
      });

      if (res.data.code === 1 || res.status === 200 || res.status === 201) {
        Swal.fire({
          icon: "success",
          title: user ? "Usuario Actualizado" : "Usuario Creado",
          text: "Los datos se han guardado con éxito.",
          timer: 3000,
          showConfirmButton: false,
          background: "#121212",
          color: "#e0e0e0",
        });

        if (onUserSaved) {
          onUserSaved();
        }
        onClose(); // Cierra el formulario/modal
      } else {
        // Manejo de códigos de respuesta inesperados
        Swal.fire({
          icon: "error",
          title: "Error de Servidor",
          text: res.data.message || "Ocurrió un error inesperado al guardar.",
          background: "#121212",
          color: "#e0e0e0",
        });
      }
    } catch (error) {
      console.error(
        "Error al enviar el formulario:",
        error.response ? error.response.data : error.message
      );

      // Manejo de error de conexión/servidor
      let errorMessage =
        error.response?.data?.message || "No se pudo conectar al servidor.";

      if (error.response?.status === 401) {
        errorMessage =
          "Acceso denegado: Por favor, inicia sesión. El token es inválido o faltante.";
      }

      Swal.fire({
        icon: "error",
        title: "Error de Conexión",
        text: errorMessage,
        background: "#121212",
        color: "#e0e0e0",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      saveUser(formData);

      // La limpieza del formulario se maneja dentro de saveUser al cerrar el modal (onClose)
    } else {
      // Opcional: mostrar una alerta de error si la validación falla
      Swal.fire({
        icon: "error",
        title: "Error de Validación",
        text: "Por favor, corrige los campos marcados en rojo.",
        background: "#121212",
        color: "#e0e0e0",
      });
    }
  };

  return (
    <div className="user-form-container">
      <Form onSubmit={handleSubmit}>
        <div className="d-flex align-items-center mb-4">
          <FaUser className="user-icon me-2" />
          <h5 className="mb-0 text-white">
            {user ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </h5>
        </div>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Nombre <span className="required">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className={`custom-input ${errors.nombre ? "input-error" : ""}`}
              />
              {errors.nombre && <p className="error-text">{errors.nombre}</p>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Apellido <span className="required">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                className={`custom-input ${
                  errors.apellido ? "input-error" : ""
                }`}
              />
              {errors.apellido && (
                <p className="error-text">{errors.apellido}</p>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Correo Electrónico <span className="required">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                className={`custom-input ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                className={`custom-input ${
                  errors.password ? "input-error" : ""
                }`}
              />
              {errors.password ? (
                <p className="error-text">{errors.password}</p>
              ) : (
                <p className="password-text">
                  Deja este campo vacío si no deseas cambiar la contraseña
                </p>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Confirmación de contraseña</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar contraseña"
                className={`custom-input ${
                  errors.confirmPassword ? "input-error" : ""
                }`}
              />
              {errors.confirmPassword ? (
                <p className="error-text">{errors.confirmPassword}</p>
              ) : (
                <p className="password-text">
                  Deja este campo vacío si no deseas cambiar la contraseña
                </p>
              )}
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-end mt-4">
          <Button type="submit" className="save-button">
            {user ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UserForm;
