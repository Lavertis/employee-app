import React from 'react';
import {Container, Button} from 'react-bootstrap';
import {FaPlus, FaTrash} from 'react-icons/fa';

interface EmployeeListHeaderProps {
    handleAddClick: () => void;
    setShowDeleteModal: (show: boolean) => void;
    selectedEmployeeIds: number[];
}

const EmployeeListHeader: React.FC<EmployeeListHeaderProps> = ({handleAddClick, setShowDeleteModal, selectedEmployeeIds}) => {
    return (
        <Container className="d-flex justify-content-between mb-3">
            <h1>Employee list</h1>
            <div className="d-flex align-items-center">
                <Button variant="primary" onClick={handleAddClick} className="d-flex align-items-center">
                    <FaPlus className="me-1"/><span className="text-nowrap">Add Employee</span>
                </Button>
                {selectedEmployeeIds && <Button variant="danger" onClick={() => setShowDeleteModal(true)}
                         className="d-flex align-items-center ms-2" disabled={!selectedEmployeeIds.length}>
                    <FaTrash className="me-1"/><span className="text-nowrap">Delete Selected</span>
                </Button>}
            </div>
        </Container>
    );
};

export default EmployeeListHeader;