import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useAuth } from "../../services/AuthContext";

const AgregarSolicitudModal = ({ show, handleClose, onUpdate }) => {
  const { authData } = useAuth();

  const [idSolicitud, setIdSolicitud] = useState(""); // O proporciona un valor inicial apropiado
  const [idServicio, setIdServicio] = useState(null);
  const [idCliente, setIdCliente] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState(true);
  const [fechaSolicitada, setFechaSolicitada] = useState(new Date());
  const [listaDetalleSolicitud, setListaDetalleSolicitud] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);

  const accessToken = authData?.accessToken;

  const handleGuardar = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${accessToken}`);

      const raw = JSON.stringify({
        idSolicitud,
        servicio: { idServicio },
        cliente: { idCliente },
        descripcion,
        fechaSolicitada: fechaSolicitada.toISOString(),
        estado,
        listaDetalleSolicitud,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://127.0.0.1:8080/solicitudes",
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.text(); // Cambiado a text, ya que el ejemplo muestra que la respuesta es texto
      setApiResponse(result);
      onUpdate(); // Llama a la función onUpdate para actualizar la lista de solicitudes
    } catch (error) {
      setError(error.message);
    }

    // Cierra el modal después de guardar
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Solicitud</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formIdSolicitud">
            <Form.Label>ID Solicitud</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese el ID de la solicitud"
              value={idSolicitud}
              onChange={(e) => setIdSolicitud(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formIdServicio">
            <Form.Label>ID Servicio</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese el ID del servicio"
              value={idServicio}
              onChange={(e) => setIdServicio(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formIdCliente">
            <Form.Label>ID Cliente</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese el ID del cliente"
              value={idCliente}
              onChange={(e) => setIdCliente(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formListaDetalleSolicitud">
            <Form.Label>Lista Detalle Solicitud</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese la lista de detalle de solicitud"
              value={listaDetalleSolicitud}
              onChange={(e) => setListaDetalleSolicitud(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formDescripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese la descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Check
              type="switch"
              id="custom-switch-solicitud"
              label={estado ? "Activo" : "Inactivo"}
              checked={estado}
              onChange={() => setEstado(!estado)}
            />
          </Form.Group>

          <Form.Group controlId="formFechaSolicitada">
            <Form.Label>Fecha Solicitada</Form.Label>
            <br />
            <DatePicker
              selected={fechaSolicitada}
              onChange={(date) => setFechaSolicitada(date)}
              minDate={new Date()}
              showTimeSelect
              dateFormat="Pp"
              className="form-control"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {apiResponse && (
          <p>Respuesta de la API: {JSON.stringify(apiResponse)}</p>
        )}
        {error && <p>Error: {error}</p>}
        <Button variant="primary" type="button" onClick={handleGuardar}>
          Guardar
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AgregarSolicitudModal;
