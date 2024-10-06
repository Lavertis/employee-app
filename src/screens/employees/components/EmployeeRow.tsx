import React from 'react';
import {Button, Card, Container, Form} from 'react-bootstrap';
import {FaEdit} from 'react-icons/fa';
import {EmployeeListItem} from "../../../types/employee.ts";
import {sexLabels} from "../../../constants/enum-labels.ts";

interface EmployeeRowProps {
    employee: EmployeeListItem;
    handleEditClick: (id: string) => void;
    handleCheckboxChange: (id: string, checked: boolean) => void;
}

const EmployeeRow: React.FC<EmployeeRowProps> = ({employee, handleEditClick, handleCheckboxChange}) => {
    return (
        <Card className="mb-3">
            <Card.Body>
                <Container className="d-flex justify-content-between align-items-start">
                    <div>
                        <Card.Title>{employee.firstName} {employee.lastName}</Card.Title>
                        <Card.Text>
                            Age: {employee.age} years<br/>
                            Sex: {sexLabels[
                            employee.sex as keyof typeof sexLabels
                            ]}
                        </Card.Text>
                    </div>
                    <div className="d-flex gap-1 flex-column">
                        <Button variant="primary" onClick={() => handleEditClick(employee.id)}>
                            <FaEdit className="mb-1"/>
                        </Button>
                        <Form.Check
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange(employee.id, e.target.checked)}
                            className="mx-auto"
                        />
                    </div>
                </Container>
            </Card.Body>
        </Card>
    );
};

export default EmployeeRow;