import React from 'react';
import PropTypes from 'prop-types';
import InputFor from './InputFor';
import { Form, Col } from 'antd';
const FormItem = Form.Item;

const SubmissionFor = ({
  data,
  selectOptions,
  form,
  span,
  onChange,
  formItemLayout,
  extraFunc,
}) => {
  let input = InputFor({
    // eslint-disable-line new-cap
    data,
    selectOptions,
    onChange,
    form,
    extraFunc,
  });
  return (
    <Col
      lg={span || 12}
      sm={span || 12}
      xs={24}
      data-id={`${data.name}-container`}
    >
      <FormItem
        {...formItemLayout}
        label={data.label}
        style={{ padding: '0 8px' }}
      >
        {form.getFieldDecorator(data.name, {
          rules: data.rules,
        })(input)}
      </FormItem>
    </Col>
  );
};

SubmissionFor.propTypes = {
  form: PropTypes.object,
  data: PropTypes.object,
  span: PropTypes.number,
  onChange: PropTypes.func,
  formItemLayout: PropTypes.object,
  selectOptions: PropTypes.array,
  extraFunc: PropTypes.func,
};

export default SubmissionFor;
