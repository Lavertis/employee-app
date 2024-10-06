import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import { deleteEmployees } from '../../../store/employeesSlice.ts';
import {AppDispatch, RootState} from "../../../store";

interface DeleteEmployeeModalProps {
    show: boolean;
    handleClose: () => void;
    employeeIds: number[];
    onDelete: () => void;
}

const DeleteEmployeeModal: React.FC<DeleteEmployeeModalProps> = ({ show, handleClose, employeeIds, onDelete }) => {
    const { error } = useSelector((state: RootState) => state.employees);
    const dispatch = useDispatch<AppDispatch>();

    const handleDelete = async () => {
        const resultAction = await dispatch(deleteEmployees(employeeIds));
        if (deleteEmployees.fulfilled.match(resultAction)) {
            onDelete();
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Employees</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete these Employees?
                {error && <div className="text-danger">{error}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteEmployeeModal;