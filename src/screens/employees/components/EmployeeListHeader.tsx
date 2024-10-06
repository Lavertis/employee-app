import React from 'react';
import {Container, Button} from 'react-bootstrap';
import {FaPlus, FaTrash} from 'react-icons/fa';
import {useSelector} from "react-redux";
import {RootState} from "../../../store";

interface EmployeeListHeaderProps {
    handleAddClick: () => void;
    setShowDeleteModal: (show: boolean) => void;
}

const EmployeeListHeader: React.FC<EmployeeListHeaderProps> = ({handleAddClick, setShowDeleteModal}) => {
    const {
        selectedEmployeeIds
    } = useSelector((state: RootState) => state.employees);

    return (
        <Container className="d-flex flex-column flex-md-row justify-content-between mb-3">
            <h1 className="text-center">Employee list</h1>
            <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center mt-2 mt-md-0">
                <Button variant="primary" onClick={handleAddClick}
                        className="d-flex align-items-center mb-2 mb-sm-0 me-sm-2">
                    <FaPlus className="me-1"/><span className="text-nowrap">Add Employee</span>
                </Button>
                {selectedEmployeeIds && <Button
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)}
                    className="d-flex align-items-center"
                    disabled={!selectedEmployeeIds.length}
                >
                    <FaTrash className="me-1"/><span className="text-nowrap">Delete Selected</span>
                </Button>}
            </div>
        </Container>
    );
};

export default EmployeeListHeader;