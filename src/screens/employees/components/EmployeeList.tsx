import React, {useEffect, useState} from 'react';
import {Alert, Container, Spinner} from "react-bootstrap";
import EmployeeRow from "./EmployeeRow.tsx";
import DeleteEmployeeModal from "./DeleteEmployeeModal.tsx";
import EmployeeFormModal from "./employee-form/EmployeeFormModal.tsx";
import {EmployeeListItem} from "../../../types/employee.ts";
import InfiniteScroll from "react-infinite-scroll-component";

interface EmployeeListProps {
    itemsPerPage: number;
    totalRecords: number | null;
    employees: EmployeeListItem[];
    setEmployees: React.Dispatch<React.SetStateAction<EmployeeListItem[]>>;
    selectedEmployeeIds: number[];
    setSelectedEmployeeIds: React.Dispatch<React.SetStateAction<number[]>>;
    showDeleteModal: boolean;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    showFormModal: boolean;
    setShowFormModal: React.Dispatch<React.SetStateAction<boolean>>;
    fetchEmployees: (page: number, pageSize: number) => Promise<EmployeeListItem[]>;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
                                                       itemsPerPage,
                                                       totalRecords,
                                                       employees,
                                                       setEmployees,
                                                       selectedEmployeeIds,
                                                       setSelectedEmployeeIds,
                                                       showDeleteModal,
                                                       setShowDeleteModal,
                                                       showFormModal,
                                                       setShowFormModal,
                                                       fetchEmployees
                                                   }) => {

    const [currentPage, setCurrentPage] = useState(1);

    const fetchMoreData = async () => {
        if (totalRecords && employees.length >= totalRecords) return;
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

    return (
        <Container>
            <InfiniteScroll
                dataLength={employees.length}
                next={fetchMoreData}
                hasMore={!totalRecords || employees.length < totalRecords}
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