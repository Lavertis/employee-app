import {useEffect, useState} from 'react';
import {Table, Container, Spinner, Alert, Button, Pagination, FormControl} from 'react-bootstrap';
import axiosInstance from "../../api/axiosInstance.ts";
import DeleteEmployeeModal from "./components/DeleteEmployeeModal.tsx";
import {FaEdit, FaPlus, FaTrash} from "react-icons/fa";
import EmployeeFormModal from "./components/employee-form/EmployeeFormModal.tsx";
import {EmployeeListItem} from "../../types/employee.ts";

interface EmployeeListProps {
    itemsPerPage: number;
}

const EmployeeList = ({itemsPerPage}: EmployeeListProps) => {
    const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [fullNameSearch, setFullNameSearch] = useState("");

    const fetchEmployee = async (page: number, pageSize: number, fullNameSearch: string) => {
        axiosInstance.get(`/employees?page=${page}&pageSize=${pageSize}&fullName=${fullNameSearch}`)
            .then(response => {
                setEmployees(response.data);
                setTotalRecords(response.data.totalRecords);
                setLoading(false);
            })
            .catch(error => {
                    setError(error.error);
                    setLoading(false);
                }
            );
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchEmployee(1, itemsPerPage, fullNameSearch);
    }, [fullNameSearch, itemsPerPage]);

    useEffect(() => {
        fetchEmployee(currentPage, itemsPerPage, fullNameSearch);
    }, [currentPage, itemsPerPage]);

    const handleDeleteClick = (id: number) => {
        setSelectedEmployeeId(id);
        setShowDeleteModal(true);
    };

    const handleEditClick = (employeeId: number) => {
        setEditingEmployeeId(employeeId);
        setShowFormModal(true);
    };

    const handleAddClick = () => {
        setEditingEmployeeId(null);
        setShowFormModal(true);
    };

    const handleDelete = () => {
        setCurrentPage(1);
        fetchEmployee(1, itemsPerPage, fullNameSearch);
    };

    const handleSave = () => {
        setEditingEmployeeId(null);
        fetchEmployee(currentPage, itemsPerPage, fullNameSearch);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalRecords / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const renderPaginationItems = () => {
        const totalPages = Math.ceil(totalRecords / itemsPerPage);
        const items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
                    {number}
                </Pagination.Item>
            );
        }
        return items;
    };

    if (loading) {
        return (
            <Container className="text-center">
                <div className="d-flex flex-column align-items-center">
                    <Spinner animation="border" role="status" />
                    <span className="mt-2">Loading...</span>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert variant="danger">
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Container className="d-flex justify-content-between">
                <h1>Employee list</h1>
                <div className="d-flex align-items-center gap-2">
                    <FormControl
                        type="text"
                        placeholder="Search by full name"
                        value={fullNameSearch}
                        onChange={(e) => setFullNameSearch(e.target.value)}
                        className=""
                    />
                    <Button variant="primary" onClick={handleAddClick} className="d-flex align-items-center">
                        <FaPlus className="me-1"/><span className="text-nowrap">Add Employee</span>
                    </Button>
                </div>
            </Container>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Age</th>
                    <th>Sex</th>
                </tr>
                </thead>
                <tbody>
                {employees.map(employee => (
                    <tr key={employee.id}>
                        <td>{employee.firstName}</td>
                        <td>{employee.lastName}</td>
                        <td>{employee.age}</td>
                        <td>{employee.sex}</td>
                        <td>
                            <Container className="d-flex gap-1 justify-content-center">
                                <Button variant="primary" onClick={() => handleEditClick(employee.id)}>
                                    <FaEdit className="mb-1"/>
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteClick(employee.id)}>
                                    <FaTrash className="mb-1"/>
                                </Button>
                            </Container>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <Pagination className="justify-content-center">
                <Pagination.Prev onClick={handlePrevPage} disabled={currentPage === 1} />
                {renderPaginationItems()}
                <Pagination.Next onClick={handleNextPage} disabled={currentPage === Math.ceil(totalRecords / itemsPerPage) || totalRecords === 0} />
            </Pagination>
            <DeleteEmployeeModal
                show={showDeleteModal}
                handleClose={() => setShowDeleteModal(false)}
                employeeId={selectedEmployeeId}
                onDelete={handleDelete}
            />
            <EmployeeFormModal
                show={showFormModal}
                handleClose={() => setShowFormModal(false)}
                employeeId={editingEmployeeId}
                onSave={handleSave}
            />
        </Container>
    );
};

export default EmployeeList;
