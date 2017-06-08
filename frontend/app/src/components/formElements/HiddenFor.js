import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Col } from 'antd';
const FormItem = Form.Item;

const HiddenFor = ({data, form}) => {
  return (
    <Col span={0}>
      <FormItem>
        {form.getFieldDecorator(data.name, {})(
          <Input type="hidden" name={data.name} />)}
      </FormItem>
    </Col>);
};

HiddenFor.propTypes = {
  form: PropTypes.object,
  data: PropTypes.object
};

export default HiddenFor;
