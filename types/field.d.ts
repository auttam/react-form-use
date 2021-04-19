export function createFromOptions({ name, value, transform, validate, }: any): {
    name: any;
    value: any;
    initialValue: any;
    transform: any;
    validate: any;
    dirty: boolean;
    error: string;
    invalid: boolean;
};
export function reset({ name, initialValue, transform, validate }: {
    name: any;
    initialValue: any;
    transform: any;
    validate: any;
}): {
    name: any;
    value: any;
    initialValue: any;
    transform: any;
    validate: any;
    dirty: boolean;
    error: string;
    invalid: boolean;
};
export function copyProps({ name, value, error, dirty, invalid, initialValue, }: FieldData): FieldData;
/**
 * Represents form field data
 */
export type FieldData = {
    /**
     * - name of the field
     */
    name: string;
    /**
     * - value of the field
     */
    value: string | boolean;
    /**
     * - flag to indicate that the value has been changed
     */
    dirty: boolean;
    /**
     * - existing error on the field
     */
    error: string;
    /**
     * - flag to indicate that field has invalid value
     */
    invalid: boolean;
};
