import React, { PropTypes } from 'react';
import validationRunner from './../helpers/validation/validationRunner';
import normalizeModel from './../helpers/normalizeModel';
import decorateInputs from './../helpers/decorateInputs';

class Form extends React.Component {
  state = {
    formIsValid: true
  };

  componentWillMount() {
    const eventHandler = {onChangeHandler: this.onChangeHandler, onBlurHandler: this.onBlurHandler};
    const fields = normalizeModel(this.props, eventHandler);
    this.setState({fields});
  }

  componentWillReceiveProps(newProps) {
    const model = newProps.model;
    const fields = this.state.fields;
    const newFields = Object.keys(fields).map(x => {
      let field = fields[x];
      if (!field.dirty || newProps.reset) {
        let value = model[x].value || '';
        if (model[x].type === 'array' && value === '') {
          value = [];
        }
        field.value = value;
      }
      if (newProps.reset) {
        field.errors = [];
      }
      return field;
    }).reduce((x, y) =>{ x[y.name] = y; return x; }, {});
    this.setState({fields: newFields});
  }

  handleChange = (fieldName, value, change) => {
    const fields = this.state.fields;
    let field = fields[Object.keys(fields).filter(x => fields[x].name === fieldName)[0]];
    if (!field) {
      return;
    }
    if (change) {
      field.dirty = field.value !== value;
      field.value = value;
    }
    field.errors = validationRunner(field, fields);

    field.invalid = field.errors.length > 0;
    this.setState({
      fields: Object.keys(fields)
        .map(x => fields[x].name === fieldName ? field : fields[x])
        .reduce((x, y) =>{ x[y.name] = y; return x; }, {}),
      formIsValid: Object.keys(fields).some(f => fields[f].errors && fields[f].errors.length > 0)
    });
  };

  generateNameValueModel = () => {
    const fields = this.state.fields;
    return Object.keys(fields).reduce((x, y) =>{ x[y] = fields[y].value; return x; }, {});
  };

  onChangeHandler = (e) => {
    return e.target ? this.handleChange(e.target.name, e.target.value, true) : null;
  };

  onBlurHandler = (e) => {
    return e.target ? this.handleChange(e.target.name, e.target.value) : null;
  };

  onSubmitHandler = (e) =>{
    e.preventDefault();
    this.errors = [];
    const fields = this.state.fields;
    let newFieldsState = Object.keys(fields).map(x => {
      fields[x].errors = validationRunner(fields[x], this.state.fields);
      this.errors = this.errors.concat(fields[x].errors);
      return fields[x];
    }).reduce((x, y) =>{ x[y.name] = y; return x; }, {});

    this.setState({fields: newFieldsState, formIsValid: this.errors.length <= 0, errors: this.errors});
    if (this.errors.length <= 0) {
      this.props.submitHandler(this.generateNameValueModel());
    }
  };

  render() {
    // I have moved this down to render, as it is necessary when using "connect"ed inputs from redux
    // also superficial evidence is that it does not affect the number of time decorate is called
    this.newChildren = decorateInputs(this.props.children, this.state.fields);
    return (<form onSubmit={this.onSubmitHandler} >
      {this.newChildren}
    </form>);
  }
}


Form.propTypes = {
  children: PropTypes.array,
  submitHandler: PropTypes.func
};

export default Form;
