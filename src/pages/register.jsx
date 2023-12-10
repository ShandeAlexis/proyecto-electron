import "../styles/login.css"; // Asegúrate de tener el archivo de estilos correspondiente
import AuthService from "../services/AuthService";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export function Register() {
  const { setAuth } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "", // Agregado para confirmar la contraseña
    tipoCuenta: "1", // Valor predeterminado, puedes ajustarlo según tus necesidades
    roles: [0], // Lista de roles seleccionados
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRolesChange = (e) => {
    const selectedRoles = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({
      ...formData,
      roles: selectedRoles,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validar que las contraseñas coincidan
      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }

      const response = await AuthService.register({
        email: formData.email,
        password: formData.password,
        tipoCuenta: {
          idTipoCuenta: parseInt(formData.tipoCuenta),
        },
        roles: formData.roles.map((roleId) => ({ idRol: parseInt(roleId) })),
      });

      if (response.status === "success") {
        const accessToken = response.access_token;
        setAuth({ email: formData.email, accessToken });
        console.log("Registro exitoso. Redirigiendo a /inicio");
        navigate("/inicio");
      } else {
        setError(response.message || "Registro fallido. No se redirige.");
        // Puedes manejar lógica adicional para mostrar un mensaje de error, etc.
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      setError("Error al intentar registrarse. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="container main-register">
          <div className="row">
            <div className="col-md-6 left">
              <div className="input-box">
                <header>Crear cuenta</header>
                <form onSubmit={handleSubmit}>
                  <div className="input-field">
                    <input
                      type="text"
                      className="input"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required=""
                      autoComplete="off"
                    />
                    <label htmlFor="email">Email</label>
                  </div>
                  <div className="input-field">
                    <input
                      type="password"
                      className="input"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      required=""
                    />
                    <label htmlFor="password">Contraseña</label>
                  </div>
                  <div className="input-field">
                    <input
                      type="password"
                      className="input"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required=""
                    />
                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                  </div>
                  <div className="input-field">
                    <br />
                    <label htmlFor="tipoCuenta">Tipo de Cuenta:</label>
                    <select
                      id="tipoCuenta"
                      className="input"
                      value={formData.tipoCuenta}
                      onChange={handleChange}
                    >
                      <option value="1">Cliente</option>
                      <option value="2">Conductor</option>
                      {/* Agrega más opciones según tus necesidades */}
                    </select>
                  </div>
                  
                
                  <div className="input-field">
                    {error && <div className="error-message">{error}</div>}
                    <input
                      type="submit"
                      className="submit"
                      value="Registrarse"
                    />
                  </div>
                  <div className="signin">
                    <span>
                      ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
                    </span>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-6 side-image-register">
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
