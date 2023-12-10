import React, { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { TopbarandUser } from "../../components/topbaranduser";
import { useAuth } from "../../services/AuthContext";
import { Error404 } from "../../components/error404";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import TextBrilloso from "../../components/textoBrilloso";
import AgregarActividad from "./agregarActividad";

const localizer = momentLocalizer(moment);

export function Actividades() {
  const { authData } = useAuth();
  const [actividades, setActividades] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controlar la apertura/cierre del modal

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const accessToken = authData?.accessToken;
        if (!accessToken) {
          setIsAuthenticated(false);
          return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        const response = await fetch(
          "http://127.0.0.1:8080/actividades/detach/paginado",
          requestOptions
        );

        if (!response.ok) {
          setIsAuthenticated(false);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const actividadesConFechas = result.content.map((actividad) => ({
          ...actividad,
          fechaCreada: new Date(actividad.fechaCreada),
        }));
        setActividades(actividadesConFechas);
        console.log(
          "Fechas de las actividades:",
          actividadesConFechas.map((a) => a.fechaCreada)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchActividades();
  }, [authData,modalIsOpen]);

  
  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <Sidebar />
      <div className={`main ${authData ? "active" : ""}`}>
        <TopbarandUser />
        <div className="container mt-4">
          {isAuthenticated ? (
            <>
              <TextBrilloso name={"Registro de actividades"} />

              <button
              style={{ background:"var(--purpura)"}}
                type="button"
                className="btn btn-primary mb-3"
                onClick={handleOpenModal}  // Usa handleOpenModal para abrir el modal
              >
                Agregar Actividad
              </button>

              <AgregarActividad
              
                isOpen={modalIsOpen}
                onClose={handleCloseModal} 
                 // Usa handleCloseModal para cerrar el modal
              />
              <div className="shadow p-4 bg-white rounded">
                <Calendar
                  localizer={localizer}
                  events={
                    Array.isArray(actividades)
                      ? actividades.map((a) => ({
                          start: a.fechaCreada,
                          end: a.fechaCreada,
                          title: a.descripcion,
                          estado: a.estado,
                        }))
                      : []
                  }
                  views={["month", "week", "day"]}
                  style={{ height: "500px", color:"var(--purpura)"}}
                  eventPropGetter={(event) => ({
                    className: `bg-${event.estado ? "success" : "warning"}`, // Usa la clase de fondo de Bootstrap
                  })}
                />
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
