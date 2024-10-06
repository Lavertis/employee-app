import React, {useEffect, useState} from 'react';
import {Alert, Container} from 'react-bootstrap';
import {EmployeeListItem} from "../../types/employee.ts";
import {parsePaginationHeader} from "../../utils/pagination-utils.ts";
import axiosInstance from "../../api/axiosInstance.ts";
import EmployeeList from "./components/EmployeeList.tsx";
import EmployeeListHeader from "./components/EmployeeListHeader.tsx";


const Employees: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState('');
    const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [totalRecords, setTotalRecords] = useState<number | null>(null);

    const fetchEmployees = (page: number, pageSize: number): Promise<EmployeeListItem[]> => {
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
            });
    };

    useEffect(() => {
        fetchEmployees(1, 5).then(fetchedEmployees => {
            setEmployees(fetchedEmployees);

            setIsLoaded(true);
        });
    }, []);

    const handleAddClick = () => {
        setShowFormModal(true);
    };

    if (error) {
        return (
            <Alert variant="danger">{error}</Alert>
        );
    }
    const shouldShowNoEmployeesAlert = !employees.length && isLoaded;
    console.log({employees, isLoaded, shouldShowNoEmployeesAlert});
    return (
        <Container>
            <EmployeeListHeader
                handleAddClick={handleAddClick}
                setShowDeleteModal={setShowDeleteModal}
                selectedEmployeeIds={selectedEmployeeIds}
            />
            {shouldShowNoEmployeesAlert ? <Alert variant="info">No employees found</Alert> : <EmployeeList
                itemsPerPage={5}
                totalRecords={totalRecords}
                employees={employees}
                setEmployees={setEmployees}
                selectedEmployeeIds={selectedEmployeeIds}
                setSelectedEmployeeIds={setSelectedEmployeeIds}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                showFormModal={showFormModal}
                setShowFormModal={setShowFormModal}
                fetchEmployees={fetchEmployees}
            />}
        </Container>
    );
};

export default Employees;