// src/screens/EmployeeFormModal.tsx
import React, {useEffect, useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {useFormik} from 'formik';
import axiosInstance from '../../../../api/axiosInstance.ts';
import Select from "react-select";
import {Sex} from "../../../../types/employee.ts";
import {formatErrorsForFormik} from "../../../../utils/error-utils.ts";
import {SelectOption} from "../../../../types/select.ts";
import bookFormValidationSchema from "./employee-form-validation-schema.ts";

interface FormValues {
    firstName: string;
    lastName: string;
    age: number;
    sex: SelectOption;
}

const initialValues = {
    firstName: 'John',
    lastName: 'Doe',
    age: 18,
    sex: null as SelectOption | null,
}

interface EmployeeFormModalProps {
    show: boolean;
    handleClose: () => void;
    employeeId?: number | null;
    onSave: () => void;
}


const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({show, handleClose, employeeId, onSave}) => {
    const [sexSelectOptions, setSexSelectOptions] = useState<SelectOption[]>([]);
    const [initialFormValues, setInitialFormValues] = useState<FormValues | null>(null);

    const fetchSexes = async () => {
        try {
            const sexes = await axiosInstance.get('/sexes');
            setSexSelectOptions(sexes.data.map((sex: Sex) => ({value: sex.id, label: sex.name})));
        } catch (error) {
            console.error('Failed to fetch sexes:', error);
        }
    };

    const fetchEmployee = async (id: number) => {
        axiosInstance.get(`/books/${id}`)
            .then(response => {
                const employee = response.data;
                setInitialFormValues({
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    age: employee.age,
                    sex: {value: employee.sex.id, label: employee.sex.name}
                });
            })
            .catch(error => {
                console.error('Failed to fetch employee-list:', error);
            });
    }

    const loadForm = async () => {
        await fetchSexes();
        if (employeeId) {
            fetchEmployee(employeeId);
        } else {
            setInitialFormValues(null);
            formik.resetForm();
        }
    }

    useEffect(() => {
        if (show) {
            loadForm();
        }
    }, [show]);

    useEffect(() => {
        if (initialFormValues) {
            formik.setValues({
                firstName: initialFormValues.firstName,
                lastName: initialFormValues.lastName,
                age: initialFormValues.age,
                sex: initialFormValues.sex,
            });
        }
    }, [initialFormValues]);

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: bookFormValidationSchema,
        onSubmit: async (values) => {
            if (employeeId && initialFormValues) {
                const changedFields: Partial<FormValues> = Object.entries(values).reduce((acc, [key, value]) => {
                    if (value !== initialFormValues[key as keyof FormValues]) {
                        (acc as any)[key as keyof FormValues] = value;
                    }
                    return acc;
                }, {} as Partial<FormValues>);
                console.log('changedFields', changedFields);
                if (Object.keys(changedFields).length === 0) {
                    handleClose();
                    return;
                }

                axiosInstance.patch(`/employees/${employeeId}`, {
                    firstName: changedFields.firstName,
                    lastName: changedFields.lastName,
                    age: changedFields.age,
                    sexId: changedFields.sex?.value
                }).then(() => {
                    onSave();
                    handleClose();
                }).catch(error => {
                    formik.setErrors(formatErrorsForFormik(error.response.data));
                    console.error('Failed to save the book-list:', error);
                });
            } else {
                axiosInstance.post('/employees', {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    age: values.age,
                    sexId: values.sex?.value
                }).then(() => {
                    onSave();
                    handleClose();
                }).catch(error => {
                    formik.setErrors(formatErrorsForFormik(error.response.data));
                    console.error('Failed to save the book-list:', error);
                })
            }
        }
    });

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{initialFormValues ? 'Edit Employee' : 'New Employee'}</Modal.Title>
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
                            min={1}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.age}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formSex">
                        <Form.Label>Sex</Form.Label>
                        <Select
                            name="sex"
                            options={sexSelectOptions}
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