import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { useAuth } from "../../services/AuthContext";
import { TopbarandUser } from "../../components/topbaranduser";
import { AgregarConductor } from "./agregarconductor";
import { EditarConductor } from "./editarconductor";
import Swal from "sweetalert2";
import { Error404 } from "../../components/error404";
import TextBrilloso from "../../components/textoBrilloso";
import Paginator from "../../components/paginacion";

export function ConductoresLista() {
  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  const { authData } = useAuth();
  const [conductores, setConductores] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showAgregar, setShowAgregar] = useState(false);
  const [editConductor, setEditConductor] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    const fetchConductores = async () => {
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
          `http://127.0.0.1:8080/conductores/detach/paginado?page=${currentPage}&size=5`,
          requestOptions
        );

        if (!response.ok) {
          setIsAuthenticated(false);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setConductores(result.content);
        setCurrentPage(result.pageable.pageNumber);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchConductores();
  }, [authData, currentPage, dataChanged]);

  const onEdit = (item) => {
    setEditConductor(item);
  };

  const onUpdateConductor = () => {
    // Actualiza la lista de conductores después de editar uno existente
    const fetchConductores = async () => {
      try {
        // ... (código de la función fetchConductores)
        setDataChanged((prev) => !prev); // Cambia el estado dataChanged
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchConductores();
  };

  const onDelete = (item) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Estas seguro de eliminarlo?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, elimínalo!",
        cancelButtonText: "No, cancelalo!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const accessToken = authData?.accessToken;
          const myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${accessToken}`);

          const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow",
          };

          fetch(
            `http://127.0.0.1:8080/conductores/${item.idConductor}`,
            requestOptions
          )
            .then((response) => response.text())
            .then((result) => {
              console.log(result);
              setConductores(
                conductores.filter(
                  (conductor) => conductor.idConductor !== item.idConductor
                )
              );
              swalWithBootstrapButtons.fire({
                title: "Eliminado!",
                text: "Tu conductor ha sido eliminado con éxito!",
                icon: "success",
              });
            })
            .catch((error) => {
              console.log("error", error);
              swalWithBootstrapButtons.fire({
                title: "Error",
                text: "An error occurred while deleting the file.",
                icon: "error",
              });
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelado",
            text: "Tu conductor sigue en la base de datos.",
            icon: "error",
          });
        }
      });
  };

  const toggleAgregar = () => {
    setShowAgregar(!showAgregar);
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
          {showAgregar && ( // En ConductoresLista
            <AgregarConductor
              onClose={toggleAgregar}
              onUpdate={onUpdateConductor}
            />
          )}
          {editConductor && (
            <EditarConductor
              conductor={editConductor}
              onClose={() => setEditConductor(null)}
              onUpdate={onUpdateConductor}
            />
          )}

          {isAuthenticated ? (
            <>
              <TextBrilloso name="Conductores" />

              <div className="container text-center mt-3">
                <button
                  type="button"
                  className="btn btn-success d-flex align-items-center justify-content-center"
                  onClick={toggleAgregar}
                  style={{ fontSize: "1.2rem" , background:"var(--purpura)" }}
                >
                  <ion-icon
                    name="person-add-outline"
                    style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}
                  ></ion-icon>
                  Agregar
                </button>
              </div>
              <table className="table table-striped table-bordered mt-4">
                <thead className="thead-dark">
                  <tr>
                    <th>Foto</th>
                    <th>Nombres</th>
                    <th>Genero</th>
                    <th>Apellidos</th>
                    <th>DNI</th>
                    <th>Edad</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {conductores.map((conductor) => (
                    <tr key={conductor.idConductor}>
                      <td className="col-1">
                        {conductor.foto ? (
                          <img
                            src={`data:image/png;base64,${arrayBufferToBase64(
                              conductor.foto
                            )}`}
                            alt="Foto del Conductor"
                            style={{ width: "50px", height: "50px" }}
                          />
                        ) : (
                          "No hay foto"
                        )}
                      </td>
                      <td className="col-1">{conductor.nombres}</td>
                      <td className="col-1">{conductor.genero.tipo}</td>
                      <td className="col-1">
                        {conductor.apellidoPaterno} {conductor.apellidoMaterno}{" "}
                      </td>
                      <td className="col-1">{conductor.dni}</td>
                      <td className="col-auto">{conductor.edad}</td>
                      <td>{conductor.telefono}</td>
                      <td className="col-auto">{conductor.email}</td>
                      <td className="col-auto">
                        <span
                          className={`badge ${
                            conductor.estado ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {conductor.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="col-auto">
                        <button
                          className="btn btn-primary"
                          onClick={() => onEdit(conductor)}
                        >
                          <ion-icon name="create-outline"></ion-icon>
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => onDelete(conductor)}
                        >
                          <ion-icon name="trash-outline"></ion-icon>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
