interface FormError {
    errors: { [k: string]: string; };
}

interface FormikErorrs {
    [k: string]: string;
}

export const formatErrorsForFormik = (formError: FormError) => {
    const formikErrors: FormikErorrs = {};
    for (const [fieldName, values] of Object.entries(formError.errors)) {
        const newFieldName = fieldName.replace('.Value', '');
        const fieldNameLowerCased = newFieldName.charAt(0).toLowerCase() + newFieldName.slice(1);
        formikErrors[fieldNameLowerCased] = values[0];
    }
    return formikErrors;
}