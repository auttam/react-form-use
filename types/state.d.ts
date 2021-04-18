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
export function initialize(fieldOptions: Array<Options>): {
    name: any;
    value: any;
    initialValue: any;
    transform: any;
    validate: any;
    dirty: boolean;
    error: string;
    invalid: boolean;
}[];
export function reducer(state: any[], { action, fieldName, data, callback }: {
    action: string;
    fieldName: string;
    data: any;
    callback: any;
}): any[];
export function createFormData(state: any[]): FormData;
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
/**
 * returns value of a field
 */
export type FormDataGetValueCallback = () => string | boolean;
/**
 * returns data serialized into json
 */
export type FormDataGetFieldsCallback = () => Array<{
    name: string;
    value: string;
}>;
/**
 * returns data as a plain object
 */
export type FormDataGetObjectCallback = () => any;
/**
 * - represents a collection fields with value
 */
export type FormData = {
    /**
     * - returns value of a field
     */
    getValue: FormDataGetValueCallback;
    /**
     * - returns data serialized into json
     */
    getFields: any;
    /**
     * - returns data as a plain object
     */
    getObject: FormDataGetObjectCallback;
};
export type SubmitCallback = (formData: FormData) => void;
/**
 * - represents a collection fields with value
 */
export type FormOptions = {
    /**
     * a function called on the form submit
     */
    submit: SubmitCallback;
};
