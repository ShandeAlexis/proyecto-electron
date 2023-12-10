import React, { useEffect, useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useAuth } from "../../services/AuthContext";
import Swal from "sweetalert2";

export function AgregarVehiculo({ onClose, onUpdate }) {
    const { authData } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(true);
  
    const [formValido, setFormValido] = useState(false);
  
    const [placa, setPlaca] = useState("");
    const [colorVehiculo, setColorVehiculo] = useState("");
    const [alto, setAlto] = useState("");
    const [ancho, setAncho] = useState("");
    const [estado, setEstado] = useState(true);
  
    const [detalleVehiculo, setDetalleVehiculo] = useState({
      fechaSoatVenc: "",
      fechaCirculacionVenc: "",
      fechaTecnicaVenc: ""
    });
  
    const [tiposVehiculo, setTiposVehiculo] = useState([]);
    const [tipoVehiculoSeleccionado, setTipoVehiculoSeleccionado] = useState(null);
  
    const accessToken = authData?.accessToken;
  
    useEffect(() => {
      const obtenerTiposVehiculo = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8080/tipo-vehiculos", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`
            },
            redirect: "follow"
          });
  
          if (response.ok) {
            const data = await response.json();
            setTiposVehiculo(data);
            if (data.length > 0) {
              setTipoVehiculoSeleccionado(data[0]);
            }
          } else {
            console.error("Error al obtener tipos de vehículo");
          }
        } catch (error) {
          console.error("Error de red:", error);
        }
      };
  
      obtenerTiposVehiculo();
    }, [accessToken]);
  
    const handleClose = () => {
      onClose();
    };
  
    const handleGuardar = () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${accessToken}`);
  
      const convertirAFechaISO = (fecha) => {
        const fechaObj = new Date(fecha);
        return fechaObj.toISOString();
      };
  
      const detalleVehiculoFormateado = {
        fechaSoatVenc: convertirAFechaISO(detalleVehiculo.fechaSoatVenc),
        fechaCirculacionVenc: convertirAFechaISO(detalleVehiculo.fechaCirculacionVenc),
        fechaTecnicaVenc: convertirAFechaISO(detalleVehiculo.fechaTecnicaVenc),
      };
  
      const raw = JSON.stringify({
        tipoVehiculo: {
          idTipoVehiculo: tipoVehiculoSeleccionado?.idTipoVehiculo || 1
        },
        placa,
        foto: null,
        colorVehiculo,
        alto,
        ancho,
        estado,
        listaDetalleVehiculo: [detalleVehiculoFormateado]
      });
  
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
  
      fetch("http://127.0.0.1:8080/vehiculos", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          Swal.fire({
            title: "Buen trabajo!",
            text: "Guardado con éxito",
            icon: "success"
          });
          onUpdate();
          handleClose();
        })
        .catch((error) => console.log("error", error));
    };
  
    const validarPlaca = () => {
      setFormValido(!!placa.trim());
    };
  
    const handleDetalleVehiculoChange = (field, value) => {
      setDetalleVehiculo({
        ...detalleVehiculo,
        [field]: value
      });
    };

  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Vehículo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
        <Form.Group controlId="formTipoVehiculo">
            <Form.Label>Tipo de Vehículo</Form.Label>
            <Form.Select
              value={tipoVehiculoSeleccionado?.idTipoVehiculo || ""}
              onChange={(e) => {
                const selectedTipoVehiculo = tiposVehiculo.find(
                  (tipo) => tipo.idTipoVehiculo === parseInt(e.target.value)
                );
                setTipoVehiculoSeleccionado(selectedTipoVehiculo);
              }}
            >
              {tiposVehiculo.map((tipo) => (
                <option key={tipo.idTipoVehiculo} value={tipo.idTipoVehiculo}>
                  {tipo.tipo}
                </option>
              ))}
            </Form.Select>
          </Form.Group>


          <Form.Group controlId="formPlaca">
            <Form.Label>Placa</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese placa"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              onBlur={validarPlaca}
            />
          </Form.Group>

          <Form.Group controlId="formColorVehiculo">
            <Form.Label>Color del Vehículo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese color del vehículo"
              value={colorVehiculo}
              onChange={(e) => setColorVehiculo(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formAlto">
            <Form.Label>Alto</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese alto"
              value={alto}
              onChange={(e) => setAlto(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formAncho">
            <Form.Label>Ancho</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese ancho"
              value={ancho}
              onChange={(e) => setAncho(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formDetalleVehiculo">
            <Form.Label>Detalle del Vehículo</Form.Label>
            <Form.Group controlId="formSoat">
              <Form.Label>Fecha de vencimiento de SOAT</Form.Label>
              <Form.Control
                type="date"
                value={detalleVehiculo.fechaSoatVenc}
                onChange={(e) =>
                  handleDetalleVehiculoChange(
                    "fechaSoatVenc",
                    e.target.value
                  )
                }
              />
            </Form.Group>

            <Form.Group controlId="formCirculacion">
              <Form.Label>Fecha de vencimiento de circulación</Form.Label>
              <Form.Control
                type="date"
                value={detalleVehiculo.fechaCirculacionVenc}
                onChange={(e) =>
                  handleDetalleVehiculoChange(
                    "fechaCirculacionVenc",
                    e.target.value
                  )
                }
              />
            </Form.Group>

            <Form.Group controlId="formTecnica">
              <Form.Label>Fecha de vencimiento técnica</Form.Label>
              <Form.Control
                type="date"
                value={detalleVehiculo.fechaTecnicaVenc}
                onChange={(e) =>
                  handleDetalleVehiculoChange(
                    "fechaTecnicaVenc",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Form.Group>

          <Form.Group controlId="formEstadoVehiculo">
            <Form.Label>Estado del Vehículo</Form.Label>
            <Form.Check
              type="switch"
              id="custom-switch-vehiculo"
              label={estado ? "Activo" : "Inactivo"}
              checked={estado}
              onChange={() => setEstado(!estado)}
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
}
