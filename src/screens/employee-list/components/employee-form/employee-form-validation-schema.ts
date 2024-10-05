import * as Yup from "yup";

const employeeFormValidationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required').min(1, 'First Name must be at least 1 character').max(255, 'First Name must be at most 255 characters'),
    lastName: Yup.string().required('Last Name is required').min(1, 'Last Name must be at least 1 character').max(255, 'Last Name must be at most 255 characters'),
    age: Yup.number().required('Age is required').min(18, 'Age must be at least 8').max(100, 'Age must be at most 100'),
    sex: Yup.object().shape({
        value: Yup.string().required(),
        label: Yup.string().required()
    }).required('Sex is required'),
});

export default employeeFormValidationSchema;
