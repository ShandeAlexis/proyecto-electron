// EditarConductor.js

import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../../services/AuthContext";
import Swal from "sweetalert2";

export function EditarConductor({ conductor, onClose, onUpdate }) {
  const { authData } = useAuth();
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [genero, setGenero] = useState("");
  const [dni, setDni] = useState("");
  const [edad, setEdad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [foto, setFoto] = useState(null); // Agrega estado para la foto
  const [estado, setEstado] = useState(true); // Agrega estado para el estado del conductor

  useEffect(() => {
    setNombres(conductor.nombres);
    setApellidos(`${conductor.apellidoPaterno} ${conductor.apellidoMaterno}`);
    setGenero(conductor.genero.tipo);
    setDni(conductor.dni);
    setEdad(conductor.edad);
    setTelefono(conductor.telefono);
    setEmail(conductor.email);
    setFoto(conductor.foto); // Agrega la foto desde el conductor
    setEstado(conductor.estado);
  }, [conductor]);

  const accessToken = authData?.accessToken;

  const handleClose = () => {
    onClose();
  };

  const handleGuardar = () => {
    Swal.fire({
      title: "¿Quieres guardar los cambios?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: `No guardar`,
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        let generoId;
        if (genero === "HOMBRE") {
          generoId = 1;
        } else if (genero === "MUJER") {
          generoId = 2;
        } else {
          generoId = 3;
        }

        const raw = JSON.stringify({
          idConductor: conductor.idConductor,
          nombres,
          genero: {
            idGenero: generoId,
            tipo: genero,
          },
          apellidoPaterno: apellidos.split(" ")[0],
          apellidoMaterno: apellidos.split(" ")[1] || "",
          dni,
          edad,
          telefono,
          email,
          foto, // Incluye la foto actualizada
          estado,
        });

        const requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(
          `http://127.0.0.1:8080/conductores/${conductor.idConductor}`,
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => {
            console.log(result);
            handleClose();
            onUpdate();
            Swal.fire("¡Guardado!", "", "success");
          })
          .catch((error) => {
            console.log("error", error);
            Swal.fire("Error al guardar los cambios", "", "error");
          });
      } else if (result.isDenied) {
        Swal.fire("Los cambios no han sido guardados", "", "info");
        handleClose();
      }
    });
  };

  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Conductor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formNombres">
            <Form.Label>Nombres</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formApellidos">
            <Form.Label>Apellidos</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formGenero">
            <Form.Label>Género</Form.Label>
            <Form.Control
              as="select"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
            >
              <option value="">Seleccione...</option>
              <option value="HOMBRE">HOMBRE</option>
              <option value="MUJER">MUJER</option>
              <option value="OTRO">OTRO</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formDni">
            <Form.Label>DNI</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formEdad">
            <Form.Label>Edad</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese edad"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formFoto">
            <Form.Label>Foto</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese URL de la foto"
              value={foto}
              onChange={(e) => setFoto(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Check
              type="switch"
              id="custom-switch"
              label={estado ? "Activo" : "Inactivo"}
              checked={estado}
              onChange={() => setEstado(!estado)}
            />
          </Form.Group>

  
        </Form>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="primary" type="button" onClick={handleGuardar}>
            Guardar cambios
          </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
