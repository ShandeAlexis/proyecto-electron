import React from "react";

const Paginator = ({ currentPage, totalPages, onPrevPage, onNextPage }) => {
  return (
    <div className="pagination-container">
      <div style={{ marginTop: "10px" }} className="pagination justify-content-center">
        <button style={{ color: "var(--letra)" }}
          className="btn btn-outline-info"
          onClick={onPrevPage}
          disabled={currentPage === 0}
        >
          Anterior
        </button>
        <span  style={{ color: "var(--letra)" }} className="mx-3">{`Página ${currentPage + 1} de ${totalPages}`}</span>
        <button
        style={{ color: "var(--letra)" }}
          className="btn btn-outline-info"
          onClick={onNextPage}
          disabled={currentPage === totalPages - 1}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Paginator;
