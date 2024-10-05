import React from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

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

const EmployeeRow: React.FC<EmployeeRowProps> = ({ employee, handleEditClick, handleDeleteClick }) => {
    return (
        <Card className="mb-3">
            <Card.Body>
                <Container className="d-flex justify-content-between align-items-start">
                    <div>
                        <Card.Title>{employee.firstName} {employee.lastName}</Card.Title>
                        <Card.Text>
                            Age: {employee.age} years<br />
                            Sex: {employee.sex}
                        </Card.Text>
                    </div>
                    <div className="d-flex gap-1">
                        <Button variant="primary" onClick={() => handleEditClick(employee.id)}>
                            <FaEdit className="mb-1" />
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteClick(employee.id)}>
                            <FaTrash className="mb-1" />
                        </Button>
                    </div>
                </Container>
            </Card.Body>
        </Card>
    );
};

export default EmployeeRow;