// src/screens/EmployeeFormModal.tsx
import React, {useEffect, useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {useFormik} from 'formik';
import Select from "react-select";
import {formatErrorsForFormik} from "../../../../utils/error-utils.ts";
import {SelectOption} from "../../../../types/select.ts";
import employeeFormValidationSchema from "./employee-form-validation-schema.ts";
import {sexLabels} from "../../../../constants/enum-labels.ts";
import {useDispatch, useSelector} from "react-redux";
import {fetchSexes} from "../../../../store/sexSlice.ts";
import {updateEmployee} from "../../../../store/employeesSlice.ts";
import {AppDispatch, RootState} from "../../../../store";
import deepEqual from 'deep-equal';

const initialValues = {
    firstName: 'John',
    lastName: 'Doe',
    age: 18,
    sex: null as SelectOption | null,
}

interface EmployeeFormModalProps {
    show: boolean;
    handleClose: () => void;
    onSave: () => void;
}


export interface EmployeeFormValues {
    firstName: string;
    lastName: string;
    age: number;
    sex: SelectOption | null;
}

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({show, handleClose, onSave}) => {
    const [initialFormValues, setInitialFormValues] = useState<EmployeeFormValues | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { sexOptions } = useSelector((state: RootState) => state.sex);
    const { editEmployee, editError, editPending } = useSelector((state: RootState) => state.employees);
    const [ formSubmitted, setFormSubmitted ] = useState<boolean>(false);

    useEffect(() => {
        if (show) {
            if (editEmployee) {
                setInitialFormValues({
                    firstName: editEmployee.firstName,
                    lastName: editEmployee.lastName,
                    age: editEmployee.age,
                    sex: {value: editEmployee.sex.id, label: sexLabels[editEmployee.sex.name as keyof typeof sexLabels]}
                });
            } else {
                setInitialFormValues(initialValues);
            }
            dispatch(fetchSexes());
        }
    }, [show, dispatch, editEmployee]);

    const handleSubmit = async (values: EmployeeFormValues) => {
        if (editEmployee?.id && initialFormValues) {
            const changedFields = getChangedFields(values, initialFormValues);
            if (Object.keys(changedFields).length === 0) {
                handleClose();
                return;
            }
            const sexId = changedFields.sex?.value;
            delete changedFields['sex'];
            dispatch(updateEmployee({ ...changedFields, sexId })).then(() => {
                setFormSubmitted(true);
            });
        } else {
            const sexId = values.sex?.value;
            const newFields: Partial<EmployeeFormValues> = Object.assign({}, values);
            delete newFields['sex'];
            dispatch(updateEmployee({ ...newFields, sexId })).then(() => {
                setFormSubmitted(true);
            });
        }
    };

    const getChangedFields = (values: EmployeeFormValues, initialValues: EmployeeFormValues) => {
        return Object.entries(values).reduce((acc, [key, value]) => {
            if (!deepEqual(value, initialValues[key as keyof EmployeeFormValues])) {
                (acc as any)[key as keyof EmployeeFormValues] = value;
            }
            return acc;
        }, {} as Partial<EmployeeFormValues>);
    };

    const formik = useFormik({
        initialValues: initialFormValues || initialValues,
        enableReinitialize: true,
        validationSchema: employeeFormValidationSchema,
        onSubmit: handleSubmit
    });

    useEffect(() => {
        if(editError !== null && typeof editError !== 'string') {
            formik.setErrors(formatErrorsForFormik(editError));
        }
    }, [formik, editError])

    useEffect(() => {
        if(formSubmitted && !editPending && editError === null) {
            onSave();
            handleClose();
        }
    }, [formSubmitted, editPending, editError])

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{editEmployee ? 'Edit Employee' : 'New Employee'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formFirstName">
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstName"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!formik.errors.firstName && formik.touched.firstName}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.firstName}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formLastName">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!formik.errors.lastName && formik.touched.lastName}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.lastName}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formAge">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                            type="number"
                            name="age"
                            value={formik.values.age}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!formik.errors.age && formik.touched.age}
                            min={18}
                            max={100}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.age}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formSex">
                        <Form.Label>Sex</Form.Label>
                        <Select
                            name="sex"
                            options={sexOptions}
                            value={formik.values.sex}
                            onChange={(selectedOption) => formik.setFieldValue('sex', selectedOption)}
                            onBlur={formik.handleBlur}
                            className={formik.errors.sex && formik.touched.sex ? 'is-invalid' : ''}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.sex}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" type="submit" disabled={formik.isSubmitting} onClick={formik.submitForm}>
                    Save
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EmployeeFormModal;