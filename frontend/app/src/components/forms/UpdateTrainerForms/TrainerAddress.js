import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableFor from '../../formElements/EditableFor';
import { Form, Card, Row } from 'antd';
import EDFooter from './../EDFooter';

const TrainerAddressInner = ({model,
                               form,
                               submit,
                               editing,
                               toggleEdit,
                              states
                             }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        submit(values);
        console.log('Received values of form: ', values);
        toggleEdit(e);
      }
    });
  };

  return (
    <Card title={'Trainer Address'}>
      <Form onSubmit={handleSubmit} layout={'vertical'}>
        <EditableFor form={form} data={model.id} hidden={true} />
        <Row type="flex">
          <EditableFor editing={editing} form={form} data={model.street1} />
          <EditableFor editing={editing} form={form} data={model.street2} />
        </Row>
        <Row type="flex">
          <EditableFor editing={editing} form={form} data={model.city} />
          <EditableFor
            editing={editing}
            form={form} data={model.state}
            span={8}
            selectOptions={states}
          />
          <EditableFor editing={editing} form={form} data={model.zipCode} span={4} />
        </Row>
        <EDFooter editing={editing} toggleEdit={toggleEdit} />
      </Form>
    </Card>
  );
};

TrainerAddressInner.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  states: PropTypes.array,
  submit: PropTypes.func,
  editing: PropTypes.bool,
  toggleEdit: PropTypes.func

};


class TrainerAddress extends Component {
  state = {editing: false};

  toggleEdit = (e) => {
    e.preventDefault();
    this.setState({editing: !this.state.editing});
  };

  render() {
    let Inner = Form.create({mapPropsToFields: (props) => ({...props.model})})(TrainerAddressInner);
    return (<Inner {...this.props} editing={this.state.editing} toggleEdit={this.toggleEdit} />);
  }
}

TrainerAddress.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func
};

export default TrainerAddress;
