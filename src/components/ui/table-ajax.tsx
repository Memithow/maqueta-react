import React, { useState } from "react";

interface Column {
    key: string;
    label: string;
    render?: (item: any) => React.ReactNode;
}

interface DataTableProps {
    data: any[];
    columns: Column[];
    itemsPerPage?: number;
    className?: string;
}

const DataTableAjax = ({
    data,
    columns,
    itemsPerPage = 10,
    className = "",
}: DataTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className={`w-100 mt-4 ${className}`}>
            <div className="table-responsive-sm">
                <table className="table table-sm table-hover rounded mb-0">
                    <thead >
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} scope="col">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="fs-6">
                        {currentData.length > 0 ? (
                            currentData.map((item, idx) => (
                                <tr key={idx}>
                                    {columns.map((col) => (
                                        <td key={col.key}>
                                            {col.render
                                                ? col.render(item)
                                                : item[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center text-muted py-4"
                                >
                                    Ningún dato disponible en esta tabla
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                    onClick={prevPage}
                    className="btn btn-outline-secondary btn-sm"
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>

                <span className="text-muted small">
                    Página {currentPage} de {totalPages}
                </span>

                <button
                    onClick={nextPage}
                    className="btn btn-outline-secondary btn-sm"
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default DataTableAjax;
