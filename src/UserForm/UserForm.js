import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserForm.css'; // Mantenemos el archivo CSS para estilos personalizados

const UserForm = ({ user, onClose }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Datos guardados", formData);
      alert("¡Usuario guardado con éxito!");
      onClose();
    }
  };

  return (
    <div className="user-form-container">
      <Form onSubmit={handleSubmit}>
        <div className="d-flex align-items-center mb-4">
          <FaUser className="user-icon me-2" />
          <h5 className="mb-0 text-white">Datos del usuario</h5>
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
                className={`custom-input ${errors.nombre ? 'input-error' : ''}`}
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
                className={`custom-input ${errors.apellido ? 'input-error' : ''}`}
              />
              {errors.apellido && <p className="error-text">{errors.apellido}</p>}
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
                className={`custom-input ${errors.email ? 'input-error' : ''}`}
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
                className={`custom-input ${errors.password ? 'input-error' : ''}`}
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
                className={`custom-input ${errors.confirmPassword ? 'input-error' : ''}`}
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
            Guardar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UserForm;
