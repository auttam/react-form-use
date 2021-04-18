import { initialize, ACTIONS } from './state';
import createUsable from './usable';

describe('createUsable()', () => {
  test('returns object with fields array and other properties', () => {
    const usable = createUsable([], () => {});
    expect(usable).toEqual(
      expect.objectContaining({
        fields: expect.arrayContaining([]),
        setFieldValue: expect.any(Function),
        setFieldError: expect.any(Function),
        reset: expect.any(Function),
        isDirty: expect.any(Boolean),
        isInvalid: expect.any(Boolean),
        validate: expect.any(Function),
      }),
    );
    expect(Object.keys(usable)).toEqual([
      'fields',
      'setFieldValue',
      'setFieldError',
      'reset',
      'isDirty',
      'isInvalid',
      'validate',
      'handleSubmit',
    ]);
  });

  test('order of fields corresponds to the options', () => {
    const state = initialize([
      { name: 'f1', value: 'v1' },
      { name: 'f2', value: 'v2' },
      { name: 'f3', value: 'v3' },
    ]);
    const usable = createUsable(state, () => {});
    expect(usable.fields[0].name).toBe('f1');
    expect(usable.fields[1].name).toBe('f2');
    expect(usable.fields[2].name).toBe('f3');
  });

  test('all field level properties are present', () => {
    const state = initialize([{ name: 'f1', value: 'v1' }]);
    const {
      fields: [f1],
    } = createUsable(state, () => {});

    expect(Object.keys(f1)).toEqual([
      'name',
      'value',
      'error',
      'dirty',
      'invalid',
      'initialValue',
      'setValue',
      'setError',
      'validate',
      'handleChange',
    ]);
  });

  test('all field level properties are correctly set', () => {
    const state = initialize([{ name: 'f1', value: 'v1' }]);
    const {
      fields: [f1],
    } = createUsable(state, () => {});
    expect(f1).toStrictEqual(
      expect.objectContaining({
        name: 'f1',
        value: 'v1',
        error: '',
        dirty: false,
        invalid: false,
        initialValue: 'v1',
        setValue: expect.any(Function),
        setError: expect.any(Function),
      }),
    );
  });

  test('field is a copy of an object from the state array', () => {
    const state = initialize([{ name: 'f1', value: 'v1' }]);
    const { fields } = createUsable(state, () => {});
    fields.push({});
    fields[0].value = 'v1_changed';
    expect(state).toHaveLength(1);
    expect(fields).toHaveLength(2);
    expect(fields[0].value).toBe('v1_changed');
    expect(state[0].value).toBe('v1');
  });

  test('setValue() of the field dispatches change with the correct params', () => {
    const dispatch = jest.fn();
    const state = initialize([{ name: 'f1', value: 'v1' }]);
    const {
      fields: [f1],
    } = createUsable(state, dispatch);
    f1.setValue('v2');
    expect(dispatch).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      action: ACTIONS.SET_FIELD_VALUE,
      fieldName: 'f1',
      data: 'v2',
    });
  });

  test('setError() of the field dispatches change with the correct params', () => {
    const dispatch = jest.fn();
    const state = initialize([{ name: 'f1', value: 'v1' }, { name: 'f2' }]);
    const {
      fields: [f1],
    } = createUsable(state, dispatch);
    f1.setError('e1');
    expect(dispatch).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      action: ACTIONS.SET_FIELD_ERROR,
      fieldName: 'f1',
      data: 'e1',
    });
  });

  test('handleChange() of the field dispatches change correctly for text input', () => {
    const dispatch = jest.fn();
    const state = initialize([{ name: 'f1', value: 'v1' }, { name: 'f2' }]);
    const {
      fields: [f1],
    } = createUsable(state, dispatch);
    f1.handleChange({ target: { value: 'v2' } });
    expect(dispatch).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      action: ACTIONS.SET_FIELD_VALUE,
      fieldName: 'f1',
      data: 'v2',
    });
  });

  test('handleChange() of the field dispatches change correctly for checkbox', () => {
    const dispatch = jest.fn();
    const state = initialize([{ name: 'f1', value: false }, { name: 'f2' }]);
    const {
      fields: [f1],
    } = createUsable(state, dispatch);
    f1.handleChange({ target: { checked: true, type: 'checkbox' } });
    expect(dispatch).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      action: ACTIONS.SET_FIELD_VALUE,
      fieldName: 'f1',
      data: true,
    });
  });

  test('handleChange() of the field dispatches change correctly for radio', () => {
    const dispatch = jest.fn();
    const state = initialize([{ name: 'f1', value: false }, { name: 'f2' }]);
    const {
      fields: [f1],
    } = createUsable(state, dispatch);
    f1.handleChange({ target: { checked: true, type: 'radio' } });
    expect(dispatch).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      action: ACTIONS.SET_FIELD_VALUE,
      fieldName: 'f1',
      data: true,
    });
  });

  test('validate() of the field dispatches validation action correctly', () => {
    const dispatch = jest.fn();
    const state = initialize([
      {
        name: 'f1',
        value: 'v1',
      },
    ]);
    const {
      fields: [f1],
    } = createUsable(state, dispatch);
    f1.validate();
    expect(dispatch).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      action: ACTIONS.VALIDATE_FIELD,
      fieldName: 'f1',
    });
  });

  test('setFieldValue()', () => {
    const dispatch = jest.fn();
    const state = initialize([{ name: 'f1', value: 'v1' }]);
    const { setFieldValue } = createUsable(state, dispatch);
    setFieldValue('f1', 'v2');
    expect(dispatch).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      action: ACTIONS.SET_FIELD_VALUE,
      fieldName: 'f1',
      data: 'v2',
    });
  });

  test('setFieldError()', () => {
    const dispatch = jest.fn();
    const state = initialize([{ name: 'f1', value: 'v1' }]);
    const { setFieldError } = createUsable(state, dispatch);
    setFieldError('f1', 'e1');
    expect(dispatch).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      action: ACTIONS.SET_FIELD_ERROR,
      fieldName: 'f1',
      data: 'e1',
    });
  });

  test('reset()', () => {
    const dispatch = jest.fn();
    const state = initialize([{ name: 'f1', value: 'v1' }]);
    const { reset } = createUsable(state, dispatch);
    reset();
    expect(dispatch).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      action: ACTIONS.RESET,
      fieldName: undefined,
      data: undefined,
    });
  });

  test('validate() of the form dispatches validation action correctly', () => {
    const dispatch = jest.fn();
    const state = initialize([
      {
        name: 'f1',
        value: 'v1',
        validate: ({ setError }) => setError('F1_ERROR'),
      },
    ]);
    const { validate } = createUsable(state, dispatch);
    validate();
    expect(dispatch).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      action: ACTIONS.VALIDATE_ALL,
      callback: expect.any(Function),
    });
  });

  test('isDirty and isInvalid flags are setting correctly', () => {
    const state = initialize([
      {
        name: 'f1',
        value: 'v1',
      },
    ]);
    state[0].invalid = true;
    state[0].dirty = true;
    const { isDirty, isInvalid } = createUsable(state, () => {});
    expect(isDirty).toBe(true);
    expect(isInvalid).toBe(true);
  });
});
