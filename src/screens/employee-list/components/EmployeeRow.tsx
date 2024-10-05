import React from 'react';
import {Button, Container} from 'react-bootstrap';
import {FaEdit, FaTrash} from 'react-icons/fa';

interface EmployeeRowProps {
    employee: {
        id: number;
        firstName: string;
        lastName: string;
        age: number;
        sex: string;
    };
    handleEditClick: (id: number) => void;
    handleDeleteClick: (id: number) => void;
}

const EmployeeRow: React.FC<EmployeeRowProps> = ({employee, handleEditClick, handleDeleteClick}) => {
    return (
        <tr>
            <td>{employee.firstName}</td>
            <td>{employee.lastName}</td>
            <td>{employee.age}</td>
            <td>{employee.sex}</td>
            <td>
                <Container className="d-flex gap-1 justify-content-center">
                    <Button variant="primary" onClick={() => handleEditClick(employee.id)}>
                        <FaEdit className="mb-1"/>
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteClick(employee.id)}>
                        <FaTrash className="mb-1"/>
                    </Button>
                </Container>
            </td>
        </tr>
    );
};

export default EmployeeRow;
