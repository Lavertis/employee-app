import React from 'react';
import {Pagination} from 'react-bootstrap';

interface PaginationComponentProps {
    currentPage: number;
    totalRecords: number;
    itemsPerPage: number;
    handlePageChange: (pageNumber: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
                                                                     currentPage,
                                                                     totalRecords,
                                                                     itemsPerPage,
                                                                     handlePageChange
                                                                 }) => {
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    return (
        <Pagination className="justify-content-center">
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}/>
            {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                </Pagination.Item>
            ))}
            <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalRecords === 0}
            />
        </Pagination>
    );
};

export default PaginationComponent;
