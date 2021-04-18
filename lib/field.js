const FIELD = Object.freeze({
  value: '',
  dirty: false,
  error: '',
  invalid: false,
  initialValue: '',
});

/**
 * Creates a new field from options
 * @param {Object} options
 */
export const createFromOptions = ({ name, value, transform, validate }) => ({
  ...FIELD,
  name,
  value,
  initialValue: value,
  transform: typeof transform === 'function' ? transform : null,
  validate: typeof validate === 'function' ? validate : null,
});

/** Resets fields to initial state */
export const reset = ({ name, initialValue, transform, validate }) => ({
  ...FIELD,
  name,
  value: initialValue,
  initialValue,
  transform,
  validate,
});

/**
 * @typedef {object} FieldData Represents form field data
 * @property {string} name - name of the field
 * @property {string|boolean} value - value of the field
 * @property {boolean} dirty - flag to indicate that the value has been changed
 * @property {string} error - existing error on the field
 * @property {boolean} invalid - flag to indicate that field has invalid value
 */

/**
 * Gets a copy field excluding field helper methods
 * @param {FieldData} copyFrom
 * @returns {FieldData}
 */
export const copyProps = ({
  name,
  value,
  error,
  dirty,
  invalid,
  initialValue,
}) => ({
  name,
  value,
  error,
  dirty,
  invalid,
  initialValue,
});
