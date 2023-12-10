import React, { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { TopbarandUser } from "../../components/topbaranduser";
import { useAuth } from "../../services/AuthContext";
import { Error404 } from "../../components/error404";
import TextBrilloso from "../../components/textoBrilloso";
import Paginator from "../../components/paginacion";

export function Clientes() {
  const { authData } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  //esto es para la paginacion
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    const fetchClientes = async () => {
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
          `http://127.0.0.1:8080/clientes/paginado?page=${currentPage}&size=5`,
          requestOptions
        );

        if (!response.ok) {
          setIsAuthenticated(false);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setClientes(result.content);
        setCurrentPage(result.pageable.pageNumber);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchClientes();
  }, [authData, currentPage, dataChanged]);

  const onEdit = (cliente) => {
    // Implementa la lógica de edición según tus necesidades
    console.log("Editar:", cliente);
  };

  const onDelete = (cliente) => {
    // Implementa la lógica de eliminación según tus necesidades
    console.log("Eliminar:", cliente);
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
              <TextBrilloso name={"Clientes"} />
              <div className="container text-center mt-3">
                <button
                  type="button"
                  className="btn btn-success d-flex align-items-center justify-content-center"
                  // onClick={}
                  style={{ fontSize: "1.2rem" , background:"var(--purpura)" }}
                >
                  <ion-icon
                    name="business-outline"
                    style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}
                  ></ion-icon>
                  Agregar
                </button>
              </div>
              <table className="table table-striped table-bordered mt-4">
                <thead className="thead-dark">
                  <tr>
                    <th>ID</th>
                    <th>RUC</th>
                    <th>Nombres</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.idCliente}>
                      <td>{cliente.idCliente}</td>
                      <td>{cliente.ruc}</td>
                      <td>{cliente.nombres}</td>
                      <td>{cliente.telefono}</td>
                      <td>{cliente.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            cliente.estado ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {cliente.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => onEdit(cliente)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => onDelete(cliente)}
                        >
                          Eliminar
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
