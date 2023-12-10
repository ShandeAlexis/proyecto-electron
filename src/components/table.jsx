export function Table({ data }) {
  // Asumiendo que cada elemento en 'data' es un objeto con propiedades
  const renderTableRows = () => {
    return data.map((item, index) => (
      <tr key={index}>
        <td>{item.email}</td>
        <td>{item.fecha_creacion}</td>
        {/* Agrega más celdas según las propiedades que desees mostrar */}
        <td>
          <button className="btn btn-primary" onClick={() => onEdit(item)}>Editar</button>
        </td>
        <td>
          <button className="btn btn-danger" onClick={() => onDelete(item)}>Eliminar</button>
        </td>
      </tr>
    ));
  };
  return (
    //<table className="table table-dark table-striped table-bordered">
    
<table className="table table-dark table-striped table-bordered ">
      <thead className="thead-dark">
        <tr>
          <th>Email</th>
          <th>Fecha de Creación</th>
          {/* Agrega más encabezados según las propiedades que desees mostrar */}
          <th>Acciones</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>{renderTableRows()}</tbody>
    </table>
  );
}
