import React from 'react';

export function TablaConductor({ data }) {
  // Asumiendo que cada elemento en 'data' es un objeto con propiedades
  const renderTableRows = () => {
    return data.map((item, index) => (
      <tr key={index}>
        <td>{item.idConductor}</td>
        <td>{item.nombres}</td>
        <td>{item.apellidoPaterno}</td>
        <td>{item.apellidoMaterno}</td>
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
    <table className="table table-striped table-bordered">
      <thead className="thead-dark">
        <tr>
          <th>ID Conductor</th>
          <th>Nombres</th>
          <th>Apellido Paterno</th>
          <th>Apellido Materno</th>
          {/* Agrega más encabezados según las propiedades que desees mostrar */}
          <th>Acciones</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>{renderTableRows()}</tbody>
    </table>
  );
}
