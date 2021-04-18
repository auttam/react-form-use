/**
 * Reducer actions
 */
export const ACTIONS: Readonly<{
    RESET: number;
    SET_FIELD_VALUE: number;
    SET_FIELD_ERROR: number;
    VALIDATE_FIELD: number;
    VALIDATE_ALL: number;
}>;
export function initialize(optionsList: Array<Options>): {
    name: any;
    /**
     * Executes validate method of the field
     * @param {Object} field
     * @param {Array} state
     * @returns {String} validation error
     */
    value: any;
    initialValue: any;
    transform: any;
    validate: any;
    dirty: boolean;
    error: string;
    invalid: boolean;
}[];
export function reducer(state: any[], { action, fieldName, data }: {
    action: string;
    fieldName: string;
    data: any;
}): any[];
export type SetFieldErrorCallback = (error: string) => void;
export type GetFieldCallback = (fieldName: string) => import("./field").FieldData;
/**
 * Represents object supplied to validate callback
 */
export type ValidateParamObject = {
    /**
     * - value of the field
     */
    value: string | boolean;
    /**
     * callback to set field error
     */
    setError: SetFieldErrorCallback;
    /**
     * callback to get related field data
     */
    getField: GetFieldCallback;
};
export type ValidateCallback = (validateParamObject: ValidateParamObject) => boolean;
export type TransformCallback = (newValue: string, prev: string) => string;
/**
 * collection of field options
 */
export type Options = {
    /**
     * - name of the field
     */
    name: string;
    /**
     * - value of the field
     */
    value: string | boolean;
    /**
     * - callback to transform the value
     */
    transform: TransformCallback;
    /**
     * - callback to validate the value
     */
    validate: ValidateCallback;
};
