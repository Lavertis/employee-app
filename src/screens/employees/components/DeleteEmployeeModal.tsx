import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axiosInstance from "../../../api/axiosInstance.ts";
import axios from "axios";

interface DeleteEmployeeModalProps {
    show: boolean;
    handleClose: () => void;
    employeeIds: number[];
    onDelete: () => void;
}

const DeleteEmployeeModal: React.FC<DeleteEmployeeModalProps> = ({ show, handleClose, employeeIds, onDelete }) => {
    const [error, setError] = useState<string>('');

    const handleDelete = async () => {
        try {
            await axiosInstance.post(`/employees/bulk-delete`, { employeeIds });
            onDelete();
            handleClose();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error);
                console.error('Failed to delete the Employees:', error.response.data.error);
            } else {
                setError('An unexpected error occurred');
                console.error('An unexpected error occurred:', error);
            }
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
