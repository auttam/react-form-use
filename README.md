# react-form-use

A simple hook to make your react forms easy to use.

## Install

```
npm install react-form-use
```

## Quickstart

```jsx
import React from 'react';
import { useForm } from 'rect-form-use';

const App = () => {
  const {
    fields: [greetings],
  } = useForm([{ name: 'greetings', value: 'Hello World!' }]);

  return (
    <>
      <h1>{`${greetings.value || '<empty>'}`}</h1>
      <input onChange={greetings.handleChange} value={greetings.value} />
    </>
  );
};
```

## API

The hook, `useForm`, accepts an array of options and returns an array of fields (in the same order) that can be used with the `<input/>`.

Check [this page](https://github.com/auttam/react-form-use/wiki/API) for full [api](https://github.com/auttam/react-form-use/wiki/API).

## Form Example

```jsx
// Source: https://stackoverflow.com/a/742455
const email_regex = /^\S+@\S+$/;

const App = () => {
  const {
    fields: [fullName, email],
    handleReset,
  } = useForm([
    { name: 'fullName', value: '', transform: (value) => value.toUpperCase() },
    {
      name: 'email',
      value: '',
      validate: ({ value, setError }) => {
        if (!email_regex.test(value)) {
          setError('Invalid email');
        }
      },
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.value) {
      fullName.setError('Name is required');
    }
  };
  return (
    <>
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
        <input type="submit" disabled={email.dirty && email.invalid} />
        <input type="reset" />
      </form>
    </>
  );
};
```

## More Examples

Check more examples [here](https://github.com/auttam/react-form-use/wiki).
