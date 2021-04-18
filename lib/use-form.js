import { useReducer } from 'react';
import { initialize, reducer } from './state';
import createUsable from './usable';

/**
 * Use Form Hook
 * @param {Array.<import('./state').Options>} fieldOptions array of field options
 * @returns {import('./usable').Usable}
 */
export function useForm(fieldOptions) {
  // initializing state, from supplied options list
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    if (!Array.isArray(fieldOptions)) {
      throw new TypeError('invalid argument type, must be an array');
    }
    return initialize(fieldOptions);
  });

  return createUsable(state, dispatch);
}
