import React, {useEffect, useState} from 'react';
import axiosInstance from "../../api/axiosInstance.ts";
import {Alert, Container, Spinner, Table} from "react-bootstrap";
import SearchAddComponent from "../../components/SearchAddComponent.tsx";
import EmployeeRow from "./components/EmployeeRow.tsx";
import PaginationComponent from "../../components/PaginationComponent.tsx";
import DeleteEmployeeModal from "./components/DeleteEmployeeModal.tsx";
import EmployeeFormModal from "./components/employee-form/EmployeeFormModal.tsx";
import {EmployeeListItem} from "../../types/employee.ts";
import {parsePaginationHeader} from "../../utils/pagination-utils.ts";

interface EmployeeListProps {
    itemsPerPage: number;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ itemsPerPage }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [employees, setEmployees] = useState<EmployeeListItem[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [fullNameSearch, setFullNameSearch] = useState('');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);

    const fetchEmployees = (page: number, pageSize: number, fullName: string) => {
        setLoading(true);
        axiosInstance.get(`/employees?page=${page}&pageSize=${pageSize}&fullName=${fullName}`)
            .then(response => {
                setEmployees(response.data);
                const paginationHeader = response.headers['x-pagination'];
                if (paginationHeader) {
                    const paginationData = parsePaginationHeader(paginationHeader);
                    console.log('paginationData:', paginationData);
                    setTotalRecords(paginationData.totalCount);
                }
                setLoading(false);
            })
            .catch(error => {
                setError(error.response.data.error);
                setLoading(false);
            });
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchEmployees(1, itemsPerPage, fullNameSearch);
    }, [fullNameSearch, itemsPerPage]);

    useEffect(() => {
        fetchEmployees(currentPage, itemsPerPage, fullNameSearch);
    }, [currentPage]);

    const handleDeleteClick = (id: number) => {
        setSelectedEmployeeId(id);
        setShowDeleteModal(true);
    };

    const handleEditClick = (employeeId: number) => {
        setSelectedEmployeeId(employeeId);
        setShowFormModal(true);
    };

    const handleAddClick = () => {
        setSelectedEmployeeId(null);
        setShowFormModal(true);
    };

    const handleDelete = () => {
        setCurrentPage(1);
        fetchEmployees(1, itemsPerPage, fullNameSearch);
    };

    const handleSave = () => {
        setSelectedEmployeeId(null);
        fetchEmployees(currentPage, itemsPerPage, fullNameSearch);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return (
            <Container className="d-flex flex-column align-items-center text-center">
                <Spinner animation="border" role="status"/>
                <span className="mt-2">Loading...</span>
            </Container>
        );
    }

    if (error) {
        return (
            <Alert variant="danger">{error}</Alert>
        );
    }

    return (
        <Container>
            <SearchAddComponent
                fullNameSearch={fullNameSearch}
                setFullNameSearch={setFullNameSearch}
                handleAddClick={handleAddClick}
            />
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Age</th>
                    <th>Sex</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {employees.map(employee => (
                    <EmployeeRow
                        key={employee.id}
                        employee={employee}
                        handleEditClick={handleEditClick}
                        handleDeleteClick={handleDeleteClick}
                    />
                ))}
                </tbody>
            </Table>
            <PaginationComponent
                currentPage={currentPage}
                totalRecords={totalRecords}
                itemsPerPage={itemsPerPage}
                handlePageChange={handlePageChange}
            />
            <DeleteEmployeeModal
                show={showDeleteModal}
                handleClose={() => setShowDeleteModal(false)}
                employeeId={selectedEmployeeId}
                onDelete={handleDelete}
            />
            <EmployeeFormModal
                show={showFormModal}
                handleClose={() => setShowFormModal(false)}
                employeeId={selectedEmployeeId}
                onSave={handleSave}
            />
        </Container>
    );
};

export default EmployeeList;
