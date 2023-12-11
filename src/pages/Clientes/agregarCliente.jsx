import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../../services/AuthContext";
import Swal from "sweetalert2";

export function AgregarCliente({ onClose, onUpdate }) {
  const { authData } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [formValido, setFormValido] = useState(false);

  const [ruc, setRuc] = useState("");
  const [nombres, setNombres] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState(true);

  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [dni, setDni] = useState("");
  const [edad, setEdad] = useState("");

  const [rucValido, setRucValido] = useState(true);
  const [nombresValido, setNombresValido] = useState(true);
  const [telefonoValido, setTelefonoValido] = useState(true);
  const [emailValido, setEmailValido] = useState(true);

  const [apellidoPaternoValido, setApellidoPaternoValido] = useState(true);
  const [apellidoMaternoValido, setApellidoMaternoValido] = useState(true);
  const [dniValido, setDniValido] = useState(true);
  const [edadValida, setEdadValida] = useState(true);
  const [genero, setGenero] = useState("");
  const [generoValido, setGeneroValido] = useState(true);

  const accessToken = authData?.accessToken;

  if (!accessToken) {
    setIsAuthenticated(false);
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const handleGuardar = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${accessToken}`);

      if (!rucValido || !nombresValido || !telefonoValido || !emailValido || !generoValido) {
        return;
      }

      let generoId;

      if (genero === "HOMBRE") {
        generoId = 1;
      } else if (genero === "MUJER") {
        generoId = 2;
      } else {
        generoId = 3;
      }

      const raw = JSON.stringify({
        ruc,
        nombres,
        telefono,
        email,
        estado,
        tipoCliente: {
          idTipoCliente: 1,
        },
        detalleCliente: {
          genero: {
            idGenero: generoId,
            tipo: genero,
          },
          apellidoPaterno,
          apellidoMaterno,
          dni,
          edad,
          foto: null,
        },
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch("http://127.0.0.1:8080/clientes", requestOptions);
      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Buen trabajo!",
          text: "Guardado con éxito",
          icon: "success",
        });
        onUpdate();
        handleClose();
      } else {
        Swal.fire({
          title: "Error",
          text: result.error || "Hubo un problema al guardar",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al procesar la solicitud",
        icon: "error",
      });
    }
  };

  const validarRuc = () => {
    const rucRegex = /^[0-9]{11}$/;
    setRucValido(ruc && ruc.match(rucRegex));
    validarFormulario();
  };

  const validarNombres = () => {
    setNombresValido(!!nombres);
    validarFormulario();
  };

  const validarTelefono = () => {
    const telefonoRegex = /^\d{9}$/;
    setTelefonoValido(telefono && telefono.match(telefonoRegex));
    validarFormulario();
  };

  const validarEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValido(email && email.match(emailRegex));
    validarFormulario();
  };

  const validarApellidoPaterno = () => {
    setApellidoPaternoValido(!!apellidoPaterno);
    validarFormulario();
  };

  const validarApellidoMaterno = () => {
    setApellidoMaternoValido(!!apellidoMaterno);
    validarFormulario();
  };

  const validarDni = () => {
    setDniValido(!!dni);
    validarFormulario();
  };

  const validarEdad = () => {
    setEdadValida(!!edad);
    validarFormulario();
  };

  const validarGenero = () => {
    setGeneroValido(!!genero);
    validarFormulario();
  };

  const validarFormulario = () => {
    setFormValido(
      rucValido &&
      nombresValido &&
      telefonoValido &&
      emailValido &&
      apellidoPaternoValido &&
      apellidoMaternoValido &&
      dniValido &&
      edadValida &&
      generoValido
    );
  };

  return (
    <Modal show={true} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formRuc">
            <Form.Label>RUC</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el RUC"
              onChange={(e) => setRuc(e.target.value)}
              onBlur={validarRuc}
              isInvalid={!rucValido}
            />
            <Form.Control.Feedback type="invalid">
              Ingrese un RUC válido (11 dígitos numéricos).
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formNombres">
            <Form.Label>Nombres</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese los nombres"
              onChange={(e) => setNombres(e.target.value)}
              onBlur={validarNombres}
              isInvalid={!nombresValido}
            />
            <Form.Control.Feedback type="invalid">
              Ingrese los nombres del cliente.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el teléfono"
              onChange={(e) => setTelefono(e.target.value)}
              onBlur={validarTelefono}
              isInvalid={!telefonoValido}
            />
            <Form.Control.Feedback type="invalid">
              Ingrese un teléfono válido (9 dígitos numéricos).
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese el email"
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validarEmail}
              isInvalid={!emailValido}
            />
            <Form.Control.Feedback type="invalid">
              Ingrese un email válido.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formGenero">
            <Form.Label>Género</Form.Label>
            <Form.Control
              as="select"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              onBlur={validarGenero}
              isInvalid={!generoValido}
            >
              <option value="">Seleccione...</option>
              <option value="HOMBRE">HOMBRE</option>
              <option value="MUJER">MUJER</option>
              <option value="OTRO">OTRO</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Seleccione una opción válida para el género.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formApellidoPaterno">
            <Form.Label>Apellido Paterno</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el apellido paterno"
              onChange={(e) => setApellidoPaterno(e.target.value)}
              onBlur={validarApellidoPaterno}
              isInvalid={!apellidoPaternoValido}
            />
            <Form.Control.Feedback type="invalid">
              Ingrese el apellido paterno del cliente.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formApellidoMaterno">
            <Form.Label>Apellido Materno</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el apellido materno"
              onChange={(e) => setApellidoMaterno(e.target.value)}
              onBlur={validarApellidoMaterno}
              isInvalid={!apellidoMaternoValido}
            />
            <Form.Control.Feedback type="invalid">
              Ingrese el apellido materno del cliente.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formDni">
            <Form.Label>DNI</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el DNI"
              onChange={(e) => setDni(e.target.value)}
              onBlur={validarDni}
              isInvalid={!dniValido}
            />
            <Form.Control.Feedback type="invalid">
              Ingrese un DNI válido.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formEdad">
            <Form.Label>Edad</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese la edad"
              onChange={(e) => setEdad(e.target.value)}
              onBlur={validarEdad}
              isInvalid={!edadValida}
            />
            <Form.Control.Feedback type="invalid">
              Ingrese una edad válida.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          type="button"
          onClick={handleGuardar}
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
