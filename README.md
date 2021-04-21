# react-form-use

A simple hook for your react forms.

## Install

```
npm install react-form-use
```

## Quickstart

```jsx
import React from 'react';
import { useForm } from 'react-form-use'; // 1. import the hook

const App = () => {
  // 2. create the fields
  const {
    fields: [greetings],
  } = useForm([{ name: 'greetings', value: 'Hello World!' }]);

  return (
    <>
      <h1>{`${greetings.value || '<empty>'}`}</h1>
      {/* 3. Use the fields with input elements */}
      <input onChange={greetings.handleChange} value={greetings.value} />
    </>
  );
};
```

Try hook [online here](https://stackblitz.com/edit/react-form-use?devtoolsheight=33&embed=1&file=src/App.js&hideExplorer=1&hideNavigation=1).

## API

```jsx
const {
  fields: [field1, field2, ...more],
  ...helpers
} = useForm(
  [{ ...fieldOptions1 }, { ...fieldOptions2 }, ...moreOptions],
  formOptions,
);
```

The `useForm` hook, accepts 2 arguments:

- An `Array` of options to create the fields (required)
- An `Object` with form specific options (optional)

It returns an `Object` that contains:

- an `Array` of fields, created in the same order as the field options were passed
- additional helpers to work with the form

Check [this page](https://github.com/auttam/react-form-use/wiki/API) for the full [api](https://github.com/auttam/react-form-use/wiki/API).

## Simple Form Example

```jsx
import React from 'react';
import { useForm } from 'react-form-use'; // 1. import form

// Source: https://stackoverflow.com/a/742455
const email_regex = /^\S+@\S+$/;

const App = () => {
  // 2. create form fields
  const {
    fields: [name, email],
    handleSubmit,
    reset,
  } = useForm(
    [
      // Add validate callback to validate the field
      // onChange and onSubmit events.
      // Return 'true' to mark field as valid
      { name: 'name', validate: ({ value }) => !!value },
      {
        name: 'email',
        // You can also call setError method
        // to set a custom error message
        validate: ({ value, setError }) => {
          if (!email_regex.test(value)) {
            setError('Please enter valid email!');
            return false;
          }
          return true;
        },
      },
    ],
    {
      // Add submit callback, to work on the form formData
      // on form submit. This method is also called
      // when a helper method with similar name i.e. submit(),
      // returned by the hook is manually called.
      submit: (formData) => {
        // get the single field value
        const value = formData.getValue('name');
        console.log(value);

        // get all the fields
        const fields = formData.getFields();
        console.log(fields);

        // get data as an object containing
        // fields names as the keys
        const obj = formData.getObject();
        console.log(obj);
      },
    },
  );

  const handleReset = () => reset();
  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <h1>react-form-use</h1>
      <p>Simple Form Example</p>
      <label>
        Enter Name:
        <input value={name.value} onChange={name.handleChange} />
        {name.error}
      </label>

      <label>
        Enter Email:
        <input onChange={email.handleChange} value={email.value} />
        {email.error}
      </label>
      <div>
        <button>Submit</button>
        <input type="reset" />
      </div>
    </form>
  );
};
```

Run the above example [here](https://stackblitz.com/edit/react-form-use-rv7unm?devtoolsheight=33&embed=1&file=src/App.js&hideExplorer=1&hideNavigation=1)

## More Examples

More examples are [available here](https://github.com/auttam/react-form-use/wiki).
