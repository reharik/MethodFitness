import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableFor from '../../formElements/EditableFor';
import { Form, Card, Row } from 'antd';
import EDFooter from './../EDFooter';

const TrainerClientRatesInner = ({
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
        const payload = {
          trainerId: model.trainerId.value,
          clientRates: Object.keys(values)
            .filter(x => values[x])
            .map(x => ({
              clientId: x,
              rate: values[x],
            })),
        };
        submit(payload);
        console.log('Received values of form: ', payload);
        toggleEdit(e);
      }
    });
  };

  const formItemLayout = {
    labelCol: { span: 16, pull: 6 },
    wrapperCol: { span: 6, push: 1 },
  };

  return (
    <Card title={`Trainer's Client Rate`} data-id={'trainerClientRate'}>
      <Form layout="inline" onSubmit={handleSubmit}>
        <EditableFor form={form} data={model.trainerId} hidden={true} />
        {model.trainerClientRates.listItems.map(x => {
          return (
            <Row type="flex" key={x.name}>
              <EditableFor
                formItemLayout={formItemLayout}
                key={x.name}
                editing={editing}
                form={form}
                data={x}
                span={16}
              />
            </Row>
          );
        })}
        <EDFooter editing={editing} toggleEdit={toggleEdit} />
      </Form>
    </Card>
  );
};

TrainerClientRatesInner.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func,
  editing: PropTypes.bool,
  toggleEdit: PropTypes.func,
};

class TrainerClientRates extends Component {
  state = { editing: false };

  toggleEdit = e => {
    e.preventDefault();
    this.setState({
      editing: !this.state.editing,
    });
  };

  mapPropsToFields = props => {
    let data = {};
    if (props.model.trainerClientRates.listItems) {
      props.model.trainerClientRates.listItems.forEach(
        x => (data[x.name] = Form.createFormField(x)),
      );
    }
    return data;
  };

  render() {
    let Inner = Form.create({
      mapPropsToFields: this.mapPropsToFields,
    })(TrainerClientRatesInner);
    return (
      <Inner
        {...this.props}
        editing={this.state.editing}
        toggleEdit={this.toggleEdit}
      />
    );
  }
}

TrainerClientRates.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func,
};

export default TrainerClientRates;
