import React, {useEffect, useState} from 'react';
import axiosInstance from "../../../api/axiosInstance.ts";
import {Alert, Button, Container, Spinner} from "react-bootstrap";
import EmployeeRow from "./EmployeeRow.tsx";
import DeleteEmployeeModal from "./DeleteEmployeeModal.tsx";
import EmployeeFormModal from "./employee-form/EmployeeFormModal.tsx";
import {EmployeeListItem} from "../../../types/employee.ts";
import {parsePaginationHeader} from "../../../utils/pagination-utils.ts";
import InfiniteScroll from "react-infinite-scroll-component";
import {FaPlus, FaTrash} from "react-icons/fa";

interface EmployeeListProps {
    itemsPerPage: number;
}

const EmployeeList: React.FC<EmployeeListProps> = ({itemsPerPage}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [employees, setEmployees] = useState<EmployeeListItem[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);

    const fetchEmployees = (page: number, pageSize: number): Promise<EmployeeListItem[]> => {
        setIsLoading(true);
        return axiosInstance.get(`/employees?page=${page}&pageSize=${pageSize}`)
            .then(response => {
                const paginationHeader = response.headers['x-pagination'];
                if (paginationHeader) {
                    const paginationData = parsePaginationHeader(paginationHeader);
                    setTotalRecords(paginationData.totalCount);
                }
                return response.data;
            })
            .catch(error => {
                setError(error.response.data.error);
                return [];
            })
            .finally(() => setIsLoading(false));
    };

    const fetchMoreData = async () => {
        if (employees.length >= totalRecords) return;
        const newEmployees = await fetchEmployees(currentPage + 1, itemsPerPage);
        setEmployees(prevEmployees => [...prevEmployees, ...newEmployees]);
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handleDelete = async () => {
        setSelectedEmployeeIds([]);
        setCurrentPage(1);
        await fetchEmployees(1, itemsPerPage).then(fetchedEmployees => {
            setEmployees(fetchedEmployees);
        });
    };

    useEffect(() => {
        fetchEmployees(1, itemsPerPage).then(fetchedEmployees => {
            setEmployees(fetchedEmployees);
        });
    }, []);

    const handleEditClick = (employeeId: number) => {
        setSelectedEmployeeIds([employeeId]);
        setShowFormModal(true);
    };

    const handleAddClick = () => {
        setShowFormModal(true);
    };

    const handleSave = () => {
        setSelectedEmployeeIds([]);
        setCurrentPage(1);
        fetchEmployees(1, itemsPerPage).then(fetchedEmployees => {
            setEmployees(fetchedEmployees);
        });
    };

    const handleCheckboxChange = (id: number, checked: boolean) => {
        setSelectedEmployeeIds(prevIds =>
            checked ? [...prevIds, id] : prevIds.filter(employeeId => employeeId !== id)
        );
    };

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
                    <Button variant="danger" onClick={() => setShowDeleteModal(true)}
                            className="d-flex align-items-center ms-2" disabled={!selectedEmployeeIds.length}>
                        <FaTrash className="me-1"/><span className="text-nowrap">Delete Selected</span>
                    </Button>
                </div>
            </Container>
            <InfiniteScroll
                dataLength={employees.length}
                next={fetchMoreData}
                hasMore={employees.length < totalRecords}
                loader={<Spinner animation="border" role="status"/>}
                height={'calc(100vh - 300px)'}
                endMessage={<Alert variant="info">No more employees</Alert>}
            >
                {employees.map(employee => (
                    <EmployeeRow
                        key={employee.id}
                        employee={employee}
                        handleEditClick={handleEditClick}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                ))}
            </InfiniteScroll>
            <DeleteEmployeeModal
                show={showDeleteModal}
                handleClose={() => setShowDeleteModal(false)}
                employeeIds={selectedEmployeeIds}
                onDelete={handleDelete}
            />
            <EmployeeFormModal
                show={showFormModal}
                handleClose={() => setShowFormModal(false)}
                employeeId={selectedEmployeeIds[0]}
                onSave={handleSave}
            />
        </Container>
    );
};

export default EmployeeList;
