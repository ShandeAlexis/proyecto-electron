import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { TopbarandUser } from "../../components/topbaranduser";
import { useAuth } from "../../services/AuthContext";
import TextBrilloso from "../../components/textoBrilloso";

export function Configuracion() {
  const { authData } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = authData?.email;

        if (!userEmail) {
          throw new Error("Correo electrónico del usuario no disponible");
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${authData?.accessToken}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        const response = await fetch(
          "http://127.0.0.1:8080/usuarios",
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Error al obtener datos de los usuarios");
        }

        const usersData = await response.json();

        // Filtra el usuario cuyo correo electrónico coincide con el del usuario autenticado
        const currentUser = usersData.find((user) => user.email === userEmail);

        if (currentUser) {
          setUserData(currentUser);
        } else {
          throw new Error("Usuario no encontrado");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated, authData]);

  return (
    <>
      <Sidebar />
      <div className={`main ${authData ? "active" : ""}`}>
        <TopbarandUser />
        <div className="container ">
          {isAuthenticated ? (
            <>
            <br />
              <TextBrilloso name={"Configuración"} />
              <br />
              <div className="container text-center mt-5">
                {userData && (
                  <>
                    <div class="form-floating mb-3 container d-flex justify-content-center align-items-center">
                      <input
                        type="email"
                        className="form-control "
                        style={{ width: "600px", alignContent: "center" }}
                        id="floatingInputDisabled"
                        placeholder="name@example.com"
                        disabled
                      />
                      <label
                        className="container d-flex justify-content-center align-items-center"
                        for="floatingInputDisabled"
                      >
                        Tipo de cuenta: {userData.tipoCuenta.tipo}
                      </label>
                    </div>
                    <div class="form-floating mb-3 container d-flex justify-content-center align-items-center">
                      <input
                        type="email"
                        className="form-control "
                        style={{ width: "600px", alignContent: "center" }}
                        id="floatingInputDisabled"
                        placeholder="name@example.com"
                        disabled
                      />
                      <label
                        className="container d-flex justify-content-center align-items-center"
                        for="floatingInputDisabled"
                      >
                        Correo : {userData.email}
                      </label>
                    </div>
                    <div class="form-floating mb-3 container d-flex justify-content-center align-items-center">
                      <input
                        type="email"
                        className="form-control "
                        style={{ width: "600px", alignContent: "center" }}
                        id="floatingInputDisabled"
                        placeholder="name@example.com"
                        disabled
                      />
                      <label
                        className="container d-flex justify-content-center align-items-center"
                        for="floatingInputDisabled"
                      >
                        {userData.password}
                      </label>
                    </div>
                    <div class="form-floating mb-3 container d-flex justify-content-center align-items-center">
                      <input
                        type="email"
                        className="form-control "
                        style={{ width: "600px", alignContent: "center" }}
                        id="floatingInputDisabled"
                        placeholder="name@example.com"
                        disabled
                      />
                      <label
                        className="container d-flex justify-content-center align-items-center"
                        for="floatingInputDisabled"
                      >
                        Fecha de creación:  {userData.fechaCreacion}
                      </label>
                    </div>
                    <div class="form-floating mb-3 container d-flex justify-content-center align-items-center">
                      <input
                        type="email"
                        className="form-control "
                        style={{ width: "600px", alignContent: "center" }}
                        id="floatingInputDisabled"
                        placeholder="name@example.com"
                        disabled
                      />
                      <label
                        className="container d-flex justify-content-center align-items-center"
                        for="floatingInputDisabled"
                      >
                      {userData.listaRole && userData.listaRole.length > 0 && (
                      <div>Rol: {userData.listaRole[0].nombre}</div>
                    )}

                      </label>
                    </div>
                    <div class="form-floating mb-3 container d-flex justify-content-center align-items-center">
                      <input
                        type="email"
                        className="form-control "
                        style={{ width: "600px", alignContent: "center" }}
                        id="floatingInputDisabled"
                        placeholder="name@example.com"
                        disabled
                      />
                      <label
                        className="container d-flex justify-content-center align-items-center"
                        for="floatingInputDisabled"
                      >
                       {userData.listaRole && userData.listaRole.length > 0 && (
                      <div>{userData.listaRole[0].descripcion}</div>
                    )}
                      </label>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Error404 />
          )}
        </div>
      </div>
    </>
  );
}
