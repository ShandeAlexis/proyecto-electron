import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../../services/AuthContext";
import Swal from "sweetalert2";

export function EditarVehiculo({ vehiculo, onClose, onUpdate }) {
  const { authData } = useAuth();
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
  const [formValido, setFormValido] = useState(false); // Agregar esta línea
  const accessToken = authData?.accessToken;

  useEffect(() => {
    if (vehiculo) {
      setPlaca(vehiculo.placa || "");
      setColorVehiculo(vehiculo.colorVehiculo || "");
      setAlto(vehiculo.alto || "");
      setAncho(vehiculo.ancho || "");
      setEstado(vehiculo.estado || true);
      setDetalleVehiculo({
        fechaSoatVenc: vehiculo.listaDetalleVehiculo[0]?.fechaSoatVenc || "",
        fechaCirculacionVenc: vehiculo.listaDetalleVehiculo[0]?.fechaCirculacionVenc || "",
        fechaTecnicaVenc: vehiculo.listaDetalleVehiculo[0]?.fechaTecnicaVenc || ""
      });
    }

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
  }, [accessToken, vehiculo]);

  const handleClose = () => {
    onClose();
  };

  const handleGuardarEdicion = async () => {
    try {
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
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch(`http://127.0.0.1:8080/vehiculos/${vehiculo.idVehiculo}`, requestOptions);

      if (response.ok) {
        Swal.fire({
          title: "Buen trabajo!",
          text: "Edición exitosa",
          icon: "success"
        });
        onUpdate();
        handleClose();
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: "Error",
          text: errorData.message || "Hubo un problema al editar el vehículo",
          icon: "error"
        });
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
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
        <Modal.Title>Editar Vehículo</Modal.Title>
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
              value={placa}
              onChange={(e) => {
                setPlaca(e.target.value);
                validarPlaca();
              }}
              placeholder="Ingrese la placa del vehículo"
              isInvalid={!formValido}
            />
            <Form.Control.Feedback type="invalid">
              La placa no puede estar vacía.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formColorVehiculo">
            <Form.Label>Color del Vehículo</Form.Label>
            <Form.Control
              type="text"
              value={colorVehiculo}
              onChange={(e) => setColorVehiculo(e.target.value)}
              placeholder="Ingrese el color del vehículo"
            />
          </Form.Group>

          <Form.Group controlId="formAlto">
            <Form.Label>Alto del Vehículo</Form.Label>
            <Form.Control
              type="number"
              value={alto}
              onChange={(e) => setAlto(e.target.value)}
              placeholder="Ingrese el alto del vehículo"
            />
          </Form.Group>

          <Form.Group controlId="formAncho">
            <Form.Label>Ancho del Vehículo</Form.Label>
            <Form.Control
              type="number"
              value={ancho}
              onChange={(e) => setAncho(e.target.value)}
              placeholder="Ingrese el ancho del vehículo"
            />
          </Form.Group>

          {/* Resto del formulario de acuerdo a tus campos */}

          <Button
            variant="primary"
            type="button"
            onClick={handleGuardarEdicion}
            disabled={!formValido}
          >
            Guardar
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
