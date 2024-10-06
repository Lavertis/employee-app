import React from 'react';
import {Container, Spinner, Table} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {
    fetchEmployee,
    fetchNextEmployees,
    setSelectedEmployeeIds
} from "../../../store/employeesSlice.ts";
import EmployeeTableRow from "./EmployeeTableRow.tsx";

interface EmployeeListProps {
    setShowFormModal: (show: boolean) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ setShowFormModal }) => {
    const {
        employees,
        totalRecords,
        selectedEmployeeIds
    } = useSelector((state: RootState) => state.employees);
    const dispatch = useDispatch<AppDispatch>();

    const handleEditClick = (employeeId: string) => {
        dispatch(fetchEmployee(employeeId));
        setShowFormModal(true);
    };

    const handleCheckboxChange = (id: string, checked: boolean) => {
        dispatch(setSelectedEmployeeIds(checked ? [...selectedEmployeeIds, id] : selectedEmployeeIds.filter(employeeId => employeeId !== id)));
    };

    return (
        <Container>
            <InfiniteScroll
                dataLength={employees.length}
                next={() => dispatch(fetchNextEmployees())}
                hasMore={!totalRecords || employees.length < totalRecords}
                loader={<Spinner animation="border" role="status"/>}
                height={'80vh'}
                endMessage={<div className="text-center">No more employees</div>}
            >
                <Table striped bordered>
                    <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Sex</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map(employee => (
                        <EmployeeTableRow
                            key={employee.id}
                            employee={employee}
                            handleEditClick={handleEditClick}
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    ))}
                    </tbody>
                </Table>
            </InfiniteScroll>
        </Container>
    );
};

export default EmployeeList;