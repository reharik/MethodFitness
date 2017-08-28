import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableFor from '../../formElements/EditableFor';
import { Form, Card, Row } from 'antd';
import EDFooter from './../EDFooter';

const TrainerContactInner = ({model,
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
    <Card title={'Trainer Contact'}>
      <Form onSubmit={handleSubmit} layout={'vertical'}>
        <EditableFor form={form} data={model.trainerId} hidden={true} />
        <Row type="flex">
          <EditableFor editing={editing} form={form} data={model.firstName} />
          <EditableFor editing={editing} form={form} data={model.lastName} />
        </Row>
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

TrainerContactInner.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func,
  editing: PropTypes.bool,
  toggleEdit: PropTypes.func
};


class TrainerContact extends Component {
  state = {editing: false};

  toggleEdit = (e) => {
    e.preventDefault();
    this.setState({editing: !this.state.editing});
  };

  render() {
    let Inner = Form.create({mapPropsToFields: (props) => ({...props.model})})(TrainerContactInner);
    return (<Inner {...this.props} editing={this.state.editing} toggleEdit={this.toggleEdit} />);
  }
}

TrainerContact.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func
};

export default TrainerContact;
