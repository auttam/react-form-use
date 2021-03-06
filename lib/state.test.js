import { initialize, reducer, ACTIONS, createFormData } from './state';

describe('state functions', () => {
  describe('initialize()', () => {
    test('returns empty array when receives empty array', () => {
      const state = initialize([]);
      expect(state).toEqual([]);
    });

    test('value is initialized to default empty string', () => {
      const state = initialize([{ name: 'myNumber' }]);
      expect(state).toEqual([
        {
          name: 'myNumber',
          value: '',
          dirty: false,
          error: '',
          invalid: false,
          initialValue: '',
          transform: null,
          validate: null,
        },
      ]);
    });

    test('returns array of fields with only known properties', () => {
      const state = initialize([{ name: 'myNumber', value: 20, test: 12 }]);
      expect(state).toEqual([
        {
          name: 'myNumber',
          value: 20,
          dirty: false,
          error: '',
          invalid: false,
          initialValue: 20,
          transform: null,
          validate: null,
        },
      ]);
    });

    test('fields are not the references of the options', () => {
      const field = { name: 'myNumber', value: 20, test: 12 };
      const state = initialize([field]);
      state[0].value = 50;
      expect(field).not.toMatchObject({
        value: 50,
      });
    });

    test('throws error if field name is missing', () => {
      expect(() => initialize([{}])).toThrow(
        'name missing for the field at index 0',
      );
    });

    test('adds transform method to the field only if it is of function type', () => {
      const state1 = initialize([
        { name: 'myNumber', value: 20, transform: {} },
      ]);
      expect(state1[0].transform).toBeNull();
      const state2 = initialize([
        { name: 'myNumber', value: 30, transform: () => {} },
      ]);
      expect(typeof state2[0].transform).toBe('function');
    });

    test('adds validate method to the field only if it is of function type', () => {
      const state1 = initialize([{ name: 'myNumber', value: 20 }]);
      expect(state1[0].validate).toBeNull();
      const state2 = initialize([
        { name: 'myNumber', value: 30, validate: () => {} },
      ]);
      expect(typeof state2[0].validate).toBe('function');
    });
  });

  describe('reducer()', () => {
    test('throws error if field name is wrong', () => {
      const state1 = initialize([{ name: 'myNumber', value: 20 }]);
      expect(() =>
        reducer(state1, { action: 'test', fieldName: 'wrongName', data: '' }),
      ).toThrow("No field found with the name: 'wrongName'");
    });

    test('returns previous state as is, if action or field name is missing or data is undefined', () => {
      const state1 = initialize([{ name: 'myNumber', value: 20 }]);
      const state2 = reducer(state1, {});
      const state3 = reducer(state1, { name: 'test', fieldName: '' });
      const state4 = reducer(state1, { name: 'test', fieldName: 'myNumber' });
      const state5 = reducer(state1, {
        action: 'test',
        fieldName: 'myNumber',
        data: null,
      });
      expect(state2).toBe(state1);
      expect(state3).toBe(state1);
      expect(state4).toBe(state1);
      expect(state5).not.toBe(state1); // validates that reducer returns a copy of previous state
      expect(state5).toStrictEqual(state1);
    });

    describe('ACTION: RESET', () => {
      test('resets fields correctly', () => {
        const state = initialize([{ name: 'myNumber', value: 20 }]);
        state[0].value = 50;
        const newState = reducer(state, { action: ACTIONS.RESET });
        expect(newState[0]).toMatchObject({
          name: 'myNumber',
          value: 20,
        });
      });

      test('retains transform function', () => {
        const state = initialize([
          { name: 'myNumber', value: 20, transform: (a) => a + 1 },
        ]);
        const newState = reducer(state, { action: ACTIONS.RESET });
        expect(newState[0].transform(20)).toBe(21);
      });
    });

    describe('ACTION: SET_FIELD_VALUE', () => {
      test('value and dirty flags are being set correctly', () => {
        const state = initialize([{ name: 'myNumber', value: 20 }]);
        const [field] = reducer(state, {
          action: ACTIONS.SET_FIELD_VALUE,
          fieldName: 'myNumber',
          data: 30,
        });
        expect(field).toMatchObject({
          name: 'myNumber',
          value: 30,
          dirty: true,
        });
      });

      test('state is copied before update is made', () => {
        const state1 = initialize([{ name: 'myNumber', value: 20 }]);
        const state2 = reducer(state1, {
          action: ACTIONS.SET_FIELD_VALUE,
          fieldName: 'myNumber',
          data: 30,
        });
        expect(state1[0].value).toBe(20);
        expect(state2[0].value).toBe(30);
      });

      test('updates value of the correct field, when more fields are present', () => {
        const state1 = initialize([
          { name: 'name', value: '' },
          { name: 'age', value: 30 },
        ]);

        const state2 = reducer(state1, {
          action: ACTIONS.SET_FIELD_VALUE,
          fieldName: 'name',
          data: 'Daniel',
        });

        expect(state1[0].value).toBe('');
        expect(state1[1].value).toBe(30);
        expect(state2[0].value).toBe('Daniel');
        expect(state2[1].value).toBe(30);
        expect(state1[1]).not.toBe(state2[1]);

        const state3 = reducer(state2, {
          action: ACTIONS.SET_FIELD_VALUE,
          fieldName: 'age',
          data: 40,
        });

        expect(state1[0].value).toBe('');
        expect(state1[1].value).toBe(30);
        expect(state2[0].value).toBe('Daniel');
        expect(state2[1].value).toBe(30);
        expect(state3[0].value).toBe('Daniel');
        expect(state3[1].value).toBe(40);
      });

      test('transforms value if transform function is available', () => {
        const state1 = initialize([
          {
            name: 'name',
            value: 'daniel',
            transform: (value) => value.toUpperCase(),
          },
        ]);

        const state2 = reducer(state1, {
          action: ACTIONS.SET_FIELD_VALUE,
          fieldName: 'name',
          data: 'other',
        });

        expect(state1[0]).toMatchObject({
          value: 'daniel',
          error: '',
        });

        expect(state2[0]).toMatchObject({
          value: 'OTHER',
          error: '',
        });
      });

      test('passes old and new values to the transforms callback', () => {
        const state1 = initialize([
          {
            name: 'name',
            value: 'daniel',
            transform: (value, old) => {
              if (value === 'test1') {
                return old;
              }
              return value;
            },
          },
        ]);

        const state2 = reducer(state1, {
          action: ACTIONS.SET_FIELD_VALUE,
          fieldName: 'name',
          data: 'test1',
        });

        expect(state1[0]).toMatchObject({
          value: 'daniel',
          error: '',
        });

        expect(state2[0]).toMatchObject({
          value: 'daniel',
          error: '',
        });

        const state3 = reducer(state1, {
          action: ACTIONS.SET_FIELD_VALUE,
          fieldName: 'name',
          data: 'test2',
        });

        expect(state3[0]).toMatchObject({
          value: 'test2',
          error: '',
        });
      });

      test('callbacks the validate callback of the field if present', () => {
        const validate = jest.fn();
        const state1 = initialize([
          {
            name: 'name',
            value: 'daniel',
            validate,
          },
        ]);

        reducer(state1, {
          action: ACTIONS.SET_FIELD_VALUE,
          fieldName: 'name',
          data: 'test1',
        });

        expect(validate).toHaveBeenCalled();
        expect(validate).toHaveBeenCalledTimes(1);
        expect(validate).toHaveBeenCalledWith({
          value: 'test1',
          setError: expect.any(Function),
          getField: expect.any(Function),
        });
      });

      test('existing error is cleared on value change', () => {
        const state1 = initialize([
          {
            name: 'name',
            value: 'daniel',
          },
        ]);

        state1[0].error = 'ERROR';
        const state2 = reducer(state1, {
          action: ACTIONS.SET_FIELD_VALUE,
          fieldName: 'name',
          data: 'test1',
        });

        expect(state1[0]).toMatchObject({
          name: 'name',
          value: 'daniel',
          error: 'ERROR',
        });

        expect(state2[0]).toMatchObject({
          name: 'name',
          value: 'test1',
          error: '',
        });
      });
    });

    describe('ACTION: SET_FIELD_ERROR', () => {
      test('updates error of the correct field, when more fields are present', () => {
        const state1 = initialize([{ name: 'name', value: 'daniel' }]);

        const state2 = reducer(state1, {
          action: ACTIONS.SET_FIELD_ERROR,
          fieldName: 'name',
          data: 'This is an error',
        });
        expect(state1[0]).toMatchObject({
          value: 'daniel',
          error: '',
        });
        expect(state2[0]).toMatchObject({
          value: 'daniel',
          error: 'This is an error',
        });
      });
    });

    describe('ACTION: VALIDATE_FIELD', () => {
      test('calls validate callback if present', () => {
        const validate = jest.fn();
        const state1 = initialize([
          {
            name: 'name',
            value: 'daniel',
            validate,
          },
        ]);

        reducer(state1, {
          action: ACTIONS.VALIDATE_FIELD,
          fieldName: 'name',
        });

        expect(validate).toHaveBeenCalled();
        expect(validate).toHaveBeenCalledTimes(1);
        expect(validate).toHaveBeenCalledWith({
          value: 'daniel',
          setError: expect.any(Function),
          getField: expect.any(Function),
        });
      });
    });

    describe('ACTION: VALIDATE_ALL', () => {
      test('runs validation on all the fields', () => {
        const state = initialize([
          {
            name: 'firstNumber',
            value: 40,
            validate: ({ value }) => value < 30,
          },
          {
            name: 'secondNumber',
            value: 20,
            validate: ({ value, setError, getField }) => {
              const field = getField('firstNumber');
              if (field.value * value > 50) {
                setError('NUMBER_TOO_BIG');
              }
              field.value = 5;
            },
          },
        ]);

        const [firstNumber, secondNumber] = reducer(state, {
          action: ACTIONS.VALIDATE_ALL,
          callback: () => {},
        });

        expect(firstNumber).toMatchObject({
          name: 'firstNumber',
          value: 40,
          dirty: false,
          invalid: true,
          error: 'Invalid value',
        });

        expect(secondNumber).toMatchObject({
          name: 'secondNumber',
          value: 20,
          dirty: false,
          invalid: true,
          error: 'NUMBER_TOO_BIG',
        });
      });

      test('calls the callback correctly', () => {
        const hasError = jest.fn();
        const state = initialize([
          {
            name: 'firstNumber',
            value: 10,
            validate: ({ value }) => value < 30,
          },
        ]);

        // Test when there is no error
        const [firstNumberState1] = reducer(state, {
          action: ACTIONS.VALIDATE_ALL,
          callback: hasError,
        });

        expect(firstNumberState1).toMatchObject({
          name: 'firstNumber',
          value: 10,
          dirty: false,
          invalid: false,
          error: '',
        });

        expect(hasError).toHaveBeenCalled();
        expect(hasError).toHaveBeenCalledTimes(1);
        expect(hasError).toHaveBeenCalledWith(false);

        // Test when there is an error
        state[0].value = 40;
        const [firstNumberState2] = reducer(state, {
          action: ACTIONS.VALIDATE_ALL,
          callback: hasError,
        });

        expect(firstNumberState2).toMatchObject({
          name: 'firstNumber',
          value: 40,
          dirty: false,
          invalid: true,
          error: 'Invalid value',
        });

        expect(hasError).toHaveBeenCalledTimes(2);
        expect(hasError).toHaveBeenCalledWith(true);
      });

      test('does not update the state if there is no error to prevent render', () => {
        const hasError = jest.fn();
        const state1 = initialize([
          {
            name: 'firstNumber',
            value: 10,
            validate: ({ value }) => value < 30,
          },
        ]);

        // Test when there is no error
        const state2 = reducer(state1, {
          action: ACTIONS.VALIDATE_ALL,
          callback: hasError,
        });

        expect(state2[0]).toMatchObject({
          name: 'firstNumber',
          value: 10,
          dirty: false,
          invalid: false,
          error: '',
        });

        expect(hasError).toHaveBeenCalledWith(false);
        expect(state1).toBe(state2);
      });
    });

    describe('Field validation', () => {
      test('setError callback is being called correctly', () => {
        const state = initialize([
          {
            name: 'myNumber',
            value: 20,
            validate: ({ value, setError }) => {
              if (value > 30) {
                setError('FIELD_ERROR');
              }
            },
          },
        ]);

        const [field] = reducer(state, {
          action: ACTIONS.SET_FIELD_VALUE,
          fieldName: 'myNumber',
          data: 40,
        });

        expect(field).toMatchObject({
          name: 'myNumber',
          value: 40,
          dirty: true,
          invalid: true,
          error: 'FIELD_ERROR',
        });
      });

      test('validation fails if setError is called', () => {
        const state = initialize([
          {
            name: 'myNumber',
            value: 20,
            validate: ({ setError }) => setError('Error 1'),
          },
        ]);

        const [field] = reducer(state, {
          action: ACTIONS.SET_FIELD_VALUE,
          fieldName: 'myNumber',
          data: 25,
        });

        expect(field).toMatchObject({
          name: 'myNumber',
          value: 25,
          dirty: true,
          invalid: true,
          error: 'Error 1',
        });
      });

      test('validation fails if setError is called, even if callback returns true', () => {
        const state = initialize([
          {
            name: 'myNumber',
            value: 20,
            validate: ({ setError }) => {
              setError('Error 2');
              return true;
            },
          },
        ]);

        const [field] = reducer(state, {
          action: ACTIONS.SET_FIELD_VALUE,
          fieldName: 'myNumber',
          data: 25,
        });

        expect(field).toMatchObject({
          name: 'myNumber',
          value: 25,
          dirty: true,
          invalid: true,
          error: 'Error 2',
        });
      });

      test('validation fails with default error if callback returns void', () => {
        const state = initialize([
          {
            name: 'myNumber',
            value: 20,
            validate: () => {},
          },
        ]);

        const [field] = reducer(state, {
          action: ACTIONS.SET_FIELD_VALUE,
          fieldName: 'myNumber',
          data: 25,
        });

        expect(field).toMatchObject({
          name: 'myNumber',
          value: 25,
          dirty: true,
          invalid: true,
          error: 'Invalid value',
        });
      });

      test('validation fails with default error if callback returns false', () => {
        const state = initialize([
          {
            name: 'myNumber',
            value: 20,
            validate: () => false,
          },
        ]);

        const [field] = reducer(state, {
          action: ACTIONS.SET_FIELD_VALUE,
          fieldName: 'myNumber',
          data: 25,
        });

        expect(field).toMatchObject({
          name: 'myNumber',
          value: 25,
          dirty: true,
          invalid: true,
          error: 'Invalid value',
        });
      });

      test('validation pass when callback returns true', () => {
        const state = initialize([
          {
            name: 'myNumber',
            value: 20,
            validate: () => true,
          },
        ]);

        const [field] = reducer(state, {
          action: ACTIONS.SET_FIELD_VALUE,
          fieldName: 'myNumber',
          data: 25,
        });

        expect(field).toMatchObject({
          name: 'myNumber',
          value: 25,
          dirty: true,
          invalid: false,
          error: '',
        });
      });

      test('getFields callback is being called correctly', () => {
        const state = initialize([
          {
            name: 'firstNumber',
            value: 20,
          },
          {
            name: 'secondNumber',
            value: 20,
            validate: ({ value, setError, getField }) => {
              const field = getField('firstNumber');
              if (field.value * value > 50) {
                setError('NUMBER_TOO_BIG');
              }
              field.value = 5;
            },
          },
        ]);

        const [firstNumber, secondNumber] = reducer(state, {
          action: ACTIONS.SET_FIELD_VALUE,
          fieldName: 'secondNumber',
          data: 3,
        });

        expect(firstNumber).toMatchObject({
          name: 'firstNumber',
          value: 20,
          dirty: false,
          invalid: false,
          error: '',
        });

        expect(secondNumber).toMatchObject({
          name: 'secondNumber',
          value: 3,
          dirty: true,
          invalid: true,
          error: 'NUMBER_TOO_BIG',
        });
      });

      test('validate_all runs validation on all the fields', () => {
        const state = initialize([
          {
            name: 'firstNumber',
            value: 40,
            validate: ({ value }) => value < 30,
          },
          {
            name: 'secondNumber',
            value: 20,
            validate: ({ value, setError, getField }) => {
              const field = getField('firstNumber');
              if (field.value * value > 50) {
                setError('NUMBER_TOO_BIG');
              }
              field.value = 5;
            },
          },
        ]);
        let hasError = false;
        const [firstNumber, secondNumber] = reducer(state, {
          action: ACTIONS.VALIDATE_ALL,
          callback: (result) => {
            hasError = result;
          },
        });

        expect(firstNumber).toMatchObject({
          name: 'firstNumber',
          value: 40,
          dirty: false,
          invalid: true,
          error: 'Invalid value',
        });

        expect(secondNumber).toMatchObject({
          name: 'secondNumber',
          value: 20,
          dirty: false,
          invalid: true,
          error: 'NUMBER_TOO_BIG',
        });

        expect(hasError).toBe(true);
      });
    });
  });

  describe('createFormData()', () => {
    test('creates form data with all props', () => {
      const state = initialize([{ name: 'myNumber', value: 20 }]);
      const formData = createFormData(state);
      expect(Object.keys(formData)).toEqual([
        'getValue',
        'getObject',
        'getFields',
      ]);
      expect(formData).toMatchObject({
        getValue: expect.any(Function),
        getObject: expect.any(Function),
        getFields: expect.any(Function),
      });
    });

    describe('FormData: getValue()', () => {
      test('gets field value', () => {
        const state = initialize([{ name: 'myNumber', value: 20 }]);
        const formData = createFormData(state);
        expect(formData.getValue('myNumber')).toBe(20);
      });

      test('throws error for missing field', () => {
        const state = initialize([{ name: 'myNumber', value: 20 }]);
        const formData = createFormData(state);
        expect(() => formData.getValue('wrongName')).toThrow(
          "No field found with the name: 'wrongName'",
        );
      });
    });

    test('FormData: getFields()', () => {
      const state = initialize([
        { name: 'myNumber', value: 20 },
        { name: 'myString', value: 'abc', transform: () => {} },
      ]);
      const [myNumber, myString] = state;
      const formData = createFormData(state);
      expect(myNumber.value).toBe(20);
      expect(myString.value).toBe('abc');
      expect(formData.getFields()).toEqual([
        { name: 'myNumber', value: 20 },
        { name: 'myString', value: 'abc' },
      ]);
    });

    test('FormData: getObject()', () => {
      const state = initialize([
        { name: 'myNumber', value: 20 },
        { name: 'myString', value: 'abc', transform: () => {} },
      ]);
      const [myNumber, myString] = state;
      const formData = createFormData(state);
      expect(myNumber.value).toBe(20);
      expect(myString.value).toBe('abc');
      expect(formData.getObject()).toMatchObject({
        myNumber: 20,
        myString: 'abc',
      });
    });
  });
});
