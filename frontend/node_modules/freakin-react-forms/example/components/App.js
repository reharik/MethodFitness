import React from 'react';
import Form from '../../src/components/Form';
import Input from './Input';

export default () => {

  const model = [
    {
      type: 'text',
      name: 'userName',
      label: 'User Name',
      rules: [{rule:'required'}],
      customAttr: 'this is a custom attr'
    },
    {
      type: 'password',
      name: 'password',
      label: 'Password'
    }
  ];
  return (<div className="redux__datatable__app" >
    <Form model={model} submitHandler={x=>{}} >
      <div><Input frfProperty="userName" /></div>
      <div><Input frfProperty="password" /></div>
      <input type="submit" value="submit"></input>
      </Form>
  </div>);
};
