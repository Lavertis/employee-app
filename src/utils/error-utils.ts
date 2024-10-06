import {FormError, FormikErrors} from "../types/errors.ts";


export const formatErrorsForFormik = (formError: FormError) => {
    const formikErrors: FormikErrors = {};
    for (const [fieldName, values] of Object.entries(formError.errors)) {
        const newFieldName = fieldName.replace('.Value', '');
        const fieldNameLowerCased = newFieldName.charAt(0).toLowerCase() + newFieldName.slice(1);
        formikErrors[fieldNameLowerCased] = values[0];
    }
    return formikErrors;
}