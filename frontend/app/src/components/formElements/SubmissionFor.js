import React from 'react';
import PropTypes from 'prop-types';
import InputFor from './InputFor';
import { Form } from 'antd';
const FormItem = Form.Item;

const SubmissionFor = ({data, selectOptions, form}) => {
  let input = InputFor({data, selectOptions});
  return (<FormItem label={data.label}>
    {form.getFieldDecorator(data.name, {rules: data.rules})(input)}
  </FormItem>);
};

SubmissionFor.propTypes = {
  form: PropTypes.object,
  data: PropTypes.object,
  selectOptions: PropTypes.array
};

export default SubmissionFor;
