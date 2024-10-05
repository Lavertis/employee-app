import React, {useEffect, useState} from 'react';
import axiosInstance from "../../api/axiosInstance.ts";
import {Alert, Button, Container, Spinner} from "react-bootstrap";
import EmployeeRow from "./components/EmployeeRow.tsx";
import DeleteEmployeeModal from "./components/DeleteEmployeeModal.tsx";
import EmployeeFormModal from "./components/employee-form/EmployeeFormModal.tsx";
import {EmployeeListItem} from "../../types/employee.ts";
import {parsePaginationHeader} from "../../utils/pagination-utils.ts";
import InfiniteScroll from "react-infinite-scroll-component";
import {FaPlus} from "react-icons/fa";

interface EmployeeListProps {
    itemsPerPage: number;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ itemsPerPage }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [employees, setEmployees] = useState<EmployeeListItem[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);

    const fetchEmployees = (page: number, pageSize: number) => {
        setIsLoading(true);
        axiosInstance.get(`/employees?page=${page}&pageSize=${pageSize}`)
            .then(response => {
                setEmployees([...employees, ...response.data]);
                const paginationHeader = response.headers['x-pagination'];
                if (paginationHeader) {
                    const paginationData = parsePaginationHeader(paginationHeader);
                    setTotalRecords(paginationData.totalCount);
                }
            })
            .catch(error => {
                setError(error.response.data.error);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchEmployees(1, itemsPerPage);
    }, []);

    const handleDeleteClick = (id: number) => {
        setSelectedEmployeeId(id);
        setShowDeleteModal(true);
    };

    const handleEditClick = (employeeId: number) => {
        setSelectedEmployeeId(employeeId);
        setShowFormModal(true);
    };

    const handleAddClick = () => {
        setShowFormModal(true);
    };

    const handleDelete = () => {
        setEmployees(employees.filter(employee => employee.id !== selectedEmployeeId));
        setSelectedEmployeeId(null);
    };

    const handleSave = () => {
        setSelectedEmployeeId(null);
    };

    const fetchMoreData = () => {
        console.log('fetchMoreData');
        if (employees.length >= totalRecords) return;
        console.log('fetchMoreData2');
        setCurrentPage(prevPage => prevPage + 1);
        fetchEmployees(currentPage + 1, itemsPerPage);
    }

    if (error) {
        return (
            <Alert variant="danger">{error}</Alert>
        );
    }

    if (!employees.length && !isLoading) {
        return (
            <Alert variant="info">No employees found</Alert>
        );
    }

    return (
        <Container>
            <Container className="d-flex justify-content-between mb-3">
                <h1>Employee list</h1>
                <div className="d-flex align-items-center">
                    <Button variant="primary" onClick={handleAddClick} className="d-flex align-items-center">
                        <FaPlus className="me-1"/><span className="text-nowrap">Add Employee</span>
                    </Button>
                </div>
            </Container>
            <InfiniteScroll
                dataLength={employees.length}
                next={fetchMoreData}
                hasMore={true}
                loader={<Spinner animation="border" role="status" />}
                height={'calc(100vh - 300px)'}
                endMessage={<Alert variant="info">No more employees</Alert>}
            >
                {employees.map(employee => (
                    <EmployeeRow
                        key={employee.id}
                        employee={employee}
                        handleEditClick={handleEditClick}
                        handleDeleteClick={handleDeleteClick}
                    />
                ))}
            </InfiniteScroll>
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
