import React from 'react';
import {Button, Card, Container, Form} from 'react-bootstrap';
import {FaEdit} from 'react-icons/fa';
import {EmployeeListItem} from "../../../types/employee.ts";
import {sexLabels} from "../../../constants/enum-labels.ts";

interface EmployeeRowProps {
    index: number;
    employee: EmployeeListItem;
    handleEditClick: (id: string) => void;
    handleCheckboxChange: (id: string, checked: boolean) => void;
}

const EmployeeRow: React.FC<EmployeeRowProps> = ({index, employee, handleEditClick, handleCheckboxChange}) => {
    return (
        <Card className={`mb-2 mx-3 ${index % 2 != 0 ? 'bg-light' : ''}`}>
            <Card.Body>
                <Container className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <Card.Title className="mb-1 me-2">{employee.firstName} {employee.lastName}</Card.Title>
                        <Card.Text>
                            {employee.age} years, {sexLabels[employee.sex as keyof typeof sexLabels]}
                        </Card.Text>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                        <Button variant="primary" onClick={() => handleEditClick(employee.id)}>
                            <FaEdit />
                        </Button>
                        <Form.Check
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange(employee.id, e.target.checked)}
                        />
                    </div>
                </Container>
            </Card.Body>
        </Card>
    );
};

export default EmployeeRow;