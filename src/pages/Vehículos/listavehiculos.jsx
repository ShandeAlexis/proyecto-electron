import React, { useState, useEffect } from "react";
import { Sidebar } from "../../components/sidebar";
import { TopbarandUser } from "../../components/topbaranduser";
import { Card, Button, Modal } from "react-bootstrap";
import { useAuth } from "../../services/AuthContext";
import { Error404 } from "../../components/error404";
import TextBrilloso from "../../components/textoBrilloso";
import { AgregarVehiculo } from "./agregarVehiculo";
import { EditarVehiculo } from "./editarVehiculo";
import Paginator from "../../components/paginacion";

export function ListaVehiculos() {
  const { authData } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [dataChanged, setDataChanged] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [mostrarEditarModal, setMostrarEditarModal] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  const [editarVehiculo, setEditarVehiculo] = useState(null);

  useEffect(() => {
    const fetchVehiculos = async () => {
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
          `http://127.0.0.1:8080/vehiculos/detach/paginado?page=${currentPage}&size=4`,
          requestOptions
        );

        if (!response.ok) {
          setIsAuthenticated(false);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setVehiculos(result.content);
        setCurrentPage(result.pageable.pageNumber);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchVehiculos();
  }, [authData, currentPage, dataChanged]);

  const onVerDetalles = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
  };

  const onCloseDetalles = () => {
    setSelectedVehiculo(null);
  };

  const handleMostrarModal = () => {
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  const handleEditar = (vehiculo) => {
    setEditarVehiculo(vehiculo);
  };
  const handleUpdateList = () => {
    setDataChanged((prev) => !prev); // Cambia el estado para forzar la recarga de la lista
  };

  //esos dos es para la paginacion
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  return (
    <>
      <Sidebar />
      <div className={`main ${authData ? "active" : ""}`}>
        <TopbarandUser />
        <div className="container">
          {isAuthenticated ? (
            <>
              <TextBrilloso name={"Vehiculos"} />
              <div className="container text-center mt-3">
                <button
                  style={{ background: "var(--purpura)" }}
                  className="btn btn-success "
                  type="button"
                  onClick={handleMostrarModal}
                >
                  Agregar <ion-icon name="car-outline"></ion-icon>
                </button>
                {mostrarModal && (
                  <AgregarVehiculo
                    onClose={handleCerrarModal}
                    onUpdate={() => {
                      // Aquí puedes realizar acciones después de agregar un vehículo, si es necesario
                      handleCerrarModal(); // Cerrar el modal después de agregar el vehículo
                    }}
                  />
                )}
              </div>
              <div className="d-flex justify-content-center flex-wrap ">
                {vehiculos.map((vehiculo) => (
                  <Card
                  
                    key={vehiculo.idVehiculo}
                    className="m-3"
                    style={{ width: "18rem",  background: "var(--purpura)" }}
                    
                  >
                    <Card.Img
                      src="https://static.motor.es/fotos-noticias/2020/03/que-coche-es-rayo-mcqueen-202066150-1585635516_1.jpg"
                      alt="Card image"
                      className="container"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        top: "6px",
                        left: "2px", // Hace que la imagen ocupe todo el ancho del card
                      }}
                    />
                    <Card.Body className="text-center"  style={{ color: "var(--letra)" }}>
                      <Card.Title>Placa: {vehiculo.placa}</Card.Title>
                      <Card.Text >
                        <strong >Estado:</strong>{" "}
                        <span
                          className={`badge ${
                            vehiculo.estado ? "bg-success" : "bg-warning"
                          }`}
                        >
                          {vehiculo.estado ? "Activo" : "Inactivo"}
                        </span>{" "}
                        <br />
                        <strong>Tipo de vehiculo:</strong>{" "}
                        {vehiculo.tipoVehiculo.tipo} <br />
                        <strong>Fecha Circulación:</strong>{" "}
                        {new Date(
                          vehiculo.listaDetalleVehiculo[0].fechaCirculacionVenc
                        ).toLocaleDateString()}{" "}
                        <br />
                        <strong>Fecha Técnica:</strong>{" "}
                        {new Date(
                          vehiculo.listaDetalleVehiculo[0].fechaTecnicaVenc
                        ).toLocaleDateString()}{" "}
                        <br />
                      </Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => onVerDetalles(vehiculo)}
                      >
                        Ver detalles
                      </Button>
                      <Button
                        variant="warning"
                        onClick={() => handleEditar(vehiculo)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => onVerDetalles(vehiculo)}
                      >
                        Eliminar
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
              </div>
              {editarVehiculo && (
                <EditarVehiculo
                vehiculo={editarVehiculo}
                onClose={() => setEditarVehiculo(null)}
                onUpdate={handleUpdateList}  // Pasa la función onUpdate
              />
              )}

              {/* Modal para detalles */}
              <Modal show={selectedVehiculo !== null} onHide={onCloseDetalles}>
                <Modal.Header closeButton>
                  <Modal.Title>Detalles del Vehículo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedVehiculo && (
                    <>
                      <p>
                        <strong>Color:</strong> {selectedVehiculo.colorVehiculo}{" "}
                        <br />
                        <strong>Alto:</strong> {selectedVehiculo.alto} <br />
                        <strong>Ancho:</strong> {selectedVehiculo.ancho} <br />
                        <strong>Capacidad Máxima:</strong>{" "}
                        {selectedVehiculo.tipoVehiculo.capacidadMaxima} <br />
                        <strong>Descripción:</strong>{" "}
                        {selectedVehiculo.tipoVehiculo.descripcion} <br />
                        {/* Puedes agregar más información según tus necesidades */}
                        <strong>Fecha SOAT:</strong>{" "}
                        {new Date(
                          selectedVehiculo.listaDetalleVehiculo[0].fechaSoatVenc
                        ).toLocaleDateString()}{" "}
                        <br />
                      </p>
                    </>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="warning" onClick={onCloseDetalles}>
                    Cerrar
                  </Button>
                </Modal.Footer>
              </Modal>

              <Paginator
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
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
