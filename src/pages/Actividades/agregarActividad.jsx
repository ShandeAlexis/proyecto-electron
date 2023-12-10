import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../../services/AuthContext";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { format, addDays } from "date-fns";
import DatePicker from "react-datepicker";
const AgregarActividad = ({ isOpen, onClose, onUpdate }) => {
  const { authData } = useAuth();
  const [show, setShow] = useState(isOpen);

  const [formValido, setFormValido] = useState(false);

  const [idConductor, setIdConductor] = useState("");
  const [idVehiculo, setIdVehiculo] = useState("");
  const [idSolicitud, setIdSolicitud] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState(true);
  const [fechaCreada, setFechaCreada] = useState("");

  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);

  const accessToken = authData?.accessToken;

  const handleClose = () => {
    onClose();
    setShow(false);
  };

  const handleGuardar = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    const formattedDate = fechaCreada.toISOString(); // Convierte a formato ISO 8601


    const raw = JSON.stringify({
      conductor: { idConductor },
      vehiculo: { idVehiculo },
      solicitud: { idSolicitud },
      descripcion,
      estado,
      fechaCreada : formattedDate,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://127.0.0.1:8080/actividades", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        Swal.fire({
          title: "Buen trabajo!",
          text: "Guardado con éxito",
          icon: "success",
        });
        onUpdate();
        handleClose();
      })
      .catch((error) => console.log("error", error));
  };

  const validarCampos = () => {
    setFormValido(
      !!idConductor &&
        !!idVehiculo &&
        !!idSolicitud &&
        !!descripcion &&
        !!fechaCreada
    );
  };

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${accessToken}`);

        const requestOptions = {
          method: "GET",
          headers,
          redirect: "follow",
        };

        // Obtener conductores
        const conductoresResponse = await fetch(
          "http://127.0.0.1:8080/conductores/",
          requestOptions
        );
        const conductoresData = await conductoresResponse.json();
        setConductores(conductoresData);
      } catch (error) {
        console.error("Error al obtener conductores:", error);
      }
    };

    fetchData();
  }, [accessToken]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${accessToken}`);

        const requestOptions = {
          method: "GET",
          headers,
          redirect: "follow",
        };

        // Obtener vehículos
        const vehiculosResponse = await fetch(
          "http://127.0.0.1:8080/vehiculos/",
          requestOptions
        );
        const vehiculosData = await vehiculosResponse.json();
        setVehiculos(vehiculosData);
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
      }
    };

    fetchData();
  }, [accessToken]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${accessToken}`);

        const requestOptions = {
          method: "GET",
          headers,
          redirect: "follow",
        };

        // Obtener solicitudes
        const solicitudesResponse = await fetch(
          "http://127.0.0.1:8080/solicitudes",
          requestOptions
        );
        const solicitudesData = await solicitudesResponse.json();
        setSolicitudes(solicitudesData);
      } catch (error) {
        console.error("Error al obtener solicitudes:", error);
      }
    };

    fetchData();
  }, [accessToken]);


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Actividad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formConductor">
            <Form.Label>Conductor</Form.Label>
            <Form.Control
              as="select"
              value={idConductor}
              onChange={(e) => setIdConductor(e.target.value)}
              onBlur={validarCampos}
            >
              <option value="">Seleccione un conductor</option>
              {conductores.map((conductor) => (
                <option key={conductor.idConductor} value={conductor.idConductor}>
                  {`${conductor.nombres} ${conductor.apellidoPaterno}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formVehiculo">
            <Form.Label>Vehículo</Form.Label>
            <Form.Control
              as="select"
              value={idVehiculo}
              onChange={(e) => setIdVehiculo(e.target.value)}
              onBlur={validarCampos}
            >
              <option value="">Seleccione un vehículo</option>
              {vehiculos.map((vehiculo) => (
                <option key={vehiculo.idVehiculo} value={vehiculo.idVehiculo}>
                  {`${vehiculo.tipoVehiculo.tipo}  ${vehiculo.colorVehiculo} con la placa: ${vehiculo.placa}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formSolicitud">
            <Form.Label>Solicitud</Form.Label>
            <Form.Control
              as="select"
              value={idSolicitud}
              onChange={(e) => setIdSolicitud(e.target.value)}
              onBlur={validarCampos}
            >
              <option value="">Seleccione una solicitud</option>
              {solicitudes.map((solicitud) => (
                <option key={solicitud.idSolicitud} value={solicitud.idSolicitud}>
                {`${solicitud.descripcion}, el ${format(new Date(solicitud.fechaSolicitada), 'dd/MM/yyyy')} a las ${format(new Date(solicitud.fechaSolicitada), 'HH:mm')}`}
                  
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formDescripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese la descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              onBlur={validarCampos}
            />
          </Form.Group>

          <Form.Group controlId="formEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Check
              type="switch"
              id="custom-switch-actividad"
              label={estado ? "Activo" : "Inactivo"}
              checked={estado}
              onChange={() => setEstado(!estado)}
            />
          </Form.Group>

          <Form.Group controlId="formFechaCreada">
            <Form.Label>Fecha Creada</Form.Label>
            <br />
            <DatePicker
              selected={fechaCreada}
              onChange={(date) => setFechaCreada(date)}
              minDate={new Date()}
              showTimeSelect
              dateFormat="Pp"
              className="form-control"
              onBlur={validarCampos}
              
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          type="button"
          onClick={handleGuardar}
          disabled={!formValido}
        >
          Guardar
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AgregarActividad;
