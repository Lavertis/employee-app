import React from 'react';
import {Button, Form} from 'react-bootstrap';
import {FaEdit} from 'react-icons/fa';
import {EmployeeListItem} from "../../../types/employee.ts";
import {sexLabels} from "../../../constants/enum-labels.ts";

interface EmployeeTableRowProps {
    employee: EmployeeListItem;
    handleEditClick: (id: string) => void;
    handleCheckboxChange: (id: string, checked: boolean) => void;
}

const EmployeeTableRow: React.FC<EmployeeTableRowProps> = ({employee, handleEditClick, handleCheckboxChange}) => {
    return (
        <tr>
            <td className="text-center align-middle">
                <Form.Check
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange(employee.id, e.target.checked)}
                />
            </td>
            <td className="align-middle">{employee.firstName} {employee.lastName}</td>
            <td className="align-middle">{employee.age} years</td>
            <td className="align-middle">{sexLabels[employee.sex as keyof typeof sexLabels]}</td>
            <td className="align-middle text-center">
                <Button variant="primary" onClick={() => handleEditClick(employee.id)}>
                    <FaEdit/>
                </Button>
            </td>
        </tr>
    );
};

export default EmployeeTableRow;