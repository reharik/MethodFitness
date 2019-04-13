import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableFor from '../../formElements/EditableFor';
import { Form, Card, Row } from 'antd';
import EDFooter from './../EDFooter';

const TrainerDefaultClientRateInner = ({
  model,
  form,
  toggleEdit,
  submit,
  editing,
}) => {
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
    <Card
      title={`Default Trainer Client Rate`}
      data-id={'defaultTrainerClientRate'}
    >
      <Form onSubmit={handleSubmit} layout={'vertical'}>
        <EditableFor form={form} data={model.trainerId} hidden={true} />
        <Row type="flex">
          <EditableFor
            editing={editing}
            form={form}
            data={model.defaultTrainerClientRate}
          />
        </Row>
        <EDFooter editing={editing} toggleEdit={toggleEdit} />
      </Form>
    </Card>
  );
};

TrainerDefaultClientRateInner.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func,
  editing: PropTypes.bool,
  toggleEdit: PropTypes.func,
};

class TrainerDefaultClientRate extends Component {
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
    })(TrainerDefaultClientRateInner);
    return (
      <Inner
        {...this.props}
        editing={this.state.editing}
        toggleEdit={this.toggleEdit}
      />
    );
  }
}

TrainerDefaultClientRate.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func,
};

export default TrainerDefaultClientRate;
