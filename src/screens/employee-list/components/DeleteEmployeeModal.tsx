// src/DeleteBookModal.tsx
import React, {useEffect, useState} from 'react';
import {Modal, Button} from 'react-bootstrap';
import axiosInstance from "../../../api/axiosInstance.ts";

interface DeleteEmployeeModalProps {
    show: boolean;
    handleClose: () => void;
    employeeId: number | null;
    onDelete: (id: number) => void;
}

const DeleteEmployeeModal: React.FC<DeleteEmployeeModalProps> = ({show, handleClose, employeeId, onDelete}) => {
    const [error, setError] = useState<string>('');

    const handleDelete = async () => {
        if (employeeId !== null) {
            axiosInstance.delete(`/employees/${employeeId}`)
                .then(() => {
                    onDelete(employeeId);
                    handleClose();
                })
                .catch((error) => {
                    setError(error.response.data.error);
                    console.error('Failed to delete the Employee:', error.response.data.error);
                });
        }
    };

    useEffect(() => {
        if (!show) {
            setError('');
        }
    }, [show]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this Employee?
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
