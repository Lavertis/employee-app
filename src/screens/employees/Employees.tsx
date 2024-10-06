import React, {useCallback, useEffect} from 'react';
import {Alert, Container} from 'react-bootstrap';
import EmployeeList from "./components/EmployeeList.tsx";
import EmployeeListHeader from "./components/EmployeeListHeader.tsx";
import {
    clearEditEmployee,
    fetchEmployees,
    resetEmployees,
    setSelectedEmployeeIds,
    setShowDeleteModal,
    setShowEditModal
} from "../../store/employeesSlice.ts";
import {AppDispatch, RootState} from "../../store";
import {useDispatch, useSelector} from "react-redux";
import DeleteEmployeeModal from "./components/DeleteEmployeeModal.tsx";
import EmployeeFormModal from "./components/employee-form/EmployeeFormModal.tsx";


const Employees: React.FC = () => {
    const {
        employees,
        error,
        isLoaded,
        showDeleteModal,
        showEditModal
    } = useSelector((state: RootState) => state.employees);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        resetEmployees();
        dispatch(fetchEmployees());
    }, [dispatch]);

    const handleShowDeleteModal = useCallback((show: boolean) => {
        dispatch(setShowDeleteModal(show));
    }, [dispatch]);

    const handleShowEditModal = useCallback((show: boolean) => {
        dispatch(setShowEditModal(show));
    }, [dispatch]);

    const handleAddClick = () => {
        dispatch(setShowEditModal(true));
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
                setShowDeleteModal={handleShowDeleteModal}
            />
            {shouldShowNoEmployeesAlert ? <Alert variant="info">No employees found</Alert> :
                <EmployeeList setShowFormModal={handleShowEditModal}/>}
            <DeleteEmployeeModal
                show={showDeleteModal}
                handleClose={() => handleShowDeleteModal(false)}
                onDelete={handleDelete}
            />
            <EmployeeFormModal
                show={showEditModal}
                handleClose={() => {
                    handleShowEditModal(false);
                    dispatch(clearEditEmployee());
                }}
                onSave={handleSave}
            />
        </Container>
    );
};

export default Employees;