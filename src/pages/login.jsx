import "../styles/login.css";
import AuthService from "../services/AuthService";
import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export function Login() {
  const { setAuth } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleCreateAccountClick = () => {
    // Agrega la clase "hide" para iniciar la transición
    document.querySelector(".wrapper").classList.add("hide");

    // Después de un breve retraso, realiza la navegación al componente de registro (/registro)
    setTimeout(() => {
      navigate("/registro");
    }, 500); // Este valor debe coincidir con el tiempo de transición en CSS
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      const data = await AuthService.authenticate(
        formData.email,
        formData.password
      );

      const accessToken = data.access_token;

      // Almacena el token de acceso en el estado o en algún almacenamiento seguro
      // Ejemplo usando el estado del componente:
      setFormData({ ...formData, accessToken });

      // Verifica si hay un token de acceso antes de redirigir
      if (accessToken) {
        setAuth({ email: formData.email, accessToken });
        navigate("/inicio");
      } else {
        setError("Credenciales inválidas. Por favor, inténtalo de nuevo.");
        // Aquí puedes manejar lógica adicional para mostrar un mensaje de error, etc.
      }
      // Maneja los datos de respuesta según sea necesario
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      setError("Error al intentar iniciar sesión. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="container main-login">
          <div className="row">
            <div className="col-md-6 side-image">
              
            </div>
            <div className="col-md-6 right">
              <div className="input-box">
                <header>Ingresar cuenta</header>
                
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
                    <label htmlFor="password">Password</label>
                  </div>
                  <div className="input-field">
                  {error && <div className="alert alert-danger">{error}</div>}
                    <input type="submit" className="submit" value="Entrar" />
                  </div>
                  <div className="signin">
                    <span>
                      Aun no tiene una cuenta?{" "}
                      <Link to="/registro" onClick={handleCreateAccountClick}>
                        Crear una cuenta
                      </Link>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
