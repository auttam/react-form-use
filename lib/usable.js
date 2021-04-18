import { ACTIONS, createFormData } from './state';

/** Gets input element's value */
const getInputData = (e) => {
  const { value, type, checked } = e.target;
  return type === 'checkbox' || type === 'radio' ? checked : value;
};

/**
 * @typedef {object} Field Represents a form field containing data and related methods
 * @property {string} name - name of the field
 * @property {string|boolean} value - value of the field
 * @property {string|boolean} initialValue - initial value of the field
 * @property {boolean} dirty - flag to indicate that the value has been changed
 * @property {string} error - error message of the field
 * @property {boolean} invalid - flag to indicate that the field has an invalid value
 * @property {Function} setValue - sets the value of the field
 * @property {Function} setError - sets the error of the field
 * @property {Function} handleChange - onChange handler for the `<input />` element
 * @property {Function} validate runs validation on the fields
 */

/**
 * Adds field helpers to the field
 * @param {Object} fieldData
 * @param {Function} dispatch
 * @returns {Field}
 */
const injectHelpers = (
  { name, value, error, dirty, invalid, initialValue },
  dispatch,
) => ({
  name,
  value,
  error,
  dirty,
  invalid,
  initialValue,
  setValue: (newValue) =>
    dispatch({
      action: ACTIONS.SET_FIELD_VALUE,
      fieldName: name,
      data: newValue,
    }),
  setError: (newError) =>
    dispatch({
      action: ACTIONS.SET_FIELD_ERROR,
      fieldName: name,
      data: newError,
    }),
  validate: () =>
    dispatch({
      action: ACTIONS.VALIDATE_FIELD,
      fieldName: name,
    }),
  handleChange: (e) => {
    dispatch({
      action: ACTIONS.SET_FIELD_VALUE,
      fieldName: name,
      data: getInputData(e),
    });
  },
});

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
const createUsable = (state, dispatch, formOptions) => {
  let isDirty = false;
  let isInvalid = false;

  // create field composed of data, helper methods & handlers
  const fields = state.map((field) => {
    isDirty = isDirty || field.dirty;
    isInvalid = isInvalid || field.invalid;
    return injectHelpers(field, dispatch);
  });

  // implementing reset method to reset all fields
  const reset = () => {
    dispatch({
      action: ACTIONS.RESET,
    });
  };

  // implementing method for setting field value
  const setFieldValue = (fieldName, value) => {
    dispatch({
      action: ACTIONS.SET_FIELD_VALUE,
      fieldName,
      data: value,
    });
  };

  // implementing method for setting field error
  const setFieldError = (fieldName, error) => {
    dispatch({ action: ACTIONS.SET_FIELD_ERROR, fieldName, data: error });
  };

  // implement method for validating and calling submit callback of formOptions
  const submit = () => {
    // validate form
    let invalid = false;
    dispatch({
      action: ACTIONS.VALIDATE_ALL,
      callback: (hasError) => {
        invalid = hasError;
      },
    });

    if (invalid || !formOptions || typeof formOptions.submit !== 'function') {
      return;
    }

    // call submit callback with form data
    formOptions.submit(createFormData(state));
  };

  // implementing handler for form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  return {
    fields,
    setFieldValue,
    setFieldError,
    reset,
    isDirty,
    isInvalid,
    submit,
    handleSubmit,
  };
};

export default createUsable;
