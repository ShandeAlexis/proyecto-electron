import React, { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { TopbarandUser } from "../../components/topbaranduser";
import { useAuth } from "../../services/AuthContext";
import { Error404 } from "../../components/error404";
import TextBrilloso from "../../components/textoBrilloso";
import Paginator from "../../components/paginacion";
import { Toast } from "react-bootstrap";
import AgregarSolicitudModal from "./agregarSolicitud";

export function Solicitudes() {
  const { authData } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showAgregarModal, setShowAgregarModal] = useState(false);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
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
          `http://127.0.0.1:8080/solicitudes/detach/paginado?page=${currentPage}&size=3`,
          requestOptions
        );

        if (!response.ok) {
          setIsAuthenticated(false);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setSolicitudes(result.content);
        setCurrentPage(result.pageable.pageNumber);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSolicitudes();
  }, [authData, currentPage]);

  // Estos dos son para la paginación
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  const handleAbrirAgregarModal = () => {
    setShowAgregarModal(true);
  };

  const handleCerrarAgregarModal = () => {
    setShowAgregarModal(false);
  };


  return (
    <>
      <Sidebar />
      <div className={`main ${authData ? "active" : ""}`}>
        <TopbarandUser />
        <div className="container">
          {isAuthenticated ? (
            <>
              <TextBrilloso name={"Solicitudes"} />
              <div className="container text-center mt-3">
                <button
                  style={{ background: "var(--purpura)" }}
                  className="btn btn-success"
                  type="button"
                  onClick={handleAbrirAgregarModal}
                >
                  Añadir <ion-icon name="add-circle-outline"></ion-icon>
                </button>
              </div>
              <div className="d-flex justify-content-center flex-wrap">
                {solicitudes.map((solicitud) => (
                  <div
                    key={solicitud.idSolicitud}
                    className="card m-3"
                    style={{ width: "18rem", background: "var(--purpura)" }}
                  >
                    <div
                      className="card-body text-center"
                      style={{ color: "var(--letra)" }}
                    >
                      <h5 className="card-title">
                        Solicitud {solicitud.idSolicitud}
                      </h5>
                      <p className="card-text">
                        Descripción: {solicitud.descripcion}
                      </p>
                      <p className="card-text">
                        {" "}
                        Fecha: {formatDate(solicitud.fechaSolicitada)}
                      </p>
                      <p className="card-text">
                        Estado:{" "}
                        <span
                          className={`badge ${
                            solicitud.estado ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {solicitud.estado ? "Activo" : "Inactivo"}
                        </span>
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setSelectedDetails(solicitud);
                          setShowDetails(true);
                        }}
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Paginator
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
              />
              <Toast
                show={showDetails}
                onClose={() => setShowDetails(false)}
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-40%, -50%)",
                  backgroundColor: "white",
                }}
              >
                <Toast.Header>
                  <strong className="me-auto">Detalles de la Solicitud</strong>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                    onClick={() => setShowDetails(false)}
                  ></button>
                </Toast.Header>
                <Toast.Body className="text-center">
                  {selectedDetails && (
                    <>
                      <p>
                        <strong>Servicio:</strong>{" "}
                        {selectedDetails.servicio.tipo}
                      </p>
                      <p>
                        <strong>Cliente:</strong>{" "}
                        {selectedDetails.cliente.nombres}
                      </p>
                      <p>
                        <strong>Telefono:</strong>{" "}
                        {selectedDetails.cliente.telefono}
                      </p>
                      <p>
                        <strong>Correo:</strong> {selectedDetails.cliente.email}
                      </p>
                     
                      {/* Agrega más campos según tus necesidades */}
                    </>
                  )}
                </Toast.Body>
              </Toast>

              <AgregarSolicitudModal
                show={showAgregarModal}
                handleClose={handleCerrarAgregarModal}
                onUpdate={() => {
                  // Aquí puedes realizar alguna acción después de actualizar la lista
                  // de solicitudes, si es necesario.
                }}
              />
            </>
          ) : (
            <Error404 />
          )}
        </div>
      </div>
    </>
  );
}
