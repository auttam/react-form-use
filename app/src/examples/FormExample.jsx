import React from 'react';
import { useForm } from '../../../lib/use-form';

// Source: https://stackoverflow.com/a/742455
const email_regex = /^\S+@\S+$/;

const FormExample = () => {
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
};

export default FormExample;
