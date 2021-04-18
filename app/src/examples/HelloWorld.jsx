import React from 'react';
import { useForm } from '../../../lib/use-form';

const HelloWorld = () => {
  const {
    fields: [greetings],
    getData
  } = useForm([{ name: 'greetings', value: 'Hello World!' }]);
  
  return (
    <>
      <h1>{`${greetings.value || '<empty>'}`}</h1>
      <input onChange={greetings.handleChange} value={greetings.value} />
    </>
  );
};

export default HelloWorld;
