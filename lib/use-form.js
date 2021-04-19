import { useReducer } from 'react';
import { initialize, reducer } from './state';
import createUsable from './usable';

/**
 * Use Form Hook
 * @param {Array.<import('./state').Options>} fieldOptions array of field options
 * @param {import('./state').FormOptions} formOptions function called on form submit
 * @returns {import('./usable').Usable}
 */
export function useForm(fieldOptions, formOptions = {}) {
  // initializing state, from supplied options list
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    if (!Array.isArray(fieldOptions)) {
      throw new TypeError('invalid argument type, must be an array');
    }
    return initialize(fieldOptions);
  });

  return createUsable(state, dispatch, formOptions);
}
