import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/sidebar";
import { useAuth } from "../services/AuthContext";
import { TopbarandUser } from "../components/topbaranduser";
import TextBrilloso from "../components/textoBrilloso";
import { Error404 } from "../components/error404";

export function Inicio() {
  const { authData } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const accessToken = authData?.accessToken;
    if (!accessToken) {
      setIsAuthenticated(false);
    }
  }, [authData]);

  console.log(authData);

  return (
    <div>
      <Sidebar />
      <div className={`main ${authData ? "active" : ""}`}>
        <TopbarandUser />

        {authData && (
          <TextBrilloso name={`Bienvenido ${authData.email}!`} />
        )}

        <div className="container d-flex justify-content-center align-items-center">
          {isAuthenticated ? (
            <div className="row mt-2 justify-content-center divmayor" 
            style={{
              backgroundColor:"var(--purpura)",
              color:"var(--letra)",
              borderRadius: "20px",
            }}>
              <div className="container col-md-6 custom-column">
                <img
                  className="imagen"
                  src="src/assets/fotocarros.png"
                  alt=""
                  style={{
                    width: "43%",
                    height: "440px",
                    borderRadius: "20px",
                  }}
                />
              </div>

              <div className="container textoinicio mt-4">
                <br />
                <br />
                <strong>- Misión</strong>
                <p>
                  <br />
                  Ofrecer un servicio de calidad, respetando la <br /> seguridad y el
                  confort, para así consolidarnos con la confianza de nuestros
                  clientes.
                </p>
                <br />
                <br />
                <strong>- Visión</strong>

                <p>
                  <br />
                  Posicionarnos en el mercado local como una <br /> de las empresas
                  con el mejor servicio de transportes de personal,
                  aprendiendo y mejorando continuamente.
                </p>
              </div>
            </div>
          ) : (
            <Error404 />
          )}
        </div>
      </div>
    </div>
  );
}
