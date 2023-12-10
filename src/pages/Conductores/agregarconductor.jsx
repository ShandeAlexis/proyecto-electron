import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useAuth } from "../../services/AuthContext";
import Swal from "sweetalert2";

export function AgregarConductor({ onClose, onUpdate }) {
  const { authData } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Agrega un estado para el estado de autenticación

  const [formValido, setFormValido] = useState(false);

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [genero, setGenero] = useState("");
  const [dni, setDni] = useState("");
  const [edad, setEdad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [foto, setFoto] = useState(null); // Agrega un estado para la foto
  const [estado, setEstado] = useState(true); // Agrega un estado para el estado del conductor

  // Agrega estados para la validez de cada campo
  const [nombresValido, setNombresValido] = useState(true);
  const [nombresError, setNombresError] = useState("");
  const [apellidosValido, setApellidosValido] = useState(true);
  const [apellidosError, setApellidosError] = useState("");
  const [generoValido, setGeneroValido] = useState(true);
  const [generoError, setGeneroError] = useState("");
  const [dniValido, setDniValido] = useState(true);
  const [dniError, setDniError] = useState("");
  const [edadValida, setEdadValida] = useState(true);
  const [edadError, setEdadError] = useState("");
  const [telefonoValido, setTelefonoValido] = useState(true);
  const [telefonoError, setTelefonoError] = useState("");
  const [emailValido, setEmailValido] = useState(true);
  const [emailError, setEmailError] = useState("");

  const accessToken = authData?.accessToken;
  if (!accessToken) {
    // Si no hay accessToken, el usuario no está autenticado
    setIsAuthenticated(false);
    return;
  }
  const reader = new FileReader();

  reader.onloadend = () => {
    const byteArray = Array.from(new Uint8Array(reader.result));
    setFoto(byteArray);
  };

  if (foto instanceof Blob) {
    reader.readAsArrayBuffer(foto);
  }

  const handleClose = () => {
    onClose();
  };

  const handleGuardar = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    let generoId; // Variable para almacenar el ID del género según la selección
    if (genero === "HOMBRE") {
      generoId = 1; // ID de HOMBRE en tu sistema
    } else if (genero === "MUJER") {
      generoId = 2; // ID de MUJER en tu sistema
    } else {
      generoId = 3; // ID de OTRO en tu sistema
    }

    // Validaciones antes de enviar los datos al servidor
    if (!nombresValido) {
      // Si el nombre no es válido, muestra un mensaje de error y no envíes la solicitud
      return;
    }
    if (!apellidosValido) {
      // Si el nombre no es válido, muestra un mensaje de error y no envíes la solicitud
      return;
    }

    const raw = JSON.stringify({
      nombres,
      genero: {
        idGenero: generoId, // Puedes cambiar esto según tus necesidades
        tipo: genero,
      },
      apellidoPaterno: apellidos.split(" ")[0], // Tomar el primer apellido
      apellidoMaterno: apellidos.split(" ")[1] || "", // Tomar el segundo apellido si existe
      dni,
      edad,
      telefono,
      email,
      foto, // Incluye el estado actual de la foto
      estado, // Incluye el estado actual del conductor
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://127.0.0.1:8080/conductores", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        // Puedes realizar acciones adicionales después de guardar
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

  const validarNombres = () => {
    // Validar que el nombre no sea nulo y tenga entre 4 y 35 caracteres
    if (!nombres || nombres.length < 4 || nombres.length > 35) {
      setNombresValido(false);
      setNombresError("El nombre debe tener entre 4 y 35 caracteres");
      setFormValido(false);
    } else {
      setNombresValido(true);
      setNombresError("");
      setFormValido(true);
    }
  };

  const validarApellidos = () => {
    // Validar que haya un espacio en los apellidos y que cada apellido tenga al menos 4 caracteres
    const apellidosArray = apellidos.split(" ");
    if (
      apellidosArray.length !== 2 ||
      apellidosArray.some(
        (apellido) => !apellido.trim() || apellido.trim().length < 4
      )
    ) {
      setApellidosValido(false);
      setApellidosError(
        "Ingrese ambos apellidos separados entre un espacio , cada uno con al menos 4 caracteres"
      );
      setFormValido(false);
    } else {
      setApellidosValido(true);
      setApellidosError("");
      setFormValido(true);
    }
  };

  const validarGenero = () => {
    // Validar que se haya seleccionado una opción válida para el género
    if (!genero) {
      setGeneroValido(false);
      setGeneroError("Seleccione una opción válida para el género");
      setFormValido(false);
    } else {
      setGeneroValido(true);
      setGeneroError("");
      setFormValido(true);
    }
  };
  const validarDNI = () => {
    // Validar que el DNI contenga solo números y tenga una longitud de 8 dígitos
    const dniRegex = /^[0-9]{8}$/;
    if (!dni || !dni.match(dniRegex)) {
      setDniValido(false);
      setDniError("Ingrese un DNI válido de 8 dígitos");
      setFormValido(false);
    } else {
      setDniValido(true);
      setDniError("");
      setFormValido(true);
    }
  };
  const validarEdad = () => {
    // Validar que la edad no esté vacía y sea un valor numérico válido
    const edadValue = parseInt(edad, 10);
    if (isNaN(edadValue) || edad.trim() === "") {
      setEdadValida(false);
      setEdadError("Ingrese una edad válida");
      setFormValido(false);
    } else {
      setEdadValida(true);
      setEdadError("");
      setFormValido(true);
    }
  };

  const validarTelefono = () => {
    const telefonoRegex = /^\d{9}$/;
    if (!telefono || !telefono.match(telefonoRegex)) {
      setTelefonoValido(false);
      setTelefonoError("Ingrese un teléfono válido con 9 dígitos");
      setFormValido(false);
    } else {
      setTelefonoValido(true);
      setTelefonoError("");
      setFormValido(true);
    }
  };

  const validarEmail = () => {
    // Validar formato de email sin verificar unicidad
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.match(emailRegex)) {
      setEmailValido(false);
      setEmailError("Ingrese un email válido");
      setFormValido(false);
    } else {
      setEmailValido(true);
      setEmailError("");
      setFormValido(true);
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFoto(selectedFile);
  };

  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Conductor</Modal.Title>
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
              onBlur={validarNombres} // Validar cuando el campo pierde el foco
              isInvalid={!nombresValido} // Marcar el campo como no válido si la validación falla
            />
            {/* Mostrar un mensaje de error si el nombre no es válido */}
            <Form.Control.Feedback type="invalid">
              {nombresError}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formApellidos">
            <Form.Label>Apellidos</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              onBlur={validarApellidos}
              isInvalid={!apellidosValido}
            />
            <Form.Control.Feedback type="invalid">
              {apellidosError}
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
              {generoError}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formDni">
            <Form.Label>DNI</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              onBlur={validarDNI}
              isInvalid={!dniValido}
            />
            <Form.Control.Feedback type="invalid">
              {dniError}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formEdad">
            <Form.Label>Edad</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese edad"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              onBlur={validarEdad}
              isInvalid={!edadValida}
            />
            <Form.Control.Feedback type="invalid">
              {edadError}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <InputGroup>
              <InputGroup.Text id="telefono-prefix">+51</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Ingrese teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                onBlur={validarTelefono}
                isInvalid={!telefonoValido}
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {telefonoError}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validarEmail}
              isInvalid={!emailValido}
            />
            <Form.Control.Feedback type="invalid">
              {emailError}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formFoto">
            <Form.Label>Foto</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setFoto(e.target.files[0])} // Guarda el archivo seleccionado en el estado
            />
            <br />
            {/* Puedes agregar algún mensaje de ayuda o validación aquí */}
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
            <br />
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
