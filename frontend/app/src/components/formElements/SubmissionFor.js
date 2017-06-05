import React from 'react';
import PropTypes from 'prop-types';
import InputFor from './InputFor';
import { Form, Col } from 'antd';
const FormItem = Form.Item;

const SubmissionFor = ({data,
                         selectOptions,
                         form,
                         span,
                         onChange,
                         formItemLayout
}) => {

  let input = InputFor({data, selectOptions, onChange});
  return (
    <Col span={span || 12}>
      <FormItem {...formItemLayout} label={data.label} style={{padding: '0 8px'}}>
        {form.getFieldDecorator(data.name, {rules: data.rules})(input)}
      </FormItem>
    </Col>);
};

SubmissionFor.propTypes = {
  form: PropTypes.object,
  data: PropTypes.object,
  span: PropTypes.number,
  onChange: PropTypes.func,
  formItemLayout: PropTypes.object,
  selectOptions: PropTypes.array
};

export default SubmissionFor;
