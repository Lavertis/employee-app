import React, {useEffect, useState} from 'react';
import { Modal, Button } from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import { deleteEmployees } from '../../../store/employeesSlice.ts';
import {AppDispatch, RootState} from "../../../store";

interface DeleteEmployeeModalProps {
    show: boolean;
    handleClose: () => void;
    onDelete: () => void;
}

const DeleteEmployeeModal: React.FC<DeleteEmployeeModalProps> = ({ show, handleClose, onDelete }) => {
    const { deleteError, deletePending, selectedEmployeeIds } = useSelector((state: RootState) => state.employees);
    const dispatch = useDispatch<AppDispatch>();
    const [ closeRequested, setCloseRequested ] = useState<boolean>(false);

    const handleDelete = async () => {
        dispatch(deleteEmployees(selectedEmployeeIds)).then(() => {
            setCloseRequested(true);
        });
    };

    useEffect(() => {
        if(closeRequested && !deletePending && deleteError === null) {
            onDelete();
            handleClose();
        }
    }, [closeRequested, deletePending, deleteError])

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Employees</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete these Employees?
                {deleteError && <div className="text-danger">{deleteError}</div>}
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