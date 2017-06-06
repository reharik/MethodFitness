import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableFor from '../../formElements/EditableFor';
import { Form, Card, Row } from 'antd';
import EDFooter from './../EDFooter';

class TrainerInfo extends Component {
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
      <Card title={'Trainer Info'} >
        <Form onSubmit={this.handleSubmit} layout={'vertical'} >
          <EditableFor form={form} data={model.id} hidden={true} />
          <Row type="flex">
            <EditableFor editing={this.state.editing} form={form} data={model.birthDate} />
            <EditableFor editing={this.state.editing} form={form} data={model.color} />
          </Row>
          <EDFooter editing={this.state.editing} toggleEdit={this.toggleEdit} />
        </Form>
      </Card>
    );
  }
}


TrainerInfo.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func
};

export default Form.create({mapPropsToFields: (props) => ({...props.model})})(TrainerInfo);