import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableFor from '../../formElements/EditableFor';
import { Form, Card, Row } from 'antd';
import EDFooter from './../EDFooter';

class TrainerAddress extends Component {
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
        this.toggleEdit(e);
      }
    });
  };

  render() {
    let model = this.props.model;
    let form = this.props.form;
    return (
      <Card title={'Trainer Address'} >
        <Form onSubmit={this.handleSubmit} layout={'vertical'} >
          <EditableFor form={form} data={model.id} hidden={true} />
          <Row type="flex">
            <EditableFor editing={this.state.editing} form={form} data={model.street1} />
            <EditableFor editing={this.state.editing} form={form} data={model.street2} />
          </Row>
          <Row type="flex">
            <EditableFor editing={this.state.editing} form={form} data={model.city} />
            <EditableFor
              editing={this.state.editing}
              form={form} data={model.state}
              span={8}
              selectOptions={this.props.states}
            />
            <EditableFor editing={this.state.editing} form={form} data={model.zipCode} span={4} />
          </Row>
          <EDFooter editing={this.state.editing} toggleEdit={this.toggleEdit} />
        </Form>
      </Card>
    );
  }
}

TrainerAddress.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  states: PropTypes.array,
  submit: PropTypes.func
};

export default Form.create({mapPropsToFields: (props) => ({...props.model})})(TrainerAddress);
