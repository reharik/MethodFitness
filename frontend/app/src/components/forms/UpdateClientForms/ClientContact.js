import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableFor from '../../formElements/EditableFor';
import { Form, Card, Row } from 'antd';
import EDFooter from './../EDFooter';

const ClientContactInner = ({model,
                              form,
                              toggleEdit,
                              submit,
                              editing
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
    <Card title={'Client Contact'}>
      <Form onSubmit={handleSubmit} layout={'vertical'}>
        <EditableFor form={form} data={model.clientId} hidden={true} />
        <Row type="flex">
          <EditableFor editing={editing} form={form} data={model.mobilePhone} />
          <EditableFor editing={editing} form={form} data={model.secondaryPhone} />
        </Row>
        <Row type="flex">
          <EditableFor editing={editing} form={form} data={model.email} />
        </Row>
        <EDFooter editing={editing} toggleEdit={toggleEdit} />
      </Form>
    </Card>
  );
};

ClientContactInner.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func,
  editing: PropTypes.bool,
  toggleEdit: PropTypes.func
};


class ClientContact extends Component {
  state = {editing: false};

  toggleEdit = (e) => {
    e.preventDefault();
    this.setState({editing: !this.state.editing});
  };

  render() {
    let Inner = Form.create({mapPropsToFields: (props) => ({...props.model})})(ClientContactInner);
    return (<Inner {...this.props} editing={this.state.editing} toggleEdit={this.toggleEdit} />);
  }
}

ClientContact.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func
};

export default ClientContact;
