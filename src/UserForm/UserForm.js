import { useState } from "react";
import styles from "./UserForm.module.css";
import { FaUser } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';


const UserForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {}; // almacena el error
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

    if (formData.password.length > 0) {
      if (formData.password.length < 8) {
        newErrors.password = "La contraseña debe de tener almenos 8 caracteres";
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    if (formData.password && formData.confirmPassword) {
      newErrors.confirmPassword =
        "Debes ingresar una contraseña para confirmarla.";
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
      alert("!Usuario guardado con exito!");
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <FaUser className={styles.icon} />
          <span>Usuarios</span>
        </div>
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <div className={styles.formContainerleft}>
              <label>
                Nombre <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className={`${styles.input} ${
                  errors.nombre ? styles.inputError : ""
                }`}
              />
              {errors.nombre && (
                <p className={styles.errorText}>{errors.nombre}</p>
              )}

              <label>
                Correo Electrónico <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                className={`${styles.input} ${
                  errors.email ? styles.inputError : ""
                }`}
              />
              {errors.email && (
                <p className={styles.errorText}>{errors.email}</p>
              )}

              <label>Confirmación de contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar contraseña"
                className={`${styles.input} ${
                  errors.confirmPassword ? styles.inputError : ""
                }`}
              />
              {errors.confirmPassword ? (
                <p className={styles.errorText}>{errors.confirmPassword}</p>
              ) : (
                <p className={styles.passwordText}>
                  Deja este campo vacío si no deseas cambiar la contraseña
                </p>
              )}
            </div>
            <div className={styles.formContainerleft}>
              <label>
                Apellido <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                className={`${styles.input} ${
                  errors.apellido ? styles.inputError : ""
                }`}
              />
              {errors.apellido && (
                <p className={styles.errorText}>{errors.apellido}</p>
              )}
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                className={`${styles.input} ${
                  errors.password ? styles.inputError : ""
                }`}
              />
              {errors.password ? (
                <p className={styles.errorText}>{errors.password}</p>
              ) : (
                <p className={styles.passwordText}>
                  Deja este campo vacío si no deseas cambiar la contraseña
                </p>
              )}
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.saveButton}>
              Guardar
            </button>
          </div>
        </form>
      </div>
      <form></form>
    </div>
  );
};

export default UserForm;
