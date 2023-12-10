import React, { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { TopbarandUser } from "../../components/topbaranduser";
import { useAuth } from "../../services/AuthContext";
import { Error404 } from "../../components/error404";
import TextBrilloso from "../../components/textoBrilloso";
import Paginator from "../../components/paginacion";
import moment from "moment"; // Importa moment
import jsPDF from "jspdf";

export function ListaFacturas() {
  const { authData } = useAuth();
  const [facturas, setFacturas] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    const fetchFacturas = async () => {
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
          `http://127.0.0.1:8080/facturas/paginado?page=${currentPage}&size=5`,
          requestOptions
        );

        if (!response.ok) {
          setIsAuthenticated(false);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        // Formatea las fechas utilizando moment
        const facturasFormateadas = result.content.map((factura) => ({
          ...factura,
          fecha: moment(factura.fecha).format("YYYY-MM-DD"), // Ajusta el formato según tus necesidades
          ordenServicio: {
            ...factura.ordenServicio,
            fecha: moment(factura.ordenServicio.fecha).format("DD/MM/YYYY"),
          },
        }));

        setFacturas(facturasFormateadas);
        setCurrentPage(result.pageable.pageNumber);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchFacturas();
  }, [authData, currentPage, dataChanged]);

  const onEdit = (factura) => {
    console.log("Editar:", factura);
    // Implementa la lógica de edición según tus necesidades
  };

  const onDelete = (factura) => {
    console.log("Eliminar:", factura);
    // Implementa la lógica de eliminación según tus necesidades
  };

  //esos dos es para la paginacion
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  // Función para generar y descargar el PDF
  const handleDownloadPDF = (factura) => {
    const doc = new jsPDF();
    doc.text(`Empresa: Santa Rosa`, 20, 20);
    // Añade los datos de la factura al PDF
    doc.text(`ID Factura: ${factura.idFactura}`, 20, 30);
    doc.text(`Código Factura: ${factura.codigoFactura}`, 20, 40);
    doc.text(`Fecha: ${factura.fecha}`, 20, 50);
    doc.text(`Estado: ${factura.estado ? "Activo" : "Inactivo"}`, 20, 80);
    // Añade los datos de la orden de servicio al PDF
    doc.text(
      `ID Orden Servicio: ${factura.ordenServicio.idOrdenServicio}`,
      20,
      90
    );
    doc.text(
      `Código Orden Servicio: ${factura.ordenServicio.codigoOrden}`,
      20,
      100
    );
    doc.text(`Fecha Orden Servicio: ${factura.ordenServicio.fecha}`, 20, 110);
    doc.text(
      `Estado Orden Servicio: ${
        factura.ordenServicio.estado ? "Activo" : "Inactivo"
      }`,
      20,
      120
    );

    // Añade más campos según sea necesario
    // Agrega una imagen en la esquina superior derecha
    const logoImage = new Image();
    logoImage.src = "src/assets/planta.jpg"; // Reemplaza con la ruta correcta de tu imagen
    doc.addImage(
      logoImage,
      "JPEG",
      doc.internal.pageSize.width - 65,
      20,
      50,
      30
    );

    // Guarda el PDF con un nombre único
    const fileName = `factura_${factura.idFactura}.pdf`;
    doc.save(fileName);
  };

  return (
    <>
      <Sidebar />
      <div className={`main ${authData ? "active" : ""}`}>
        <TopbarandUser />
        <div className="container">
          {isAuthenticated ? (
            <>
              <TextBrilloso name={"Facturas"} />
              <div className="container text-center mt-3">
                {/* Agregar botón de agregar factura si es necesario */}
              </div>
              <table className="table table-striped table-bordered mt-4">
                <thead className="thead-dark">
                  <tr>
                    <th>ID Factura</th>
                    <th>Código Factura</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>ID Orden Servicio</th>
                    <th>Código Orden Servicio</th>
                    <th>Fecha Orden Servicio</th>
                    <th>Estado Orden Servicio</th>
                    <th>Acción</th>
                    <th>Descargar PDF</th>
                  </tr>
                </thead>
         

<tbody>
  {facturas.map((factura) => (
    <tr key={factura.idFactura}>
      <td className="col-1">{factura.idFactura}</td>
      <td>{factura.codigoFactura}</td>
      <td className="text-nowrap">{factura.fecha}</td>
      <td>{factura.estado ? "Activo" : "Inactivo"}</td>
      <td>{factura.ordenServicio.idOrdenServicio}</td>
      <td>{factura.ordenServicio.codigoOrden}</td>
      <td>{factura.ordenServicio.fecha}</td>
      <td>
        {factura.ordenServicio.estado ? "Activo" : "Inactivo"}
      </td>
      <td className="">
        <button
          className="btn btn-primary me-2"
          onClick={() => onEdit(factura)}
        >
          <ion-icon name="create-outline"></ion-icon>
        </button>
        <button
          className="btn btn-danger me-2"
          onClick={() => onDelete(factura)}
        >
          <ion-icon name="trash-outline"></ion-icon>
        </button>
      </td>
      <td>
      <button
          className="btn btn-info"
          onClick={() => handleDownloadPDF(factura)}
        >
          Descargar PDF
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
