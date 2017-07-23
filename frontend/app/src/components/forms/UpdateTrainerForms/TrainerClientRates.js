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
        const payload = {
          id: this.props.model.id.value,
          clientRates: Object.keys(values)
            .filter(x => values[x])
            .map(x => ({id: x, rate: values[x]}))
        };
        this.props.submit(payload);
        console.log('Received values of form: ', payload);
        this.toggleEdit(e);
      }
    });
  }


  render() {
    const formItemLayout = {labelCol: {span: 16, pull: 6}, wrapperCol: {span: 6, push: 1}};
    let model = this.props.model;
    let form = this.props.form;
    return (
      <Card title={`Trainer's Client Rate`} >
        <Form layout="inline" onSubmit={this.handleSubmit} >
          <EditableFor form={form} data={model.id} hidden={true} />
          { model.trainerClientRates.listItems.map(x => {
            return (<Row type="flex" key={x.name} >
              <EditableFor
                formItemLayout={formItemLayout}
                key={x.name}
                editing={this.state.editing}
                form={form}
                data={x}
                span={16} /></Row>);
          })
          }
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

const mapPropsToFields = (props) => {
  let data = {};
  if (props.model.trainerClientRates.listItems) {
    props.model.trainerClientRates.listItems.forEach(x => data[x.name] = x);
  }
  return data;
};

export default Form.create({mapPropsToFields})(TrainerInfo);

