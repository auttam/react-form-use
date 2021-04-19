# react-form-use

A simple hook to make your react forms easy to use.

## Install

```
npm install react-form-use
```

## Quickstart

```jsx
import React from 'react';
import { useForm } from 'react-form-use'; // 1. import the hook

const App = () => {
  // 2. create fields of the input elements
  const {
    fields: [greetings],
  } = useForm([{ name: 'greetings', value: 'Hello World!' }]);

  return (
    <>
      <h1>{`${greetings.value || '<empty>'}`}</h1>
      {/* 3. Use field with the input element */}
      <input onChange={greetings.handleChange} value={greetings.value} />
    </>
  );
};
```

Run the above example [here](https://stackblitz.com/edit/react-ptyetm?embed=1&file=src/App.js).

## API

The hook, `useForm`, accepts 2 arguments:

- An `Array` of the field specific options (required)
- An `Object` of form options (optional)

And returns an `Object` that contains the following:

- an `Array` of fields, created in the same order as the field options were passed
- additional properties and methods to work with the form and input controls

Check [this page](https://github.com/auttam/react-form-use/wiki/API) for the full [api](https://github.com/auttam/react-form-use/wiki/API).

## Form Example

```jsx
import React from 'react';
import { useForm } from 'react-form-use'; // 1. import the hook

// Source: https://stackoverflow.com/a/742455
const email_regex = /^\S+@\S+$/;

export default function App() {
  const {
    fields: [fullName, email],
    reset, // resets all fields to the initial state
    handleSubmit, // validates all fields and calls the 'submit' callback
  } = useForm(
    [
      { name: 'fullName', validate: ({ value }) => !!value },
      {
        name: 'email',
        validate: ({ value, setError }) => {
          if (!email_regex.test(value)) {
            setError('Invalid email');
          }
        },
      },
    ],
    {
      // called on form submit
      submit: (formData) => {
        // gets field value
        const value = formData.getValue('fullName');
        console.log(value);

        // gets all the fields
        const fields = formData.getFields();
        console.log(fields);

        // gets data as object with keys same as field names
        const obj = formData.getObject();
        console.log(obj);
      },
    },
  );

  const handleReset = () => reset();
  return (
    <>
      <h1>Form Example</h1>
      <form onReset={handleReset} onSubmit={handleSubmit}>
        <label>
          Name:
          <input onChange={fullName.handleChange} value={fullName.value} />
        </label>
        {fullName.error}
        <br />
        <label>
          Email:
          <input
            type="email"
            onChange={email.handleChange}
            value={email.value}
          />
        </label>
        {email.error}
        <br />
        <input type="submit" />
        <input type="reset" />
      </form>
    </>
  );
}
```

Run the above example [here](https://stackblitz.com/edit/react-vdany9?embed=1&file=src/App.js)

## More Examples

More examples [available here](https://github.com/auttam/react-form-use/wiki).
