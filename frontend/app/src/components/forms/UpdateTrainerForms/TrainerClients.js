import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableFor from '../../formElements/EditableFor';
import { Form, Card, Row } from 'antd';
import EDFooter from './../EDFooter';

const TrainerClientsInner = ({model,
                               form,
                               toggleEdit,
                               submit,
                               editing,
                              clients
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
    <Card title={`Trainer's Clients`}>
      <Form onSubmit={handleSubmit} layout={'vertical'}>
        <EditableFor form={form} data={model.trainerId} hidden={true} />
        <Row type="flex">
          <EditableFor
            editing={editing}
            form={form}
            data={model.clients}
            selectOptions={clients} />
        </Row>
        <EDFooter editing={editing} toggleEdit={toggleEdit} />
      </Form>
    </Card>
  );
};

TrainerClientsInner.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  clients: PropTypes.array,
  submit: PropTypes.func,
  editing: PropTypes.bool,
  toggleEdit: PropTypes.func
};


class TrainerClients extends Component {
  state = {editing: false};

  toggleEdit = (e) => {
    e.preventDefault();
    this.setState({editing: !this.state.editing});
  };

  render() {
    let Inner = Form.create({mapPropsToFields: (props) => ({...props.model})})(TrainerClientsInner);
    return (<Inner {...this.props} editing={this.state.editing} toggleEdit={this.toggleEdit} />);
  }
}

TrainerClients.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func
};

export default TrainerClients;
