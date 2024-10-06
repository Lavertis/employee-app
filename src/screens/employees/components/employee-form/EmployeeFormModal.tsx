// // src/screens/EmployeeFormModal.tsx
// import React, {useEffect, useState} from 'react';
// import {Modal, Button, Form} from 'react-bootstrap';
// import {useFormik} from 'formik';
// import Select from "react-select";
// import {formatErrorsForFormik} from "../../../../utils/error-utils.ts";
// import {SelectOption} from "../../../../types/select.ts";
// import employeeFormValidationSchema from "./employee-form-validation-schema.ts";
// import {sexLabels} from "../../../../constants/enum-labels.ts";
// import {useDispatch, useSelector} from "react-redux";
// import {fetchSexes} from "../../../../store/sexSlice.ts";
// import {fetchEmployee, saveEmployee, updateEmployee} from "../../../../store/employeesSlice.ts";
// import {AppDispatch, RootState} from "../../../../store";
//
// interface FormValues {
//     firstName: string;
//     lastName: string;
//     age: number;
//     sex: SelectOption | null;
// }
//
// const initialValues = {
//     firstName: 'John',
//     lastName: 'Doe',
//     age: 18,
//     sex: null as SelectOption | null,
// }
//
// interface EmployeeFormModalProps {
//     show: boolean;
//     handleClose: () => void;
//     employeeId?: number | null;
//     onSave: () => void;
// }
//
// const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({show, handleClose, employeeId, onSave}) => {
//     const [initialFormValues, setInitialFormValues] = useState<FormValues | null>(null);
//     const dispatch = useDispatch<AppDispatch>();
//     const { sexOptions } = useSelector((state: RootState) => state.sex);
//     const { employee, error } = useSelector((state: RootState) => state.employees);
//
//     useEffect(() => {
//         if (show) {
//             if (employeeId) {
//                 dispatch(fetchEmployee(employeeId));
//             } else {
//                 setInitialFormValues(initialValues);
//             }
//             dispatch(fetchSexes());
//         }
//     }, [show, dispatch, employeeId]);
//
//     useEffect(() => {
//         if (employee) {
//             setInitialFormValues({
//                 firstName: employee.firstName,
//                 lastName: employee.lastName,
//                 age: employee.age,
//                 sex: {value: employee.sex.id, label: sexLabels[employee.sex.name as keyof typeof sexLabels]}
//             });
//         }
//     }, [employee]);
//
//     const handleSubmit = async (values: FormValues) => {
//         try {
//             if (employeeId && initialFormValues) {
//                 const changedFields = getChangedFields(values, initialFormValues);
//                 if (Object.keys(changedFields).length === 0) {
//                     handleClose();
//                     return;
//                 }
//                 await dispatch(updateEmployee({ id: employeeId, ...changedFields, sexId: changedFields.sex?.value }));
//             } else {
//                 await dispatch(saveEmployee({ ...values, sexId: values.sex?.value }));
//             }
//             onSave();
//             handleClose();
//         } catch (error) {
//             formik.setErrors(formatErrorsForFormik(error));
//         }
//     };
//
//     const getChangedFields = (values: FormValues, initialValues: FormValues) => {
//         return Object.entries(values).reduce((acc, [key, value]) => {
//             if (value !== initialValues[key as keyof FormValues]) {
//                 (acc as any)[key as keyof FormValues] = value;
//             }
//             return acc;
//         }, {} as Partial<FormValues>);
//     };
//
//     const formik = useFormik({
//         initialValues: initialFormValues || initialValues,
//         enableReinitialize: true,
//         validationSchema: employeeFormValidationSchema,
//         onSubmit: handleSubmit
//     });
//
//     return (
//         <Modal show={show} onHide={handleClose}>
//             <Modal.Header closeButton>
//                 <Modal.Title>{initialFormValues ? 'Edit Employee' : 'New Employee'}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Form>
//                     <Form.Group controlId="formFirstName">
//                         <Form.Label>First name</Form.Label>
//                         <Form.Control
//                             type="text"
//                             name="firstName"
//                             value={formik.values.firstName}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             isInvalid={!!formik.errors.firstName && formik.touched.firstName}
//                         />
//                         <Form.Control.Feedback type="invalid">
//                             {formik.errors.firstName}
//                         </Form.Control.Feedback>
//                     </Form.Group>
//                     <Form.Group controlId="formLastName">
//                         <Form.Label>Last name</Form.Label>
//                         <Form.Control
//                             type="text"
//                             name="lastName"
//                             value={formik.values.lastName}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             isInvalid={!!formik.errors.lastName && formik.touched.lastName}
//                         />
//                         <Form.Control.Feedback type="invalid">
//                             {formik.errors.lastName}
//                         </Form.Control.Feedback>
//                     </Form.Group>
//                     <Form.Group controlId="formAge">
//                         <Form.Label>Age</Form.Label>
//                         <Form.Control
//                             type="number"
//                             name="age"
//                             value={formik.values.age}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             isInvalid={!!formik.errors.age && formik.touched.age}
//                             min={1}
//                         />
//                         <Form.Control.Feedback type="invalid">
//                             {formik.errors.age}
//                         </Form.Control.Feedback>
//                     </Form.Group>
//                     <Form.Group controlId="formSex">
//                         <Form.Label>Sex</Form.Label>
//                         <Select
//                             name="sex"
//                             options={sexOptions}
//                             value={formik.values.sex}
//                             onChange={(selectedOption) => formik.setFieldValue('sex', selectedOption)}
//                             onBlur={formik.handleBlur}
//                             className={formik.errors.sex && formik.touched.sex ? 'is-invalid' : ''}
//                         />
//                         <Form.Control.Feedback type="invalid">
//                             {formik.errors.sex}
//                         </Form.Control.Feedback>
//                     </Form.Group>
//                 </Form>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="success" type="submit" disabled={formik.isSubmitting} onClick={formik.submitForm}>
//                     Save
//                 </Button>
//                 <Button variant="secondary" onClick={handleClose}>
//                     Cancel
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };
//
// export default EmployeeFormModal;