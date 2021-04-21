import { createFromOptions, reset, copyProps } from './field';

/** Find field by field name */
const find = (state, name) => {
  const field = state.find((item) => item.name === name);
  if (!field) {
    throw new Error(`No field found with the name: '${name}'`);
  }
  return field;
};

/**
 * Executes validate method of the field
 * @param {Object} field
 * @param {Array} state
 * @returns {String} validation error
 */
const getError = ({ value, validate }, state) => {
  if (!validate) return '';
  let fieldError = '';

  const valid = validate({
    value,
    setError: (error) => {
      fieldError = error !== undefined ? error : '';
    },
    getField: (name) => copyProps(find(state, name)),
  });

  // return custom error if set explicitly otherwise default error
  // if validate callback function doesn't return true
  return fieldError || (valid !== true ? 'Invalid value' : '');
};

/**
 * Reducer actions
 */
export const ACTIONS = Object.freeze({
  RESET: 1,
  SET_FIELD_VALUE: 2,
  SET_FIELD_ERROR: 3,
  VALIDATE_FIELD: 4,
  VALIDATE_ALL: 5,
});

/**
 * @callback SetFieldErrorCallback
 * @param {string} error field error
 * @returns {void}
 */

/**
 * @callback GetFieldCallback
 * @param {string} fieldName name of the field
 * @returns {import("./field").FieldData}
 */

/**
 * @typedef {object} ValidateParamObject Represents object supplied to validate callback
 * @property {string|boolean} value - value of the field
 * @property {SetFieldErrorCallback} setError callback to set field error
 * @property {GetFieldCallback} getField callback to get related field data
 */

/**
 * @callback ValidateCallback
 * @param {ValidateParamObject} validateParamObject field value
 * @returns {Boolean} return true to mark field as valid
 */

/**
 * @callback TransformCallback
 * @param {string} newValue new value
 * @param {string} prev previous value
 * @returns {string} transformed value
 */

/**
 * @typedef {object} Options collection of field options
 * @property {string} name - name of the field
 * @property {string|boolean} value - value of the field
 * @property {TransformCallback} transform - callback to transform the value
 * @property {ValidateCallback} validate - callback to validate the value
 */

/**
 * Initialize field from a list of field options
 * @param {Array.<Options>} fieldOptions list of field options
 */
export const initialize = (fieldOptions) =>
  fieldOptions.map((options, index) => {
    if (!options.name) {
      throw new TypeError(`name missing for the field at index ${index}`);
    }
    return createFromOptions(options);
  });

/**
 * Reducer callback for useReducer hook
 * @param {Array} state
 * @param {Object} actionDetail
 * @param {String} actionDetail.action name of the action
 * @param {String} actionDetail.fieldName name of the field where action is being applied
 * @param {Object} actionDetail.data data with key/value pair to be updated on the field
 * @param {Object} actionDetail.callback fn when action needs to send back data to the caller
 */
export const reducer = (state, { action, fieldName, data, callback }) => {
  if (!action) return state;

  // preform reset
  if (action === ACTIONS.RESET) {
    return state.map((field) => reset(field));
  }

  // validate all fields
  if (action === ACTIONS.VALIDATE_ALL) {
    let hasError = false;
    const validatedCopy = state.map((field) => {
      const error = getError(field, state);
      hasError = hasError || error;
      return { ...field, error, invalid: !!error };
    });

    // if error found, return new state
    // else return existing to prevent re-render
    if (hasError) {
      callback(true);
      return validatedCopy;
    }
    callback(false);
    return state;
  }

  // field name is require for rest of the actions
  if (!fieldName) {
    return state;
  }

  // one of the following is required to create the new state
  if (typeof data === 'undefined' && action !== ACTIONS.VALIDATE_FIELD) {
    return state;
  }

  // clone state and find field to modify
  const newState = state.map((item) => ({ ...item }));
  const field = find(newState, fieldName);

  // perform set value
  if (action === ACTIONS.SET_FIELD_VALUE) {
    // change the value by running the transform method
    if (field.transform) {
      field.value = field.transform(data, field.value);
    } else {
      // change value as-is
      field.value = data;
    }

    // determine if field has been changed
    field.dirty = field.initialValue !== field.value;
  }

  // perform set error
  if (action === ACTIONS.SET_FIELD_ERROR) {
    field.error = data;
    field.invalid = !!field.error;
  }

  // perform field validation
  if (action === ACTIONS.SET_FIELD_VALUE || action === ACTIONS.VALIDATE_FIELD) {
    field.error = getError(field, state);
    field.invalid = !!field.error;
  }

  return newState;
};

/**
 * @callback FormDataGetValueCallback returns value of a field
 * @returns {String|Boolean}
 */

/**
 * @callback FormDataGetFieldsCallback returns data serialized into json
 * @returns {Array.<{name:String, value:String}}
 */

/**
 * @callback FormDataGetObjectCallback returns data as a plain object
 * @returns {Object}
 */

/**
 * @typedef {object} FormData - represents a collection fields with value
 * @property {FormDataGetValueCallback} getValue - returns value of a field
 * @property {FormDataGetJsonCallback} getFields - returns data serialized into json
 * @property {FormDataGetObjectCallback} getObject - returns data as a plain object
 */

/**
 * @callback SubmitCallback
 * @param {FormData} formData
 * @returns {void}
 */

/**
 * @typedef {object} FormOptions - represents a collection fields with value
 * @property {SubmitCallback} submit a function called on the form submit
 */

/**
 * Creates form data from state
 * @param {Array} state
 * @returns {FormData}
 */
export const createFormData = (state) => ({
  getValue: (name) => find(state, name).value,
  getObject: () =>
    state.reduce((prev, { name, value }) => {
      const upd = prev;
      upd[name] = value;
      return upd;
    }, {}),
  getFields: () => state.map(({ name, value }) => ({ name, value })),
});
