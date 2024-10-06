import React, {useEffect, useState} from 'react';
import {Alert, Container} from 'react-bootstrap';
import EmployeeList from "./components/EmployeeList.tsx";
import EmployeeListHeader from "./components/EmployeeListHeader.tsx";
import {fetchEmployees, resetEmployees, setSelectedEmployeeIds} from "../../store/employeesSlice.ts";
import {AppDispatch, RootState} from "../../store";
import {useDispatch, useSelector} from "react-redux";
import DeleteEmployeeModal from "./components/DeleteEmployeeModal.tsx";
import EmployeeFormModal from "./components/employee-form/EmployeeFormModal.tsx";


const Employees: React.FC = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const {
        employees,
        error,
        selectedEmployeeIds,
        isLoaded
    } = useSelector((state: RootState) => state.employees);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        resetEmployees();
        dispatch(fetchEmployees());
    }, [dispatch]);

    const handleAddClick = () => {
        setShowFormModal(true);
    };

    const handleDelete = async () => {
        dispatch(setSelectedEmployeeIds([]));
        dispatch(resetEmployees());
        dispatch(fetchEmployees());
    };

    const handleSave = () => {
        dispatch(setSelectedEmployeeIds([]));
        dispatch(resetEmployees());
        dispatch(fetchEmployees());
    };

    if (error) {
        return (
            <Alert variant="danger">{error}</Alert>
        );
    }
    const shouldShowNoEmployeesAlert = !employees.length && isLoaded;
    return (
        <Container>
            <EmployeeListHeader
                handleAddClick={handleAddClick}
                setShowDeleteModal={setShowDeleteModal}
            />
            {shouldShowNoEmployeesAlert ? <Alert variant="info">No employees found</Alert> :
                <EmployeeList setShowFormModal={setShowFormModal}/>}
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

export default Employees;