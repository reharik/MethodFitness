import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

const HiddenFor = ({data, form}) => {
  return (<FormItem>
    {form.getFieldDecorator(data.name, {})(
      <Input type="hidden" name={data.name} /> )}
  </FormItem>);
};

HiddenFor.propTypes = {
  form: PropTypes.object,
  data: PropTypes.object
};

export default HiddenFor;
