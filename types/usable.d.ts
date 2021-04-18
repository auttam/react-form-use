export default createUsable;
/**
 * Represents a form field containing data and related methods
 */
export type Field = {
    /**
     * - name of the field
     */
    name: string;
    /**
     * - value of the field
     */
    value: string | boolean;
    /**
     * - initial value of the field
     */
    initialValue: string | boolean;
    /**
     * - flag to indicate that the value has been changed
     */
    dirty: boolean;
    /**
     * - error message of the field
     */
    error: string;
    /**
     * - flag to indicate that the field has an invalid value
     */
    invalid: boolean;
    /**
     * - sets the value of the field
     */
    setValue: Function;
    /**
     * - sets the error of the field
     */
    setError: Function;
    /**
     * - onChange handler for the `<input />` element
     */
    handleChange: Function;
    /**
     * runs validation on the fields
     */
    validate: Function;
};
/**
 * Field State
 */
export type Usable = {
    /**
     * array of the declared fields
     */
    fields: Array<Field>;
    /**
     * sets value of the field setFieldValue(fieldName, value)
     */
    setFieldValue: Function;
    /**
     * sets error of the field setFieldError(fieldName, error)
     */
    setFieldError: Function;
    /**
     * resets all fields to the initial values
     */
    reset: Function;
    /**
     * runs validation on all the fields
     */
    validate: Function;
    /**
     * flag that indicates at least one field is dirty
     */
    isDirty: boolean;
    /**
     * flag that indicates at least one field is invalid
     */
    isInvalid: boolean;
    /**
     * handler for the `onSubmit` event of the `<form />`
     */
    handleSubmit: Function;
};
/**
 * @typedef {object} Usable Field State
 * @property {Array.<Field>} fields array of the declared fields
 * @property {Function} setFieldValue sets value of the field setFieldValue(fieldName, value)
 * @property {Function} setFieldError sets error of the field setFieldError(fieldName, error)
 * @property {Function} reset resets all fields to the initial values
 * @property {Function} validate runs validation on all the fields
 * @property {Boolean} isDirty flag that indicates at least one field is dirty
 * @property {Boolean} isInvalid flag that indicates at least one field is invalid
 * @property {Function} handleSubmit handler for the `onSubmit` event of the `<form />`
 *
 */
/**
 * Create usable object containing fields and helpers function
 * @param {Array.<Object>} state
 * @param {Function} dispatch
 * @param {Object} formOptions
 * @return {Usable}
 */
declare function createUsable(state: Array<any>, dispatch: Function, formOptions: any): Usable;
