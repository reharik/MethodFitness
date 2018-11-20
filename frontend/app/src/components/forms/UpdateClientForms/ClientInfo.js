import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableFor from '../../formElements/EditableFor';
import { Form, Card, Row } from 'antd';
import EDFooter from './../EDFooter';

const ClientInfoInner = ({ model, form, toggleEdit, submit, editing }) => {
  const handleSubmit = e => {
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
    <Card title={'Client Info'} data-id={'clientInfo'}>
      <Form onSubmit={handleSubmit} layout={'vertical'}>
        <EditableFor form={form} data={model.clientId} hidden={true} />
        <Row type="flex">
          <EditableFor editing={editing} form={form} data={model.firstName} />
          <EditableFor editing={editing} form={form} data={model.lastName} />
        </Row>
        <Row type="flex">
          <EditableFor editing={editing} form={form} data={model.birthDate} />
        </Row>
        <EDFooter editing={editing} toggleEdit={toggleEdit} />
      </Form>
    </Card>
  );
};

ClientInfoInner.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func,
  editing: PropTypes.bool,
  toggleEdit: PropTypes.func,
};

class ClientInfo extends Component {
  state = { editing: false };

  toggleEdit = e => {
    e.preventDefault();
    this.setState({
      editing: !this.state.editing,
    });
  };

  render() {
    let Inner = Form.create({
      mapPropsToFields: props =>
        Object.keys(props.model)
          .map(x => Form.createFormField(props.model[x]))
          .reduce((acc, item) => {
            acc[item.name] = item;
            return acc;
          }, {}),
    })(ClientInfoInner);
    return (
      <Inner
        {...this.props}
        editing={this.state.editing}
        toggleEdit={this.toggleEdit}
      />
    );
  }
}

ClientInfo.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func,
};

export default ClientInfo;
