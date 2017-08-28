import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableFor from '../../formElements/EditableFor';
import { Form, Card, Row } from 'antd';
import EDFooter from './../EDFooter';

const TrainerPasswordInner = ({model,
                           form,
                           toggleEdit,
                           submit,
                           editing,
                           roles
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
    <Card title={'Trainer Password'}>
      <Form onSubmit={handleSubmit} layout={'vertical'}>
        <EditableFor form={form} data={model.trainerId} hidden={true} />
        <Row type="flex">
          <EditableFor editing={editing} form={form} data={model.password} noDisplay={true} />
        </Row>
        <Row type="flex">
          <EditableFor editing={editing} form={form} data={model.confirmPassword} noDisplay={true} />
        </Row>
        <Row type="flex">
          <EditableFor
            editing={editing}
            form={form}
            data={model.role}
            selectOptions={roles}
            noDisplay={true} />
        </Row>
        <EDFooter editing={editing} toggleEdit={toggleEdit} />
      </Form>
    </Card>
  );
};

TrainerPasswordInner.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func,
  roles: PropTypes.array,
  editing: PropTypes.bool,
  toggleEdit: PropTypes.func
};


class TrainerPassword extends Component {
  state = {editing: false};

  toggleEdit = (e) => {
    e.preventDefault();
    this.setState({editing: !this.state.editing});
  };

  render() {
    let Inner = Form.create({mapPropsToFields: (props) => ({...props.model})})(TrainerPasswordInner);
    return (<Inner {...this.props} editing={this.state.editing} toggleEdit={this.toggleEdit} />);
  }
}

TrainerPassword.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func
};

export default TrainerPassword;
