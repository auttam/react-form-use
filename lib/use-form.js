import { useReducer } from 'react';
import { initialize, reducer } from './state';
import createUsable from './usable';

/**
 * Use Form Hook
 * @param {Array.<import('./state').Options>} optionsList array of field options
 * @returns {import('./usable').Usable}
 */
export function useForm(optionsList) {
  // initializing state, from supplied options list
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    if (!Array.isArray(optionsList)) {
      throw new TypeError('invalid argument type, must be an array');
    }
    return initialize(optionsList);
  });

  return createUsable(state, dispatch);
}
