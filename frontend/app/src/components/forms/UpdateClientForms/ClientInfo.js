import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableFor from '../../formElements/EditableFor';
import { Form, Card } from 'antd';
import EDFooter from './../EDFooter';

class ClientInfo extends Component {
  state = {editing: false};

  toggleEdit = (e, rollBack) => {
    e.preventDefault();
    if (rollBack) {
      this.setState({ editing: !this.state.editing });
    } else {
      this.setState({
        editing: !this.state.editing
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submit(values);
        console.log('Received values of form: ', values);
        this.toggleEdit();
      }
    });
  };

  render() {
    let model = this.props.model;
    let form = this.props.form;
    return (
      <Card title={'Client Info'} >
        <Form onSubmit={this.handleSubmit} >
          <EditableFor form={form} data={model.id} hidden="true" />
          <div className="editableDisplay__content__form__row">
            <EditableFor editing={this.state.editing} form={form} data={model.firstName} />
            <EditableFor editing={this.state.editing} form={form} data={model.lastName} />
          </div>
          <div className="editableDisplay__content__form__row">
            <EditableFor editing={this.state.editing} form={form} data={model.birthDate} />
          </div>
          <EDFooter editing={this.state.editing} toggleEdit={this.toggleEdit} />
        </Form>
      </Card>
    );
  }
}


ClientInfo.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func
};

export default Form.create({mapPropsToFields: (props) => (props.model)})(ClientInfo);
